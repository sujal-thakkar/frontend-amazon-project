import { addToCart, cart, loadFromStorage, removeFromCart, updateDeliveryOption } from "../../../data/cart.js";

describe('test suite: add to cart', () => {
    beforeEach(() => {
        spyOn(localStorage, 'setItem');
    });

    it('adds an existing product to the cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c10',
                quantity: 1,
                deliveryOptionId: '1'
            }]);
        });
        loadFromStorage();

        addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c10', 1);
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem)
            .toHaveBeenCalledWith('cart', JSON.stringify(cart));
        expect(cart[0].productId)
            .toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c10');
        expect(cart[0].quantity).toEqual(2);
    });

    it('adds a new product to the cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });
        loadFromStorage();

        addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c10', 1);
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem)
            .toHaveBeenCalledWith('cart', JSON.stringify(cart));
        expect(cart[0].productId)
            .toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c10');
        expect(cart[0].quantity).toEqual(1);
    });
});

describe('test suite: remove from cart', () => {
    beforeEach(() => {
        spyOn(localStorage, 'setItem');
    });

    it('removes a product from the cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c10',
                quantity: 1,
                deliveryOptionId: '1'
            }]);
        });
        loadFromStorage();

        removeFromCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c10');
        
        expect(cart.length).toEqual(0);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem)
            .toHaveBeenCalledWith('cart',JSON.stringify([]));
    });

    it('does nothing if product is not in the cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c10',
                quantity: 1,
                deliveryOptionId: '1'
            }]);
        });
        loadFromStorage();

        removeFromCart('does-not-exist');
        
        expect(cart.length).toEqual(1);
        expect(cart[0].productId)
            .toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c10');
        expect(cart[0].quantity).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c10',
            quantity: 1,
            deliveryOptionId: '1'
        }]));
    });
});

describe('test suite: update delivery option', () => {
    beforeEach(() => {
        spyOn(localStorage, 'setItem');
    });

    it('update delivery option of a product', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c10',
                quantity: 1,
                deliveryOptionsId: '1'
            }]);
        });
        loadFromStorage();

        updateDeliveryOption('e43638ce-6aa0-4b85-b27f-e1d07eb678c10', '3');

        expect(cart.length).toEqual(1);
        expect(
            cart[0].productId
        ).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c10');
        expect(cart[0].quantity).toEqual(1);

        expect(cart[0].deliveryOptionsId).toEqual('3');

        expect(localStorage.setItem).toHaveBeenCalledTimes(1);

        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c10',
            quantity: 1,
            deliveryOptionsId: '3'
        }]));
    });

    it('does nothing if productId is not valid/in cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c10',
                quantity: 1,
                deliveryOptionsId: '1'
            }]);
        });
        loadFromStorage();

        updateDeliveryOption('not-in-cart', '2');

        expect(cart.length).toEqual(1);
        expect(cart[0].deliveryOptionsId).toEqual('1');
        expect(
            localStorage.setItem
        ).toHaveBeenCalledTimes(0);
    });

    it('does nothing if deliveryOptionId is not valid', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c10',
                quantity: 1,
                deliveryOptionsId: '1'
            }]);
        });
        loadFromStorage();

        updateDeliveryOption('e43638ce-6aa0-4b85-b27f-e1d07eb678c10', 'invalid-deliveryOptionId');

        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c10');
        expect(cart[0].deliveryOptionsId).toEqual('1');
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });
});