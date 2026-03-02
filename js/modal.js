// Product modal open/close behavior and overlay interaction
window.showProductModal = function showProductModal(card){
  const modal = document.getElementById("productModal");
  const grid = document.getElementById("products");

  window.AppState.selectedCard = card;
  window.AppState.selectedProduct = {
    name: card.dataset.name,
    price: card.dataset.price,
    category: card.dataset.category
  };

  document.getElementById("modalImage").src = card.querySelector("img").src;
  document.getElementById("modalCategory").textContent = card.dataset.category;
  document.getElementById("modalName").textContent = card.dataset.name;
  document.getElementById("modalPrice").textContent = card.dataset.price;
  document.getElementById("modalDescription").textContent = card.dataset.details;
  document.getElementById("cartFeedback").textContent = "Tap Add to Cart to save this item.";

  document.querySelectorAll(".product-card").forEach(item => item.classList.remove("active-card"));
  card.classList.add("active-card");
  grid.classList.add("dimmed");
  modal.classList.add("active");
};

window.closeProductModal = function closeProductModal(){
  const modal = document.getElementById("productModal");
  const grid = document.getElementById("products");

  modal.classList.remove("active");
  grid.classList.remove("dimmed");

  document.querySelectorAll(".product-card").forEach(item => item.classList.remove("active-card"));
  window.AppState.selectedCard = null;
};

window.handleOverlayClick = function handleOverlayClick(event){
  const popup = document.querySelector(".product-modal-content");
  if(!popup.contains(event.target)){
    window.closeProductModal();
  }
};
