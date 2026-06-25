const products = [
  {id:1, name:'Vestido Aurora', desc:'Vestido longo tomara-que-caia com babados', price:289.90, img:'images/vestido-branco.jpg', cat:'Vestidos'},
  {id:2, name:'Vestido Noir', desc:'Vestido midi justo em tecido canelado', price:219.90, img:'images/vestido-preto.jpg', cat:'Vestidos'},
  {id:3, name:'Conjunto Power Red', desc:'Top com zíper + legging cintura alta', price:259.90, img:'images/conjunto-vermelho.jpg', cat:'Conjuntos'},
  {id:4, name:'Conjunto Bloom', desc:'Regata canelada + saia bordada floral', price:199.90, img:'images/conjunto-saia.jpg', cat:'Conjuntos'},
  {id:5, name:'Body Scarlet', desc:'Body vermelho com zíper frontal', price:139.90, img:'images/body-vermelho.jpg', cat:'Tops'},
  {id:6, name:'Legging High Power', desc:'Legging preta cintura alta fitness', price:119.90, img:'images/legging-preta.jpg', cat:'Fitness'},
  {id:7, name:'Regata Essential', desc:'Regata branca canelada básica', price:69.90, img:'images/regata-branca.jpg', cat:'Tops'},
  {id:8, name:'Saia Bloom Floral', desc:'Saia mini preta com bordado floral', price:109.90, img:'images/saia-floral.jpg', cat:'Saias'},
  {id:9, name:'Tênis Urban Mix', desc:'Tênis chunky coleção cores variadas', price:349.90, img:'images/tenis.jpg', cat:'Calçados'},
  {id:10, name:'Colar Charm Dourado', desc:'Colar delicado com pingente ornamentado', price:89.90, img:'images/colar.jpg', cat:'Acessórios'},
  {id:11, name:'Bracelete Minimal', desc:'Bracelete fino banhado a ouro', price:59.90, img:'images/bracelete.jpg', cat:'Acessórios'},
];

const cart = JSON.parse(localStorage.getItem('cart') || '[]');
const fmt = v => 'R$ ' + v.toFixed(2).replace('.', ',');
let activeFilter = 'Todos';

function renderProducts(){
  const grid = document.getElementById('productGrid');
  const list = activeFilter === 'Todos' ? products : products.filter(p=>p.cat===activeFilter);
  grid.innerHTML = list.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="card-body">
        <span class="tag">${p.cat}</span>
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="price">${fmt(p.price)}</div>
        <button onclick="addCart(${p.id})">Adicionar à sacola</button>
      </div>
    </div>
  `).join('');
}

function renderFilters(){
  const cats = ['Todos', ...new Set(products.map(p=>p.cat))];
  document.getElementById('filters').innerHTML = cats.map(c=>
    `<button class="${c===activeFilter?'active':''}" onclick="setFilter('${c}')">${c}</button>`
  ).join('');
}

function setFilter(c){activeFilter=c;renderFilters();renderProducts();}

function addCart(id){
  const p = products.find(x=>x.id===id);
  const ex = cart.find(x=>x.id===id);
  if(ex) ex.qty++; else cart.push({...p, qty:1});
  save();
  openCart();
}

function removeCart(id){
  const i = cart.findIndex(x=>x.id===id);
  if(i>-1) cart.splice(i,1);
  save();
}

function save(){
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  document.getElementById('cartCount').textContent = cart.reduce((s,x)=>s+x.qty,0);
  const items = document.getElementById('cartItems');
  if(!cart.length){items.innerHTML='<p style="text-align:center;color:#999;padding:40px 0">Sua sacola está vazia</p>';}
  else items.innerHTML = cart.map(x=>`
    <div class="cart-item">
      <img src="${x.img}" alt="${x.name}">
      <div class="cart-item-info">
        <div>${x.name}</div>
        <div>Qtd: ${x.qty}</div>
        <div class="p">${fmt(x.price * x.qty)}</div>
      </div>
      <button onclick="removeCart(${x.id})">✕</button>
    </div>
  `).join('');
  document.getElementById('cartTotal').textContent = fmt(cart.reduce((s,x)=>s+x.price*x.qty,0));
}

function openCart(){
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

document.getElementById('cartBtn').onclick = openCart;
document.getElementById('closeCart').onclick = closeCart;
document.getElementById('overlay').onclick = closeCart;

renderFilters();
renderProducts();
renderCart();
