// Hero slideshow — two-div crossfade background rotation
window.HeroSlideshow = {
  slides: [],
  index: 0,
  timer: null
};

function getFallbackSlides() {
  return [
    {
      image: "images/gloves/blue_gloves.png",
      title: "Hammerhead Blue Dive Gloves",
      subtitle: "Durable dive gloves built for comfort and grip.",
      category: "Gloves"
    },
    {
      image: "images/gloves/hh_gloves_red.png",
      title: "Hammerhead Red Dive Gloves",
      subtitle: "High-visibility red finish for long dive sessions.",
      category: "Gloves"
    }
  ];
}

window.renderHeroSlide = function renderHeroSlide() {
  const slideA = document.getElementById("slideImageA");
  const slideB = document.getElementById("slideImageB");
  const slide  = window.HeroSlideshow.slides[window.HeroSlideshow.index];

  if (!slideA || !slideB || !slide) return;

  // Determine which panel is currently visible
  const current = slideA.classList.contains("active") ? slideA : slideB;
  const next    = current === slideA ? slideB : slideA;

  // Load the new image on the hidden panel, then crossfade
  next.style.backgroundImage = `url('${slide.image}')`;
  void next.offsetWidth; // force reflow so the transition fires from opacity 0
  next.classList.add("active");
  current.classList.remove("active");
};

window.restartHeroTimer = function restartHeroTimer() {
  clearInterval(window.HeroSlideshow.timer);

  if (window.HeroSlideshow.slides.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.HeroSlideshow.timer = setInterval(() => {
    window.HeroSlideshow.index =
      (window.HeroSlideshow.index + 1) % window.HeroSlideshow.slides.length;
    window.renderHeroSlide();
  }, 5000);
};

window.nextHeroSlide = function nextHeroSlide() {
  if (!window.HeroSlideshow.slides.length) return;
  window.HeroSlideshow.index =
    (window.HeroSlideshow.index + 1) % window.HeroSlideshow.slides.length;
  window.renderHeroSlide();
  window.restartHeroTimer();
};

window.prevHeroSlide = function prevHeroSlide() {
  if (!window.HeroSlideshow.slides.length) return;
  window.HeroSlideshow.index =
    (window.HeroSlideshow.index - 1 + window.HeroSlideshow.slides.length) %
    window.HeroSlideshow.slides.length;
  window.renderHeroSlide();
  window.restartHeroTimer();
};

window.addEventListener("resize", () => window.restartHeroTimer());

window.initializeHeroSlideshow = function initializeHeroSlideshow() {
  const derived =
    typeof window.getHeroSlidesFromCatalog === "function"
      ? window.getHeroSlidesFromCatalog()
      : [];

  window.HeroSlideshow.slides =
    derived.length > 0 ? derived : getFallbackSlides();
  window.HeroSlideshow.index = 0;

  // Seed the first slide onto panel A and make it visible immediately
  const slideA = document.getElementById("slideImageA");
  if (slideA && window.HeroSlideshow.slides[0]) {
    slideA.style.backgroundImage =
      `url('${window.HeroSlideshow.slides[0].image}')`;
    slideA.classList.add("active");
  }

  window.restartHeroTimer();
};
