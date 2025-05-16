import { renderOrderSummary } from "../../../scripts/checkout/orderSummary.js";
import { loadFromStorage, cart } from "../../../data/cart.js";
import { renderPaymentSummary } from "../../../scripts/checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../../../data/products.js";

describe('test suite: render order summary', () => {
    const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
    const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

    beforeAll(async () => {
        await loadProductsFetch();
    });

    beforeEach(() => {
        spyOn(localStorage, 'setItem');

        document.querySelector('.js-test-container')
            .innerHTML = `
                <div class="js-order-summary"></div>
                <div class="js-checkout-header"></div>
                <div class="js-payment-summary"></div>
            `
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([
                {
                    productId: productId1,
                    quantity: 2,
                    deliveryOptionsId: '2'
                },
                {
                    productId: productId2,
                    quantity: 1,
                    deliveryOptionsId: '1'
                }
            ]);
        });
        loadFromStorage();

        renderOrderSummary();
    });

    afterEach(() => {
        document.querySelector('.js-test-container').innerHTML = '';
    });

    it('displays the cart', () => {
        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(2);

        expect(
            document.querySelector(`.js-product-quantity-${productId1}`).innerText
        ).toContain('Quantity: 2');

        expect(
            document.querySelector(`.js-product-quantity-${productId2}`).innerText
        ).toContain('Quantity: 1');

        expect(
            document.querySelector(`.js-product-name-${productId1}`).innerText
        ).toContain("Black and Gray Athletic Cotton Socks");

        expect(
            document.querySelector(`.js-product-name-${productId2}`).innerText
        ).toContain("Intermediate Size Basketball");

        expect(
            document.querySelector(`.js-product-price-${productId1}`).innerText
        ).toEqual('$10.90');


        expect(
            document.querySelector(`.js-product-price-${productId2}`).innerText
        ).toEqual('$20.95');
    });

    it('removes a product', () => {
        document.querySelector(`.js-delete-link-${productId1}`).click();

        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(1);

        expect(
            document.querySelector(`.js-cart-item-comtainer-${productId1}`)
        ).toEqual(null);

        expect(
            document.querySelector(`.js-cart-item-comtainer-${productId2}`)
        ).not.toEqual(!null);

        expect(cart.length).toEqual(1);

        expect(cart[0].productId).toEqual(productId2);
    });

    it('updates the delivery option', () => {
        document.querySelector(`.js-delivery-option-${productId1}-3`).click();

        expect(
            document.querySelector(`.js-delivery-option-input-${productId1}-3`).checked
        ).toEqual(true);

        expect(cart.length).toEqual(2);

        expect(cart[0].productId && cart[0].deliveryOptionsId).toEqual(productId1 && '3');

        expect(
            document.querySelector('.js-payment-summary-shipping').innerText
        ).toEqual('$9.99');

        expect(
            document.querySelector('.js-payment-summary-total').innerText
        ).toEqual('$58.01')
    });
});