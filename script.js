const PRODUCTS=[
{id:"phone",name:"Smartphone Pro X",category:"Tecnologia",price:2999.90,old:3499.90,discount:14,image:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=85"},
{id:"headphones",name:"Headphone Wireless",category:"Áudio",price:399.90,old:499.90,discount:20,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85"},
{id:"watch",name:"Smartwatch Active",category:"Tecnologia",price:699.90,old:799.90,discount:12,image:"https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=85"},
{id:"controller",name:"Controle Wireless",category:"Games",price:329.90,old:399.90,discount:18,image:"https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=85"},
{id:"speaker",name:"Caixa de Som Mini",category:"Áudio",price:249.90,old:299.90,discount:17,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=85"},
{id:"keyboard",name:"Teclado Mecânico",category:"Games",price:459.90,old:549.90,discount:16,image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85"},
{id:"lamp",name:"Luminária Smart",category:"Casa",price:189.90,old:239.90,discount:21,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85"},
{id:"camera",name:"Câmera Compacta",category:"Tecnologia",price:1199.90,old:1399.90,discount:14,image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85"}];

let cart=JSON.parse(localStorage.getItem("centralmarket-cart")||"[]");

function money(v){return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function saveCart(){localStorage.setItem("centralmarket-cart",JSON.stringify(cart));updateCartCount();renderCart()}
function updateCartCount(){const n=cart.reduce((s,i)=>s+i.qty,0);document.querySelectorAll("#cartCount").forEach(e=>e.textContent=n)}
function productCard(p){
return `<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="discount">-${p.discount}%</span></div><div class="product-info"><span class="product-cat">${p.category}</span><h3>${p.name}</h3><div class="stars">★★★★★</div><div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div><button class="add-btn" data-add="${p.id}">Adicionar ao carrinho</button></div></article>`}
function renderProducts(list,selector="#productGrid"){const el=document.querySelector(selector);if(!el)return;el.innerHTML=list.map(productCard).join("")}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===id);if(!p)return;const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id:p.id,name:p.name,price:p.price,qty:1});saveCart();toast("Produto adicionado ao carrinho")}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart()}
function renderCart(){
const mount=document.querySelector("#cartMount");if(!mount)return;
const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
mount.innerHTML=`<div class="cart-backdrop" id="cartBackdrop"></div><aside class="cart-drawer" id="cartDrawer"><div class="cart-head"><h2>Seu carrinho</h2><button class="close-cart" id="closeCart">×</button></div><div class="cart-items">${cart.length?cart.map(i=>`<div class="cart-item"><div><strong>${i.name}</strong><br><small>${money(i.price)} cada</small></div><div class="qty"><button data-minus="${i.id}">−</button><span>${i.qty}</span><button data-plus="${i.id}">+</button></div></div>`).join(""):`<div class="cart-empty">Seu carrinho está vazio.</div>`}</div><div class="cart-foot"><div class="cart-total"><span>Total</span><span>${money(total)}</span></div><button class="btn primary checkout" id="checkoutBtn">Finalizar compra</button></div></aside><div class="toast" id="toast"></div>`;
bindCart();
}
function openCart(){document.querySelector("#cartDrawer")?.classList.add("open");document.querySelector("#cartBackdrop")?.classList.add("open")}
function closeCart(){document.querySelector("#cartDrawer")?.classList.remove("open");document.querySelector("#cartBackdrop")?.classList.remove("open")}
function bindCart(){
document.querySelector("#closeCart")?.addEventListener("click",closeCart);
document.querySelector("#cartBackdrop")?.addEventListener("click",closeCart);
document.querySelectorAll("[data-minus]").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.minus,-1)));
document.querySelectorAll("[data-plus]").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.plus,1)));
document.querySelector("#checkoutBtn")?.addEventListener("click",()=>toast("Checkout pronto para ser conectado ao pagamento."));
}
function toast(msg){let el=document.querySelector("#toast");if(!el)return;el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800)}
function setup(){
document.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(b.dataset.add)});
document.querySelectorAll("#cartBtn").forEach(b=>b.addEventListener("click",()=>{openCart()}));
updateCartCount();renderCart();

const featured=document.querySelector("#featuredProducts");if(featured)renderProducts(PRODUCTS.slice(0,4),"#featuredProducts");

const grid=document.querySelector("#productGrid");
if(grid){
const params=new URLSearchParams(location.search);const requested=params.get("categoria");const filter=document.querySelector("#categoryFilter");if(requested&&filter){filter.value=requested}
const apply=()=>{const q=(document.querySelector("#productSearch")?.value||"").toLowerCase();const cat=filter?.value||"Todos";const list=PRODUCTS.filter(p=>(cat==="Todos"||p.category===cat)&&p.name.toLowerCase().includes(q));renderProducts(list);document.querySelector("#emptyProducts")?.classList.toggle("hidden",list.length>0)};
document.querySelector("#productSearch")?.addEventListener("input",apply);filter?.addEventListener("change",apply);apply();
}
document.querySelector("#contactForm")?.addEventListener("submit",e=>{e.preventDefault();document.querySelector("#contactStatus").textContent="Mensagem preparada. Conecte este formulário a um serviço de envio para receber as mensagens.";e.target.reset()});
}
document.addEventListener("DOMContentLoaded",setup);