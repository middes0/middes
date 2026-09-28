const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

let cart = JSON.parse(localStorage.getItem("centralmarket-cart") || "[]");

function money(value) {
  return value.toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
}

function renderCart() {
  const count = $("#cartCount");
  const items = $("#cartItems");
  const total = $("#cartTotal");
  count.textContent = cart.length;

  if (!cart.length) {
    items.innerHTML = '<p class="empty">Seu carrinho está vazio.</p>';
    total.textContent = money(0);
    return;
  }

  items.innerHTML = cart.map((item, i) => `
    <div class="cart-line">
      <span>${item.name}</span>
      <strong>${money(item.price)}</strong>
      <button data-remove="${i}">remover</button>
    </div>
  `).join("");

  total.textContent = money(cart.reduce((sum, item) => sum + item.price, 0));

  $$("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      cart.splice(Number(btn.dataset.remove), 1);
      saveCart();
    });
  });
}

function saveCart() {
  localStorage.setItem("centralmarket-cart", JSON.stringify(cart));
  renderCart();
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

$$(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.closest(".product");
    const price = Number(product.querySelector(".price").textContent.replace("R$","").replace(".","").replace(",",".").trim());
    cart.push({name: btn.dataset.product, price});
    saveCart();
    toast(`${btn.dataset.product} adicionado ao carrinho`);
  });
});

$("#cartBtn").addEventListener("click", () => {
  $("#cartDrawer").classList.add("open");
  $("#backdrop").classList.add("open");
});
$("#closeCart").addEventListener("click", closeCart);
$("#backdrop").addEventListener("click", closeCart);

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#backdrop").classList.remove("open");
}

$("#searchBtn").addEventListener("click", () => {
  $("#searchPanel").classList.toggle("open");
  $("#searchInput").focus();
});

$("#searchInput").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase().trim();
  $$(".product").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(term) ? "" : "none";
  });
});

$$(".category").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    const products = $$(".product");
    products.forEach(card => {
      card.style.display = card.dataset.category === category ? "" : "none";
    });
    document.querySelector("#produtos").scrollIntoView({behavior:"smooth"});
    toast(`Mostrando ${category}`);
  });
});

$("#copyCoupon").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("CENTRAL10");
    toast("Cupom CENTRAL10 copiado");
  } catch {
    toast("Cupom: CENTRAL10");
  }
});

$("#year").textContent = new Date().getFullYear();
renderCart();
