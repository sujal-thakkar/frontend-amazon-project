import { cart, addToCart, calculateCartQuantity } from "../data/cart.js";
import { products, loadProducts } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

loadProducts(renderProductsGrid);

function renderProductsGrid() {
  updateCartQuantity();

  // Get search parameter from URL
  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');
  let filteredProducts = products;

  if (search && search.trim() !== '') {
    const searchLower = search.toLowerCase();
    filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      (Array.isArray(product.keywords) &&
        product.keywords.some(keyword =>
          keyword.toLowerCase().includes(searchLower)
        )
      )
    );
  }

  let productsHTML = '';

  filteredProducts.forEach((product) => {
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
          src="${product.getRatingsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
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

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="js-added-${product.id} added-to-cart">
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

  const addedMsgTimeouts = {};

  function displayAddedMsg(productId) {
    const addedMsg = document.querySelector(`.js-added-${productId}`);

    addedMsg.classList.add('added-msg-visible');

    const previousTimeoutId = addedMsgTimeouts[productId];

    if (previousTimeoutId)
      clearTimeout(previousTimeoutId);

    const timeoutId = setTimeout(() => {
      addedMsg.classList.remove('added-msg-visible');
    }, 2000);

    addedMsgTimeouts[productId] = timeoutId;
  }

  function updateCartQuantity() {
    let totalQuantity = calculateCartQuantity();
    if (totalQuantity > 0)
      document.querySelector('.js-cart-quantity').innerHTML = totalQuantity;
  }

  cartBtns.forEach((cartBtn) => {
    cartBtn.addEventListener('click', () => {
      const productId = cartBtn.dataset.productId;

      const selectedQuantity = document.querySelector(`.js-quantity-selector-${productId}`);

      addToCart(productId, selectedQuantity);

      displayAddedMsg(productId);

      updateCartQuantity();

    });
  });

  const searchInput = document.querySelector('.js-search-input');
  const searchBtnContainer = document.querySelector('.js-search');
  searchBtnContainer.innerHTML = `
    <button class="js-search-btn search-button">
      <img class="search-icon" src="images/icons/search-icon.png">
    </button>
  `;

  const searchBtn = document.querySelector('.js-search-btn');
  searchBtn.addEventListener('click', () => {
    const query = encodeURIComponent(searchInput.value);
    window.location.href = `amazon.html?search=${query}`;
  });

}
