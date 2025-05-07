import { cart, calculateCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder, saveToStorage } from "../../data/orders.js";

export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const matchingProduct = getProduct(productId);

        if (!matchingProduct) {
            // console.warn(`Product with ID ${productId} not found.`);
            return; // Skip this cart item if the product is missing
        }

        productPriceCents += matchingProduct.priceCents * cartItem.quantity;

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionsId);
        if (deliveryOption) {
            shippingPriceCents += deliveryOption.priceCents;
        }
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * (10 / 100);
    const totalCents = totalBeforeTaxCents + taxCents;
    const totalQuantity = calculateCartQuantity();

    const paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${totalQuantity}):</div>
            <div class="payment-summary-money">
                $${formatCurrency(productPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money
                js-payment-summary-shipping">
                $${formatCurrency(shippingPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">
                $${formatCurrency(totalBeforeTaxCents)}
            </div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">
                $${formatCurrency(taxCents)}
            </div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money
                js-payment-summary-total">
                $${formatCurrency(totalCents)}
            </div>
        </div>

        <button class="place-order-button button-primary
            js-place-order">
            Place your order
        </button>
    `;

    document.querySelector('.js-payment-summary')
        .innerHTML = paymentSummaryHTML; 

    document.querySelector('.js-place-order')
        .addEventListener('click', async() => {
            try {
                const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cart: cart
                    })
                });

                const order = await response.json();
                addOrder(order);
                saveToStorage();

            } catch (error) {
                console.log('Unexpected error occured. Try again later.');
            }
            
            window.location.href = 'orders.html';
        });
}