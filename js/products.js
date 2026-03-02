// Product page state + catalogue navigation + shopping list drawer
window.AppState = {
  shoppingList: [],
  selectedCard: null,
  selectedProduct: null,
  shoppingDrawerOpen: false
};

window.openCategory = function openCategory(category){
  const welcome = document.getElementById("welcome");
  const catalogue = document.getElementById("catalogue");

  welcome.classList.add("hidden");
  welcome.style.display = "none";
  catalogue.style.display = "block";
  requestAnimationFrame(() => catalogue.classList.remove("hidden"));
  window.scrollTo({ top: 0, behavior: "auto" });

  if (typeof window.closeProductModal === "function") {
    window.closeProductModal();
  }

  const title = document.getElementById("catTitle");
  const products = document.querySelectorAll(".product-card");

  if(category === "All"){
    title.textContent = "All Products";
    products.forEach(p => { p.style.display = "block"; });
  } else {
    title.textContent = category;
    products.forEach(p => {
      p.style.display = p.dataset.category === category ? "block" : "none";
    });
  }
};

window.goBack = function goBack(){
  const welcome = document.getElementById("welcome");
  const catalogue = document.getElementById("catalogue");

  if (typeof window.closeProductModal === "function") {
    window.closeProductModal();
  }

  window.toggleShoppingList(false);
  catalogue.classList.add("hidden");

  setTimeout(() => {
    catalogue.style.display = "none";
    welcome.style.display = "flex";
    welcome.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 220);
};

window.renderShoppingList = function renderShoppingList(){
  const list = document.getElementById("shoppingListItems");
  if(!list) return;

  if(window.AppState.shoppingList.length === 0){
    list.innerHTML = "<li>No items added yet.</li>";
    return;
  }

  list.innerHTML = window.AppState.shoppingList
    .map(item => `<li>${item.name} · ${item.price}</li>`)
    .join("");
};

window.toggleShoppingList = function toggleShoppingList(forceState){
  const drawer = document.getElementById("shoppingDrawer");
  if(!drawer) return;

  const shouldOpen = typeof forceState === "boolean"
    ? forceState
    : !window.AppState.shoppingDrawerOpen;

  window.AppState.shoppingDrawerOpen = shouldOpen;
  drawer.classList.toggle("open", shouldOpen);
};

window.addToCartFromModal = function addToCartFromModal(){
  if(!window.AppState.selectedProduct) return;

  window.AppState.shoppingList.push(window.AppState.selectedProduct);
  document.getElementById("cartFeedback").textContent =
    `${window.AppState.selectedProduct.name} added. Cart items: ${window.AppState.shoppingList.length}.`;

  window.renderShoppingList();
};
