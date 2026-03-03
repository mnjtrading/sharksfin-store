// Product page state + catalogue navigation + shopping cart modal
const CART_STORAGE_KEY = "mnj-cart-items";

function parsePriceLabel(priceLabel) {
  const symbolMatch = priceLabel.match(/[₱$]/);
  const value = Number(priceLabel.replace(/[^0-9.]/g, "")) || 0;
  return {
    symbol: symbolMatch ? symbolMatch[0] : "₱",
    value
  };
}

function formatPrice(symbol, amount) {
  return `${symbol}${amount.toLocaleString("en-PH")}`;
}

function getCartKey(item) {
  return `${item.name}__${item.size || "no-size"}`;
}

window.AppState = {
  shoppingList: [],
  selectedCard: null,
  selectedProduct: null,
  cartModalOpen: false
};

function saveCartState() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(window.AppState.shoppingList));
}

function loadCartState() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      window.AppState.shoppingList = parsed;
    }
  } catch (error) {
    window.AppState.shoppingList = [];
  }
}

function getCartTotals() {
  const totalsBySymbol = {};
  let itemCount = 0;

  window.AppState.shoppingList.forEach((item) => {
    itemCount += item.quantity;
    const subtotal = item.unitPrice * item.quantity;
    totalsBySymbol[item.symbol] = (totalsBySymbol[item.symbol] || 0) + subtotal;
  });

  const totalLabel = Object.entries(totalsBySymbol)
    .map(([symbol, total]) => formatPrice(symbol, total))
    .join(" + ") || "₱0";

  return { itemCount, totalLabel };
}

window.openCategory = function openCategory(category) {
  const welcome = document.getElementById("welcome");
  const catalogue = document.getElementById("catalogue");

  welcome.classList.add("hidden");
  welcome.style.display = "none";
  catalogue.style.display = "block";
  requestAnimationFrame(() => catalogue.classList.remove("hidden"));
  window.scrollTo({ top: 0, behavior: "auto" });

  if (typeof window.closeProductModal === "function") {
    window.closeProductModal();
  }

  window.closeCartModal();

  const title = document.getElementById("catTitle");
  const products = document.querySelectorAll(".product-card");

  if (category === "All") {
    title.textContent = "All Products";
    products.forEach((product) => {
      product.style.display = "block";
    });
  } else {
    title.textContent = category;
    products.forEach((product) => {
      product.style.display = product.dataset.category === category ? "block" : "none";
    });
  }
};

window.goBack = function goBack() {
  const welcome = document.getElementById("welcome");
  const catalogue = document.getElementById("catalogue");

  if (typeof window.closeProductModal === "function") {
    window.closeProductModal();
  }

  window.closeCartModal();
  catalogue.classList.add("hidden");

  setTimeout(() => {
    catalogue.style.display = "none";
    welcome.style.display = "flex";
    welcome.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 220);
};

window.renderShoppingList = function renderShoppingList() {
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");
  const cartGrandTotal = document.getElementById("cartGrandTotal");
  if (!cartItems || !cartSummary || !cartGrandTotal) return;

  if (window.AppState.shoppingList.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    cartSummary.textContent = "0 items";
    cartGrandTotal.textContent = "₱0";
    return;
  }

  cartItems.innerHTML = window.AppState.shoppingList
    .map((item) => {
      const subtotal = item.unitPrice * item.quantity;
      return `
        <article class="cart-item" data-key="${item.key}">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-body">
            <h4>${item.name}</h4>
            <p>Size: ${item.size || "N/A"}</p>
            <p>Qty: ${item.quantity}</p>
            <p>Unit: ${formatPrice(item.symbol, item.unitPrice)}</p>
            <p class="item-total">Item Total: ${formatPrice(item.symbol, subtotal)}</p>
          </div>
          <button type="button" class="remove-item-btn" data-remove-key="${item.key}">Remove</button>
        </article>
      `;
    })
    .join("");

  const totals = getCartTotals();
  cartSummary.textContent = `${totals.itemCount} item${totals.itemCount === 1 ? "" : "s"}`;
  cartGrandTotal.textContent = totals.totalLabel;
};

window.toggleShoppingList = function toggleShoppingList(forceState) {
  const shouldOpen = typeof forceState === "boolean" ? forceState : !window.AppState.cartModalOpen;
  if (shouldOpen) {
    window.openCartModal();
    return;
  }
  window.closeCartModal();
};

window.openCartModal = function openCartModal() {
  const cartModal = document.getElementById("cartModal");
  if (!cartModal) return;

  window.AppState.cartModalOpen = true;
  window.renderShoppingList();
  cartModal.classList.add("active");
};

window.closeCartModal = function closeCartModal() {
  const cartModal = document.getElementById("cartModal");
  if (!cartModal) return;

  window.AppState.cartModalOpen = false;
  cartModal.classList.remove("active");
};

window.handleCartOverlayClick = function handleCartOverlayClick(event) {
  const popup = document.querySelector(".cart-modal-content");
  if (popup && !popup.contains(event.target)) {
    window.closeCartModal();
  }
};

window.removeCartItem = function removeCartItem(itemKey) {
  const itemElement = Array.from(document.querySelectorAll(".cart-item"))
    .find((element) => element.dataset.key === itemKey);

  if (itemElement) {
    itemElement.classList.add("is-removing");
  }

  window.setTimeout(() => {
    window.AppState.shoppingList = window.AppState.shoppingList.filter((item) => item.key !== itemKey);
    saveCartState();
    window.renderShoppingList();
  }, itemElement ? 220 : 0);
};

window.addToCartFromModal = function addToCartFromModal() {
  if (!window.AppState.selectedProduct) return;

  const incoming = window.AppState.selectedProduct;
  const existing = window.AppState.shoppingList.find((item) => item.key === incoming.key);

  if (existing) {
    existing.quantity += incoming.quantity;
  } else {
    window.AppState.shoppingList.push({ ...incoming });
  }

  saveCartState();
  const withSize = incoming.size ? ` (${incoming.size})` : "";
  document.getElementById("cartFeedback").textContent =
    `${incoming.name}${withSize} added x${incoming.quantity}.`;

  window.renderShoppingList();
};

window.addEventListener("DOMContentLoaded", () => {
  loadCartState();
  window.renderShoppingList();

  const cartItems = document.getElementById("cartItems");
  if (cartItems) {
    cartItems.addEventListener("click", (event) => {
      const button = event.target.closest(".remove-item-btn");
      if (!button) return;
      window.removeCartItem(button.dataset.removeKey);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (window.AppState.cartModalOpen) {
      window.closeCartModal();
    }
    if (document.getElementById("productModal")?.classList.contains("active")) {
      window.closeProductModal();
    }
  });
});

window.parsePriceLabel = parsePriceLabel;
window.getCartKey = getCartKey;
