var products = [
  { id:1, name:"Rose Glow Serum",           brand:"Petal Lab",   price:34.99, subPrice:29.74, ecoScore:"A", carbon:"0.3 kg CO2", tags:["Vegan","Cruelty-Free","Organic"], ingredients:["rosehip oil","vitamin c","hyaluronic acid","aloe vera"],           image:"rose-serum.jpg" },
  { id:2, name:"Green Tea Cleanser",         brand:"PureRoot",    price:22.00, subPrice:18.70, ecoScore:"A", carbon:"0.2 kg CO2", tags:["Vegan","Cruelty-Free"],           ingredients:["green tea extract","aloe vera","chamomile","water"],               image:"green-tea-cleanser.jpg" },
  { id:3, name:"Bamboo Charcoal Mask",       brand:"EarthSkin",   price:28.50, subPrice:24.23, ecoScore:"B", carbon:"0.5 kg CO2", tags:["Cruelty-Free","Organic"],         ingredients:["activated charcoal","bamboo extract","kaolin clay","tea tree oil"], image:"bamboo-mask.jpg" },
  { id:4, name:"Lavender Night Cream",       brand:"Bloom & Co",  price:41.00, subPrice:34.85, ecoScore:"A", carbon:"0.4 kg CO2", tags:["Vegan","Cruelty-Free"],           ingredients:["lavender oil","shea butter","vitamin e","jojoba oil"],            image:"lavender-cream.jpg" },
  { id:5, name:"Turmeric Brightening Toner", brand:"GoldenHerb",  price:19.99, subPrice:16.99, ecoScore:"B", carbon:"0.6 kg CO2", tags:["Vegan"],                          ingredients:["turmeric extract","niacinamide","witch hazel","glycerin"],        image:"turmeric-toner.jpg" },
  { id:6, name:"Coconut Lip Butter",         brand:"Petal Lab",   price:12.00, subPrice:10.20, ecoScore:"A", carbon:"0.1 kg CO2", tags:["Vegan","Cruelty-Free","Organic"], ingredients:["coconut oil","beeswax alternative","vitamin e","shea butter"],    image:"coconut-lip.jpg" },
  { id:7, name:"Argan Hair Oil",             brand:"DesertBloom", price:36.00, subPrice:30.60, ecoScore:"B", carbon:"0.7 kg CO2", tags:["Cruelty-Free"],                   ingredients:["argan oil","vitamin b5","silk protein","rosemary extract"],       image:"argan-oil.jpg" },
  { id:8, name:"Cucumber Eye Gel",           brand:"PureRoot",    price:24.99, subPrice:21.24, ecoScore:"C", carbon:"0.9 kg CO2", tags:["Vegan"],                          ingredients:["cucumber extract","caffeine","hyaluronic acid","aloe vera"],      image:"cucumber-gel.jpg" }
];

var scoreColor = { A: "#2e7d45", B: "#d97706", C: "#dc2626" };


function updateCartCount() {
  var el = document.getElementById('cartCount');
  if (!el) return;
  var cart = JSON.parse(localStorage.getItem('cart') || '[]');
  var total = 0;
  for (var i = 0; i < cart.length; i++) total += cart[i].qty;
  el.textContent = total;
}

function showCards(list) {
  var grid = document.getElementById('productGrid');
  var noResults = document.getElementById('noResults');
  grid.innerHTML = '';

  if (list.length === 0) {
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  for (var i = 0; i < list.length; i++) {
    var p = list[i];

    var tagHTML = '';
    for (var t = 0; t < p.tags.length; t++) {
      var tag = p.tags[t];
      var cls = tag === 'Vegan' ? 'tag-vegan' : tag === 'Cruelty-Free' ? 'tag-cruelty' : 'tag-organic';
      tagHTML += '<span class="tag ' + cls + '">' + tag + '</span>';
    }

    var card = document.createElement('div');
    card.className = 'card';
    card.innerHTML =
      '<img src="' + p.image + '" alt="' + p.name + '" onclick="goToDetails(' + p.id + ')" />' +
      '<div class="card-body">' +
        '<h3 onclick="goToDetails(' + p.id + ')">' + p.name + '</h3>' +
        '<p class="brand">' + p.brand + '</p>' +
        '<div class="tags">' + tagHTML + '</div>' +
        '<span class="eco-badge" style="background:' + scoreColor[p.ecoScore] + '">Eco ' + p.ecoScore + '</span>' +
        '<p class="carbon">🌍 ' + p.carbon + ' carbon footprint</p>' +
        '<p class="sub-note">♻️ Subscribe price: $' + p.subPrice.toFixed(2) + ' <span class="save-badge">Save 15%</span></p>' +
        '<div class="card-footer">' +
          '<span class="price">$' + p.price.toFixed(2) + '</span>' +
          '<button class="btn-green" onclick="addToCart(' + p.id + ', this)">Add to Cart</button>' +
        '</div>' +
      '</div>';

    grid.appendChild(card);
  }
}

function goToDetails(id) {
  localStorage.setItem('selectedProduct', id);
  window.location.href = 'details.html';
}

function addToCart(id, btn) {
  var product;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) { product = products[i]; break; }
  }

  var cart = JSON.parse(localStorage.getItem('cart') || '[]');
  var found = false;
  for (var j = 0; j < cart.length; j++) {
    if (cart[j].id === id) { cart[j].qty += 1; found = true; break; }
  }
  if (!found) {
    cart.push({ id:product.id, name:product.name, brand:product.brand, price:product.price, ecoScore:product.ecoScore, image:product.image, qty:1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  btn.textContent = 'Added!';
  btn.classList.add('added');
  setTimeout(function() {
    btn.textContent = 'Add to Cart';
    btn.classList.remove('added');
  }, 1200);

  updateCartCount();
}

function filterProducts() {
  var query = document.getElementById('searchBox').value.toLowerCase().trim();
  var activeBtn = document.querySelector('.filter-btn.active');
  var activeScore = activeBtn ? activeBtn.getAttribute('data-score') : 'all';

  var result = [];
  for (var i = 0; i < products.length; i++) {
    var p = products[i];

    var scoreOk = (activeScore === 'all' || p.ecoScore === activeScore);

    var ingredientOk = true;
    if (query !== '') {
      ingredientOk = false;
      for (var j = 0; j < p.ingredients.length; j++) {
        if (p.ingredients[j].indexOf(query) !== -1) { ingredientOk = true; break; }
      }
    }

    if (scoreOk && ingredientOk) result.push(p);
  }

  showCards(result);
}

var currentQty = 1;

function loadDetails() {
  var id = parseInt(localStorage.getItem('selectedProduct') || '1');
  var p = null;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) { p = products[i]; break; }
  }
  if (!p) p = products[0];

  var scoreText = {
    A: "Excellent – lowest environmental impact.",
    B: "Good – moderate environmental footprint.",
    C: "Fair – higher impact, offset options available."
  };

  var tagHTML = '';
  for (var t = 0; t < p.tags.length; t++) {
    var tag = p.tags[t];
    var cls = tag === 'Vegan' ? 'tag-vegan' : tag === 'Cruelty-Free' ? 'tag-cruelty' : 'tag-organic';
    tagHTML += '<span class="tag ' + cls + '">' + tag + '</span>';
  }

  var ingHTML = '';
  for (var k = 0; k < p.ingredients.length; k++) {
    ingHTML += '<span class="pill">' + p.ingredients[k] + '</span>';
  }

  var container = document.getElementById('detailContainer');
  container.innerHTML =
    '<img class="product-img" src="' + p.image + '" alt="' + p.name + '" />' +

    '<div class="detail-info">' +
      '<p class="brand">' + p.brand + '</p>' +
      '<h1>' + p.name + '</h1>' +
      '<div class="tags">' + tagHTML + '</div>' +
      '<p class="price">$' + p.price.toFixed(2) + ' <span style="font-size:0.9rem;color:#888;font-weight:400">one-time</span></p>' +
      '<div class="sub-box">' +
        '♻️ Subscribe price: <strong>$' + p.subPrice.toFixed(2) + '</strong> <span class="save-badge">Save 15%</span><br/>' +
        '🏆 Earn <strong>' + Math.floor(p.price) + '</strong> loyalty points' +
      '</div>' +
      '<div class="eco-box">' +
        '<div class="eco-circle" style="background:' + scoreColor[p.ecoScore] + '">' + p.ecoScore + '</div>' +
        '<div>' +
          '<strong>Eco Score: ' + p.ecoScore + '</strong>' +
          '<p>' + scoreText[p.ecoScore] + '</p>' +
          '<p>🌍 Carbon: ' + p.carbon + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="qty-row">' +
        '<div class="qty-control">' +
          '<button onclick="changeQty(-1)">−</button>' +
          '<span id="qtyDisplay">1</span>' +
          '<button onclick="changeQty(1)">+</button>' +
        '</div>' +
        '<span style="color:#888;font-size:0.85rem">Quantity</span>' +
      '</div>' +
      '<button class="btn-green" id="addBtn" onclick="addToCartDetail(' + p.id + ')">🛒 Add to Cart</button>' +
    '</div>' +

    '<div class="info-box">' +
      '<h3>🌿 Ingredients</h3>' +
      '<div class="ingredient-list">' + ingHTML + '</div>' +
    '</div>' +

    '<div class="info-box">' +
      '<h3>ℹ️ About</h3>' +
      '<p>' + p.name + ' by ' + p.brand + ' uses sustainably sourced ingredients. ' +
      'Third-party tested, 100% recycled packaging.<br/><br/>' +
      '<strong>Subscribe & Save:</strong> 15% off every refill order.<br/>' +
      '<strong>Loyalty Points:</strong> Earn 1 point per $1. 100 pts = $5 off.</p>' +
    '</div>';
}

function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById('qtyDisplay').textContent = currentQty;
}

function addToCartDetail(id) {
  var product;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) { product = products[i]; break; }
  }

  var cart = JSON.parse(localStorage.getItem('cart') || '[]');
  var found = false;
  for (var j = 0; j < cart.length; j++) {
    if (cart[j].id === id) { cart[j].qty += currentQty; found = true; break; }
  }
  if (!found) {
    cart.push({ id:product.id, name:product.name, brand:product.brand, price:product.price, ecoScore:product.ecoScore, image:product.image, qty:currentQty });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  var btn = document.getElementById('addBtn');
  btn.textContent = 'Added ' + currentQty + ' to Cart!';
  btn.classList.add('added');
  setTimeout(function() {
    btn.textContent = '🛒 Add to Cart';
    btn.classList.remove('added');
  }, 1500);

  updateCartCount();
}

window.onload = function() {
  updateCartCount();

  if (document.getElementById('productGrid')) {
    showCards(products);

    document.getElementById('searchBox').addEventListener('input', filterProducts);

    var btns = document.querySelectorAll('.filter-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function() {
        for (var j = 0; j < btns.length; j++) btns[j].classList.remove('active');
        this.classList.add('active');
        filterProducts();
      });
    }
  }

  if (document.getElementById('detailContainer')) {
    loadDetails();
  }
};