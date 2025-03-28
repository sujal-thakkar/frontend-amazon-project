export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart) {
    cart = [
        {
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c10',
            quantity: 2
        },
        {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1
        }
    ]
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, selectedQuantity) {
    let flag = 0;

    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            cartItem.quantity += Number(selectedQuantity.value);
            flag = 1;
        }
    });

    if (flag === 0) {
        cart.push({
            productId,
            quantity: Number(selectedQuantity.value)
        });
    }

    saveToStorage();
}

export function removeFromCart(productId) {
    const newCart = [];
    cart.forEach((cartItem) => {
        if(cartItem.productId !== productId)
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
        if(item.productId === productId) {
            item.quantity = newQuantity;
        }

        saveToStorage();
    })
}