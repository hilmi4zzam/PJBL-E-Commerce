const products = [
  { id: 1, name: 'Laptop Gaming', price: 15000000, detail: '16GB • RTX 4060', image: 'assets/laptop.png' },
  { id: 2, name: 'Smartphone', price: 5000000, detail: '128GB • AMOLED', image: 'assets/smartphone.jpg' },
  { id: 3, name: 'Headphone', price: 1500000, detail: 'Noise Cancelling', image: 'assets/headphone.jpg' },
  { id: 4, name: 'Smartwatch', price: 3000000, detail: 'Heart Rate • GPS', image: 'assets/smartwatch.jpg' },
  { id: 5, name: 'Keyboard Mechanical', price: 2000000, detail: 'Hot-swap • RGB', image: 'assets/keyboard.jpeg' },
  { id: 6, name: 'Mouse Gaming', price: 800000, detail: '69g • Wireless', image: 'assets/mouse.jpeg' },
  { id: 7, name: 'Monitor 4K', price: 6000000, detail: '27" • HDR10', image: 'assets/monitor.jpeg' },
  { id: 8, name: 'Webcam HD', price: 1200000, detail: '1080p • 60fps', image: 'assets/webcam.jpeg' },
];

const paymentProviders = {
  dana: {
    label: 'DANA',
    qr: 'assets/qr_code_dana.jpg',
  },
  gopay: {
    label: 'GoPay',
    qr: 'assets/qr_code_gopay.jpg',
  },
};

const CART_STORAGE_KEY = 'minimal_cart_state';
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderProducts();
  updateCartUI();
  initLogoAnimation();
});

function initLogoAnimation() {
  const logoContainer = document.getElementById('logo-animation');
  if (!logoContainer || typeof lottie === 'undefined') {
    return;
  }

  lottie.loadAnimation({
    container: logoContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'logoaplikasihilmi.json',
    name: 'brand-logo',
  });
}

function loadCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function renderProducts() {
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-photo" aria-hidden="true">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${product.detail}</div>
      </div>
      <strong>${formatPrice(product.price)}</strong>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
    `;
    productsGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  saveCart();
  pulseCartButton();
}

function pulseCartButton() {
  const cartButton = document.querySelector('.cart-pill');
  if (!cartButton) return;
  cartButton.style.transform = 'scale(1.05)';
  setTimeout(() => {
    cartButton.style.transform = '';
  }, 200);
}

function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Keranjang kosong</p>';
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <div class="cart-item-thumb">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.detail} • ${formatPrice(item.price)}</div>
            <div class="cart-item-quantity">
              <button class="qty-btn" onclick="decreaseQuantity(${item.id})">-</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
              <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
            </div>
          </div>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
      `
      )
      .join('');
  }

  if (cartTotal) {
    cartTotal.textContent = formatPrice(getCartTotal());
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function increaseQuantity(productId) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.quantity += 1;
  updateCartUI();
  saveCart();
}

function decreaseQuantity(productId) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  if (item.quantity === 1) {
    removeFromCart(productId);
    return;
  }
  item.quantity -= 1;
  updateCartUI();
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
  saveCart();
}

function toggleCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  cartSidebar?.classList.toggle('active');
}

function openCheckout() {
  if (cart.length === 0) {
    alert('Keranjang kosong! Tambahkan produk terlebih dahulu.');
    return;
  }

  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutItems = document.getElementById('checkout-items');
  const checkoutTotal = document.getElementById('checkout-total');

  if (checkoutItems) {
    checkoutItems.innerHTML = cart
      .map(
        (item) => `
				<div class="checkout-item">
					<span>${item.name} x${item.quantity}</span>
					<span>${formatPrice(item.price * item.quantity)}</span>
				</div>
			`
      )
      .join('');
  }

  if (checkoutTotal) {
    checkoutTotal.textContent = formatPrice(getCartTotal());
  }

  checkoutModal?.classList.add('active');
}

function closeCheckout() {
  document.getElementById('checkout-modal')?.classList.remove('active');
}

function processPayment() {
  const paymentMethodElement = document.querySelector('input[name="payment"]:checked');
  const paymentMethod = paymentMethodElement?.value ?? 'cash';
  const total = getCartTotal();

  closeCheckout();

  if (paymentMethod === 'cash') {
    showSuccessModal();
  } else {
    showPaymentModal(paymentMethod, total);
  }
}

function showPaymentModal(method, amount) {
  const paymentModal = document.getElementById('payment-modal');
  const paymentTitle = document.getElementById('payment-title');
  const paymentInfo = document.getElementById('payment-info');
  const provider = paymentProviders[method];

  if (!paymentModal || !paymentTitle || !paymentInfo || !provider) return;

  paymentTitle.textContent = `Pembayaran ${provider.label}`;
  paymentInfo.innerHTML = buildPaymentTemplate(provider, amount);

  paymentModal.classList.add('active');
}

function buildPaymentTemplate(provider, amount) {
  return `
		<div class="payment-details">
      <h3>${provider.label} Virtual QR</h3>
      <img src="${provider.qr}" alt="QR ${provider.label}" class="qr-image" />
			<div class="payment-amount">${formatPrice(amount)}</div>
			<div class="payment-instructions">
				<p>1. Buka aplikasi ${provider.label} kamu</p>
				<p>2. Pilih menu Scan/Pay</p>
				<p>3. Scan kode di atas</p>
				<p>4. Selesaikan transaksi</p>
			</div>
		</div>
	`;
}

function closePaymentModal() {
  document.getElementById('payment-modal')?.classList.remove('active');
}

function completePayment() {
  closePaymentModal();
  showSuccessModal();
}

function showSuccessModal() {
  document.getElementById('success-modal')?.classList.add('active');
  cart = [];
  updateCartUI();
  saveCart();
  document.getElementById('cart-sidebar')?.classList.remove('active');
}

function closeSuccessModal() {
  document.getElementById('success-modal')?.classList.remove('active');
}

window.addEventListener('click', (event) => {
  const checkoutModal = document.getElementById('checkout-modal');
  const paymentModal = document.getElementById('payment-modal');
  const successModal = document.getElementById('success-modal');

  if (event.target === checkoutModal) {
    closeCheckout();
  }
  if (event.target === paymentModal) {
    closePaymentModal();
  }
  if (event.target === successModal) {
    closeSuccessModal();
  }
});

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}
