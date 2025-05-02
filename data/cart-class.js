class Cart {
    cartItems;
    #localStorageKey;

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
        this.#loadFromStorage();
    }

    #loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));
    
        if (!this.cartItems) {
            this.cartItems = [
                {
                    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c10',
                    quantity: 1,
                    deliveryOptionsId: '1'
                },
                {
                    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                    quantity: 2,
                    deliveryOptionsId: '2'
                }
            ]
        }
    }

    saveToStorage() {
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }

    addToCart(productId, selectedQuantity) {
        let matchingItem;
    
        this.cartItems.forEach((cartItem) => {
            if(cartItem.productId === productId) matchingItem = cartItem;
        });
    
        const quantityToAdd = Number(
            typeof selectedQuantity === 'object' ? selectedQuantity.value : selectedQuantity
        );
    
        if(matchingItem) matchingItem.quantity += quantityToAdd;
        else {
            this.cartItems.push({
                productId,
                quantity : quantityToAdd,
                deliveryOptionsId : '1'
            });
        }
    
        this.saveToStorage();
    }

    removeFromCart(productId) {
        const newCart = [];
        this.cartItems.forEach((cartItem) => {
            if (cartItem.productId !== productId)
                newCart.push(cartItem);
        });
    
        this.cartItems = newCart;
    
        this.saveToStorage();
    }

    updateDeliveryOption(productId, deliveryOptionId) {
        if(deliveryOptionId != '1' 
            && deliveryOptionId != '2' 
            && deliveryOptionId != '3') 
        return;
        
        let matchingProduct;
        this.cartItems.forEach((cartItem) => {
            if(cartItem.productId === productId) {
                matchingProduct = cartItem;
            }
        });
    
        if(!matchingProduct) return;
    
        matchingProduct.deliveryOptionsId = deliveryOptionId;
    
        this.saveToStorage();
    }

    calculateCartQuantity() {
        let totalQuantity = 0;
        this.cartItems.forEach((cartItem) => {
            totalQuantity += cartItem.quantity;
        });
    
        return totalQuantity;
    }

    updateQuantity(productId, newQuantity) {
        this.cartItems.forEach((item) => {
            if (item.productId === productId) {
                item.quantity = newQuantity;
            }
    
            this.saveToStorage();
        });
    }
};

const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');



console.log(cart);
console.log(businessCart);

console.log(businessCart instanceof Cart);