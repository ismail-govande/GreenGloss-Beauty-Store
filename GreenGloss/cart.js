var promoCodes = { 'GREEN15': 15, 'ECO10': 10, 'BEAUTY5': 5 };
var appliedPromo = 0;
var scoreColor = { A: "#2e7d45", B: "#d97706", C: "#dc2626" };

function renderCart() {
  var cart = JSON.parse(localStorage.getItem('cart') || '[]');
  var container = document.getElementById('cartItems');
  var summaryBox = document.getElementById('summaryBox');
  container.innerHTML = '';

  if (cart.length === 0) {
    summaryBox.style.display = 'none';
    container.innerHTML =
      '<div class="empty-cart">' +
        '<div style="font-size:3rem">🛍️</div>' +
        '<h2>Your cart is empty</h2>' +
        '<p>Discover our sustainable products</p>' +
        '<a href="products.html">Shop Now</a>' +
      '</div>';
    return;
  }

  summaryBox.style.display = 'block';

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML =
      '<img src="' + item.image + '" alt="' + item.name + '" />' +
      '<div class="cart-item-info">' +
        '<h4>' + item.name + '</h4>' +
        '<p>' + item.brand + '</p>' +
        '<span class="eco-badge" style="background:' + scoreColor[item.ecoScore] + '">Eco ' + item.ecoScore + '</span>' +
        '<div class="qty-control" style="margin-top:8px">' +
          '<button onclick="changeQty(' + item.id + ', -1)">−</button>' +
          '<span id="qty-' + item.id + '">' + item.qty + '</span>' +
          '<button onclick="changeQty(' + item.id + ', 1)">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-item-right">' +
        '<p class="price">$' + (item.price * item.qty).toFixed(2) + '</p>' +
        '<button class="remove-btn" onclick="removeItem(' + item.id + ')">✕ Remove</button>' +
      '</div>';
    container.appendChild(div);
  }

  updateSummary(cart);
}

function updateSummary(cart) {
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) subtotal += cart[i].price * cart[i].qty;

  var ecoDiscount = 0;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].ecoScore === 'A') ecoDiscount += cart[i].price * cart[i].qty * 0.05;
  }

  var promoAmt = (subtotal * appliedPromo) / 100;
  var total = subtotal - ecoDiscount - promoAmt;
  var loyaltyPts = Math.floor(total);

  document.getElementById('subtotal').textContent      = '$' + subtotal.toFixed(2);
  document.getElementById('ecoDiscount').textContent   = '-$' + ecoDiscount.toFixed(2);
  document.getElementById('promoDiscount').textContent = '-$' + promoAmt.toFixed(2);
  document.getElementById('total').textContent         = '$' + total.toFixed(2);
  document.getElementById('loyaltyPoints').textContent = loyaltyPts;
}

function changeQty(id, delta) {
  var cart = JSON.parse(localStorage.getItem('cart') || '[]');
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].qty = Math.max(1, cart[i].qty + delta);
      break;
    }
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function removeItem(id) {
  var cart = JSON.parse(localStorage.getItem('cart') || '[]');
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) newCart.push(cart[i]);
  }
  localStorage.setItem('cart', JSON.stringify(newCart));
  renderCart();
  updateCartCount();
}

function applyPromo() {
  var code = document.getElementById('promoInput').value.trim().toUpperCase();
  var msg = document.getElementById('promoMsg');
  if (promoCodes[code]) {
    appliedPromo = promoCodes[code];
    msg.textContent = 'Code applied! ' + appliedPromo + '% off.';
    msg.style.color = 'green';
    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    updateSummary(cart);
  } else {
    appliedPromo = 0;
    msg.textContent = 'Invalid code. Try GREEN15, ECO10 or BEAUTY5.';
    msg.style.color = 'red';
  }
}

function checkout() {
  document.getElementById('popup').style.display = 'flex';
}

function clearAndClose() {
  localStorage.removeItem('cart');
  document.getElementById('popup').style.display = 'none';
  window.location.href = 'products.html';
}

function updateCartCount() {
  var el = document.getElementById('cartCount');
  if (!el) return;
  var cart = JSON.parse(localStorage.getItem('cart') || '[]');
  var total = 0;
  for (var i = 0; i < cart.length; i++) total += cart[i].qty;
  el.textContent = total;
}

window.onload = function() {
  renderCart();
  updateCartCount();
};