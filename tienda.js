document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_STRIPE_LINK = 'https://buy.stripe.com/bJe8wQ0mZ2pX9Evaa7fw400';
  let cart = [];

  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.tab-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;

      if (target === 'todos') {
        sections.forEach(sec => sec.classList.remove('hidden'));
      } else {
        sections.forEach(sec => {
          if (sec.dataset.category === target) {
            sec.classList.remove('hidden');
          } else {
            sec.classList.add('hidden');
          }
        });
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
        const defaultEmptyMsg = cartItemsContainer.getAttribute('data-empty-text') || 'Tu carrito está vacío.';
        cartItemsContainer.innerHTML = `<p class="text-sm text-slate-400 text-center py-10 font-medium">${defaultEmptyMsg}</p>`;
      }
      if (cartTotal) cartTotal.innerText = '$0 USD';
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
          <span class="text-slate-400 text-[11px]">${item.quantity} x $${item.price} USD</span>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <span class="font-bold text-[#1F8A65]">$${itemTotal} USD</span>
          <button data-remove-item="${item.title}" class="text-slate-400 hover:text-red-500 font-bold cursor-pointer transition-colors p-1">✕</button>
        </div>
      `;
      cartItemsContainer?.appendChild(itemEl);
    });

    if (cartTotal) cartTotal.innerText = `$${total} USD`;

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
      const link = btn.getAttribute('data-link') || DEFAULT_STRIPE_LINK;

      const existing = cart.find(item => item.title === title);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ title, price, quantity: 1, link });
      }

      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ OK!';
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
    if (cart.length === 0) return;
    

    const checkoutLink = cart[0].link || DEFAULT_STRIPE_LINK;
    window.location.href = checkoutLink;
  });


  const modalBtns = document.querySelectorAll('[data-modal-target]');
  const closeBtns = document.querySelectorAll('[data-close-modal]');

  modalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-target');
      document.getElementById(modalId)?.classList.remove('hidden');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      document.getElementById(modalId)?.classList.add('hidden');
    });
  });
});
