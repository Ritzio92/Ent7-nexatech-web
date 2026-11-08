/*
 * NexaTech — tienda web de demostración (Sesión 7)
 * Todos los productos, precios y reseñas son ficticios.
 * No hay pagos, autenticación, servidor ni servicios externos.
 */
'use strict';

const products = [
  {id:'aurabook',name:'AuraBook Pro 14',category:'Laptops',image:'laptop',description:'Potencia y ligereza para crear sin límites.',price:3899,oldPrice:4299,rating:4.9,reviews:128,badge:'OFERTA',featured:1,specs:['Pantalla de 14 pulgadas','16 GB RAM y 512 GB SSD','Diseño ligero y portátil']},
  {id:'novasound',name:'NovaSound ANC',category:'Audio',image:'headphones',description:'Audio inmersivo con cancelación de ruido.',price:449,oldPrice:599,rating:4.8,reviews:216,badge:'TOP VENTAS',featured:2,specs:['Cancelación de ruido activa','Hasta 32 horas de batería','Conexión Bluetooth']},
  {id:'keyforge',name:'KeyForge 75',category:'Periféricos',image:'keyboard',description:'Teclado mecánico compacto y preciso.',price:299,oldPrice:null,rating:4.9,reviews:87,badge:'NUEVO',featured:3,specs:['Formato compacto 75 %','Switches mecánicos','Iluminación personalizable']},
  {id:'pixelview',name:'PixelView QHD 27',category:'Monitores',image:'monitor',description:'Una nueva perspectiva de cada detalle.',price:1299,oldPrice:1499,rating:4.7,reviews:104,badge:'OFERTA',featured:4,specs:['Panel QHD de 27 pulgadas','Frecuencia de 165 Hz','Conectividad HDMI y DisplayPort']},
  {id:'pulsemouse',name:'PulseMouse Pro',category:'Periféricos',image:'mouse',description:'Precisión absoluta en cada movimiento.',price:189,oldPrice:null,rating:4.7,reviews:198,badge:null,featured:5,specs:['Sensor óptico de alta precisión','Diseño ergonómico','Conectividad inalámbrica']},
  {id:'orbitcam',name:'OrbitCam 4K',category:'Accesorios',image:'webcam',description:'Tu mejor imagen en todas las reuniones.',price:319,oldPrice:389,rating:4.6,reviews:72,badge:'OFERTA',featured:6,specs:['Resolución 4K','Micrófono integrado','Conexión por USB']},
  {id:'novatab',name:'NovaTab 11',category:'Laptops',image:'tablet',description:'Tu espacio creativo en cualquier lugar.',price:1499,oldPrice:null,rating:4.8,reviews:93,badge:'NUEVO',featured:7,specs:['Pantalla táctil de 11 pulgadas','Almacenamiento de 128 GB','Compatible con lápiz digital']},
  {id:'voltdock',name:'VoltDock 7 en 1',category:'Accesorios',image:'dock',description:'Conecta tu mundo con un solo accesorio.',price:179,oldPrice:null,rating:4.6,reviews:147,badge:null,featured:8,specs:['Conexiones USB y HDMI','Lector de tarjetas','Diseño compacto de aluminio']},
  {id:'nebulapad',name:'NebulaPad X',category:'Gaming',image:'controller',description:'Control total para tus mejores partidas.',price:249,oldPrice:null,rating:4.8,reviews:168,badge:'POPULAR',featured:9,specs:['Conexión inalámbrica','Vibración háptica','Compatible con PC']},
  {id:'studiomic',name:'StudioMic USB',category:'Audio',image:'microphone',description:'Haz que cada idea se escuche clara.',price:269,oldPrice:329,rating:4.7,reviews:64,badge:'OFERTA',featured:10,specs:['Captación de audio nítida','Conexión USB plug & play','Soporte de escritorio']},
  {id:'aerowatch',name:'AeroWatch Fit',category:'Accesorios',image:'watch',description:'Tecnología que sigue tu propio ritmo.',price:599,oldPrice:null,rating:4.5,reviews:116,badge:'NUEVO',featured:11,specs:['Monitoreo de actividad','Pantalla táctil','Notificaciones inteligentes']},
  {id:'arcstation',name:'ArcStation G5',category:'Gaming',image:'desktop',description:'Tu estación para jugar y desarrollar.',price:4299,oldPrice:4899,rating:4.9,reviews:56,badge:'OFERTA',featured:12,specs:['Procesador de alto rendimiento','16 GB RAM y 1 TB SSD','Gabinete con iluminación RGB']}
];

const categoryNames = ['Todos','Laptops','Audio','Periféricos','Monitores','Accesorios','Gaming'];
const money = amount => new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN',minimumFractionDigits:2}).format(amount).replace('PEN','S/');
const ICONS = {
 plus:'<path d="M12 5v14M5 12h14"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 heart:'<path d="M20.8 8.7c0 4.8-8.8 10.2-8.8 10.2S3.2 13.5 3.2 8.7A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8.8 1.9Z"/>',
 bag:'<path d="M4 7h16l-1.5 12h-13L4 7Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
};
const icon = (type,size=18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">${ICONS[type]}</svg>`;
const $ = selector => document.querySelector(selector);
const productById = id => products.find(item=>item.id===id);

function readSaved(key,fallback){try{const value=localStorage.getItem(key);return value?JSON.parse(value):fallback;}catch{return fallback;}}
function persist(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Sin almacenamiento disponible: la tienda funciona en la sesión actual. */}}
const savedCart = readSaved('nexatech_cart_v1',{});
let cart = Object.fromEntries(Object.entries(savedCart).filter(([id,qty])=>productById(id)&&Number.isInteger(qty)&&qty>0).map(([id,qty])=>[id,Math.min(qty,20)]));
let favorites = readSaved('nexatech_favorites_v1',[]);
if(!Array.isArray(favorites))favorites=[];
favorites = favorites.filter(id=>productById(id));
let activeCategory = 'Todos';
let favoritesOnly = false;
let searchTerm = '';
let sortOrder = 'featured';
let toastTimer;
let lastFocusedElement = null;

function renderFilters(){
  $('#category-filters').innerHTML = categoryNames.map(category=>`<button type="button" class="filter-pill ${activeCategory===category?'active':''}" data-category="${category}" aria-pressed="${activeCategory===category}">${category}</button>`).join('');
}
function getVisibleProducts(){
  const query = searchTerm.trim().toLocaleLowerCase('es');
  const matching = products.filter(product =>
    (activeCategory==='Todos'||product.category===activeCategory) &&
    (!favoritesOnly||favorites.includes(product.id)) &&
    (!query||`${product.name} ${product.category} ${product.description}`.toLocaleLowerCase('es').includes(query))
  );
  if(sortOrder==='price-asc')matching.sort((a,b)=>a.price-b.price);
  else if(sortOrder==='price-desc')matching.sort((a,b)=>b.price-a.price);
  else if(sortOrder==='name')matching.sort((a,b)=>a.name.localeCompare(b.name,'es'));
  else matching.sort((a,b)=>a.featured-b.featured);
  return matching;
}
function renderProducts(){
  const visible = getVisibleProducts();
  $('#products-grid').innerHTML = visible.map(p=>{
    const liked = favorites.includes(p.id);
    return `<article class="product-card">
      <button type="button" class="product-art" data-detail="${p.id}" aria-label="Ver detalles de ${p.name}"><img src="assets/${p.image}.svg" loading="lazy" alt="Imagen ilustrativa de ${p.name}"/>${p.badge?`<span class="product-badge ${p.badge==='OFERTA'?'sale':''}">${p.badge}</span>`:''}</button>
      <button type="button" class="product-heart ${liked?'is-favorite':''}" data-favorite="${p.id}" aria-pressed="${liked}" aria-label="${liked?'Quitar':'Agregar'} ${p.name} ${liked?'de':'a'} favoritos">${icon('heart')}</button>
      <div class="product-info"><span class="product-category">${p.category}</span><button type="button" class="product-name" data-detail="${p.id}">${p.name}</button><p class="product-description">${p.description}</p><div class="rating"><span class="rating-star" aria-label="Calificación ilustrativa">★</span><span class="rating-score">${p.rating.toFixed(1)}</span><span class="rating-count">(${p.reviews} opiniones demo)</span></div><div class="product-bottom"><div>${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}<strong class="price">${money(p.price)}</strong></div><button type="button" class="add-to-cart" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">${icon('plus')}</button></div></div>
    </article>`;
  }).join('');
  $('#empty-state').hidden = visible.length!==0;
  $('#result-count').textContent = String(visible.length);
  $('#results-copy').textContent = `Mostrando ${visible.length} de ${products.length} productos${favoritesOnly?' · Favoritos':''}`;
  $('#favorite-toggle').classList.toggle('is-active',favoritesOnly);
  $('#favorite-toggle').setAttribute('aria-pressed',String(favoritesOnly));
  $('#favorite-toggle').setAttribute('aria-label',favoritesOnly?'Mostrar todos los productos':'Mostrar favoritos');
  renderFilters();
}
function toggleFavorite(id){
  const p=productById(id); if(!p)return;
  const isFavorite=favorites.includes(id);
  favorites=isFavorite?favorites.filter(x=>x!==id):[...favorites,id];
  persist('nexatech_favorites_v1',favorites);
  renderProducts();
  showToast(isFavorite?'Eliminado de favoritos':'Agregado a favoritos ♥');
}
function cartSize(){return Object.values(cart).reduce((sum,qty)=>sum+qty,0);}
function cartSubtotal(){return Object.entries(cart).reduce((sum,[id,qty])=>sum+(productById(id)?.price??0)*qty,0);}
function saveCart(){persist('nexatech_cart_v1',cart);renderCart();}
function addToCart(id){
  const product=productById(id);if(!product)return;
  if((cart[id]||0)>=20){showToast('Máximo 20 unidades por producto');return;}
  cart[id]=(cart[id]||0)+1;saveCart();showToast(`${product.name} agregado al carrito ✓`);
}
function changeQty(id,change){if(!productById(id)||!cart[id])return;const updated=cart[id]+change;if(updated<=0)delete cart[id];else cart[id]=Math.min(updated,20);saveCart();}
function removeItem(id){if(!cart[id])return;delete cart[id];saveCart();showToast('Producto eliminado');}
function renderCart(){
  const total=cartSize();
  $('#cart-count').textContent=total>99?'99+':String(total);
  $('#cart-open').setAttribute('aria-label',`Abrir carrito, ${total} ${total===1?'producto':'productos'}`);
  $('#cart-heading-count').textContent=`(${total})`;
  const entries=Object.entries(cart);
  $('#cart-items').innerHTML=entries.length ? entries.map(([id,qty])=>{
    const p=productById(id);
    return `<article class="cart-item"><img class="cart-item-art" src="assets/${p.image}.svg" alt=""/><div class="cart-item-info"><span class="cart-item-category">${p.category}</span><h3 class="cart-item-name">${p.name}</h3><strong class="cart-item-price">${money(p.price)}</strong><div class="cart-item-controls"><div class="qty-controls"><button type="button" data-qty="${id}" data-change="-1" aria-label="Reducir cantidad de ${p.name}">−</button><span aria-label="${qty} unidades">${qty}</span><button type="button" data-qty="${id}" data-change="1" aria-label="Aumentar cantidad de ${p.name}" ${qty>=20?'disabled':''}>+</button></div><button type="button" class="remove-item" data-remove="${id}">Quitar</button></div></div></article>`;
  }).join('') : `<div class="cart-empty"><span class="empty-bag">${icon('bag',36)}</span><strong>Tu carrito está vacío</strong><p>Tu próximo upgrade está a un clic. Explora el catálogo y añade tus favoritos.</p><button type="button" class="btn btn-dark" data-continue>Explorar catálogo ${icon('arrow')}</button></div>`;
  $('#subtotal').textContent=money(cartSubtotal());
  $('#checkout-btn').disabled=total===0;
}
function showToast(message){
  const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);
}
function openOverlay(backdrop,dialog,openClass){
  lastFocusedElement=document.activeElement;
  backdrop.hidden=false;dialog.inert=false;dialog.setAttribute('aria-hidden','false');
  document.body.classList.add('dialog-open');
  requestAnimationFrame(()=>{backdrop.classList.add('visible');dialog.classList.add(openClass);const target=dialog.querySelector('.modal-close, #cart-close, #success-close');target?.focus();});
}
function closeOverlay(backdrop,dialog,openClass){
  backdrop.classList.remove('visible');dialog.classList.remove(openClass);
  dialog.inert=true;dialog.setAttribute('aria-hidden','true');
  backdrop.hidden=true;
  document.body.classList.remove('dialog-open');
  if(lastFocusedElement?.isConnected)lastFocusedElement.focus();
}
function openCart(){if($('#cart-drawer').classList.contains('open'))return;openOverlay($('#cart-backdrop'),$('#cart-drawer'),'open');}
function closeCart(){if(!$('#cart-drawer').classList.contains('open'))return;closeOverlay($('#cart-backdrop'),$('#cart-drawer'),'open');}
function openProduct(id){
  const p=productById(id);if(!p)return;
  $('#modal-content').innerHTML=`<div class="product-detail"><img class="product-detail-image" src="assets/${p.image}.svg" alt="Imagen ilustrativa de ${p.name}"/><div class="product-detail-info"><span class="product-category">${p.category.toUpperCase()}</span><h2 id="modal-title">${p.name}</h2><div class="rating"><span class="rating-star">★</span><strong>${p.rating.toFixed(1)}</strong><span class="rating-count">(${p.reviews} opiniones ficticias)</span></div><p>${p.description} Este producto es parte de nuestro catálogo de demostración.</p><div class="detail-specs">${p.specs.map(spec=>`<span>${spec}</span>`).join('')}</div><strong class="detail-price">${money(p.price)}</strong><button type="button" class="btn btn-lime detail-add" data-add="${p.id}">Agregar al carrito ${icon('plus')}</button></div></div>`;
  openOverlay($('#modal-backdrop'),$('#product-modal'),'open');
}
function closeProduct(){if($('#product-modal').classList.contains('open'))closeOverlay($('#modal-backdrop'),$('#product-modal'),'open');}
function simulateCheckout(){
  if(cartSize()===0)return;
  closeCart();cart={};saveCart();
  openOverlay($('#success-backdrop'),$('#success-modal'),'open');
}
function closeSuccess(){if($('#success-modal').classList.contains('open'))closeOverlay($('#success-backdrop'),$('#success-modal'),'open');}
function clearAllFilters(){
  activeCategory='Todos';favoritesOnly=false;searchTerm='';sortOrder='featured';$('#product-search').value='';$('#sort-select').value='featured';renderProducts();
}

$('#category-filters').addEventListener('click',event=>{
  const btn=event.target.closest('[data-category]');if(!btn)return;
  activeCategory=btn.dataset.category;renderProducts();
});
$('#products-grid').addEventListener('click',event=>{
  const favorite=event.target.closest('[data-favorite]');if(favorite){toggleFavorite(favorite.dataset.favorite);return;}
  const add=event.target.closest('[data-add]');if(add){addToCart(add.dataset.add);return;}
  const detail=event.target.closest('[data-detail]');if(detail)openProduct(detail.dataset.detail);
});
$('#modal-content').addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');if(!add)return;
  addToCart(add.dataset.add);closeProduct();openCart();
});
$('#cart-items').addEventListener('click',event=>{
  const qty=event.target.closest('[data-qty]');if(qty){changeQty(qty.dataset.qty,Number(qty.dataset.change));return;}
  const remove=event.target.closest('[data-remove]');if(remove){removeItem(remove.dataset.remove);return;}
  if(event.target.closest('[data-continue]')){closeCart();$('#catalogo').scrollIntoView({behavior:'smooth'});}
});
$('#product-search').addEventListener('input',event=>{searchTerm=event.target.value;renderProducts();});
$('#sort-select').addEventListener('change',event=>{sortOrder=event.target.value;renderProducts();});
$('#favorite-toggle').addEventListener('click',()=>{favoritesOnly=!favoritesOnly;renderProducts();$('#catalogo').scrollIntoView({behavior:'smooth'});});
$('#mobile-search-btn').addEventListener('click',()=>{$('#catalogo').scrollIntoView({behavior:'smooth'});$('#product-search').focus({preventScroll:true});});
$('#clear-filters').addEventListener('click',clearAllFilters);
$('#cart-open').addEventListener('click',openCart);
$('#cart-close').addEventListener('click',closeCart);
$('#cart-backdrop').addEventListener('click',closeCart);
$('#continue-btn').addEventListener('click',closeCart);
$('#checkout-btn').addEventListener('click',simulateCheckout);
$('#modal-close').addEventListener('click',closeProduct);
$('#modal-backdrop').addEventListener('click',closeProduct);
$('#success-close').addEventListener('click',closeSuccess);
$('#success-backdrop').addEventListener('click',closeSuccess);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if($('#success-modal').classList.contains('open'))closeSuccess();else if($('#product-modal').classList.contains('open'))closeProduct();else closeCart();}});

renderProducts();
renderCart();
