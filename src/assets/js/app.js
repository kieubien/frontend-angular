// ========================================
// app.js — Global Data & Helpers
// ========================================

// ── DATA ──────────────────────────────
const PRODUCTS = [
  { id:1, name:'Lipstick Matte Ruby Woo', brand:'MAC Cosmetics', category:'Son môi', price:480000, originalPrice:600000, badge:'sale', rating:4.9, reviewCount:342, soldCount:2800, stock:5, isFeatured:true, colors:[{name:'Ruby Woo',hex:'#C95E85'},{name:'Russian Red',hex:'#E24B4A'},{name:'Diva',hex:'#9B3060'},{name:'Honey Love',hex:'#D2855A'}], image:'assets/mac-ruby-woo.png', emoji:'💄' },
  { id:2, name:'Rouge Dior Satin 999', brand:'Dior Beauty', category:'Son môi', price:1250000, originalPrice:null, badge:'new', rating:4.8, reviewCount:218, soldCount:1900, stock:64, isFeatured:true, colors:[{name:'999 Classic',hex:'#C8963E'},{name:'Hồng tươi',hex:'#C95E85'},{name:'Đỏ mận',hex:'#9B3060'}], image:'', emoji:'🌹' },
  { id:3, name:'Velvet Matte Lip Pencil', brand:'NARS Cosmetics', category:'Son môi', price:720000, originalPrice:850000, badge:null, rating:4.9, reviewCount:189, soldCount:1200, stock:12, isFeatured:true, colors:[{name:'Provocateur',hex:'#DEB8F0'},{name:'Walkyrie',hex:'#D4537E'},{name:'Obsession',hex:'#888'}], image:'', emoji:'✨' },
  { id:4, name:'Rouge Pur Couture Sheer', brand:'YSL Beauty', category:'Son môi', price:980000, originalPrice:null, badge:'hot', rating:4.9, reviewCount:401, soldCount:980, stock:38, isFeatured:true, colors:[{name:'Hồng pastel',hex:'#E88DAE'},{name:'Đỏ tươi',hex:'#E24B4A'},{name:'Nude',hex:'#F5D9A8'}], image:'', emoji:'💋' },
  { id:5, name:'Rouge Allure Velvet Nuit', brand:'Chanel', category:'Son môi', price:1450000, originalPrice:null, badge:'new', rating:4.8, reviewCount:276, soldCount:760, stock:27, isFeatured:false, colors:[{name:'Đen cherry',hex:'#F9D5E5'},{name:'Đỏ Chanel',hex:'#C95E85'}], image:'', emoji:'🌸' },
  { id:6, name:'Matte Revolution Lipstick', brand:'Charlotte Tilbury', category:'Son môi', price:850000, originalPrice:1000000, badge:'sale', rating:4.9, reviewCount:523, soldCount:523, stock:18, isFeatured:true, colors:[{name:'Pillow Talk',hex:'#D2855A'},{name:'Walk of Shame',hex:'#C8963E'},{name:'Bond Girl',hex:'#E24B4A'}], image:'', emoji:'🌷' },
];

const ORDERS = [
  { id:'BB2601', customerName:'Kiều Biên', customerPhone:'0912345678', items:[{productName:'MAC Ruby Woo',quantity:2}], total:894000, paymentMethod:'MoMo', status:'done', createdAt:'2026-03-18T09:14:00Z' },
  { id:'BB2600', customerName:'Trần Minh Thư', customerPhone:'0987654321', items:[{productName:'Dior Satin 999',quantity:1}], total:1250000, paymentMethod:'VISA', status:'shipping', createdAt:'2026-03-18T08:30:00Z' },
  { id:'BB2599', customerName:'Phạm Hồng Nhung', customerPhone:'0901234567', items:[{productName:'NARS Velvet',quantity:3}], total:2160000, paymentMethod:'ZaloPay', status:'pending', createdAt:'2026-03-17T21:05:00Z' },
  { id:'BB2598', customerName:'Võ Thị Thu', customerPhone:'0934567890', items:[{productName:'YSL Couture',quantity:1}], total:980000, paymentMethod:'COD', status:'done', createdAt:'2026-03-17T15:42:00Z' },
  { id:'BB2597', customerName:'Ngô Thị Tuyết', customerPhone:'0978901234', items:[{productName:'Chanel Allure',quantity:1}], total:1480000, paymentMethod:'MoMo', status:'cancelled', createdAt:'2026-03-17T11:18:00Z' },
];

// ── CART ──────────────────────────────
const Cart = {
  items: JSON.parse(localStorage.getItem('bb_cart') || '[]'),

  save() { localStorage.setItem('bb_cart', JSON.stringify(this.items)); this.updateBadge(); },

  add(product, color, qty = 1) {
    const idx = this.items.findIndex(i => i.id === product.id && i.color === color.name);
    if (idx > -1) this.items[idx].qty += qty;
    else this.items.push({ id: product.id, name: product.name, brand: product.brand, price: product.price, originalPrice: product.originalPrice, color: color.name, colorHex: color.hex, emoji: product.emoji, qty });
    this.save();
    showToast('Đã thêm vào giỏ hàng! 🛒');
  },

  remove(id, color) { this.items = this.items.filter(i => !(i.id === id && i.color === color)); this.save(); },

  updateQty(id, color, qty) {
    const idx = this.items.findIndex(i => i.id === id && i.color === color);
    if (idx > -1) { if (qty <= 0) this.remove(id, color); else { this.items[idx].qty = qty; this.save(); } }
  },

  get count() { return this.items.reduce((s, i) => s + i.qty, 0); },

  get subtotal() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },

  get discount() { return this._discount || 0; },

  get shippingFee() { return this.subtotal >= 299000 ? 0 : 30000; },

  get total() { return this.subtotal - this.discount + this.shippingFee; },

  applyCoupon(code) {
    const coupons = { 'BLOOM10': 0.1, 'BLOOM20': 0.2 };
    if (coupons[code]) { this._discount = Math.round(this.subtotal * coupons[code]); return true; }
    return false;
  },

  updateBadge() {
    document.querySelectorAll('.navbar__badge').forEach(el => {
      el.textContent = this.count;
      el.style.display = this.count > 0 ? 'flex' : 'none';
    });
  }
};

// ── HELPERS ───────────────────────────
function formatPrice(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ'; }

function getDiscount(p) {
  if (!p.originalPrice) return 0;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}

function getStatusLabel(s) {
  const m = { done:'Hoàn thành', shipping:'Đang giao', pending:'Chờ xử lý', cancelled:'Đã huỷ', new:'Mới đặt' };
  return m[s] || s;
}

function getStatusClass(s) {
  const m = { done:'s-done', shipping:'s-shipping', pending:'s-pending', cancelled:'s-cancelled', new:'s-new' };
  return m[s] || '';
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--pink-400);color:#fff;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600;z-index:9999;transition:opacity .3s;box-shadow:0 4px 20px rgba(201,94,133,.3)'; document.body.appendChild(t); }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.style.opacity = '0', 2500);
}

function buildNavbar(activePage = '') {
  return `
  <nav class="navbar">
    <div class="navbar__logo" onclick="location.href='index.html'">Blush<span>&</span>Bloom</div>
    <ul class="navbar__links">
      <li><a href="index.html" class="${activePage==='home'?'active':''}">Trang chủ</a></li>
      <li><a href="products.html" class="${activePage==='products'?'active':''}">Son môi</a></li>
      <li><a href="products.html" class="${activePage==='products'?'active':''}">Mắt</a></li>
      <li><a href="products.html" class="${activePage==='products'?'active':''}">Má hồng</a></li>
      <li><a href="products.html" class="${activePage==='products'?'active':''}">Dưỡng da</a></li>
      <li><a href="products.html">Thương hiệu</a></li>
    </ul>
    <div class="navbar__actions">
      <button class="navbar__icon-btn" title="Tìm kiếm">🔍</button>
      <button class="navbar__icon-btn" onclick="location.href='login.html'" title="Tài khoản">👤</button>
      <button class="navbar__icon-btn" onclick="location.href='cart.html'" title="Giỏ hàng" style="position:relative">
        🛒
        <span class="navbar__badge" style="display:${Cart.count>0?'flex':'none'}">${Cart.count}</span>
      </button>
      <button class="btn-register" onclick="location.href='register.html'">Đăng ký</button>
    </div>
  </nav>`;
}

function buildFooter() {
  return `
  <footer class="footer">
    <div class="footer__main">
      <div>
        <div class="footer__logo" onclick="location.href='index.html'">Blush<span>&</span>Bloom</div>
        <p class="footer__desc">Cửa hàng mỹ phẩm cao cấp online hàng đầu Việt Nam. Chuyên son môi & make-up chính hãng từ các thương hiệu nổi tiếng thế giới.</p>
        <div class="footer__socials">
          <div class="footer__social-btn">f</div>
          <div class="footer__social-btn">ig</div>
          <div class="footer__social-btn">tt</div>
          <div class="footer__social-btn">yt</div>
        </div>
      </div>
      <div>
        <div class="footer__col-title">Sản phẩm</div>
        <div class="footer__links">
          <a href="products.html">Son môi</a><a href="products.html">Phấn má</a>
          <a href="products.html">Mắt</a><a href="products.html">Dưỡng da</a><a href="products.html">Gift Set</a>
        </div>
      </div>
      <div>
        <div class="footer__col-title">Hỗ trợ</div>
        <div class="footer__links">
          <a href="#">Hướng dẫn mua hàng</a><a href="#">Chính sách đổi trả</a>
          <a href="#">Vận chuyển</a><a href="#">Tích điểm</a><a href="#">Liên hệ</a>
        </div>
      </div>
      <div>
        <div class="footer__col-title">Công ty</div>
        <div class="footer__links">
          <a href="#">Về chúng tôi</a><a href="#">Blog làm đẹp</a>
          <a href="#">Thương hiệu</a><a href="#">Tuyển dụng</a>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <span class="footer__copy">© 2026 Blush & Bloom. Bảo lưu mọi quyền.</span>
      <span class="footer__contact">Hotline: <strong>1800 1234</strong> · contact@blushbloom.vn</span>
      <div class="footer__payments">
        <span class="footer__pay-badge">VISA</span><span class="footer__pay-badge">Master</span>
        <span class="footer__pay-badge">MoMo</span><span class="footer__pay-badge">ZaloPay</span><span class="footer__pay-badge">COD</span>
      </div>
    </div>
  </footer>`;
}

function buildProductCard(p) {
  const discount = getDiscount(p);
  const badgeHtml = p.badge === 'sale' ? `<span class="product-card__badge badge-sale">-${discount}%</span>` :
                    p.badge === 'new'  ? `<span class="product-card__badge badge-new">Mới</span>` :
                    p.badge === 'hot'  ? `<span class="product-card__badge badge-hot">Hot</span>` : '';
  const colorsHtml = p.colors.slice(0,4).map(c => `<div class="color-dot" style="background:${c.hex}" title="${c.name}"></div>`).join('');
  return `
  <div class="product-card" onclick="location.href='product-detail.html?id=${p.id}'">
    <div class="product-card__img-wrap">
      <div class="product-card__img-placeholder">${p.emoji}</div>
      ${badgeHtml}
      <button class="product-card__wish" onclick="event.stopPropagation()">🤍</button>
    </div>
    <div class="product-card__body">
      <div class="product-card__brand">${p.brand}</div>
      <div class="product-card__name">${p.name}</div>
      <div>
        <span class="product-card__stars">★★★★★</span>
        <span class="product-card__review">(${p.reviewCount})</span>
      </div>
      <div class="product-card__colors">${colorsHtml}</div>
      <div class="product-card__footer">
        <div>
          <span class="price-current">${formatPrice(p.price)}</span>
          ${p.originalPrice ? `<span class="price-old">${formatPrice(p.originalPrice)}</span>` : ''}
        </div>
        <button class="add-btn" onclick="event.stopPropagation(); Cart.add(PRODUCTS.find(x=>x.id===${p.id}), PRODUCTS.find(x=>x.id===${p.id}).colors[0])">+</button>
      </div>
    </div>
  </div>`;
}

function buildAdminSidebar(activePage = '') {
  const items = [
    { label:'Dashboard', icon:'📊', href:'admin-dashboard.html', key:'dashboard' },
    { label:'Đơn hàng',  icon:'📦', href:'admin-orders.html',   key:'orders', badge:'5' },
    { label:'Sản phẩm',  icon:'💄', href:'admin-products.html', key:'products' },
    { label:'Danh mục',  icon:'🗂',  href:'#', key:'categories' },
    { label:'Thương hiệu',icon:'🏷', href:'#', key:'brands' },
    { label:'Mã giảm giá',icon:'🎟', href:'#', key:'coupons' },
    { label:'Khách hàng', icon:'👥', href:'#', key:'customers' },
    { label:'Đánh giá',   icon:'⭐', href:'#', key:'reviews' },
    { label:'Banner',     icon:'🖼',  href:'#', key:'banners' },
    { label:'Báo cáo',    icon:'📈', href:'#', key:'reports' },
    { label:'Cài đặt',    icon:'⚙️', href:'#', key:'settings' },
  ];
  const nav1 = items.slice(0,2).map(i => `<a class="admin-sidebar__item${activePage===i.key?' active':''}" href="${i.href}"><span class="admin-sidebar__ico">${i.icon}</span>${i.label}${i.badge?`<span class="admin-sidebar__badge">${i.badge}</span>`:''}</a>`).join('');
  const nav2 = items.slice(2,7).map(i => `<a class="admin-sidebar__item${activePage===i.key?' active':''}" href="${i.href}"><span class="admin-sidebar__ico">${i.icon}</span>${i.label}</a>`).join('');
  const nav3 = items.slice(7,9).map(i => `<a class="admin-sidebar__item" href="${i.href}"><span class="admin-sidebar__ico">${i.icon}</span>${i.label}</a>`).join('');
  const nav4 = items.slice(9).map(i => `<a class="admin-sidebar__item" href="${i.href}"><span class="admin-sidebar__ico">${i.icon}</span>${i.label}</a>`).join('');
  return `
  <aside class="admin-sidebar">
    <div class="admin-sidebar__top">
      <div class="admin-sidebar__brand">Blush<span>&</span>Bloom</div>
      <div class="admin-sidebar__sub">Admin Dashboard</div>
    </div>
    <div class="admin-sidebar__profile">
      <div class="admin-sidebar__avatar">KB</div>
      <div><div class="admin-sidebar__name">Kiều Biên</div><div class="admin-sidebar__role">Super Admin</div></div>
      <div class="online-dot"></div>
    </div>
    <nav class="admin-sidebar__nav">
      <div class="admin-sidebar__section">Tổng quan</div>${nav1}
      <div class="admin-sidebar__section">Quản lý</div>${nav2}
      <div class="admin-sidebar__section">Nội dung</div>${nav3}
      <div class="admin-sidebar__section">Hệ thống</div>${nav4}
    </nav>
    <div class="admin-sidebar__foot">🚪 Đăng xuất</div>
  </aside>`;
}

// Init cart badge on load
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
