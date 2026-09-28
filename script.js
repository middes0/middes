const PRODUCTS=[
{id:"phone",name:"Smartphone Pro X",category:"Tecnologia",price:2999.90,old:3499.90,discount:14,image:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1000&q=85",brand:"CentralTech",description:"Smartphone de alto desempenho para uso diário, produtividade, fotos e entretenimento.",specs:[["Tela","6,7” AMOLED"],["RAM","6 GB"],["Armazenamento","256 GB"],["Processador","Octa-core 2,8 GHz"],["Câmeras","50 MP + 12 MP"],["Bateria","5.000 mAh"],["Conectividade","5G / Wi‑Fi 6"],["Sistema","Android"]]},
{id:"headphones",name:"Headphone Wireless",category:"Áudio",price:399.90,old:499.90,discount:20,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",brand:"CentralAudio",description:"Headphone sem fio com foco em conforto, autonomia e áudio imersivo.",specs:[["Tipo","Over-ear"],["Conexão","Bluetooth 5.3"],["Autonomia","Até 35 horas"],["Microfone","Integrado"],["Cancelamento","Redução de ruído"],["Carga","USB-C"],["Peso","285 g"]]},
{id:"watch",name:"Smartwatch Active",category:"Tecnologia",price:699.90,old:799.90,discount:12,image:"https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1000&q=85",brand:"CentralTech",description:"Relógio inteligente com tela colorida e recursos para acompanhar sua rotina.",specs:[["Tela","1,8” AMOLED"],["Bateria","Até 10 dias"],["Resistência","5 ATM"],["Conectividade","Bluetooth"],["Sensores","Frequência e movimento"],["Compatibilidade","Android / iOS"]]},
{id:"controller",name:"Controle Wireless",category:"Games",price:329.90,old:399.90,discount:18,image:"https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1000&q=85",brand:"CentralPlay",description:"Controle sem fio projetado para jogos com resposta rápida e pegada confortável.",specs:[["Conexão","Wireless 2.4 GHz"],["Compatibilidade","PC / Console"],["Bateria","Até 20 horas"],["Vibração","Dual vibration"],["Porta","USB-C"],["Peso","210 g"]]},
{id:"speaker",name:"Caixa de Som Mini",category:"Áudio",price:249.90,old:299.90,discount:17,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85",brand:"CentralAudio",description:"Caixa compacta com som potente para ambientes internos e externos.",specs:[["Potência","20 W"],["Conexão","Bluetooth 5.2"],["Autonomia","Até 14 horas"],["Resistência","IPX5"],["Carga","USB-C"]]},
{id:"keyboard",name:"Teclado Mecânico",category:"Games",price:459.90,old:549.90,discount:16,image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85",brand:"CentralPlay",description:"Teclado mecânico compacto para jogos e produtividade.",specs:[["Layout","ABNT2"],["Switches","Mecânicos"],["Conexão","USB-C"],["Iluminação","RGB"],["Anti-ghosting","Sim"],["Estrutura","Alumínio"]]},
{id:"lamp",name:"Luminária Smart",category:"Casa",price:189.90,old:239.90,discount:21,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",brand:"CentralHome",description:"Luminária inteligente para criar diferentes ambientes no seu espaço.",specs:[["Potência","12 W"],["Controle","App / toque"],["Conectividade","Wi‑Fi"],["Temperatura","2700K–6500K"],["Compatibilidade","Assistentes de voz"]]},
{id:"camera",name:"Câmera Compacta",category:"Tecnologia",price:1199.90,old:1399.90,discount:14,image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85",brand:"CentralTech",description:"Câmera compacta para quem quer registrar momentos com praticidade.",specs:[["Sensor","24 MP"],["Vídeo","4K"],["Lente","18–55 mm"],["Tela","3” articulada"],["Conectividade","Wi‑Fi / Bluetooth"],["Armazenamento","SD"]]}
];

let cart=JSON.parse(localStorage.getItem("centralmarket-cart")||"[]");

function money(v){return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function saveCart(){localStorage.setItem("centralmarket-cart",JSON.stringify(cart));updateCartCount();renderCart()}
function updateCartCount(){const n=cart.reduce((s,i)=>s+i.qty,0);document.querySelectorAll("#cartCount").forEach(e=>e.textContent=n)}
function productCard(p){
return `<article class="product-card"><a class="product-link" href="produto.html?id=${p.id}"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="discount">-${p.discount}%</span></div><div class="product-info"><span class="product-cat">${p.category}</span><h3>${p.name}</h3><div class="stars">★★★★★</div><div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div></a><button class="add-btn" data-add="${p.id}">Adicionar ao carrinho</button></div></article>`}
function renderProducts(list,selector="#productGrid"){const el=document.querySelector(selector);if(!el)return;el.innerHTML=list.map(productCard).join("")}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===id);if(!p)return;const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id:p.id,name:p.name,price:p.price,qty:1});saveCart();toast("Produto adicionado ao carrinho")}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart()}
function renderCart(){
const mount=document.querySelector("#cartMount");if(!mount)return;
const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
mount.innerHTML=`<div class="cart-backdrop" id="cartBackdrop"></div><aside class="cart-drawer" id="cartDrawer"><div class="cart-head"><h2>Seu carrinho</h2><button class="close-cart" id="closeCart">×</button></div><div class="cart-items">${cart.length?cart.map(i=>`<div class="cart-item"><div><strong>${i.name}</strong><br><small>${money(i.price)} cada</small></div><div class="qty"><button data-minus="${i.id}">−</button><span>${i.qty}</span><button data-plus="${i.id}">+</button></div></div>`).join(""):`<div class="cart-empty">Seu carrinho está vazio.</div>`}</div><div class="cart-foot"><div class="cart-total"><span>Total</span><span>${money(total)}</span></div><a class="btn primary checkout" href="carrinho.html">Ver carrinho completo</a></div></aside><div class="toast" id="toast"></div>`;
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
function renderDetail(){
const el=document.querySelector("#productDetail");if(!el)return;
const id=new URLSearchParams(location.search).get("id");const p=PRODUCTS.find(x=>x.id===id);
if(!p){el.innerHTML=`<div class="empty">Produto não encontrado. <a class="text-link" href="produtos.html">Voltar aos produtos</a></div>`;return}
el.innerHTML=`<div class="detail-image"><img src="${p.image}" alt="${p.name}"></div><div class="detail-info"><span class="eyebrow">${p.category.toUpperCase()}</span><h1>${p.name}</h1><p class="detail-desc">${p.description}</p><div class="detail-brand">Fabricante: <strong>${p.brand}</strong></div><div class="detail-price">${money(p.price)} <span>${p.old?money(p.old):""}</span><b>-${p.discount}%</b></div><button class="btn primary detail-add" data-add="${p.id}">Adicionar ao carrinho</button><a class="btn ghost" href="carrinho.html">Ir para o carrinho</a></div><div class="specs"><h2>Especificações</h2><div class="spec-grid">${p.specs.map(s=>`<div><span>${s[0]}</span><strong>${s[1]}</strong></div>`).join("")}</div></div>`;
}
function renderCartPage(){
const el=document.querySelector("#fullCart");if(!el)return;
const total=cart.reduce((s,i)=>s+i.price*i.qty,0);const subtotal=total;let discount=0;
el.innerHTML=`<div class="full-cart-items">${cart.length?cart.map(i=>`<div class="full-cart-item"><img src="${PRODUCTS.find(p=>p.id===i.id)?.image||""}" alt=""><div class="full-cart-main"><div><span class="product-cat">${PRODUCTS.find(p=>p.id===i.id)?.category||""}</span><h3>${i.name}</h3><p>${money(i.price)} cada</p></div><div class="qty"><button data-minus="${i.id}">−</button><span>${i.qty}</span><button data-plus="${i.id}">+</button></div></div><strong>${money(i.price*i.qty)}</strong></div>`).join(""):`<div class="cart-empty">Seu carrinho está vazio.<br><a class="text-link" href="produtos.html">Continuar comprando →</a></div>`}</div>
<div class="checkout-box"><h2>Resumo da compra</h2><div class="summary-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="coupon-row"><input id="couponInput" placeholder="Cupom de desconto"><button id="couponBtn" class="btn ghost">Aplicar</button></div><p id="couponMsg" class="coupon-msg"></p><div class="summary-line"><span>Desconto</span><strong id="discountValue">${money(discount)}</strong></div><div class="summary-total"><span>Total</span><strong id="grandTotal">${money(subtotal-discount)}</strong></div><button class="btn primary checkout" id="fullCheckout">Finalizar compra</button></div>`;
el.querySelectorAll("[data-minus]").forEach(b=>b.addEventListener("click",()=>{changeQty(b.dataset.minus,-1);renderCartPage()}));
el.querySelectorAll("[data-plus]").forEach(b=>b.addEventListener("click",()=>{changeQty(b.dataset.plus,1);renderCartPage()}));
document.querySelector("#couponBtn")?.addEventListener("click",()=>{
const input=document.querySelector("#couponInput"),msg=document.querySelector("#couponMsg");if(input.value.trim().toUpperCase()==="CENTRAL10"){discount=subtotal*.10;document.querySelector("#discountValue").textContent=money(discount);document.querySelector("#grandTotal").textContent=money(subtotal-discount);msg.textContent="Cupom CENTRAL10 aplicado: 10% de desconto."}else msg.textContent="Cupom inválido. Tente CENTRAL10."
});
document.querySelector("#fullCheckout")?.addEventListener("click",()=>toast("Checkout pronto para ser conectado ao pagamento."));
}
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
renderDetail();renderCartPage();document.addEventListener("DOMContentLoaded",setup);