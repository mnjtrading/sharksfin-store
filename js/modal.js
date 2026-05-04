// Product modal open/close behavior, overlay interaction, sizes, quantity, image viewer, and Speargun inquiry flow
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

const GLOVE_SIZES = ["Small", "Medium", "Large", "X-Large"];

const FINS_SIZES = ["XS (EU 36–38)", "S (EU 38–40)", "M (EU 40–42)", "L (EU 42–44)", "XL (EU 44–46)"];

const SPEARGUN_MODAL_NOTE = "Starting prices vary from ₱4,000 to ₱22,000+";
const imageViewerState = {
  zoom: 1,
  panX: 0,
  panY: 0,
  dragging: false,
  pointerId: null,
  dragStartX: 0,
  dragStartY: 0,
  panStartX: 0,
  panStartY: 0
};

window.SpeargunInquiryState = {
  isOpen: false,
  actionInProgress: false,
  productName: "",
  cooldownMs: 30000
};

function getWoodgunVariantElements() {
  return {
    block: document.getElementById("woodgunVariantBlock"),
    grid: document.getElementById("woodgunVariantGrid"),
    selection: document.getElementById("woodgunVariantSelection")
  };
}

function getWoodgunVariants() {
  const parent = window.ProductCatalog.find((item) => item.id === "speargun-wood");
  return Array.isArray(parent?.variants) ? parent.variants : [];
}

function setWoodgunInquiryButtonState() {
  const inquiryButton = document.getElementById("speargunInquiryButton");
  if (!inquiryButton) return;

  const selected = window.AppState.selectedProduct;
  const needsVariantSelection = selected?.id === "speargun-wood";
  const hasVariant = Boolean(selected?.selectedVariant);

  inquiryButton.disabled = needsVariantSelection && !hasVariant;
  inquiryButton.textContent = needsVariantSelection && hasVariant
    ? `Ask for Availability / Price — ${selected.selectedVariant.name}`
    : "Ask for Availability / Price";
}

function selectWoodgunVariant(variantId) {
  const selected = window.AppState.selectedProduct;
  if (!selected || selected.id !== "speargun-wood") return;

  const variant = (selected.variants || []).find((item) => item.id === variantId);
  if (!variant) return;

  selected.selectedVariant = { ...variant };

  document.getElementById("modalImage").src = variant.image;
  document.getElementById("modalName").textContent = variant.name;
  document.getElementById("modalDescription").textContent = variant.details || selected.baseDetails || "";

  const { selection, grid } = getWoodgunVariantElements();
  if (selection) {
    selection.textContent = `Selected: ${variant.name}`;
  }

  if (grid) {
    grid.querySelectorAll(".woodgun-variant-option").forEach((button) => {
      const isActive = button.dataset.variantId === variant.id;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  setWoodgunInquiryButtonState();
  resetImageViewer();
}

function renderWoodgunVariantGrid(selectedProduct) {
  const { block, grid, selection } = getWoodgunVariantElements();
  if (!block || !grid || !selection) return;

  const isWoodgunParent = selectedProduct?.id === "speargun-wood";
  block.hidden = !isWoodgunParent;
  if (!isWoodgunParent) {
    grid.innerHTML = "";
    selection.textContent = "";
    return;
  }

  const variants = selectedProduct.variants || [];
  grid.innerHTML = variants
    .map((variant) => `
      <button
        type="button"
        class="woodgun-variant-option"
        data-variant-id="${variant.id}"
        aria-pressed="false"
      >
        <img src="${variant.image}" alt="${variant.name}" loading="lazy">
        <span class="woodgun-variant-name">${variant.name}</span>
      </button>
    `)
    .join("");
  selection.textContent = "No variant selected yet.";
}

function getImageViewerElements() {
  return {
    frame: document.getElementById("modalImageFrame"),
    image: document.getElementById("modalImage"),
    slider: document.getElementById("modalZoomSlider"),
    resetButton: document.getElementById("modalResetView")
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getPanBounds() {
  const { frame } = getImageViewerElements();
  if (!frame) return { maxX: 0, maxY: 0 };

  const frameRect = frame.getBoundingClientRect();
  const maxX = Math.max(0, ((frameRect.width * imageViewerState.zoom) - frameRect.width) / 2);
  const maxY = Math.max(0, ((frameRect.height * imageViewerState.zoom) - frameRect.height) / 2);
  return { maxX, maxY };
}

function applyImageTransform() {
  const { image, frame } = getImageViewerElements();
  if (!image || !frame) return;

  const { maxX, maxY } = getPanBounds();
  imageViewerState.panX = clamp(imageViewerState.panX, -maxX, maxX);
  imageViewerState.panY = clamp(imageViewerState.panY, -maxY, maxY);

  image.style.transform = `translate(${imageViewerState.panX}px, ${imageViewerState.panY}px) scale(${imageViewerState.zoom})`;
  frame.classList.toggle("can-pan", imageViewerState.zoom > 1.01);
}

function resetImageViewer() {
  const { slider } = getImageViewerElements();
  imageViewerState.zoom = 1;
  imageViewerState.panX = 0;
  imageViewerState.panY = 0;
  imageViewerState.dragging = false;
  imageViewerState.pointerId = null;

  if (slider) {
    slider.value = "1";
  }

  applyImageTransform();
}

function setZoom(nextZoom) {
  const parsed = Number(nextZoom);
  imageViewerState.zoom = clamp(Number.isFinite(parsed) ? parsed : 1, 1, 3);

  if (imageViewerState.zoom <= 1.01) {
    imageViewerState.panX = 0;
    imageViewerState.panY = 0;
  }

  applyImageTransform();
}

function onImagePointerDown(event) {
  const { frame } = getImageViewerElements();
  if (!frame || imageViewerState.zoom <= 1.01) return;

  event.preventDefault();
  imageViewerState.dragging = true;
  imageViewerState.pointerId = event.pointerId;
  imageViewerState.dragStartX = event.clientX;
  imageViewerState.dragStartY = event.clientY;
  imageViewerState.panStartX = imageViewerState.panX;
  imageViewerState.panStartY = imageViewerState.panY;
  frame.classList.add("is-dragging");

  try {
    frame.setPointerCapture(event.pointerId);
  } catch (error) {
    // Ignore if pointer capture is unsupported.
  }
}

function onImagePointerMove(event) {
  if (!imageViewerState.dragging || event.pointerId !== imageViewerState.pointerId) return;

  const deltaX = event.clientX - imageViewerState.dragStartX;
  const deltaY = event.clientY - imageViewerState.dragStartY;
  imageViewerState.panX = imageViewerState.panStartX + deltaX;
  imageViewerState.panY = imageViewerState.panStartY + deltaY;
  applyImageTransform();
}

function endImageDrag(event) {
  if (!imageViewerState.dragging || event.pointerId !== imageViewerState.pointerId) return;

  const { frame } = getImageViewerElements();
  imageViewerState.dragging = false;
  imageViewerState.pointerId = null;
  frame?.classList.remove("is-dragging");
}

function renderSizeOptions(productCategory) {
  const sizeBlock = document.getElementById("modalSizeBlock");
  const sizeGrid = document.getElementById("sizeGrid");
  const sizeWarning = document.getElementById("sizeWarning");

  const requiresSizeSelection = ["Wetsuit", "Gloves", "Fins"].includes(productCategory);

  if (!requiresSizeSelection) {
    sizeBlock.style.display = "none";
    sizeWarning.classList.remove("active");
    sizeGrid.innerHTML = "";
    return;
  }

  sizeBlock.style.display = "block";
  sizeWarning.classList.remove("active");
  const sizes = productCategory === "Gloves"
    ? GLOVE_SIZES
    : productCategory === "Fins"
      ? FINS_SIZES
      : WETSUIT_SIZES;

  sizeGrid.innerHTML = sizes
    .map((size) => `<button type="button" class="size-option" data-size="${size}">${size}</button>`)
    .join("");
}

function syncModalQuantity() {
  const quantityView = document.getElementById("modalQuantity");
  if (!quantityView || !window.AppState.selectedProduct) return;
  quantityView.textContent = String(window.AppState.selectedProduct.quantity);
}

function getInquiryElements() {
  return {
    modal: document.getElementById("speargunInquiryModal"),
    productName: document.getElementById("inquiryProductName"),
    nameInput: document.getElementById("inquiryName"),
    notesInput: document.getElementById("inquiryNotes"),
    feedback: document.getElementById("inquiryFeedback"),
    manualCopyArea: document.getElementById("inquiryManualCopyArea"),
    copyOpenButton: document.getElementById("copyOpenInquiryButton"),
    closeButton: document.getElementById("closeInquiryButton")
  };
}

function getInquiryHoneypotValue() {
  return document.getElementById("inquiryHoneypot")?.value || "";
}

function resetInquiryFeedback() {
  const { feedback, manualCopyArea } = getInquiryElements();
  if (!feedback || !manualCopyArea) return;

  feedback.textContent = "";
  feedback.classList.remove("success", "warning");
  manualCopyArea.value = "";
  manualCopyArea.classList.remove("active");
}

function setInquiryFeedback(message, type) {
  const { feedback } = getInquiryElements();
  if (!feedback) return;

  feedback.textContent = message;
  feedback.classList.remove("success", "warning");
  feedback.classList.add(type);
}

function buildSpeargunInquiryMessage() {
  const { nameInput, notesInput } = getInquiryElements();
  const selectedName = window.SpeargunInquiryState.productName || window.AppState.selectedProduct?.name || "Speargun";
  const customerName = nameInput?.value.trim();
  const notes = notesInput?.value.trim();

  const chunks = [
    "Hello MNJ Trading, I would like to inquire about this speargun:",
    "",
    "Product:",
    selectedName,
    "",
    "Please let me know the availability and price range."
  ];

  if (customerName) {
    chunks.push("", `Name: ${customerName}`);
  }

  if (notes) {
    chunks.push("", `Notes: ${notes}`);
  }

  chunks.push("", "Thank you.");

  return chunks.join("\n");
}

async function copyAndOpenSpeargunInquiryChat() {
  const { manualCopyArea, copyOpenButton } = getInquiryElements();
  if (!copyOpenButton || !manualCopyArea || window.SpeargunInquiryState.actionInProgress) return;

  const inquiryText = buildSpeargunInquiryMessage();
  const honeypot = getInquiryHoneypotValue();
  let copied = false;

  window.SpeargunInquiryState.actionInProgress = true;
  copyOpenButton.disabled = true;
  const originalLabel = copyOpenButton.textContent;
  copyOpenButton.textContent = "Opening Messenger...";

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(inquiryText);
      copied = true;
    }
  } catch (error) {
    copied = false;
  }

  if (!copied) {
    copied = window.fallbackCopyWithTextarea(inquiryText);
  }

  if (!honeypot) {
    window.sendAdminNotification({
      type: "speargun-inquiry",
      message: inquiryText,
      createdAt: new Date().toISOString(),
      source: "mnj-store",
      sessionId: window.getClientSessionId(),
      honeypot
    });
  }

  window.open(window.MESSENGER_CHAT_URL, "_blank", "noopener,noreferrer");

  if (copied) {
    setInquiryFeedback("Copied. Paste it into Messenger.", "success");
    manualCopyArea.classList.remove("active");
  } else {
    setInquiryFeedback(
      "Messenger opened, but automatic copy was unavailable. Please copy the inquiry below.",
      "warning"
    );
    manualCopyArea.value = inquiryText;
    manualCopyArea.classList.add("active");
    manualCopyArea.focus();
    manualCopyArea.select();
  }

  window.setTimeout(() => {
    copyOpenButton.disabled = false;
    copyOpenButton.textContent = originalLabel;
    window.SpeargunInquiryState.actionInProgress = false;
  }, window.SpeargunInquiryState.cooldownMs);
}

window.openSpeargunInquiryModal = function openSpeargunInquiryModal() {
  const { modal, productName, nameInput, notesInput } = getInquiryElements();
  const selectedProduct = window.AppState.selectedProduct;
  if (!modal || !selectedProduct?.isDisplayOnly) return;
  if (selectedProduct.id === "speargun-wood" && !selectedProduct.selectedVariant) {
    document.getElementById("cartFeedback").textContent = "Select a Woodgun variant to continue.";
    return;
  }

  window.SpeargunInquiryState.productName = selectedProduct.selectedVariant?.name || selectedProduct.name;
  window.SpeargunInquiryState.isOpen = true;

  if (productName) {
    productName.textContent = selectedProduct.name;
  }

  if (nameInput) nameInput.value = "";
  if (notesInput) notesInput.value = "";
  resetInquiryFeedback();

  modal.classList.add("active");
  if (typeof window.syncBodyScrollLock === "function") {
    window.syncBodyScrollLock();
  }

  window.requestAnimationFrame(() => {
    nameInput?.focus();
  });
};

window.closeSpeargunInquiryModal = function closeSpeargunInquiryModal() {
  const { modal } = getInquiryElements();
  if (!modal) return;

  window.SpeargunInquiryState.isOpen = false;
  modal.classList.remove("active");

  if (typeof window.syncBodyScrollLock === "function") {
    window.syncBodyScrollLock();
  }
};

window.handleSpeargunInquiryOverlayClick = function handleSpeargunInquiryOverlayClick(event) {
  if (event.target === event.currentTarget) {
    window.closeSpeargunInquiryModal();
  }
};

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

window.showProductModal = function showProductModal(card) {
  if (card.dataset.comingSoon === "true") return;

  const modal = document.getElementById("productModal");
  const grid = document.getElementById("products");
  const details = card.dataset.details || "";
  const isDisplayOnly = card.dataset.displayOnly === "true";
  const priceNote = card.dataset.priceNote || SPEARGUN_MODAL_NOTE;
  const modalDescription = document.getElementById("modalDescription");
  const modalPrice = document.getElementById("modalPrice");
  const modalPriceNote = document.getElementById("modalPriceNote");
  const quantityBlock = document.getElementById("modalQuantityControl")?.closest(".modal-quantity-block");
  const addButton = document.querySelector(".add-cart-btn");
  const inquiryButton = document.getElementById("speargunInquiryButton");
  const image = card.querySelector("img");
  if (!image) return;

  const parsedPrice = window.parsePriceLabel(card.dataset.price);
  window.AppState.selectedCard = card;
  window.AppState.selectedProduct = {
    id: card.dataset.id,
    key: "",
    name: card.dataset.name,
    priceLabel: card.dataset.price,
    symbol: parsedPrice.symbol,
    unitPrice: parsedPrice.value,
    category: card.dataset.category,
    size: null,
    quantity: 1,
    image: card.dataset.id
        ? (window.ProductCatalog.find((p) => p.id === card.dataset.id)?.image || image.src)
        : image.src,
    isDisplayOnly,
    priceNote,
    baseName: card.dataset.name,
    baseDetails: details,
    variants: card.dataset.id === "speargun-wood" ? getWoodgunVariants() : [],
    selectedVariant: null
  };

  document.getElementById("modalImage").src = image.src;
  document.getElementById("modalCategory").textContent = card.dataset.category;
  document.getElementById("modalName").textContent = card.dataset.name;
  modalPrice.textContent = isDisplayOnly ? "Availability / price inquiry" : card.dataset.price;
  modalPriceNote.hidden = !isDisplayOnly;
  modalPriceNote.textContent = isDisplayOnly ? priceNote : "";
  modalDescription.textContent = details;
  modalDescription.style.display = details.trim() ? "block" : "none";
  document.getElementById("cartFeedback").textContent = isDisplayOnly
    ? "This product is inquiry-only. Tap the button below to message us."
    : "Tap Add to Cart to save this item.";

  if (quantityBlock) {
    quantityBlock.hidden = isDisplayOnly;
  }

  if (addButton) {
    addButton.hidden = isDisplayOnly;
  }

  if (inquiryButton) {
    inquiryButton.hidden = !isDisplayOnly;
  }

  renderWoodgunVariantGrid(window.AppState.selectedProduct);
  setWoodgunInquiryButtonState();

  renderSizeOptions(card.dataset.category);
  syncModalQuantity();
  resetImageViewer();

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
  const quantityBlock = document.getElementById("modalQuantityControl")?.closest(".modal-quantity-block");
  const addButton = document.querySelector(".add-cart-btn");
  const inquiryButton = document.getElementById("speargunInquiryButton");
  const { block } = getWoodgunVariantElements();

  if (quantityBlock) {
    quantityBlock.hidden = false;
  }

  if (addButton) {
    addButton.hidden = false;
  }

  if (inquiryButton) {
    inquiryButton.hidden = true;
      inquiryButton.textContent = "Ask for Availability / Price";
  }

  if (block) {
    block.hidden = true;
  }

  window.closeSpeargunInquiryModal();
  resetImageViewer();
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
  const sizeGrid = document.getElementById("sizeGrid");
  const { frame, slider, resetButton, image } = getImageViewerElements();
  const inquiryButton = document.getElementById("speargunInquiryButton");
  const inquiryCopyButton = document.getElementById("copyOpenInquiryButton");
  const inquiryCloseButton = document.getElementById("closeInquiryButton");

  if (sizeGrid) {
    sizeGrid.addEventListener("click", (event) => {
      const button = event.target.closest(".size-option");
      if (!button) return;
      window.selectProductSize(button);
    });
  }

  slider?.addEventListener("input", () => {
    setZoom(slider.value);
  });

  resetButton?.addEventListener("click", resetImageViewer);

  if (frame && image) {
    frame.addEventListener("pointerdown", onImagePointerDown);
    frame.addEventListener("pointermove", onImagePointerMove);
    frame.addEventListener("pointerup", endImageDrag);
    frame.addEventListener("pointercancel", endImageDrag);
    frame.addEventListener("lostpointercapture", endImageDrag);

    image.addEventListener("load", () => {
      applyImageTransform();
    });

    window.addEventListener("resize", () => {
      applyImageTransform();
    });
  }

  inquiryButton?.addEventListener("click", window.openSpeargunInquiryModal);
  document.getElementById("woodgunVariantGrid")?.addEventListener("click", (event) => {
    const option = event.target.closest(".woodgun-variant-option");
    if (!option) return;
    selectWoodgunVariant(option.dataset.variantId);
  });
  inquiryCopyButton?.addEventListener("click", copyAndOpenSpeargunInquiryChat);
  inquiryCloseButton?.addEventListener("click", window.closeSpeargunInquiryModal);

  document.getElementById("qtyMinus")?.addEventListener("click", () => window.changeModalQuantity(-1));
  document.getElementById("qtyPlus")?.addEventListener("click", () => window.changeModalQuantity(1));

  const addButton = document.querySelector(".add-cart-btn");
  if (addButton) {
    addButton.addEventListener("click", (event) => {
      const selected = window.AppState.selectedProduct;
      if (!selected) return;
      if (selected.inquiryOnly) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }

      if (["Wetsuit", "Gloves", "Fins"].includes(selected.category) && !selected.size) {
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

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const inquiryModal = document.getElementById("speargunInquiryModal");
    if (inquiryModal?.classList.contains("active")) {
      window.closeSpeargunInquiryModal();
      return;
    }

    const productModal = document.getElementById("productModal");
    if (productModal?.classList.contains("active")) {
      window.closeProductModal();
    }
  });
});
