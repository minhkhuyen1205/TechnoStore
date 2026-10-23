/**
 
 * @param {Object} p - Thông tin sản phẩm
 * @param {string} className - Lớp CSS hoặc kiểu chiều cao tùy chọn
 */
function renderDeviceArt(p, customStyle = '') {
  if (!p) return '';
  const a = (p.color && p.color[0]) || '#d9d4cb';
  const b = (p.color && p.color[1]) || '#8c867b';
  const id = `g${p.id || 1}`;
  const tablet = p.category === 'Máy tính bảng';
  const watch = p.category === 'Đồng hồ thông minh';
  const small = p.category === 'Tai nghe' || p.category === 'Phụ kiện';

  let innerSvg = '';

  if (small) {
    innerSvg = `
      <g>
        <rect x="62" y="70" width="76" height="96" rx="30" fill="url(#${id})" />
        <circle cx="100" cy="118" r="18" fill="#fff" opacity="0.55" />
      </g>
    `;
  } else if (watch) {
    innerSvg = `
      <g>
        <rect x="78" y="22" width="44" height="40" rx="8" fill="${b}" />
        <rect x="78" y="178" width="44" height="40" rx="8" fill="${b}" />
        <rect x="54" y="58" width="92" height="124" rx="30" fill="url(#${id})" />
        <rect x="62" y="66" width="76" height="108" rx="24" fill="url(#${id}s)" />
        <text x="100" y="128" text-anchor="middle" fill="#fff" font-size="24" font-weight="600" font-family="Inter, sans-serif">10:09</text>
      </g>
    `;
  } else if (tablet) {
    innerSvg = `
      <g>
        <rect x="22" y="48" width="156" height="136" rx="16" fill="url(#${id})" />
        <rect x="29" y="55" width="142" height="122" rx="10" fill="url(#${id}s)" />
        <circle cx="100" cy="116" r="30" fill="#1a6dff" opacity="0.35" />
      </g>
    `;
  } else {
    // Điện thoại
    innerSvg = `
      <g>
        <rect x="52" y="18" width="96" height="196" rx="20" fill="url(#${id})" />
        <rect x="58" y="24" width="84" height="184" rx="15" fill="url(#${id}s)" />
        <circle cx="100" cy="125" r="34" fill="#1a6dff" opacity="0.35" />
        <circle cx="82" cy="108" r="22" fill="#6ea5ff" opacity="0.25" />
        <rect x="86" y="30" width="28" height="7" rx="3.5" fill="#000" opacity="0.7" />
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 200 240" style="${customStyle}" role="img" aria-label="${p.name}">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${b}" />
        </linearGradient>
        <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0b1220" />
          <stop offset="100%" stop-color="#1a3a7a" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="222" rx="60" ry="7" fill="#0b1220" opacity="0.08" />
      ${innerSvg}
    </svg>
  `;
}

/**
 * Hiển thị phần đầu trang cửa hàng.
 * @param {Object} options - Các tùy chọn { basePath, activePage, query }
 */
function renderStoreHeader(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const basePath = options.basePath || '';
  const iconPath = `${basePath}assets/icon/`;
  const viewPath = options.viewPath || `${basePath}view/`;
  const customerPath = `${viewPath}customer/`;
  const homeUrl = options.isRoot ? 'index.html' : `${basePath}index.html`;

  const user = getCurrentUser();
  const cartCount = getCartCount();
  const q = options.query || '';

  container.innerHTML = `
    <header class="store-header">
      <div class="header-container">
        <!-- Logo cửa hàng -->
        <a href="${homeUrl}" class="brand-logo">
          <img src="${iconPath}dien-thoai.svg" class="icon icon-32" alt="TechnoStore Logo" />
          Techno<span class="brand-accent">Store</span>
        </a>

        <!-- Liên kết điều hướng chính (tự động lọc các danh mục đang hoạt động) -->
        <nav class="store-nav">
          ${(typeof getActiveCategories === 'function' ? getActiveCategories() : ['Điện thoại', 'Máy tính bảng', 'Tai nghe', 'Đồng hồ thông minh', 'Phụ kiện'])
      .slice(0, 4)
      .map(c => `
              <a href="${homeUrl}?cat=${encodeURIComponent(c)}" class="nav-link ${options.activeCategory === c ? 'active' : ''}">${c}</a>
            `).join('')}
          <a href="${user ? customerPath + 'history.html' : customerPath + 'login.html'}" class="nav-link ${options.activePage === 'orders' ? 'active' : ''}">Đơn hàng</a>
        </nav>

        <!-- Thanh tìm kiếm -->
        <div class="header-search">
          <img src="${iconPath}tim-kiem.svg" class="header-search-icon icon icon-16" alt="Tìm kiếm" />
          <form action="${customerPath}search.html" method="GET" onsubmit="handleHeaderSearch(event, '${customerPath}')">
            <input 
              type="text" 
              name="q" 
              id="headerSearchInput" 
              value="${q}" 
              placeholder="Tìm iPhone, Galaxy, AirPods..." 
              class="header-search-input" 
            />
          </form>
        </div>

        <!-- Thao tác tài khoản và giỏ hàng -->
<div class="header-actions">
  <a href="${user ? customerPath + 'profile.html' : customerPath + 'login.html'}" class="user-btn">
    <img src="${iconPath}con-nguoi.svg" class="icon icon-18" alt="Tài khoản" />
    <span>${user ? (user.name || user.fullName || user.username || 'Tài khoản') : 'Đăng nhập'}</span>
  </a>

          <a href="${customerPath}cart.html" class="cart-btn" aria-label="Giỏ hàng">
            <img src="${iconPath}gio-hang.svg" class="icon icon-20" alt="Giỏ hàng" />
            <span class="cart-count-badge" id="headerCartCount" style="${cartCount > 0 ? '' : 'display:none;'}">
              ${cartCount}
            </span>
          </a>
        </div>
      </div>
    </header>
  `;

  // Lắng nghe sự kiện thay đổi giỏ hàng.
  window.addEventListener('cartUpdated', (e) => {
    const badge = document.getElementById('headerCartCount');
    if (badge) {
      const count = e.detail.count;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'grid' : 'none';
    }
  });
}

function handleHeaderSearch(e, searchPath) {
  e.preventDefault();
  const input = document.getElementById('headerSearchInput');
  const val = input ? input.value.trim() : '';
  window.location.href = `${searchPath}search.html?q=${encodeURIComponent(val)}`;
}

/**
 * Hiển thị chân trang cửa hàng.
 * @param {string} containerId - ID của phần tử chứa nội dung
 * @param {Object} options - Các tùy chọn hiển thị
 */
function renderStoreFooter(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const basePath = options.basePath || '';
  const iconPath = `${basePath}assets/icon/`;
  const viewPath = options.viewPath || `${basePath}view/`;
  const adminUrl = `${viewPath}admin.html`;
  const homeUrl = options.isRoot ? 'index.html' : `${basePath}index.html`;

  container.innerHTML = `
    <footer class="store-footer">
      <div class="footer-container">
        <!-- Cột 1: Thông tin thương hiệu -->
        <div>
          <div class="brand-logo">
            <img src="${iconPath}dien-thoai.svg" class="icon icon-32" alt="TechnoStore Logo" />
            Techno<span class="brand-accent">Store</span>
          </div>
          <p class="footer-brand-desc">
            Điện thoại và thiết bị công nghệ chính hãng. Bảo hành 12 tháng, đổi trả trong 30 ngày.
          </p>
        </div>

        <!-- Cột 2: Danh mục sản phẩm -->
        <div>
          <h4 class="footer-col-title">Sản phẩm</h4>
          <ul class="footer-links-list">
            <li><a href="${homeUrl}?cat=Điện thoại" class="footer-link">Điện thoại</a></li>
            <li><a href="${homeUrl}?cat=Máy tính bảng" class="footer-link">Máy tính bảng</a></li>
            <li><a href="${homeUrl}?cat=Tai nghe" class="footer-link">Tai nghe</a></li>
            <li><a href="${homeUrl}?cat=Đồng hồ thông minh" class="footer-link">Đồng hồ thông minh</a></li>
            <li><a href="${homeUrl}?cat=Phụ kiện" class="footer-link">Phụ kiện</a></li>
          </ul>
        </div>

        <!-- Cột 3: Hỗ trợ khách hàng -->
        <div>
          <h4 class="footer-col-title">Hỗ trợ</h4>
          <ul class="footer-links-list">
            <li><a href="#" class="footer-link">Chính sách bảo hành</a></li>
            <li><a href="#" class="footer-link">Chính sách đổi trả</a></li>
            <li><a href="#" class="footer-link">Hướng dẫn mua hàng</a></li>
            <li><a href="#" class="footer-link">Liên hệ</a></li>
          </ul>
        </div>

        <!-- Cột 4: Thông tin cửa hàng -->
        <div>
          <h4 class="footer-col-title">Cửa hàng</h4>
          <ul class="footer-links-list">
            <li class="footer-link">123 Nguyễn Huệ, Quận 1, TP.HCM</li>
            <li class="footer-link">Hotline: 1900 6868</li>
            <li class="footer-link">cskh@technostore.vn</li>
            <li class="footer-link">08:00 – 21:30 hàng ngày</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom-bar">
        © 2026 TechnoStore. Bảo lưu mọi quyền.
      </div>
    </footer>
  `;
}

/**
 * Hiển thị thanh điều hướng nhanh dạng nổi (đã loại bỏ hoàn toàn nút chuyển vai trò [Khách hàng | Quản trị]).
 */
function renderFloatingNav(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Loại bỏ hoàn toàn thanh hoặc nút nổi [Khách hàng | Quản trị] trên toàn bộ website.
  container.innerHTML = '';
  container.style.display = 'none';
}

/**
 * Hàm hỗ trợ hiển thị phân trang.
 */
function renderPagination(currentPage, totalPages, clickCallbackName, iconPath = 'assets/icon/') {
  if (totalPages <= 1) return '';
  let html = `<nav class="pagination" aria-label="Phân trang">`;

  // Nút chuyển về trang trước.
  html += `
    <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="${clickCallbackName}(${currentPage - 1})" aria-label="Trang trước">
      <img src="${iconPath}chevron-left.svg" class="icon icon-16" alt="Trang trước" />
    </button>
  `;

  // Các nút số trang.
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="${clickCallbackName}(${i})">
        ${i}
      </button>
    `;
  }

  // Nút chuyển sang trang tiếp theo.
  html += `
    <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="${clickCallbackName}(${currentPage + 1})" aria-label="Trang sau">
      <img src="${iconPath}chevron-right.svg" class="icon icon-16" alt="Trang sau" />
    </button>
  `;

  html += `</nav>`;
  return html;
}

/**
 * Tự động hiển thị danh sách ô chọn hãng sản xuất.
 * Lấy toàn bộ thương hiệu từ defaultBrands hoặc danh sách sản phẩm hiện có trong kho.
 * @param {string} containerId - ID phần tử chứa ô chọn hãng (mặc định là 'brandCheckboxList')
 */
function renderBrandCheckboxes(containerId = 'brandCheckboxList') {
  const container = document.getElementById(containerId) || document.querySelector('.brand-checkbox-list');
  if (!container) return;

  // Lấy danh sách thương hiệu từ defaultBrands hoặc quét danh sách sản phẩm hiện có.
  let brands = (typeof defaultBrands !== 'undefined' && Array.isArray(defaultBrands))
    ? [...defaultBrands]
    : [];

  if (typeof getProducts === 'function') {
    const activeProds = getProducts().filter(p => !p.isDeleted);
    const prodBrands = Array.from(new Set(activeProds.map(p => p.brand).filter(Boolean)));
    prodBrands.forEach(b => {
      if (!brands.includes(b)) brands.push(b);
    });
  }

  // Hiển thị danh sách ô chọn hãng sản xuất.
  container.innerHTML = brands.map(brand => `
    <label class="checkbox-label">
      <input type="checkbox" class="brand-filter-cb" value="${brand}" /> ${brand}
    </label>
  `).join('');
}
window.renderBrandCheckboxes = renderBrandCheckboxes;

/* Cách sử dụng: showCustomDialog(message, title, type, onConfirm, options)
   - message: Nội dung thông báo / câu hỏi xác nhận
   - title: Tiêu đề hộp thoại (mặc định 'Thông báo')
   - type: 'info' | 'success' | 'warning' | 'error' (loại thông báo)
   - onConfirm: Hàm gọi lại khi người dùng bấm [Xác nhận] / [Đồng ý]. Nếu truyền hàm này, hộp thoại hiển thị hai nút [Huỷ bỏ] và [Xác nhận] (thay cho window.confirm).
   - options: { confirmText, cancelText, onCancel }
*/
window.showCustomDialog = function (message, title = 'Thông báo', type = 'warning', onConfirm = null, options = {}) {
  // Xóa hộp thoại cũ nếu đang mở.
  const existing = document.getElementById('customSystemDialog');
  if (existing) existing.remove();

  // Cho phép truyền hàm gọi lại linh hoạt ở tham số thứ ba hoặc thứ tư.
  if (typeof type === 'function') {
    onConfirm = type;
    type = 'warning';
  }

  // Biểu tượng tương ứng với loại trạng thái.
  const iconMap = {
    info: { symbol: 'ℹ', bg: '#e0f2fe', color: '#0369a1' },
    success: { symbol: '✓', bg: '#dcfce7', color: '#15803d' },
    warning: { symbol: '⚠', bg: '#fef9c3', color: '#a16207' },
    error: { symbol: '✕', bg: '#fee2e2', color: '#dc2626' }
  };
  const icon = iconMap[type] || iconMap.warning;

  const isConfirmDialog = typeof onConfirm === 'function';
  const confirmText = options.confirmText || (isConfirmDialog ? 'Xác nhận' : 'Đồng ý');
  const cancelText = options.cancelText || 'Huỷ bỏ';

  const overlay = document.createElement('div');
  overlay.id = 'customSystemDialog';
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:9999; display:grid; place-items:center; animation: fadeIn 0.18s ease;';

  const confirmBtnBg = (type === 'error' || type === 'danger') ? '#dc2626' : 'var(--color-brand-700, #4f46e5)';

  overlay.innerHTML = `
    <div style="
      background: var(--color-card, #fff);
      border-radius: var(--radius-xl, 16px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
      max-width: 440px;
      width: 90%;
      padding: 32px 28px 24px;
      text-align: center;
      animation: popIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    ">
      <div style="
        width: 52px; height: 52px; border-radius: 50%;
        background: ${icon.bg}; color: ${icon.color};
        display: grid; place-items: center;
        font-size: 24px; font-weight: 700;
        margin: 0 auto 16px;
      ">${icon.symbol}</div>

      <h3 style="
        margin: 0 0 8px; font-size: 18px; font-weight: 700;
        color: var(--color-ink, #111);
      ">${title}</h3>

      <div style="
        margin: 0 0 24px; font-size: 14px; line-height: 1.6;
        color: var(--color-ink-2, #555);
      ">${message}</div>

      ${isConfirmDialog ? `
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button id="customDialogCancelBtn" style="
            display: inline-flex; align-items: center; justify-content: center;
            min-width: 110px; height: 42px; padding: 0 20px;
            background: #f1f5f9; color: var(--color-ink-2, #475569);
            border: 1px solid var(--color-line, #cbd5e1); border-radius: var(--radius-md, 10px);
            font-size: 14px; font-weight: 600; cursor: pointer;
            transition: background 0.2s;
          " onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
            ${cancelText}
          </button>
          <button id="customDialogConfirmBtn" style="
            display: inline-flex; align-items: center; justify-content: center;
            min-width: 110px; height: 42px; padding: 0 20px;
            background: ${confirmBtnBg}; color: #fff;
            border: none; border-radius: var(--radius-md, 10px);
            font-size: 14px; font-weight: 600; cursor: pointer;
            transition: opacity 0.2s;
          " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
            ${confirmText}
          </button>
        </div>
      ` : `
        <button id="customDialogOkBtn" style="
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 120px; height: 42px; padding: 0 24px;
          background: var(--color-brand-700, #4f46e5); color: #fff;
          border: none; border-radius: var(--radius-md, 10px);
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
          Đồng ý
        </button>
      `}
    </div>
  `;

  const closeDialog = () => {
    overlay.remove();
    document.removeEventListener('keydown', escHandler);
  };

  if (isConfirmDialog) {
    const confirmBtn = overlay.querySelector('#customDialogConfirmBtn');
    const cancelBtn = overlay.querySelector('#customDialogCancelBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        closeDialog();
        onConfirm();
      });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        closeDialog();
        if (typeof options.onCancel === 'function') options.onCancel();
      });
    }
  } else {
    const okBtn = overlay.querySelector('#customDialogOkBtn');
    if (okBtn) {
      okBtn.addEventListener('click', closeDialog);
    }
  }

  // Bấm vào vùng phủ bên ngoài hộp thoại cũng sẽ đóng hộp thoại.
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      closeDialog();
      if (isConfirmDialog && typeof options.onCancel === 'function') options.onCancel();
    }
  });

  // Nhấn phím Escape cũng sẽ đóng hộp thoại.
  const escHandler = function (e) {
    if (e.key === 'Escape') {
      closeDialog();
      if (isConfirmDialog && typeof options.onCancel === 'function') options.onCancel();
    }
  };
  document.addEventListener('keydown', escHandler);

  document.body.appendChild(overlay);
};
