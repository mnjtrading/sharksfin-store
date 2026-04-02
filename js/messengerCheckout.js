// Unified checkout summary + copy-to-clipboard flow
const FACEBOOK_PAGE_URL = "https://www.facebook.com/mnjdistributionsinc";

window.CheckoutState = {
  isOpen: false,
  copyInProgress: false
};

function getCheckoutElements() {
  return {
    modal: document.getElementById("messengerCheckoutModal"),
    form: document.getElementById("messengerCheckoutForm"),
    nameInput: document.getElementById("checkoutName"),
    notesInput: document.getElementById("checkoutNotes"),
    summaryList: document.getElementById("orderSummaryItems"),
    summaryCount: document.getElementById("orderSummaryCount"),
    summaryTotal: document.getElementById("orderSummaryTotal"),
    feedback: document.getElementById("checkoutFeedback"),
    manualCopyArea: document.getElementById("manualCopyArea"),
    copyButton: document.getElementById("copyOrderButton"),
    openFacebookButton: document.getElementById("openFacebookButton"),
    backToCartButton: document.getElementById("backToCartButton"),
    closeButton: document.getElementById("closeCheckoutButton")
  };
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCartTotalsBySymbol(cart) {
  const totalsBySymbol = {};

  cart.forEach((item) => {
    const symbol = item.symbol || "₱";
    totalsBySymbol[symbol] = (totalsBySymbol[symbol] || 0) + (item.unitPrice * item.quantity);
  });

  return Object.entries(totalsBySymbol)
    .map(([symbol, total]) => `${symbol}${total.toLocaleString("en-PH")}`)
    .join(" + ") || "₱0";
}

function getItemCount(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getItemLabel(item) {
  return item.size ? `${item.name} (${item.size})` : item.name;
}

function buildCheckoutMessage() {
  const { nameInput, notesInput } = getCheckoutElements();
  const cart = window.AppState?.shoppingList || [];

  const itemLines = cart
    .map((item) => `- ${getItemLabel(item)} x${item.quantity}`)
    .join("\n");

  const chunks = [
    "Hello MNJ Trading, I would like to order:",
    "",
    "Items:",
    itemLines,
    "",
    `Total Items: ${getItemCount(cart)}`,
    `Total: ${getCartTotalsBySymbol(cart)}`
  ];

  const customerName = nameInput?.value.trim();
  const notes = notesInput?.value.trim();

  if (customerName) {
    chunks.push("", `Name: ${customerName}`);
  }

  if (notes) {
    chunks.push("", `Notes: ${notes}`);
  }

  chunks.push("", "Please let me know the availability. Thank you.");
  return chunks.join("\n");
}

function renderCheckoutSummary() {
  const { summaryList, summaryCount, summaryTotal } = getCheckoutElements();
  const cart = window.AppState?.shoppingList || [];

  if (!summaryList || !summaryCount || !summaryTotal) return;

  summaryList.innerHTML = cart
    .map((item) => {
      const subtotal = `${item.symbol || "₱"}${(item.unitPrice * item.quantity).toLocaleString("en-PH")}`;
      return `<li><span>${escapeHtml(getItemLabel(item))} x${item.quantity}</span><strong>${subtotal}</strong></li>`;
    })
    .join("");

  summaryCount.textContent = `Total Items: ${getItemCount(cart)}`;
  summaryTotal.textContent = getCartTotalsBySymbol(cart);
}

function resetCheckoutFeedback() {
  const { feedback, manualCopyArea } = getCheckoutElements();
  if (!feedback || !manualCopyArea) return;

  feedback.textContent = "";
  feedback.classList.remove("success", "warning");
  manualCopyArea.value = "";
  manualCopyArea.classList.remove("active");
}

function setCheckoutFeedback(message, type) {
  const { feedback } = getCheckoutElements();
  if (!feedback) return;

  feedback.textContent = message;
  feedback.classList.remove("success", "warning");
  feedback.classList.add(type);
}

function fallbackCopyWithTextarea(text) {
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "readonly");
  helper.style.position = "fixed";
  helper.style.top = "-9999px";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  helper.setSelectionRange(0, helper.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(helper);
  return copied;
}

async function copyOrderDetails() {
  const { manualCopyArea, copyButton } = getCheckoutElements();
  if (window.CheckoutState.copyInProgress || !copyButton || !manualCopyArea) return;

  const cart = window.AppState?.shoppingList || [];
  if (!cart.length) {
    setCheckoutFeedback("Your cart is empty.", "warning");
    return;
  }

  window.CheckoutState.copyInProgress = true;
  copyButton.disabled = true;

  const orderText = buildCheckoutMessage();
  let copied = false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(orderText);
      copied = true;
    }
  } catch (error) {
    copied = false;
  }

  if (!copied) {
    copied = fallbackCopyWithTextarea(orderText);
  }

  if (copied) {
    setCheckoutFeedback(
      "Order details copied. You can now paste it into Facebook Messenger.",
      "success"
    );
    manualCopyArea.classList.remove("active");
  } else {
    setCheckoutFeedback(
      "Automatic copy was not available. Please manually copy the order details below.",
      "warning"
    );
    manualCopyArea.value = orderText;
    manualCopyArea.classList.add("active");
    manualCopyArea.focus();
    manualCopyArea.select();
  }

  copyButton.disabled = false;
  window.CheckoutState.copyInProgress = false;
}

function focusCheckoutModal() {
  const { nameInput, copyButton } = getCheckoutElements();
  (nameInput || copyButton)?.focus();
}

window.openMessengerCheckoutModal = function openMessengerCheckoutModal() {
  const { modal } = getCheckoutElements();
  const cart = window.AppState?.shoppingList || [];
  if (!modal) return;

  if (!cart.length) {
    window.openCartModal();
    window.renderShoppingList();
    return;
  }

  if (window.CheckoutState.isOpen) return;

  window.closeCartModal();
  window.CheckoutState.isOpen = true;
  renderCheckoutSummary();
  resetCheckoutFeedback();

  modal.classList.add("active");
  if (typeof window.syncBodyScrollLock === "function") {
    window.syncBodyScrollLock();
  }

  window.requestAnimationFrame(() => {
    focusCheckoutModal();
  });
};

window.closeMessengerCheckoutModal = function closeMessengerCheckoutModal() {
  const { modal } = getCheckoutElements();
  if (!modal) return;

  window.CheckoutState.isOpen = false;
  modal.classList.remove("active");

  if (typeof window.syncBodyScrollLock === "function") {
    window.syncBodyScrollLock();
  }
};

window.backToCartFromCheckout = function backToCartFromCheckout() {
  window.closeMessengerCheckoutModal();
  window.openCartModal();
};

window.openFacebookPage = function openFacebookPage() {
  window.open(FACEBOOK_PAGE_URL, "_blank", "noopener,noreferrer");
};

window.handleMessengerCheckoutOverlayClick = function handleMessengerCheckoutOverlayClick(event) {
  if (event.target === event.currentTarget) {
    window.closeMessengerCheckoutModal();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const {
    copyButton,
    openFacebookButton,
    backToCartButton,
    closeButton
  } = getCheckoutElements();

  copyButton?.addEventListener("click", copyOrderDetails);
  openFacebookButton?.addEventListener("click", window.openFacebookPage);
  backToCartButton?.addEventListener("click", window.backToCartFromCheckout);
  closeButton?.addEventListener("click", window.closeMessengerCheckoutModal);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const { modal } = getCheckoutElements();
    if (modal?.classList.contains("active")) {
      window.closeMessengerCheckoutModal();
    }
  });
});
