export const cart = []

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
}