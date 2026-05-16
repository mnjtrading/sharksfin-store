// App bootstrap: scroll behavior, scroll-reveal, body-lock helpers

/* ----------------------------------------------------------
   Scroll reveal via IntersectionObserver.
   Elements with class "scroll-reveal" fade + slide up when
   they enter the viewport. Called on DOMContentLoaded and
   again after async product cards are injected.
   ---------------------------------------------------------- */
function setupScrollReveal() {
  if (!window.IntersectionObserver) {
    document.querySelectorAll(".scroll-reveal:not(.is-revealed)").forEach((el) => {
      el.classList.add("is-revealed");
    });
    return;
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -28px 0px" }
  );

  document.querySelectorAll(".scroll-reveal:not(.is-revealed)").forEach((el) => {
    if (prefersReduced) {
      el.classList.add("is-revealed");
    } else {
      observer.observe(el);
    }
  });
}

window.setupScrollReveal = setupScrollReveal;

/* ----------------------------------------------------------
   Body scroll lock (used by modals)
   ---------------------------------------------------------- */
function setBodyScrollLock(shouldLock) {
  document.body.classList.toggle("no-scroll", shouldLock);
}

window.setBodyScrollLock = setBodyScrollLock;

window.syncBodyScrollLock = function syncBodyScrollLock() {
  const hasOpenOverlay =
    document.getElementById("productModal")?.classList.contains("active") ||
    document.getElementById("cartModal")?.classList.contains("active") ||
    document.getElementById("messengerCheckoutModal")?.classList.contains("active") ||
    document.getElementById("speargunInquiryModal")?.classList.contains("active");

  setBodyScrollLock(Boolean(hasOpenOverlay));

  if (typeof window.updateCheckoutButtonVisibility === "function") {
    window.updateCheckoutButtonVisibility();
  }
};

/* ----------------------------------------------------------
   Scroll to catalogue (used by the hero "Shop Now" button)
   ---------------------------------------------------------- */
window.scrollToCatalogue = function scrollToCatalogue() {
  const catalogue = document.getElementById("catalogue");
  if (catalogue) {
    catalogue.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

/* ----------------------------------------------------------
   DOMContentLoaded bootstrap
   ---------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  window.renderShoppingList();
  setupScrollReveal();

  // Header: switch from transparent to frosted glass once user scrolls past the hero
  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on load in case page is already scrolled
  }
});
