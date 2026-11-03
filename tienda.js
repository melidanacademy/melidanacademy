document.addEventListener('DOMContentLoaded', () => {
  const STRIPE_LINK = 'https://buy.stripe.com/bJe8wQ0mZ2pX9Evaa7fw400';
  let cart = [];

  const tabButtons = document.querySelectorAll('[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabKey = button.getAttribute('data-tab');

      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      tabContents.forEach(content => content.classList.add('hidden'));
      const activeContent = document.getElementById(`sec-${tabKey}`);
      if (activeContent) {
        activeContent.classList.remove('hidden');
      }
    });
  });

  const toggleCartDrawer = () => {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) drawer.classList.toggle('hidden');
  };

  const updateCartUI = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.innerText = totalQuantity;

    if (cart.length === 0) {
      if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '<p class="text-xs text-slate-400 text-center py-8">Tu carrito está vacío.</p>';
      }
      if (cartTotal) cartTotal.innerText = '0 €';
      return;
    }

    let total = 0;
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl text-xs shadow-xs';
      itemEl.innerHTML = `
        <div class="pr-2">
          <h4 class="font-bold text-[#0A3B7A] leading-tight">${item.title}</h4>
          <span class="text-slate-400 text-[11px]">${item.quantity} x ${item.price} €</span>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <span class="font-bold text-[#1F8A65]">${itemTotal} €</span>
          <button data-remove-item="${item.title}" class="text-slate-400 hover:text-red-500 font-bold cursor-pointer transition-colors p-1">✕</button>
        </div>
      `;
      cartItemsContainer?.appendChild(itemEl);
    });

    if (cartTotal) cartTotal.innerText = `${total} €`;

    document.querySelectorAll('[data-remove-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-remove-item');
        cart = cart.filter(item => item.title !== title);
        updateCartUI();
      });
    });
  };

  document.querySelectorAll('[data-add-item]').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-add-item');
      const price = parseFloat(btn.getAttribute('data-price') || '0');

      const existing = cart.find(item => item.title === title);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ title, price, quantity: 1 });
      }

      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ ¡Añadido!';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 1200);

      updateCartUI();
      toggleCartDrawer();
    });
  });

  document.getElementById('cart-toggle-btn')?.addEventListener('click', toggleCartDrawer);
  document.getElementById('cart-close-btn')?.addEventListener('click', toggleCartDrawer);

  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Agrega al menos un producto antes de continuar con el pago.');
      return;
    }
    window.location.href = STRIPE_LINK;
  });
});
