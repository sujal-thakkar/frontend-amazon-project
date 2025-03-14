let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
    <div class="product-image-container">
      <img class="product-image"
        src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
      ${product.name}
    </div>

    <div class="product-rating-container">
      <img class="product-rating-stars"
        src="images/ratings/rating-${product.rating.stars * 10}.png">
      <div class="product-rating-count link-primary">
        ${product.rating.count}
      </div>
    </div>

    <div class="product-price">
      $${(product.priceCents / 100).toFixed(2)}
    </div>

    <div class="product-quantity-container">
      <select class="js-quantity-selector-${product.id}">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="js-add-to-cart add-to-cart-button button-primary"
    data-product-id="${product.id}">
      Add to Cart
    </button>
  </div>
  `
});

const productsGrid = document.querySelector('.js-products-grid');
productsGrid.innerHTML = productsHTML;

const cartBtns = document.querySelectorAll('.js-add-to-cart');

cartBtns.forEach((cartBtn) => {
    cartBtn.addEventListener('click', () => {
      const productId = cartBtn.dataset.productId;
      const selectedQuantity = document.querySelector(`.js-quantity-selector-${productId}`)
      let flag = 0;

      cart.forEach((cartItem) => {
        if(cartItem.productId === productId) {
          cartItem.quantity += Number(selectedQuantity.value);
          flag = 1;
        }
      });

      if(flag === 0) {
        cart.push({
          productId,
          quantity: Number(selectedQuantity.value)
        });
      }

      let totalQuantity = 0;
      cart.forEach((item) => {
        totalQuantity += item.quantity;
      });
      document.querySelector('.js-cart-quantity').innerHTML = totalQuantity;

    });
});
