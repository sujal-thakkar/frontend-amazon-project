export let cart;

loadFromStorage();

export function loadFromStorage() {
    cart = JSON.parse(localStorage.getItem('cart'));

    if (!cart) {
        cart = [
            {
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                quantity: 2,
                deliveryOptionsId: '1'
            },
            {
                productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                quantity: 1,
                deliveryOptionsId: '2'
            }
        ]
    }
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, selectedQuantity) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) matchingItem = cartItem;
    });

    const quantityToAdd = Number(
        typeof selectedQuantity === 'object' ? selectedQuantity.value : selectedQuantity
    );

    if (matchingItem) matchingItem.quantity += quantityToAdd;
    else {
        cart.push({
            productId,
            quantity: quantityToAdd,
            deliveryOptionsId: '1'
        });
    }

    saveToStorage();
}

export function removeFromCart(productId) {
    const newCart = [];
    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId)
            newCart.push(cartItem);
    });

    cart = newCart;

    saveToStorage();
}

export function calculateCartQuantity() {
    let totalQuantity = 0;
    cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
    });

    return totalQuantity;
}

export function updateQuantity(productId, newQuantity) {
    cart.forEach((item) => {
        if (item.productId === productId) {
            item.quantity = newQuantity;
        }

        saveToStorage();
    })
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    if (deliveryOptionId != '1'
        && deliveryOptionId != '2'
        && deliveryOptionId != '3')
        return;

    let matchingProduct;
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            matchingProduct = cartItem;
        }
    });

    if (!matchingProduct) return;

    matchingProduct.deliveryOptionsId = deliveryOptionId;

    saveToStorage();
}

export function loadCart(func) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
        console.log(xhr.response);
        func();
    });

    xhr.open('GET', 'https://supersimplebackend.dev/cart');
    xhr.send();
}