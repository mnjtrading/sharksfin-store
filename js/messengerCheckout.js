// Unified checkout summary + copy-to-clipboard flow
window.CheckoutState = {
  isOpen: false,
  actionInProgress: false,
  cooldownMs: 30000
};

function getCheckoutElements() {
  return {
    modal: document.getElementById("messengerCheckoutModal"),
    form: document.getElementById("messengerCheckoutForm"),
    contactInput: document.getElementById("checkoutContact"),
    nameInput: document.getElementById("checkoutName"),
    notesInput: document.getElementById("checkoutNotes"),
    summaryList: document.getElementById("orderSummaryItems"),
    summaryCount: document.getElementById("orderSummaryCount"),
    summaryTotal: document.getElementById("orderSummaryTotal"),
    feedback: document.getElementById("checkoutFeedback"),
    manualCopyArea: document.getElementById("manualCopyArea"),
    copyOpenButton: document.getElementById("copyOpenChatButton"),
    backToCartButton: document.getElementById("backToCartButton"),
    closeButton: document.getElementById("closeCheckoutButton")
  };
}

function getCheckoutHoneypotValue() {
  return document.getElementById("checkoutHoneypot")?.value || "";
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
  const { contactInput, nameInput, notesInput } = getCheckoutElements();
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

  const contactInfo = contactInput?.value.trim() || "";
  const customerName = nameInput?.value.trim();
  const notes = notesInput?.value.trim();

  chunks.push("", "Contact Information:", contactInfo);

  if (customerName) chunks.push("", `Name: ${customerName}`);

  if (notes) chunks.push("", `Notes: ${notes}`);

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

function openMessengerChatOnce() {
  window.open(window.MESSENGER_CHAT_URL, "_blank", "noopener,noreferrer");
}

function clearCartAfterCheckout() {
  if (!window.AppState || !Array.isArray(window.AppState.shoppingList)) return;
  if (window.AppState.shoppingList.length === 0) return;

  window.AppState.shoppingList = [];
  localStorage.setItem("mnj-cart-items", JSON.stringify([]));
  window.renderShoppingList?.();

  const checkoutButton = document.getElementById("checkoutButton");
  if (checkoutButton) {
    checkoutButton.textContent = "Checkout (Cart Empty)";
  }
}

async function copyAndOpenMessengerChat() {
  const { manualCopyArea, copyOpenButton, contactInput } = getCheckoutElements();
  if (window.CheckoutState.actionInProgress || !copyOpenButton || !manualCopyArea) return;
  const cart = window.AppState?.shoppingList || [];
  if (!cart.length) {
    setCheckoutFeedback("Your cart is empty.", "warning");
    return;
  }
  if (!contactInput?.value.trim()) {
    setCheckoutFeedback("Please enter your contact information before continuing.", "warning");
    contactInput?.focus();
    return;
  }

  window.CheckoutState.actionInProgress = true;
  copyOpenButton.disabled = true;
  const originalLabel = copyOpenButton.textContent;
  copyOpenButton.textContent = "Opening Messenger...";

  const orderText = buildCheckoutMessage();
  const honeypot = getCheckoutHoneypotValue();
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
    copied = window.fallbackCopyWithTextarea(orderText);
  }

  if (copied) {
    clearCartAfterCheckout();
  }

  if (!honeypot) {
    window.sendAdminNotification({
      type: "checkout",
      message: orderText,
      createdAt: new Date().toISOString(),
      source: "mnj-store",
      sessionId: window.getClientSessionId(),
      honeypot
    });
  }

  openMessengerChatOnce();

  if (copied) {
    setCheckoutFeedback("Order copied. Cart cleared. Paste it into Messenger.", "success");
    manualCopyArea.classList.remove("active");
  } else {
    setCheckoutFeedback(
      "Messenger opened, but automatic copy was unavailable. Please copy the order below.",
      "warning"
    );
    manualCopyArea.value = orderText;
    manualCopyArea.classList.add("active");
    manualCopyArea.focus();
    manualCopyArea.select();
  }

  window.setTimeout(() => {
    copyOpenButton.disabled = false;
    copyOpenButton.textContent = originalLabel;
    window.CheckoutState.actionInProgress = false;
  }, window.CheckoutState.cooldownMs);
}

function focusCheckoutModal() {
  const { nameInput, copyOpenButton } = getCheckoutElements();
  (nameInput || copyOpenButton)?.focus();
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

window.handleMessengerCheckoutOverlayClick = function handleMessengerCheckoutOverlayClick(event) {
  if (event.target === event.currentTarget) {
    window.closeMessengerCheckoutModal();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const {
    copyOpenButton,
    backToCartButton,
    closeButton
  } = getCheckoutElements();

  copyOpenButton?.addEventListener("click", copyAndOpenMessengerChat);
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
