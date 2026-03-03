// Product modal open/close behavior, overlay interaction, sizes, and image magnification
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

  if (productCategory !== "Wetsuit") {
    sizeBlock.style.display = "none";
    sizeGrid.innerHTML = "";
    return;
  }

  sizeBlock.style.display = "block";
  sizeGrid.innerHTML = WETSUIT_SIZES
    .map(
      (size) =>
        `<button type="button" class="size-option" data-size="${size}" onclick="selectProductSize(this)">${size}</button>`
    )
    .join("");
}

window.selectProductSize = function selectProductSize(option) {
  const selectedSize = option.dataset.size;
  document.querySelectorAll(".size-option").forEach((sizeOption) => {
    sizeOption.classList.toggle("selected", sizeOption === option);
  });

  if (window.AppState.selectedProduct) {
    window.AppState.selectedProduct.size = selectedSize;
  }
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
  const modal = document.getElementById("productModal");
  const grid = document.getElementById("products");

  window.AppState.selectedCard = card;
  window.AppState.selectedProduct = {
    name: card.dataset.name,
    price: card.dataset.price,
    category: card.dataset.category,
    size: null
  };

  document.getElementById("modalImage").src = card.querySelector("img").src;
  document.getElementById("modalCategory").textContent = card.dataset.category;
  document.getElementById("modalName").textContent = card.dataset.name;
  document.getElementById("modalPrice").textContent = card.dataset.price;
  const modalDescription = document.getElementById("modalDescription");
  const details = card.dataset.details || "";
  modalDescription.textContent = details;
  modalDescription.style.display = details.trim() ? "block" : "none";
  document.getElementById("cartFeedback").textContent = "Tap Add to Cart to save this item.";

  renderSizeOptions(card.dataset.category);
  resetImageZoom();

  document.querySelectorAll(".product-card").forEach((item) => item.classList.remove("active-card"));
  card.classList.add("active-card");
  grid.classList.add("dimmed");
  modal.classList.add("active");
};

window.closeProductModal = function closeProductModal() {
  const modal = document.getElementById("productModal");
  const grid = document.getElementById("products");

  modal.classList.remove("active");
  grid.classList.remove("dimmed");

  document.querySelectorAll(".product-card").forEach((item) => item.classList.remove("active-card"));
  window.AppState.selectedCard = null;
  resetImageZoom();
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

  if (zoomToggle) {
    zoomToggle.addEventListener("click", window.toggleImageZoom);
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
