import {
    cart,
    removeFromCart,
    updateQuantity,
    updateDeliveryOption
}
    from '../../data/cart.js'
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

export function renderOrderSummary() {
    let cartHTML = '';
    let deliveryOptionNumber = 0;

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        deliveryOptionNumber++;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionsId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const dateString = calculateDeliveryDate(deliveryOption);

        cartHTML += `
        <div class="cart-item-container 
            js-cart-item-container
            js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}">

                <div class="cart-item-details">
                    <div class="product-name
                        js-product-name-${matchingProduct.id}">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price
                        js-product-price-${matchingProduct.id}">
                        ${matchingProduct.getPrice()}
                    </div>
                    <div class="product-quantity
                        js-product-quantity-${matchingProduct.id}">
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
                        <span class="js-delete-link 
                            delete-quantity-link 
                            js-delete-link-${matchingProduct.id}
                            link-primary" 
                            data-product-id="${matchingProduct.id}">
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
            const dateString = calculateDeliveryDate(deliveryOption);

            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionsId;

            html +=
                `
                <div class="delivery-option js-delivery-option
                    js-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
                    data-product-id="${matchingProduct.id}"
                    data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio" 
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input
                    js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}" 
                    name="delivery-option-${deliveryOptionNumber}">
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

                renderCheckoutHeader(); // using MVC model to regenerating the checkoutHeader
                /* const itemToBeDeleted = document.querySelector(`.js-cart-item-container-${productId}`)
                itemToBeDeleted.remove(); */
                
                renderOrderSummary(); //instead of using DOM and updating the page directly by using .remove(), regenerating the HTML for orderSummary.

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

                    document.querySelector(`.js-quantity-label-${productId}`)
                        .innerHTML = newQuantity;
                }
                else {
                    alert('Quantity can\'t be too low or high');
                }

                renderCheckoutHeader();

                renderPaymentSummary();
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

                        document.querySelector(`.js-quantity-label-${productId}`)
                            .innerHTML = newQuantity;
                    }
                    else {
                        alert('Quantity can\'t be too low or high');
                    }

                    renderCheckoutHeader();

                    renderPaymentSummary();
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




