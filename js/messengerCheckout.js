// Messenger checkout configuration (single integration point)
const MESSENGER_PAGE_USERNAME = "iam.nathan.18";
const CLEAR_CART_AFTER_CHECKOUT = true;

function formatMessengerLineItem(item) {
  const itemName = item.size ? `${item.name} (${item.size})` : item.name;
  return `${itemName} x${item.quantity}`;
}

function getMessengerTotalLabel(cart) {
  const total = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  return `₱${total.toLocaleString("en-PH")}`;
}

function buildMessengerMessage(cart, total, customerInfo) {
  const itemLines = cart.map(formatMessengerLineItem).join("\n");
  const notes = customerInfo.notes ? customerInfo.notes : "None";

  return `Hello! I would like to place an order from mnjtrading.shop

## ORDER DETAILS

${itemLines}

TOTAL: ${total}

## CUSTOMER INFO

Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}

Notes: ${notes}

Please confirm availability. Thank you!`;
}

function clearMessengerCheckoutErrors(form) {
  ["name", "phone", "address"].forEach((field) => {
    form.elements[field]?.removeAttribute("aria-invalid");
    const errorElement = document.getElementById(`${field}Error`);
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("active");
    }
  });
}

function validateMessengerCheckout(form) {
  clearMessengerCheckoutErrors(form);
  let isValid = true;

  ["name", "phone", "address"].forEach((field) => {
    const input = form.elements[field];
    if (!input || input.value.trim()) return;

    isValid = false;
    input.setAttribute("aria-invalid", "true");
    const label = field === "address" ? "Delivery address" : field[0].toUpperCase() + field.slice(1);
    const errorElement = document.getElementById(`${field}Error`);
    if (errorElement) {
      errorElement.textContent = `${label} is required.`;
      errorElement.classList.add("active");
    }
  });

  return isValid;
}

window.checkoutViaMessenger = function checkoutViaMessenger(cart, total, customerInfo) {
  const message = buildMessengerMessage(cart, total, customerInfo);
  const encodedMessage = encodeURIComponent(message);
  const messengerUrl = `https://m.me/${MESSENGER_PAGE_USERNAME}?text=${encodedMessage}`;
  window.open(messengerUrl, "_blank", "noopener,noreferrer");
};

window.openMessengerCheckoutModal = function openMessengerCheckoutModal() {
  const cart = window.AppState?.shoppingList || [];
  if (!cart.length) return;

  const totalText = getMessengerTotalLabel(cart);
  const orderSummaryItems = document.getElementById("orderSummaryItems");
  const orderSummaryTotal = document.getElementById("orderSummaryTotal");
  const modal = document.getElementById("messengerCheckoutModal");
  const form = document.getElementById("messengerCheckoutForm");

  if (!orderSummaryItems || !orderSummaryTotal || !modal || !form) return;

  orderSummaryItems.innerHTML = cart
    .map((item) => `<li>${formatMessengerLineItem(item)}</li>`)
    .join("");
  orderSummaryTotal.textContent = totalText;
  clearMessengerCheckoutErrors(form);
  modal.classList.add("active");
  form.elements.name?.focus();

  if (typeof window.syncBodyScrollLock === "function") {
    window.syncBodyScrollLock();
  }
};

window.closeMessengerCheckoutModal = function closeMessengerCheckoutModal() {
  const modal = document.getElementById("messengerCheckoutModal");
  const form = document.getElementById("messengerCheckoutForm");
  if (!modal || !form) return;

  modal.classList.remove("active");
  form.reset();
  clearMessengerCheckoutErrors(form);

  if (typeof window.syncBodyScrollLock === "function") {
    window.syncBodyScrollLock();
  }
};

window.handleMessengerCheckoutOverlayClick = function handleMessengerCheckoutOverlayClick(event) {
  if (event.target === event.currentTarget) {
    window.closeMessengerCheckoutModal();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("messengerCheckoutForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateMessengerCheckout(form)) return;

    const cart = window.AppState?.shoppingList || [];
    const totalText = getMessengerTotalLabel(cart);
    const customerInfo = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      address: form.elements.address.value.trim(),
      notes: form.elements.notes.value.trim()
    };

    window.checkoutViaMessenger(cart, totalText, customerInfo);

    if (CLEAR_CART_AFTER_CHECKOUT) {
      window.AppState.shoppingList = [];
      localStorage.setItem("mnj-cart-items", JSON.stringify([]));
      window.renderShoppingList();
      if (typeof window.updateCheckoutButtonVisibility === "function") {
        window.updateCheckoutButtonVisibility();
      }
      window.closeCartModal();
    }

    window.closeMessengerCheckoutModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const modal = document.getElementById("messengerCheckoutModal");
    if (modal?.classList.contains("active")) {
      window.closeMessengerCheckoutModal();
    }
  });
});

