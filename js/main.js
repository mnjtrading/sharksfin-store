// App bootstrap: initialize features after DOM is ready
function setBodyScrollLock(shouldLock) {
  document.body.classList.toggle("no-scroll", shouldLock);
}

window.setBodyScrollLock = setBodyScrollLock;

window.syncBodyScrollLock = function syncBodyScrollLock() {
  const hasOpenOverlay =
    document.getElementById("productModal")?.classList.contains("active") ||
    document.getElementById("cartModal")?.classList.contains("active") ||
    document.getElementById("messengerCheckoutModal")?.classList.contains("active") ||
    document.getElementById("speargunInquiryModal")?.classList.contains("active") ||
    document.getElementById("categoryButtons")?.classList.contains("open");

  setBodyScrollLock(Boolean(hasOpenOverlay));
};

window.addEventListener("DOMContentLoaded", () => {
  window.initializeHeroSlideshow();
  window.renderShoppingList();

  const categoryToggle = document.getElementById("categoryMenuToggle");
  const categoryButtons = document.getElementById("categoryButtons");

  if (categoryToggle && categoryButtons) {
    categoryToggle.addEventListener("click", () => {
      const nextOpenState = !categoryButtons.classList.contains("open");
      categoryButtons.classList.toggle("open", nextOpenState);
      categoryToggle.setAttribute("aria-expanded", String(nextOpenState));
      if (window.innerWidth <= 768) {
        window.syncBodyScrollLock();
      }
    });

    categoryButtons.addEventListener("click", (event) => {
      if (!event.target.closest("button")) return;
      if (window.innerWidth > 768) return;

      categoryButtons.classList.remove("open");
      categoryToggle.setAttribute("aria-expanded", "false");
      window.syncBodyScrollLock();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        categoryButtons.classList.remove("open");
        categoryToggle.setAttribute("aria-expanded", "false");
        window.syncBodyScrollLock();
      }
    });
  }
});
