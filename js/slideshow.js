// Homepage hero slideshow controls and timer logic
window.HeroSlideshow = {
  slides: [],
  index: 0,
  timer: null,
  navigationInProgress: false
};

function getFallbackSlides() {
  return [
    {
      image: "images/gloves/blue_gloves.png",
      title: "Hammerhead Blue Dive Gloves",
      subtitle: "Durable dive gloves built for comfort and grip.",
      category: "Gloves"
    }
  ];
}

window.renderHeroSlide = function renderHeroSlide() {
  const imageEl = document.getElementById("slideImage");
  const titleEl = document.getElementById("slideTitle");
  const subtitleEl = document.getElementById("slideSubtitle");
  const visualCopy = document.querySelector(".visual-copy");
  const visualHero = document.getElementById("visualHero");
  const visualHint = document.getElementById("slideHint");
  const slide = window.HeroSlideshow.slides[window.HeroSlideshow.index];

  if (!imageEl || !titleEl || !subtitleEl || !slide) return;

  imageEl.classList.remove("active");
  void imageEl.offsetWidth;
  imageEl.style.backgroundImage = `url('${slide.image}')`;
  imageEl.classList.add("active");
  titleEl.textContent = slide.title;
  subtitleEl.textContent = slide.subtitle;
  if (visualHero) {
    const categoryLabel = slide.category || "category";
    visualHero.setAttribute("aria-label", `View ${categoryLabel} products`);
    visualHero.dataset.category = categoryLabel;
  }
  if (visualHint) {
    const verb = window.matchMedia("(max-width: 860px)").matches ? "Tap" : "Click";
    visualHint.textContent = `${verb} to view ${slide.category || "category"}`;
  }

  if (visualCopy) {
    visualCopy.classList.remove("is-visible");
    window.requestAnimationFrame(() => {
      visualCopy.classList.add("is-visible");
    });
  }
};

window.restartHeroTimer = function restartHeroTimer() {
  clearInterval(window.HeroSlideshow.timer);

  if (window.HeroSlideshow.slides.length < 2) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth <= 768;
  if (prefersReducedMotion || isMobile) return;

  window.HeroSlideshow.timer = setInterval(() => {
    window.HeroSlideshow.index = (window.HeroSlideshow.index + 1) % window.HeroSlideshow.slides.length;
    window.renderHeroSlide();
  }, 4500);
};

window.nextHeroSlide = function nextHeroSlide() {
  if (window.HeroSlideshow.slides.length === 0) return;
  window.HeroSlideshow.index = (window.HeroSlideshow.index + 1) % window.HeroSlideshow.slides.length;
  window.renderHeroSlide();
  window.restartHeroTimer();
};

window.prevHeroSlide = function prevHeroSlide() {
  if (window.HeroSlideshow.slides.length === 0) return;
  window.HeroSlideshow.index = (window.HeroSlideshow.index - 1 + window.HeroSlideshow.slides.length) % window.HeroSlideshow.slides.length;
  window.renderHeroSlide();
  window.restartHeroTimer();
};

window.openHeroSlideCategory = function openHeroSlideCategory() {
  const currentSlide = window.HeroSlideshow.slides[window.HeroSlideshow.index];
  const category = currentSlide?.category;
  if (!category || typeof window.openCategory !== "function") return;
  if (window.HeroSlideshow.navigationInProgress) return;

  window.HeroSlideshow.navigationInProgress = true;
  window.openCategory(category);
  window.setTimeout(() => {
    window.HeroSlideshow.navigationInProgress = false;
  }, 220);
};

window.addEventListener("resize", () => {
  window.restartHeroTimer();
});

window.initializeHeroSlideshow = function initializeHeroSlideshow() {
  const visualHero = document.getElementById("visualHero");
  const derivedSlides = typeof window.getHeroSlidesFromCatalog === "function"
    ? window.getHeroSlidesFromCatalog()
    : [];

  window.HeroSlideshow.slides = derivedSlides.length > 0 ? derivedSlides : getFallbackSlides();
  window.HeroSlideshow.index = 0;

  window.renderHeroSlide();
  window.restartHeroTimer();

  if (visualHero && !visualHero.dataset.bound) {
    visualHero.classList.add("is-interactive");
    visualHero.setAttribute("role", "button");
    visualHero.setAttribute("tabindex", "0");

    visualHero.addEventListener("click", (event) => {
      if (event.target.closest(".visual-controls")) return;
      window.openHeroSlideCategory();
    });

    visualHero.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      window.openHeroSlideCategory();
    });

    visualHero.dataset.bound = "true";
  }
};
