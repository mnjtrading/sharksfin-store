// Product page state + catalogue navigation + shopping cart modal
const CART_STORAGE_KEY = "mnj-cart-items";
const ACTIVE_VISUAL_CATEGORIES = ["Gloves", "Wetsuit", "Fins", "Snorkels"];
const COMING_SOON_CATEGORIES = ["Spearguns", "Misc"];

window.ProductCatalog = [
  {
    id: "gloves-blue",
    category: "Gloves",
    name: "Hammerhead Blue Dive Gloves",
    price: "₱1,500",
    image: "images/gloves/blue_gloves.png",
    details: "Flexible neoprene gloves with reinforced palms for dependable grip and comfort.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "gloves-black",
    category: "Gloves",
    name: "Hammerhead Black Dive Gloves",
    price: "₱1,500",
    image: "images/gloves/hh_blk_gloves.png",
    details: "Streamlined black gloves built for durability and thermal protection underwater.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "gloves-knuckle-black",
    category: "Gloves",
    name: "Hammerhead Black Knuckle Gloves",
    price: "₱1,500",
    image: "images/gloves/hh_blk_gloves_knuckles.png",
    details: "Knuckle-protected glove design for rugged use around reefs and rocky entries.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "gloves-red",
    category: "Gloves",
    name: "Hammerhead Red Dive Gloves",
    price: "₱1,500",
    image: "images/gloves/hh_gloves_red.png",
    details: "High-visibility red finish with soft inner lining for long dive sessions.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "gloves-red-knuckle",
    category: "Gloves",
    name: "Hammerhead Red Knuckle Gloves",
    price: "₱1,500",
    image: "images/gloves/hh_red_knuckles_gloves.png",
    details: "Reinforced red gloves balancing flexibility, grip, and added knuckle coverage.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "fins-black",
    category: "Fins",
    name: "HAMMERHEAD BLACK KAUDAL FINS",
    price: "₱4,500",
    image: "images/fins/Fins_Black.png",
    details: "Lightweight long-blade fins designed for deep dives, giving efficient propulsion with reduced fatigue.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "fins-white",
    category: "Fins",
    name: "HAMMERHEAD WHITE KAUDAL FINS",
    price: "₱4,500",
    image: "images/fins/hammerhead_fins_white.png",
    details: "Responsive long-blade design tuned for glide efficiency and steady kicks.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "snorkel-green",
    category: "Snorkels",
    name: "Hammerhead Green Snorkel",
    price: "₱3,500",
    image: "images/snorkel/green_snorkel.png",
    details: "Semi-dry top snorkel with low-profile shape to reduce drag and splash entry.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "snorkel-black",
    category: "Snorkels",
    name: "Hammerhead Black Snorkel",
    price: "₱3,500",
    image: "images/snorkel/hh_black_snorkel.png",
    details: "Comfort mouthpiece and simple purge flow for reliable breathing between dives.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "wetsuit-blue",
    category: "Wetsuit",
    name: "Ambush 2-Piece Wetsuit 1.5mm (Blue Shark Camo)",
    price: "₱6,500",
    image: "images/Wetsuit_1.png",
    details: "Two-piece 1.5mm wetsuit optimized for tropical freediving with streamlined mobility.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "wetsuit-green",
    category: "Wetsuit",
    name: "Ambush 2-Piece Wetsuit 1.5mm (Green Shark Camo)",
    price: "₱6,500",
    image: "images/Wetsuit_2.jpg",
    details: "Two-piece camo wetsuit with flexible panels for comfort through extended sessions.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "spearguns-soon",
    category: "Spearguns",
    name: "Spearguns",
    price: "Coming soon",
    details: "New products will be added soon.",
    allProductsVisible: false,
    comingSoon: true
  },
  {
    id: "misc-soon",
    category: "Misc",
    name: "Misc Accessories",
    price: "Coming soon",
    details: "New products will be added soon.",
    allProductsVisible: false,
    comingSoon: true
  }
];

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

function buildProductCard(product) {
  const comingSoonClass = product.comingSoon ? " is-coming-soon" : "";
  const productPrice = product.comingSoon ? "Coming soon" : product.price;
  const media = product.comingSoon
    ? `
      <div class="product-placeholder" aria-label="${product.category} coming soon">
        <div class="coming-soon-title">Coming soon</div>
        <p>New products will be added soon.</p>
      </div>
    `
    : `<img src="${product.image}" alt="${product.name}" loading="lazy">`;

  return `
    <article
      class="product-card${comingSoonClass}"
      data-id="${product.id}"
      data-category="${product.category}"
      data-name="${product.name}"
      data-price="${productPrice}"
      data-details="${product.details || ""}"
      data-all-visible="${product.allProductsVisible}"
      data-coming-soon="${product.comingSoon}"
      ${product.comingSoon ? "" : "onclick=\"showProductModal(this)\""}
    >
      ${media}
      <div class="product-card-body">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${productPrice}</div>
      </div>
    </article>
  `;
}

function renderCatalogCards() {
  const productsGrid = document.getElementById("products");
  if (!productsGrid) return;

  productsGrid.innerHTML = window.ProductCatalog
    .map((product) => buildProductCard(product))
    .join("");
}

function setVisibleProductsForCategory(category) {
  const title = document.getElementById("catTitle");
  const products = document.querySelectorAll(".product-card");

  if (category === "All") {
    title.textContent = "All Products";
    products.forEach((productCard) => {
      const isVisible = productCard.dataset.allVisible === "true";
      productCard.style.display = isVisible ? "flex" : "none";
    });
    return;
  }

  title.textContent = category;
  products.forEach((productCard) => {
    productCard.style.display = productCard.dataset.category === category ? "flex" : "none";
  });
}

window.getHeroSlidesFromCatalog = function getHeroSlidesFromCatalog() {
  return ACTIVE_VISUAL_CATEGORIES
    .map((category) => window.ProductCatalog.find((item) => item.category === category && !item.comingSoon && item.image))
    .filter(Boolean)
    .map((item) => ({
      image: item.image,
      title: item.name,
      subtitle: item.details || `${item.category} essentials crafted for performance.`
    }));
};

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
  setVisibleProductsForCategory(category);
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

// Messenger checkout integrates through this button visibility helper to mirror cart state.
window.updateCheckoutButtonVisibility = function updateCheckoutButtonVisibility() {
  const checkoutButton = document.getElementById("checkoutButton");
  if (!checkoutButton) return;
  checkoutButton.hidden = window.AppState.shoppingList.length === 0;
};

window.renderShoppingList = function renderShoppingList() {
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");
  const cartGrandTotal = document.getElementById("cartGrandTotal");
  if (!cartItems || !cartSummary || !cartGrandTotal) return;

  if (window.AppState.shoppingList.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty.</p>
        <button type="button" class="checkout-btn continue-shopping-btn" onclick="closeCartModal()">Continue Shopping</button>
      </div>
    `;
    cartSummary.textContent = "0 items";
    cartGrandTotal.textContent = "₱0";
    window.updateCheckoutButtonVisibility();
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
  window.updateCheckoutButtonVisibility();
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
  if (typeof window.syncBodyScrollLock === "function") {
    window.syncBodyScrollLock();
  }
};

window.closeCartModal = function closeCartModal() {
  const cartModal = document.getElementById("cartModal");
  if (!cartModal) return;

  window.AppState.cartModalOpen = false;
  cartModal.classList.remove("active");
  if (typeof window.syncBodyScrollLock === "function") {
    window.syncBodyScrollLock();
  }
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
  renderCatalogCards();
  setVisibleProductsForCategory("All");
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
window.ACTIVE_VISUAL_CATEGORIES = ACTIVE_VISUAL_CATEGORIES;
window.COMING_SOON_CATEGORIES = COMING_SOON_CATEGORIES;
