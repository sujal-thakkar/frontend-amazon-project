import {
    cart,
    removeFromCart,
    calculateCartQuantity,
    updateQuantity,
    updateDeliveryOption
}
    from '../../data/cart.js'
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {

    function updateCheckoutHeader() {
        let totalQuantity = calculateCartQuantity();
        document.querySelector('.js-checkout-count').innerHTML = `${totalQuantity} items`;
    };
    updateCheckoutHeader();

    let cartHTML = '';
    let deliveryOptionNumber = 0;

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        deliveryOptionNumber++;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionsId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays,
            'days'
        );
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartHTML += `
        <div class="cart-item-container 
            js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                        $${formatCurrency(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity">
                        <span>
                            Quantity: <span class="js-quantity-label-${matchingProduct.id} quantity-label">${cartItem.quantity}</span>
                        </span>
                        <span class="js-update-link update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                            Update
                        </span>
                        <input class="js-quantity-input-${matchingProduct.id} quantity-input" data-product-id="${matchingProduct.id}">
                        <span class="js-save-quantity-link save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                            Save
                        </span>
                        <span class="js-delete-link delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                            Delete
                        </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(deliveryOptionNumber, cartItem, matchingProduct)}
                </div>
            </div>
        </div>  
        `
    });

    function deliveryOptionsHTML(deliveryOptionNumber, cartItem, matchingProduct) {
        let html = '';

        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(
                deliveryOption.deliveryDays,
                'days'
            );
            const dateString = deliveryDate.format('dddd, MMMM D');

            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionsId;

            html +=
                `
                <div class="delivery-option js-delivery-option"
                    data-product-id="${matchingProduct.id}"
                    data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio" 
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input" name="delivery-option-${deliveryOptionNumber}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString} Shipping
                        </div>
                    </div>
                </div>
            `
        });

        return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartHTML;

    document.querySelectorAll('.js-delete-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                removeFromCart(productId);

                const itemToBeDeleted = document.querySelector(`.js-cart-item-container-${productId}`)
                itemToBeDeleted.remove();
                updateCheckoutHeader();

                renderPaymentSummary();
            });
        });

    document.querySelectorAll('.js-update-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                const itemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
                itemContainer.classList.add('is-editing-quantity');

                const prevLabeledQuant = document.querySelector(`.js-quantity-label-${productId}`).innerHTML;
                document.querySelector(`.js-quantity-input-${productId}`)
                    .value = prevLabeledQuant;
            });
        });

    document.querySelectorAll('.js-save-quantity-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                const itemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
                itemContainer.classList.remove('is-editing-quantity');

                const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

                if (newQuantity >= 0 && newQuantity < 1000) {
                    updateQuantity(productId, newQuantity);
                    updateCheckoutHeader();

                    document.querySelector(`.js-quantity-label-${productId}`)
                        .innerHTML = newQuantity;
                }
                else {
                    alert('Quantity can\'t be too low or high');
                }
            });
        });

    document.querySelectorAll('.quantity-input')
        .forEach((input) => {
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const productId = input.dataset.productId;
                    const itemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
                    itemContainer.classList.remove('is-editing-quantity');

                    const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

                    if (newQuantity >= 0 && newQuantity < 1000) {
                        updateQuantity(productId, newQuantity);
                        updateCheckoutHeader();

                        document.querySelector(`.js-quantity-label-${productId}`)
                            .innerHTML = newQuantity;
                    }
                    else {
                        alert('Quantity can\'t be too low or high');
                    }
                }
            });
        });

    document.querySelectorAll('.js-delivery-option')
        .forEach((option) => {
            option.addEventListener('click', () => {
                const { productId, deliveryOptionId } = option.dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();

                renderPaymentSummary();
            });
        });
};




