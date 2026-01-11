const CART_API = "http://localhost:5000/api/cart";
const ORDER_API = "http://localhost:5000/api/orders";

document.addEventListener("DOMContentLoaded", () => {
  const drawer = document.getElementById("cartDrawer");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const checkoutForm = document.getElementById("checkoutForm");

  function openCart() {
    drawer.style.right = "0";
    loadCart();
  }

  function closeCart() {
    drawer.style.right = "-420px";
  }

  window.openCart = openCart;
  window.closeCart = closeCart;

  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) cartBtn.onclick = openCart;

  async function loadCart() {
    const res = await fetch(CART_API);
    const cart = await res.json();

    if (!cart.length) {
      cartItemsEl.innerHTML = "<p>Your cart is empty</p>";
      cartTotalEl.innerText = "Rs. 0";
      return;
    }

    let total = 0;

    cartItemsEl.innerHTML = cart.map(item => {
      total += item.price * item.quantity;
      return `
        <div style="margin-bottom:16px;">
          <strong>${item.name}</strong><br/>
          Size: ${item.size || "-"}<br/>
          Qty: ${item.quantity}<br/>
          Rs. ${item.price * item.quantity}
        </div>
      `;
    }).join("");

    cartTotalEl.innerText = `Rs. ${total}`;
  }

  // 🔥 expose for product.js (instant refresh)
  window.loadCart = loadCart;

  checkoutForm.onsubmit = async (e) => {
    e.preventDefault();

    const name = checkoutForm.querySelector("input:nth-of-type(1)").value;
    const email = checkoutForm.querySelector("input:nth-of-type(2)").value;
    const address = checkoutForm.querySelector("textarea").value;

    if (!name || !email) {
      alert("Name and email are required");
      return;
    }

    const res = await fetch(ORDER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, address })
    });

    if (!res.ok) {
      alert("Failed to place order");
      return;
    }

    alert("Order placed successfully");
    closeCart();
    location.reload();
  };
});
