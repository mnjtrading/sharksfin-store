// Homepage hero slideshow controls and timer logic
window.HeroSlideshow = {
  slides: [
    { image: "images/item.png", title: "Carbon Elite Gun", subtitle: "Engineered for precision, speed, and all-day dive comfort." },
    { image: "images/item2.png", title: "Reinforced Dive Gloves", subtitle: "Secure grip and thermal comfort for colder dives." },
    { image: "images/item3.png", title: "Carbon Blade Fins", subtitle: "Lightweight blades for power and reduced fatigue." },
    { image: "images/item4.png", title: "Hydro Flow Snorkel", subtitle: "Semi-dry airflow with all-day comfort." }
  ],
  index: 0,
  timer: null
};

window.renderHeroSlide = function renderHeroSlide(){
  const imageEl = document.getElementById("slideImage");
  const titleEl = document.getElementById("slideTitle");
  const subtitleEl = document.getElementById("slideSubtitle");
  const slide = window.HeroSlideshow.slides[window.HeroSlideshow.index];

  if(!imageEl || !titleEl || !subtitleEl || !slide) return;

  imageEl.style.backgroundImage = `url('${slide.image}')`;
  titleEl.textContent = slide.title;
  subtitleEl.textContent = slide.subtitle;
};

window.restartHeroTimer = function restartHeroTimer(){
  clearInterval(window.HeroSlideshow.timer);

  if(window.HeroSlideshow.slides.length < 2) return;

  window.HeroSlideshow.timer = setInterval(() => {
    window.HeroSlideshow.index = (window.HeroSlideshow.index + 1) % window.HeroSlideshow.slides.length;
    window.renderHeroSlide();
  }, 4500);
};

window.nextHeroSlide = function nextHeroSlide(){
  window.HeroSlideshow.index = (window.HeroSlideshow.index + 1) % window.HeroSlideshow.slides.length;
  window.renderHeroSlide();
  window.restartHeroTimer();
};

window.prevHeroSlide = function prevHeroSlide(){
  window.HeroSlideshow.index = (window.HeroSlideshow.index - 1 + window.HeroSlideshow.slides.length) % window.HeroSlideshow.slides.length;
  window.renderHeroSlide();
  window.restartHeroTimer();
};
