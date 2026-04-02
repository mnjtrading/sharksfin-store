// Product modal open/close behavior, overlay interaction, sizes, quantity, and image magnification
const WETSUIT_SIZES = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large"
];

function renderSizeOptions(productCategory) {
  const sizeBlock = document.getElementById("modalSizeBlock");
  const sizeGrid = document.getElementById("sizeGrid");
  const sizeWarning = document.getElementById("sizeWarning");

  const requiresSizeSelection = ["Wetsuit", "Gloves"].includes(productCategory);

  if (!requiresSizeSelection) {
    sizeBlock.style.display = "none";
    sizeWarning.classList.remove("active");
    sizeGrid.innerHTML = "";
    return;
  }

  sizeBlock.style.display = "block";
  sizeWarning.classList.remove("active");
  sizeGrid.innerHTML = WETSUIT_SIZES
    .map((size) => `<button type="button" class="size-option" data-size="${size}">${size}</button>`)
    .join("");
}

function syncModalQuantity() {
  const quantityView = document.getElementById("modalQuantity");
  if (!quantityView || !window.AppState.selectedProduct) return;
  quantityView.textContent = String(window.AppState.selectedProduct.quantity);
}

window.selectProductSize = function selectProductSize(option) {
  const selectedSize = option.dataset.size;
  document.querySelectorAll(".size-option").forEach((sizeOption) => {
    sizeOption.classList.toggle("selected", sizeOption === option);
  });

  document.getElementById("sizeWarning").classList.remove("active");
  document.getElementById("modalSizeBlock").classList.remove("has-warning");

  if (window.AppState.selectedProduct) {
    window.AppState.selectedProduct.size = selectedSize;
  }
};

window.changeModalQuantity = function changeModalQuantity(delta) {
  if (!window.AppState.selectedProduct) return;
  const nextQuantity = Math.max(1, window.AppState.selectedProduct.quantity + delta);
  window.AppState.selectedProduct.quantity = nextQuantity;
  syncModalQuantity();
};

function resetImageZoom() {
  const imageFrame = document.getElementById("modalImageFrame");
  imageFrame.classList.remove("is-zoomed");
  imageFrame.style.removeProperty("--zoom-x");
  imageFrame.style.removeProperty("--zoom-y");
}

window.toggleImageZoom = function toggleImageZoom() {
  const imageFrame = document.getElementById("modalImageFrame");
  imageFrame.classList.toggle("is-zoomed");
};

window.showProductModal = function showProductModal(card) {
  if (card.dataset.comingSoon === "true") return;

  const modal = document.getElementById("productModal");
  const grid = document.getElementById("products");
  const details = card.dataset.details || "";
  const modalDescription = document.getElementById("modalDescription");
  const image = card.querySelector("img");
  if (!image) return;

  const parsedPrice = window.parsePriceLabel(card.dataset.price);
  window.AppState.selectedCard = card;
  window.AppState.selectedProduct = {
    key: "",
    name: card.dataset.name,
    priceLabel: card.dataset.price,
    symbol: parsedPrice.symbol,
    unitPrice: parsedPrice.value,
    category: card.dataset.category,
    size: null,
    quantity: 1,
    image: image.src
  };

  document.getElementById("modalImage").src = image.src;
  document.getElementById("modalCategory").textContent = card.dataset.category;
  document.getElementById("modalName").textContent = card.dataset.name;
  document.getElementById("modalPrice").textContent = card.dataset.price;
  modalDescription.textContent = details;
  modalDescription.style.display = details.trim() ? "block" : "none";
  document.getElementById("cartFeedback").textContent = "Tap Add to Cart to save this item.";

  renderSizeOptions(card.dataset.category);
  syncModalQuantity();
  resetImageZoom();

  document.querySelectorAll(".product-card").forEach((item) => item.classList.remove("active-card"));
  card.classList.add("active-card");
  grid.classList.add("dimmed");
  modal.classList.add("active");
  if (typeof window.syncBodyScrollLock === "function") {
    window.syncBodyScrollLock();
  }
};

window.closeProductModal = function closeProductModal() {
  const modal = document.getElementById("productModal");
  const grid = document.getElementById("products");

  modal.classList.remove("active");
  grid.classList.remove("dimmed");

  document.querySelectorAll(".product-card").forEach((item) => item.classList.remove("active-card"));
  window.AppState.selectedCard = null;
  resetImageZoom();
  if (typeof window.syncBodyScrollLock === "function") {
    window.syncBodyScrollLock();
  }
};

window.handleOverlayClick = function handleOverlayClick(event) {
  const popup = document.querySelector(".product-modal-content");
  if (!popup.contains(event.target)) {
    window.closeProductModal();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const imageFrame = document.getElementById("modalImageFrame");
  const zoomToggle = document.getElementById("zoomToggle");
  const sizeGrid = document.getElementById("sizeGrid");

  if (zoomToggle) {
    zoomToggle.addEventListener("click", window.toggleImageZoom);
  }

  if (sizeGrid) {
    sizeGrid.addEventListener("click", (event) => {
      const button = event.target.closest(".size-option");
      if (!button) return;
      window.selectProductSize(button);
    });
  }

  document.getElementById("qtyMinus")?.addEventListener("click", () => window.changeModalQuantity(-1));
  document.getElementById("qtyPlus")?.addEventListener("click", () => window.changeModalQuantity(1));

  const addButton = document.querySelector(".add-cart-btn");
  if (addButton) {
    addButton.addEventListener("click", (event) => {
      const selected = window.AppState.selectedProduct;
      if (!selected) return;

      if (["Wetsuit", "Gloves"].includes(selected.category) && !selected.size) {
        event.stopImmediatePropagation();
        event.preventDefault();
        document.getElementById("sizeWarning").classList.add("active");
        document.getElementById("modalSizeBlock").classList.add("has-warning");
        document.getElementById("cartFeedback").textContent = "Select a size to continue.";
        return;
      }

      selected.key = window.getCartKey(selected);
    }, { capture: true });
  }

  if (imageFrame) {
    imageFrame.addEventListener("mousemove", (event) => {
      const frameBounds = imageFrame.getBoundingClientRect();
      const x = ((event.clientX - frameBounds.left) / frameBounds.width) * 100;
      const y = ((event.clientY - frameBounds.top) / frameBounds.height) * 100;
      imageFrame.style.setProperty("--zoom-x", `${x}%`);
      imageFrame.style.setProperty("--zoom-y", `${y}%`);
    });

    imageFrame.addEventListener("mouseleave", () => {
      imageFrame.style.setProperty("--zoom-x", "50%");
      imageFrame.style.setProperty("--zoom-y", "50%");
    });
  }
});
