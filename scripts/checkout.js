import { cart, removeFromCart, calculateCartQuantity, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

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

    let matchingProduct;

    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });

    cartHTML += `
    <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
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
                <div class="delivery-option">
                    <input type="radio" checked class="delivery-option-input" name="delivery-option-${deliveryOptionNumber}">
                    <div>
                        <div class="delivery-option-date">
                            Tuesday, June 21
                        </div>
                        <div class="delivery-option-price">
                            FREE Shipping
                        </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio" class="delivery-option-input" name="delivery-option-${deliveryOptionNumber}">
                    <div>
                        <div class="delivery-option-date">
                            Wednesday, June 15
                        </div>
                        <div class="delivery-option-price">
                            $4.99 - Shipping
                        </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio" class="delivery-option-input" name="delivery-option-${deliveryOptionNumber}">
                    <div>
                        <div class="delivery-option-date">
                            Monday, June 13
                        </div>
                        <div class="delivery-option-price">
                            $9.99 - Shipping
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
});

document.querySelector('.js-order-summary').innerHTML = cartHTML;

document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);

            const itemToBeDeleted = document.querySelector(`.js-cart-item-container-${productId}`)
            itemToBeDeleted.remove();
            updateCheckoutHeader();
        })
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

            if(newQuantity >= 0 && newQuantity < 1000) {
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
            if(event.key === 'Enter') {
                const productId = input.dataset.productId;
                const itemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
                itemContainer.classList.remove('is-editing-quantity');

                const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

                if(newQuantity >= 0 && newQuantity < 1000) {
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



