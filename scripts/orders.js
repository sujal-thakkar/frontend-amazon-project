import { orders } from "../data/orders.js";
import { calculateCartQuantity, addToCart } from "../data/cart.js";
import { formatCurrency } from "./utils/money.js";
import { getProduct, loadProductsFetch } from "../data/products.js";


console.log(orders);

export const updateCartHTML = () => {
    let totalQuantity = calculateCartQuantity();
    if (totalQuantity > 0) {
        document.querySelector('.js-cart-quantity')
            .innerHTML = totalQuantity;
    }
};
updateCartHTML();

const Monthdate = ((dateString) => {
    const dateObj = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    const date = new Intl.DateTimeFormat('en-US', options).format(dateObj);
    return date;
});

async function renderOrderPage() {
    let allOrderHTML = '';

    await loadProductsFetch();

    orders.forEach((order) => {
        const orderDate = Monthdate(order.orderTime);
        const totalPrice = formatCurrency(order.totalCostCents);
        const orderId = order.id;

        let orderDetailsGridHTML = '';

        order.products.forEach((product) => {
            const productId = product.productId;
            const matchingProduct = getProduct(productId);
            const DeliveryDate = Monthdate(product.estimatedDeliveryTime);

            orderDetailsGridHTML += `
                <div class="product-image-container">
                    <img src="${matchingProduct.image}">
                </div>

                <div class="product-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-delivery-date">
                        Arriving on: ${DeliveryDate}
                    </div>
                    <div class="product-quantity">
                        Quantity: ${product.quantity}
                    </div>
                    <button class="js-buy-again buy-again-button button-primary" data-product-id="${productId}" data-product-quantity="${product.quantity}">
                        <img class="buy-again-icon" src="images/icons/buy-again.png">
                        <span class="buy-again-message">Buy it again</span>
                    </button>
                </div>

                <div class="product-actions">
                    <a href="tracking.html?orderId=${orderId}&productId=${productId}">
                        <button class="track-package-button button-secondary">
                            Track package
                        </button>
                    </a>
                </div>
            `
        });

        allOrderHTML += `
            <div class="order-container">
                <div class="order-header">
                    <div class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label">Order Placed:</div>
                            <div>${orderDate}</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label">Total:</div>
                            <div>$${totalPrice}</div>
                        </div>
                    </div>

                    <div class="order-header-right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>${orderId}</div>
                    </div>
                </div>

                <div class="order-details-grid js-order-details-grid">
                    ${orderDetailsGridHTML}
                </div>
            </div>
        `
    });

    document.querySelector('.js-orders-grid')
        .innerHTML = allOrderHTML;

    document.querySelectorAll('.js-buy-again')
        .forEach((button) => {
            button.addEventListener('click', () => {
                addToCart(button.dataset.productId, button.dataset.productQuantity);

                button.innerHTML = 'Added';
                setTimeout(() => {
                    button.innerHTML = `
                        <img class="buy-again-icon" src="images/icons/buy-again.png">
                        <span class="buy-again-message">Buy it again</span>
                    `;
                }, 1000);
                updateCartHTML();
                window.location.href = 'checkout.html';
            });
        });
}

if (document.querySelector('.js-orders-grid')) {
    renderOrderPage();
}








