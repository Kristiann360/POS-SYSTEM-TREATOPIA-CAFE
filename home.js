



const menu = {
  'Mini Donuts': ['Nutella', 'White Chocolate', 'Matcha', 'Biscoff'],
  'Mini Pancakes': ['Nutella', 'White Chocolate', 'Matcha', 'Biscoff'],
  'Croffles': ['Nutella', 'White Chocolate','Matcha','Mango Graham','Oreo','Biscoff','Strawberry'],
  'Churros': ['Nutella Dip', 'White Choco Dip', 'Biscoff Dip'],
  'Fridge Faves': ['Nutella Cheesecake', 'Oreo Cheesecake', 'Banana Pudding','Biscoff Cheesecake'],
  'Tiramisu': ['Classic', 'Matcha', 'Oreo','Biscoff','Strawbery']
};

const prices = {
  'Mini Donuts': { 
    'Nutella': 85, 
    'White Chocolate': 85, 
    'Matcha': 85, 
    'Biscoff': 90 
  },
  'Mini Pancakes': { 
    'Nutella': 85, 
    'White Chocolate': 85, 
    'Matcha': 85, 
    'Biscoff': 90 
  },
  'Croffles': { 
    'Nutella': 115, 
    'White Chocolate': 115, 
    'Matcha': 115, 
    'Mango Graham': 140,
    'Oreo': 140,
    'Biscoff': 150,
    'Strawberry': 150,
  },
  'Churros': { 
    'Nutella Dip': 70, 
    'White Choco Dip': 75, 
    'Biscoff Dip': 90 
  },
  'Fridge Faves': { 
    'Nutella Cheesecake': 220, 
    'Oreo Cheesecake': 230, 
    'Banana Pudding': 240, 
    'Biscoff Cheesecake': 120
  },
  'Tiramisu': { 
    'Classic': 200, 
    'Matcha': 200, 
    'Oreo': 210,
    'Biscoff': 220,
    'Strawberry':220
  }
};

let cart = [];

function showMenu(category) {
  document.getElementById('categoryTitle').textContent = category.toUpperCase();
  const items = menu[category];
  const itemList = document.getElementById('itemList');
  
  itemList.innerHTML = items.map(item => {
    const itemPrice = prices[category]?.[item] || '—'; // ✅ get price per category
    return `
      <div class='item' onclick="addToCart('${category}', '${item}')">
        <div class="item-name">${item}</div>
        <div class="item-price">₱${itemPrice}</div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
  const activeBtn = Array.from(document.querySelectorAll('.sidebar button'))
    .find(btn => btn.textContent.toLowerCase().includes(category.toLowerCase().split(' ')[0]));
  if (activeBtn) activeBtn.classList.add('active');
}




function addToCart(category, itemName) {
  const price = prices[category]?.[itemName] || 0; // ✅ use nested price
  const existing = cart.find(i => i.name === itemName && i.category === category);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ category, name: itemName, price, qty: 1 });
  }
  updateCart();
}


function updateCart() {
  const cartContainer = document.getElementById('cartItems');
  const totalDisplay = document.getElementById('total');

  cartContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <span>${item.name} x${item.qty}</span>
      <span>₱${item.price * item.qty}</span>
      <button class="remove-btn" onclick="removeItem(${index})">×</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  totalDisplay.textContent = `Total: ₱${total}`;
}


function removeItem(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--; // subtract quantity by 1
  } else {
    cart.splice(index, 1); // remove from array if qty = 1
  }
  updateCart();
}



function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  
  const saleData = {
    date: new Date().toLocaleDateString('en-PH'),
    items: cart.map(item => `${item.name} x${item.qty}`).join(', '),
    total: `₱${total}`
  };


  let sales = JSON.parse(localStorage.getItem('salesRecords')) || [];
  console.log('Before adding sale:', sales);  // Debug: Check existing data

 
  sales.push(saleData);
  console.log('After adding sale:', sales);  // Debug: Check new data


  localStorage.setItem('salesRecords', JSON.stringify(sales));
  console.log('Saved to localStorage:', localStorage.getItem('salesRecords'));  // Debug: Confirm save


  alert("Thank you for your purchase! Sale recorded.");
  cart = [];
  updateCart();
}

document.addEventListener('DOMContentLoaded', () => {
  const salesBody = document.getElementById('salesBody');
  const noSalesMsg = document.getElementById('noSales');


  const sales = JSON.parse(localStorage.getItem('salesRecords')) || [];

  if (sales.length === 0) {
    noSalesMsg.style.display = 'block';
    return;
  }

  sales.forEach(sale => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sale.date}</td>
      <td>${sale.items}</td>
      <td>${sale.total}</td>
    `;
    salesBody.appendChild(row);
  });
});
showMenu('Mini Donuts');