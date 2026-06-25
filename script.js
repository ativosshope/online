const PRODUCTS = [
  { id: 1, name: 'Suncatcher Cristal Ametista', cat: 'decoracao', price: 49.90, img: 'images/suncatcher.jpg', desc: 'Pingente de cristal com ventosa. Reflete arco-íris pela casa.' },
  { id: 2, name: 'Kit 6 Ganchos de Ventosa', cat: 'decoracao', price: 29.90, img: 'images/ventosas.jpg', desc: 'Ganchos transparentes super-resistentes para janela ou box.' },
  { id: 3, name: 'Top Biquíni Azul Marinho', cat: 'moda', price: 89.90, img: 'images/biquini.jpg', desc: 'Top triângulo em tecido premium. Tamanhos P, M, G.' },
  { id: 4, name: 'Saída de Praia Tule Branca', cat: 'moda', price: 119.90, img: 'images/saia.jpg', desc: 'Saída leve em tule, perfeita para o verão.' },
];

const fmt = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');
const cart = new Map();

const grid = document.getElementById('grid');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const drawerBody = document.getElementById('drawerBody');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

function render(filter = 'all') {
  grid.innerHTML = '';
  PRODUCTS.filter(p => filter === 'all' || p.cat === filter).forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="img"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
      <div class="body">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="row">
          <span class="price">${fmt(p.price)}</span>
          <button class="add" data-id="${p.id}">Adicionar</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  grid.querySelectorAll('.add').forEach(btn => {
    btn.addEventListener('click', () => addToCart(+btn.dataset.id));
  });
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  openDrawer();
}

function changeQty(id, delta) {
  const next = (cart.get(id) || 0) + delta;
  if (next <= 0) cart.delete(id);
  else cart.set(id, next);
  renderCart();
}

function renderCart() {
  const items = [...cart.entries()];
  cartCount.textContent = items.reduce((s, [, q]) => s + q, 0);
  if (items.length === 0) {
    drawerBody.innerHTML = '<p class="empty">Seu carrinho está vazio.</p>';
    cartTotal.textContent = fmt(0);
    return;
  }
  let total = 0;
  drawerBody.innerHTML = items.map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    total += p.price * qty;
    return `
      <div class="item">
        <img src="${p.img}" alt="${p.name}" />
        <div class="item-info">
          <h4>${p.name}</h4>
          <span class="small">${fmt(p.price)}</span>
          <div class="qty">
            <button onclick="changeQty(${id}, -1)">−</button>
            <span>${qty}</span>
            <button onclick="changeQty(${id}, 1)">+</button>
          </div>
        </div>
      </div>`;
  }).join('');
  cartTotal.textContent = fmt(total);
}

function openDrawer() { drawer.classList.add('open'); overlay.classList.add('show'); }
function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('show'); }

document.getElementById('cartBtn').addEventListener('click', openDrawer);
document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.size === 0) return alert('Adicione produtos primeiro!');
  alert('Pedido enviado! Em breve você receberá o link de pagamento.');
  cart.clear(); renderCart(); closeDrawer();
});

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    render(chip.dataset.filter);
  });
});

window.changeQty = changeQty;
render();
renderCart();
