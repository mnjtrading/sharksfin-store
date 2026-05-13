// App bootstrap: initialize features after DOM is ready

/* ----------------------------------------------------------
   Scroll-reveal via IntersectionObserver.
   Elements with class "scroll-reveal" fade + slide up when
   they enter the viewport. Call setupScrollReveal() after
   any dynamic content is inserted into the DOM.
   ---------------------------------------------------------- */
function setupScrollReveal() {
  if (!window.IntersectionObserver) {
    // Fallback: make all targets visible immediately
    document.querySelectorAll('.scroll-reveal:not(.is-revealed)').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.scroll-reveal:not(.is-revealed)').forEach((el, i) => {
    if (prefersReduced) {
      el.classList.add('is-revealed');
    } else {
      observer.observe(el);
    }
  });
}

window.setupScrollReveal = setupScrollReveal;
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

  if (typeof window.updateCheckoutButtonVisibility === "function") {
    window.updateCheckoutButtonVisibility();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  window.renderShoppingList();
  setupScrollReveal();

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


    document.addEventListener("click", (event) => {
      if (!categoryButtons || !categoryToggle) return;
      if (!categoryButtons.classList.contains("open")) return;
      if (categoryButtons.contains(event.target) || categoryToggle.contains(event.target)) return;
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
