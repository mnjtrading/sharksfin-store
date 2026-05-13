// Product page state + catalogue navigation + shopping cart modal
const CART_STORAGE_KEY = "mnj-cart-items";
const ACTIVE_VISUAL_CATEGORIES = ["Gloves", "Wetsuit", "Fins", "Snorkels"];
const COMING_SOON_CATEGORIES = ["Misc"];
const SPEARGUN_PRICE_NOTICE = "Speargun starting prices vary from ₱4,000 to ₱22,000+";
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTueITT9gJNyIkgAaDn0RxkP4XbUpMJg8Xbm06EgKThTXTtoqF0FjjyAaqfexmbkMnGIJgUnfzTzrm/pub?output=csv";

const DEFAULT_PRODUCT_CATALOG = [
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
    id: "wetsuit-apnea-brown",
    category: "Wetsuit",
    name: "Apnea Wetsuit (Brown)",
    price: "₱6,500",
    image: "images/wetsuit_apnea_brown.png",
    details: "Apnea wetsuit designed for flexibility and comfort.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "wetsuit-apnea-green",
    category: "Wetsuit",
    name: "Apnea Wetsuit (Green)",
    price: "₱6,500",
    image: "images/wetsuit_apnea_green.png",
    details: "Apnea wetsuit designed for flexibility and comfort.",
    allProductsVisible: true,
    comingSoon: false
  },
  {
    id: "speargun-carbon",
    category: "Spearguns",
    name: "Carbon Speargun",
    price: "See pricing note",
    image: "images/speargun/carbon_speargun.png",
    details: "High-performance carbon speargun built for lightweight handling and power.",
    allProductsVisible: true,
    comingSoon: false,
    isDisplayOnly: true,
    priceNote: "Starting price varies from ₱4,000 to ₱22,000+"
  },
  {
    id: "speargun-mini-1",
    category: "Spearguns",
    name: "Mini Speargun",
    price: "See pricing note",
    image: "images/speargun/mini speargun.png",
    details: "Compact speargun option suited for smaller setups and maneuverability.",
    allProductsVisible: true,
    comingSoon: false,
    isDisplayOnly: true,
    priceNote: "Starting price varies from ₱4,000 to ₱22,000+"
  },
  {
    id: "speargun-mini-2",
    category: "Spearguns",
    name: "Mini Speargun 2",
    price: "See pricing note",
    image: "images/speargun/mini_speargun2.png",
    details: "Alternate compact speargun model with a clean, streamlined build.",
    allProductsVisible: true,
    comingSoon: false,
    isDisplayOnly: true,
    priceNote: "Starting price varies from ₱4,000 to ₱22,000+"
  },
  {
    id: "speargun-wood",
    category: "Spearguns",
    name: "Woodgun",
    price: "See pricing note",
    image: "images/speargun/Woodgun_130cm.png",
    details: "Traditional handcrafted woodgun collection. Open to choose your preferred variant.",
    allProductsVisible: true,
    comingSoon: false,
    isDisplayOnly: true,
    priceNote: "Starting price varies from ₱4,000 to ₱22,000+",
    variants: [
      {
        id: "speargun-wood-100cm",
        name: "Woodgun 100cm",
        image: "images/speargun/Woodgun_100cm.png",
        details: "Woodgun 100cm variant."
      },
      {
        id: "speargun-wood-100cm-2",
        name: "Woodgun 100cm 2",
        image: "images/speargun/Woodgun_100cm_2.png",
        details: "Alternate Woodgun 100cm variant."
      },
      {
        id: "speargun-wood-130cm",
        name: "Woodgun 130cm",
        image: "images/speargun/Woodgun_130cm.png",
        details: "Woodgun 130cm variant."
      },
      {
        id: "speargun-wood-130cm-noreel",
        name: "Woodgun 130cm No Reel",
        image: "images/speargun/Woodgun_130cm_noreel.png",
        details: "Woodgun 130cm without reel variant."
      }
    ]
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

window.ProductCatalog = [...DEFAULT_PRODUCT_CATALOG];

function parseCsvRow(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  result.push(current);
  return result;
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = parseCsvRow(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvRow(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = (values[i] ?? "").trim();
    });
    return obj;
  });
}

function toNumberPrice(value, fallbackValue) {
  const parsed = Number(String(value).replace(/[^0-9.]/g, ""));
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  const fallbackParsed = Number(String(fallbackValue).replace(/[^0-9.]/g, ""));
  return Number.isFinite(fallbackParsed) ? fallbackParsed : 0;
}

function formatPriceLabel(value) {
  return `₱${Number(value).toLocaleString("en-PH")}`;
}

async function loadProductsFromSheet() {
  const loadingEl = document.getElementById("productsLoading");
  if (loadingEl) loadingEl.style.display = "block";

  try {
    const res = await fetch(SHEET_URL);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const text = await res.text();
    const data = parseCSV(text);
    const rows = data.filter((row) => row.id);
    const sheetMap = new Map(rows.map((row) => [row.id, row]));

    window.ProductCatalog = DEFAULT_PRODUCT_CATALOG.map((product) => {
      const isSpeargun = product.id.startsWith("speargun-");
      const row = sheetMap.get(product.id);
      const numericPrice = row
        ? toNumberPrice(row.price, product.price)
        : toNumberPrice(product.price, product.price);

      return {
        ...product,
        name: row?.name?.trim() || product.name,
        price: (product.comingSoon || isSpeargun) ? product.price : formatPriceLabel(numericPrice)
      };
    });

  } catch (err) {
    console.error("Sheet load failed, fallback to local data", err);
    window.ProductCatalog = [...DEFAULT_PRODUCT_CATALOG];
  } finally {
    initializeApp();
  }
}

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
  const isDisplayOnly = Boolean(product.isDisplayOnly);
  const productPrice = product.comingSoon
    ? "Coming soon"
    : (isDisplayOnly ? "Availability / price inquiry" : product.price);
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
      data-display-only="${Boolean(product.isDisplayOnly)}"
      data-price-note="${product.priceNote || ""}"
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

  let lastCategory = null;
  const html = window.ProductCatalog.map((product) => {
    let header = "";
    if (product.category !== lastCategory) {
      header = `<div class="category-section-header" data-header-category="${product.category}">${product.category}</div>`;
      lastCategory = product.category;
    }
    return header + buildProductCard(product);
  }).join("");

  productsGrid.innerHTML = html;
}

function setActiveCategoryButton(category) {
  const categoryButtons = document.querySelectorAll("#categoryButtons button");
  categoryButtons.forEach((button) => {
    const isActive = button.textContent.trim() === (category === "All" ? "View All" : category);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function animateVisibleProductCards() {
  const productGrid = document.getElementById("products");
  if (!productGrid) return;

  const visibleCards = Array.from(productGrid.querySelectorAll(".product-card"))
    .filter((card) => card.style.display !== "none");

  productGrid.classList.remove("is-animating");
  visibleCards.forEach((card) => card.classList.remove("is-entering"));
  void productGrid.offsetWidth;
  productGrid.classList.add("is-animating");

  visibleCards.forEach((card, index) => {
    card.style.setProperty("--stagger-delay", `${Math.min(index * 36, 220)}ms`);
    card.classList.add("is-entering");
  });

  window.setTimeout(() => {
    productGrid.classList.remove("is-animating");
    visibleCards.forEach((card) => card.classList.remove("is-entering"));
  }, 420);
}

function setVisibleProductsForCategory(category) {
  const title = document.getElementById("catTitle");
  const products = document.querySelectorAll(".product-card");
  const headers = document.querySelectorAll(".category-section-header");

  // Hide all headers by default; revealed selectively for "All" below
  headers.forEach((h) => { h.style.display = "none"; });

  if (category === "All") {
    title.textContent = "All Products";
    updateCategoryNotice(category);
    products.forEach((productCard) => {
      const isVisible = productCard.dataset.allVisible === "true";
      productCard.style.display = isVisible ? "flex" : "none";
    });

    // Show a header only when it has at least one visible product after it
    headers.forEach((header) => {
      let sibling = header.nextElementSibling;
      let hasVisible = false;
      while (sibling && !sibling.classList.contains("category-section-header")) {
        if (sibling.classList.contains("product-card") && sibling.style.display !== "none") {
          hasVisible = true;
          break;
        }
        sibling = sibling.nextElementSibling;
      }
      if (hasVisible) header.style.display = "";
    });

    animateVisibleProductCards();
    return;
  }

  // Specific category — headers stay hidden
  title.textContent = category;
  updateCategoryNotice(category);
  products.forEach((productCard) => {
    productCard.style.display = productCard.dataset.category === category ? "flex" : "none";
  });

  animateVisibleProductCards();
}

function updateCategoryNotice(category) {
  const notice = document.getElementById("categoryNotice");
  if (!notice) return;
  const isSpeargunCategory = category === "Spearguns";
  notice.hidden = !isSpeargunCategory;
  notice.textContent = isSpeargunCategory ? SPEARGUN_PRICE_NOTICE : "";
}

window.getHeroSlidesFromCatalog = function getHeroSlidesFromCatalog() {
  return ACTIVE_VISUAL_CATEGORIES
    .map((category) => window.ProductCatalog.find((item) => item.category === category && !item.comingSoon && item.image))
    .filter(Boolean)
    .map((item) => ({
      image: item.image,
      title: item.name,
      subtitle: item.details || `${item.category} essentials crafted for performance.`,
      category: item.category
    }));
};

window.AppState = {
  shoppingList: [],
  selectedCard: null,
  selectedProduct: null,
  cartModalOpen: false,
  cartToastTimer: null,
  hasInitialized: false
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

function showCartToast(message) {
  const toast = document.getElementById("cartToast");
  const toastMessage = document.getElementById("cartToastMessage");
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add("is-visible");
  toast.classList.remove("is-hiding");

  if (window.AppState.cartToastTimer) {
    window.clearTimeout(window.AppState.cartToastTimer);
  }

  window.AppState.cartToastTimer = window.setTimeout(() => {
    toast.classList.add("is-hiding");
    toast.classList.remove("is-visible");
    window.AppState.cartToastTimer = null;
  }, 2600);
}

window.dismissCartToast = function dismissCartToast() {
  const toast = document.getElementById("cartToast");
  if (!toast) return;

  if (window.AppState.cartToastTimer) {
    window.clearTimeout(window.AppState.cartToastTimer);
    window.AppState.cartToastTimer = null;
  }

  toast.classList.remove("is-visible");
  toast.classList.add("is-hiding");
};

function pulseCartHighlight() {
  const cartPanel = document.querySelector(".cart-modal-content");
  if (!cartPanel) return;

  cartPanel.classList.remove("cart-highlight");
  void cartPanel.offsetWidth;
  cartPanel.classList.add("cart-highlight");
}

function animateAddButtonFeedback() {
  const addButton = document.querySelector(".add-cart-btn");
  if (!addButton) return;

  if (!addButton.dataset.defaultLabel) {
    addButton.dataset.defaultLabel = addButton.innerHTML;
  }

  if (addButton.dataset.feedbackTimeoutId) {
    window.clearTimeout(Number(addButton.dataset.feedbackTimeoutId));
  }

  addButton.classList.add("is-added");
  addButton.textContent = "Added ✓";

  const timeoutId = window.setTimeout(() => {
    addButton.classList.remove("is-added");
    addButton.innerHTML = addButton.dataset.defaultLabel || "🛒 Add to Cart";
    delete addButton.dataset.feedbackTimeoutId;
  }, 1000);

  addButton.dataset.feedbackTimeoutId = String(timeoutId);
}

window.openCategory = function openCategory(category) {
  const welcome = document.getElementById("welcome");
  const catalogue = document.getElementById("catalogue");

  // Fade welcome out, then remove from flow after transition completes
  welcome.classList.add("hidden");
  window.setTimeout(() => {
    welcome.style.display = "none";
  }, 280);

  // Make catalogue renderable, force a reflow so the transition can fire from opacity:0
  catalogue.style.display = "block";
  void catalogue.offsetWidth;
  catalogue.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "auto" });

  if (typeof window.closeProductModal === "function") {
    window.closeProductModal();
  }

  window.closeCartModal();
  setVisibleProductsForCategory(category);
  setActiveCategoryButton(category);
};

window.goBack = function goBack() {
  const welcome = document.getElementById("welcome");
  const catalogue = document.getElementById("catalogue");

  if (typeof window.closeProductModal === "function") {
    window.closeProductModal();
  }

  window.closeCartModal();
  catalogue.classList.add("hidden");

  // Wait for the full 280ms transition before swapping sections
  setTimeout(() => {
    catalogue.style.display = "none";
    welcome.style.display = "flex";
    // Force reflow so removing .hidden triggers the CSS transition rather than jumping
    void welcome.offsetWidth;
    welcome.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 280);
};

// Messenger checkout integrates through this button visibility helper to mirror cart state.
window.updateCheckoutButtonVisibility = function updateCheckoutButtonVisibility() {
  const checkoutButton = document.getElementById("checkoutButton");
  if (!checkoutButton) return;
  checkoutButton.hidden = window.AppState.shoppingList.length === 0;

  const floatingBtn = document.getElementById("floatingCartBtn");
  const floatingCount = document.getElementById("floatingCartCount");
  if (floatingBtn && floatingCount) {
    const { itemCount } = getCartTotals();
    const anyModalOpen =
      document.getElementById("productModal")?.classList.contains("active") ||
      document.getElementById("cartModal")?.classList.contains("active") ||
      document.getElementById("messengerCheckoutModal")?.classList.contains("active") ||
      document.getElementById("speargunInquiryModal")?.classList.contains("active");
    floatingBtn.hidden = itemCount === 0 || Boolean(anyModalOpen);
    floatingCount.textContent = String(itemCount);
  }
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
          <button type="button" class="remove-item-btn" data-remove-key="${item.key}" aria-label="Remove ${item.name} from cart">Remove</button>
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
  if (window.AppState.selectedProduct.isDisplayOnly) {
    document.getElementById("cartFeedback").textContent = "This product is for display and inquiry only.";
    return;
  }

  const incoming = window.AppState.selectedProduct;
  if (incoming.inquiryOnly) {
    document.getElementById("cartFeedback").textContent = "This item is for display/inquiry only.";
    return;
  }
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

  showCartToast(`Added to cart: ${incoming.name}${withSize}`);
  pulseCartHighlight();
  animateAddButtonFeedback();
  window.renderShoppingList();
};

function initializeApp() {
  window.initializeHeroSlideshow();

  if (window.AppState.hasInitialized) return;
  window.AppState.hasInitialized = true;

  renderCatalogCards();
  setVisibleProductsForCategory("All");
  setActiveCategoryButton("All");
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

  const toastCloseButton = document.getElementById("cartToastClose");
  toastCloseButton?.addEventListener("click", window.dismissCartToast);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (window.AppState.cartModalOpen) {
      window.closeCartModal();
    }
    if (document.getElementById("productModal")?.classList.contains("active")) {
      window.closeProductModal();
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadProductsFromSheet();
});

window.parsePriceLabel = parsePriceLabel;
window.getCartKey = getCartKey;
window.ACTIVE_VISUAL_CATEGORIES = ACTIVE_VISUAL_CATEGORIES;
window.COMING_SOON_CATEGORIES = COMING_SOON_CATEGORIES;
window.initializeApp = initializeApp;
