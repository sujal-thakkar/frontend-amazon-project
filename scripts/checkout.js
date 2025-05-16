import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { renderCheckoutHeader } from './checkout/checkoutHeader.js';
import { loadProducts, loadProductsFetch } from '../data/products.js';
import { loadCart, loadCartFetch } from '../data/cart.js';
// import '../data/cart-class.js';
// import '../data/car.js';
// import '../data/backend-practice.js';

async function loadPage() {
    try {
        await Promise.all([
            loadProductsFetch(),
            loadCartFetch()
        ])
    }
    catch(error) {
        console.log('Unexpected error occured. Please try again forever');
    }

    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
}
loadPage();

/* Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve(); 
        });
    })

]).then((values) => {
    console.log(values);
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
}); */

/* new Promise((resolve) => {
    loadProducts(() => {
        resolve('return value');
    });

}).then((value) => {
    console.log(value);
    return new Promise((resolve) => {
        loadCart(() => {
            resolve(); 
        });
    });

}).then(() => {
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
}); */

/* loadProducts(() => {
    loadCart(() => {
        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
    });
}); */

