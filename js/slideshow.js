// Homepage hero slideshow controls and timer logic
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
      subtitle: "Durable dive gloves built for comfort and grip."
    }
  ];
}

window.renderHeroSlide = function renderHeroSlide() {
  const imageEl = document.getElementById("slideImage");
  const titleEl = document.getElementById("slideTitle");
  const subtitleEl = document.getElementById("slideSubtitle");
  const visualCopy = document.querySelector(".visual-copy");
  const slide = window.HeroSlideshow.slides[window.HeroSlideshow.index];

  if (!imageEl || !titleEl || !subtitleEl || !slide) return;

  imageEl.classList.remove("active");
  void imageEl.offsetWidth;
  imageEl.style.backgroundImage = `url('${slide.image}')`;
  imageEl.classList.add("active");
  titleEl.textContent = slide.title;
  subtitleEl.textContent = slide.subtitle;

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

window.initializeHeroSlideshow = function initializeHeroSlideshow() {
  const derivedSlides = typeof window.getHeroSlidesFromCatalog === "function"
    ? window.getHeroSlidesFromCatalog()
    : [];

  window.HeroSlideshow.slides = derivedSlides.length > 0 ? derivedSlides : getFallbackSlides();
  window.HeroSlideshow.index = 0;

  window.renderHeroSlide();
  window.restartHeroTimer();
};
