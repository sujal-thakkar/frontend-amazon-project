import { getProduct, loadProductsFetch } from "../data/products.js";
import { updateCartHTML} from "./orders.js";
import { orders } from "../data/orders.js";

async function renderTrackingPage() {
    await loadProductsFetch();

    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId');
    console.log(orderId);
    console.log(productId);

    let order;
    orders.forEach((ord) => {
        if(ord.id === orderId) order = ord;
    })
    const product = getProduct(productId);
    console.log(order);
    console.log(product);

    updateCartHTML();

    let dateString;
    let quantity;

    order.products.forEach((prod) => {
        if(prod.productId === productId) {
            dateString = prod.estimatedDeliveryTime;
            quantity = prod.quantity;
        }
    });
    console.log(dateString);

    const dateObj = new Date(dateString);
    const options = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    };
    const arrivalDate = new Intl.DateTimeFormat('en-US', options)
        .format(dateObj);

    console.log(arrivalDate);

    const currentTime = new Date();
    const orderTime = new Date(order.orderTime);
    console.log(currentTime);
    console.log(orderTime);
    console.log(dateObj);

    let percentProgress = ((currentTime - orderTime) / (dateObj - orderTime)) * 100;
    percentProgress = Math.max(0, Math.min(100, percentProgress)) // Clamp between 0 and 100
    percentProgress = percentProgress.toFixed(1);
    console.log(percentProgress);
    
    const trackingPageHTML = `
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${arrivalDate}
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="js-progress-preparing progress-label">
            Preparing
          </div>
          <div class="js-progress-shipped progress-label">
            Shipped
          </div>
          <div class="js-progress-delivered progress-label">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${percentProgress}%"></div>
        </div>
    `

    document.querySelector('.js-order-tracking')
        .innerHTML = trackingPageHTML;

    if(percentProgress >= 0 && percentProgress <= 49) {
        document.querySelector('.js-progress-preparing')
            .classList.add('current-status');
    }
    else if(percentProgress >= 50 && percentProgress <= 99) {
        document.querySelector('.js-progress-shipped')
            .classList.add('current-status');
    }  
    else {
        document.querySelector('.js-progress-delivered')
            .classList.add('current-status');
    }
}



renderTrackingPage();