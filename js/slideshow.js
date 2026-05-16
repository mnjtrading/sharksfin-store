// Hero slideshow — full-screen background rotation
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
  const imageEl  = document.getElementById("slideImage");
  const slide    = window.HeroSlideshow.slides[window.HeroSlideshow.index];

  // Only the background element is required in the new hero layout
  if (!imageEl || !slide) return;

  imageEl.classList.remove("active");
  void imageEl.offsetWidth; // force reflow so the CSS transition re-fires
  imageEl.style.backgroundImage = `url('${slide.image}')`;
  imageEl.classList.add("active");

  // Update optional legacy elements if they still exist in the DOM
  const titleEl    = document.getElementById("slideTitle");
  const subtitleEl = document.getElementById("slideSubtitle");
  const visualCopy = document.querySelector(".visual-copy");

  if (titleEl)    titleEl.textContent    = slide.title;
  if (subtitleEl) subtitleEl.textContent = slide.subtitle;

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
  if (prefersReducedMotion) return;

  window.HeroSlideshow.timer = setInterval(() => {
    window.HeroSlideshow.index =
      (window.HeroSlideshow.index + 1) % window.HeroSlideshow.slides.length;
    window.renderHeroSlide();
  }, 5000);
};

window.nextHeroSlide = function nextHeroSlide() {
  if (window.HeroSlideshow.slides.length === 0) return;
  window.HeroSlideshow.index =
    (window.HeroSlideshow.index + 1) % window.HeroSlideshow.slides.length;
  window.renderHeroSlide();
  window.restartHeroTimer();
};

window.prevHeroSlide = function prevHeroSlide() {
  if (window.HeroSlideshow.slides.length === 0) return;
  window.HeroSlideshow.index =
    (window.HeroSlideshow.index - 1 + window.HeroSlideshow.slides.length) %
    window.HeroSlideshow.slides.length;
  window.renderHeroSlide();
  window.restartHeroTimer();
};

window.addEventListener("resize", () => {
  window.restartHeroTimer();
});

window.initializeHeroSlideshow = function initializeHeroSlideshow() {
  const derivedSlides =
    typeof window.getHeroSlidesFromCatalog === "function"
      ? window.getHeroSlidesFromCatalog()
      : [];

  window.HeroSlideshow.slides =
    derivedSlides.length > 0 ? derivedSlides : getFallbackSlides();
  window.HeroSlideshow.index = 0;

  window.renderHeroSlide();
  window.restartHeroTimer();
  // Navigation is now handled by the hero CTA button and category pill bar —
  // no click handler needed on the hero section itself.
};
