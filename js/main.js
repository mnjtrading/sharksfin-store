// App bootstrap: initialize features after DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  window.renderHeroSlide();
  window.restartHeroTimer();
  window.renderShoppingList();
});

window.addEventListener("keydown", (event) => {
  if(event.key === "Escape"){
    window.closeProductModal();
  }
});
