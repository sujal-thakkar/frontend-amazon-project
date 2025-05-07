export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
    orders.unshift(order);
}

export function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}