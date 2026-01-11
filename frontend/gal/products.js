const API_BASE = "http://localhost:5000/api";

const IMAGE_MAP = {
  1: "../product1.png",
  2: "../product2.webp",
  3: "../product3.webp",
  4: "../product4.png",
  5: "../product5.png",
  6: "../product6.webp",
  7: "../product7.png",
  8: "../product8.png",
  9: "../product9.webp"
};

// store selected size per product
const selectedSizes = {};

function productCard(p) {
  return `
    <div class="product-card" data-product-id="${p.id}">
      <div class="product-image-wrapper">
        <span class="badge">Oversized Fit</span>
        <div class="wishlist-icon"><i class="far fa-heart"></i></div>
        <img src="${IMAGE_MAP[p.id]}" alt="${p.name}" class="product-image" />
      </div>

      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <div class="product-price">Rs. ${p.price}</div>

        <div class="size-options">
          ${['S','M','L','XL'].map(size => `
            <div
              class="size-option"
              onclick="selectSize(${p.id}, '${size}', this)">
              ${size}
            </div>
          `).join('')}
        </div>

        <button
          onclick="handleAddToCart(${p.id})"
          style="
            margin-top:10px;
            width:100%;
            padding:12px;
            background:#000;
            color:#fff;
            border:none;
            text-transform:uppercase;
            letter-spacing:1px;
            cursor:pointer;
          ">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

// select size (visual highlight only)
function selectSize(productId, size, el) {
  selectedSizes[productId] = size;

  el.parentElement
    .querySelectorAll(".size-option")
    .forEach(s => (s.style.borderColor = "#e5e5e5"));

  el.style.borderColor = "#000";
}

// add to cart only after size selection
async function handleAddToCart(productId) {
  const size = selectedSizes[productId];

  if (!size) {
    alert("Please select a size");
    return;
  }

  await fetch(`${API_BASE}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, size })
  });

  updateCartCount();

  // 🔥 instant cart refresh (no delay, no reload)
  if (window.loadCart) {
    window.loadCart();
  }
}

async function loadProducts() {
  const res = await fetch(`${API_BASE}/products`);
  const products = await res.json();

  document.getElementById("productGrid").innerHTML =
    products.map(productCard).join("");
}

async function updateCartCount() {
  const res = await fetch(`${API_BASE}/cart`);
  const cart = await res.json();
  document.querySelector(".cart-btn").innerText = `CART (${cart.length})`;
}

loadProducts();
updateCartCount();
