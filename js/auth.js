/* ==========================================================================
   Customer Authentication & Profile Controller
   TechnoStore - Pure JavaScript
   ========================================================================== */

/**
 * Initialize Login & Register Page
 */
function initAuthPage(options = {}) {
  const container = document.getElementById('authPageContent');
  if (!container) return;

  const basePath = options.basePath || '';
  const customerPath = `${basePath}view/customer/`;
  const homeUrl = options.isRoot ? 'index.html' : `${basePath}index.html`;

  let mode = options.defaultMode || 'login'; // 'login' or 'register'
  const allProds = typeof getProducts === 'function' ? getProducts() : [];
  const heroProd = allProds[0] || null;

  function render() {
    const isLogin = mode === 'login';

    container.innerHTML = `
      <div class="auth-page-container">
        <!-- Left Showcase Side -->
        <div class="auth-showcase-side">
          <div class="auth-showcase-inner">
            <div class="auth-showcase-art">
              ${heroProd ? renderDeviceArt(heroProd, 'height:320px; width:auto;') : ''}
            </div>
            <h2 class="auth-showcase-title">
              Mua sắm công nghệ<br />theo cách của bạn.
            </h2>
            <p class="auth-showcase-subtitle">
              Ưu đãi riêng cho thành viên TechnoStore.
            </p>
          </div>
        </div>

        <!-- Right Form Side -->
        <div class="auth-form-side">
          <form class="auth-form-box" onsubmit="handleAuthSubmit(event)">
            <div>
              <h1 class="auth-title">${isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản'}</h1>
              <p class="auth-subtitle">
                ${isLogin ? 'Đăng nhập để tiếp tục mua sắm.' : 'Chỉ mất chưa đến một phút.'}
              </p>
            </div>

            ${!isLogin ? `
              <div class="form-field" style="margin:0;">
                <label class="form-label">Họ và tên *</label>
                <input type="text" id="authNameInput" class="input-control" placeholder="Nguyễn Minh Anh" required />
              </div>
              <div class="form-field" style="margin:0;">
                <label class="form-label">Số điện thoại *</label>
                <input type="tel" id="authPhoneInput" class="input-control" placeholder="0901234567 (10 chữ số)" required pattern="0[0-9]{9}" />
              </div>
              <div class="form-field" style="margin:0;">
                <label class="form-label">Email *</label>
                <input type="email" id="authEmailInput" class="input-control" placeholder="email@vidu.com" required />
              </div>
            ` : `
              <!-- BỎ TỰ ĐỘNG ĐIỀN ĐĂNG NHẬP: Để trống hoàn toàn ô input để người dùng tự nhập -->
              <div class="form-field" style="margin:0;">
                <label class="form-label">Email hoặc số điện thoại</label>
                <input 
                  type="text" 
                  id="authIdentifierInput"
                  class="input-control" 
                  value="" 
                  placeholder="Nhập email hoặc số điện thoại" 
                  required 
                  autocomplete="username"
                />
              </div>
            `}

            <div class="form-field" style="margin:0;">
              <label class="form-label">Mật khẩu *</label>
              <input 
                type="password" 
                id="authPasswordInput"
                class="input-control" 
                value="" 
                placeholder="${isLogin ? 'Nhập mật khẩu' : 'Tối thiểu 6 ký tự'}" 
                required 
                ${!isLogin ? 'minlength="6"' : ''}
                autocomplete="${isLogin ? 'current-password' : 'new-password'}"
              />
            </div>

            ${!isLogin ? `
              <div class="form-field" style="margin:0;">
                <label class="form-label">Nhập lại mật khẩu *</label>
                <input type="password" id="authRePasswordInput" class="input-control" placeholder="Nhập lại mật khẩu" required minlength="6" autocomplete="new-password" />
              </div>
            ` : ''}

            ${isLogin ? `
              <div class="auth-row-options">
                <label class="checkbox-label">
                  <input type="checkbox" checked />
                  Ghi nhớ đăng nhập
                </label>
                <button type="button" class="auth-forgot-link" onclick="showCustomDialog('Vui lòng kiểm tra email hướng dẫn đặt lại mật khẩu từ hệ thống.', 'Quên mật khẩu', 'info')">
                  Quên mật khẩu?
                </button>
              </div>
            ` : `
              <label class="checkbox-label">
                <input type="checkbox" required checked />
                Tôi đồng ý với điều khoản sử dụng
              </label>
            `}

            <button type="submit" class="btn btn-primary btn-lg btn-full">
              ${isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </button>

            <p class="auth-switch-text">
              ${isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button type="button" class="auth-toggle-btn" onclick="toggleAuthMode()">
                ${isLogin ? 'Đăng ký' : 'Đăng nhập'}
              </button>
            </p>
          </form>
        </div>
      </div>
    `;
  }

  window.toggleAuthMode = () => {
    mode = mode === 'login' ? 'register' : 'login';
    render();
  };

  /**
   * XỬ LÝ ĐĂNG NHẬP & ĐĂNG KÝ THỰC TẾ TỪ CƠ SỞ DỮ LIỆU
   * Sử dụng showCustomDialog thay thế toàn bộ alert mặc định
   */
  window.handleAuthSubmit = (e) => {
    e.preventDefault();

    if (mode === 'login') {
      const idInput = document.getElementById('authIdentifierInput');
      const passInput = document.getElementById('authPasswordInput');
      const identifier = (idInput ? idInput.value : '').trim();
      const password = (passInput ? passInput.value : '').trim();

      if (!identifier || !password) {
        showCustomDialog('Vui lòng nhập đầy đủ thông tin tài khoản và mật khẩu!', 'Thông báo', 'warning');
        return;
      }

      // Kiểm tra tài khoản quản trị trước khi đối chiếu thông tin khách hàng.
      const normalizedIdentifier = identifier.toLowerCase();
      const isAdminIdentifier = normalizedIdentifier === 'admin' || normalizedIdentifier === 'admin@technostore.vn';
      const isAdminPassword = password === 'admin123' || password === '123';
      if (isAdminIdentifier && isAdminPassword) {
        setAdminUser(true);
        showCustomDialog('Đăng nhập Quản trị viên thành công!', 'Thành công', 'success');
        setTimeout(() => {
          window.location.href = `${basePath}view/admin.html`;
        }, 1200);
        return;
      }

      const customers = typeof getCustomers === 'function' ? getCustomers() : [];
      const cleanId = identifier.replace(/\D/g, '');
      const user = customers.find(c => {
        const emailMatch = c.email && c.email.toLowerCase() === identifier.toLowerCase();
        const phoneMatch = c.phone && c.phone.replace(/\D/g, '') === cleanId;
        return emailMatch || phoneMatch;
      });

      const isPassValid = user && (user.password ? user.password === password : (password === 'password123' || password === '123456'));

      if (!user || !isPassValid) {
        showCustomDialog('Email hoặc mật khẩu không chính xác!', 'Đăng nhập thất bại', 'error');
        return;
      }

      if (user.locked) {
        showCustomDialog('Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ quản trị viên!', 'Tài khoản bị khóa', 'error');
        return;
      }

      setCurrentUser(user);

      // Kiểm tra tham số chuyển hướng sau khi đăng nhập (ví dụ: quay lại giỏ hàng/thanh toán)
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');
      const targetUrl = redirectUrl
        ? (redirectUrl.startsWith('http') || redirectUrl.startsWith('/') ? redirectUrl : `${customerPath}${redirectUrl}`)
        : homeUrl;

      showCustomDialog(`Đăng nhập thành công! Chào mừng <b>${user.name}</b> quay trở lại.`, 'Thành công', 'success', () => {
        window.location.href = targetUrl;
      });
    } else {
      // Đăng ký tài khoản khách hàng mới
      const name = (document.getElementById('authNameInput')?.value || '').trim();
      const phone = (document.getElementById('authPhoneInput')?.value || '').trim();
      const email = (document.getElementById('authEmailInput')?.value || '').trim();
      const password = (document.getElementById('authPasswordInput')?.value || '').trim();
      const rePassword = (document.getElementById('authRePasswordInput')?.value || '').trim();

      if (!name || !phone || !email || !password || !rePassword) {
        showCustomDialog('Vui lòng điền đầy đủ tất cả các trường thông tin!', 'Thiếu thông tin', 'warning');
        return;
      }

      // Kiểm tra định dạng số điện thoại 10 chữ số
      const phoneRegex = /^0\d{9}$/;
      const cleanPhone = phone.replace(/\s+/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        showCustomDialog('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số (bắt đầu bằng số 0).', 'Lỗi số điện thoại', 'warning');
        return;
      }

      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showCustomDialog('Địa chỉ email không đúng định dạng!', 'Lỗi email', 'warning');
        return;
      }

      if (password.length < 6) {
        showCustomDialog('Mật khẩu phải có tối thiểu 6 ký tự!', 'Mật khẩu yếu', 'warning');
        return;
      }

      if (password !== rePassword) {
        showCustomDialog('Mật khẩu nhập lại không khớp!', 'Lỗi nhập liệu', 'warning');
        return;
      }

      const customers = typeof getCustomers === 'function' ? getCustomers() : [];
      const exists = customers.some(c =>
        (c.email && c.email.toLowerCase() === email.toLowerCase()) ||
        (c.phone && c.phone.replace(/\D/g, '') === cleanPhone)
      );

      if (exists) {
        showCustomDialog('Email hoặc số điện thoại này đã được đăng ký tài khoản trong hệ thống!', 'Đã tồn tại', 'warning');
        return;
      }

      // Format ngày tham gia chuẩn DD/MM/YYYY
      const now = new Date();
      const d = String(now.getDate()).padStart(2, '0');
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const y = now.getFullYear();
      const joinedFormatted = `${d}/${m}/${y}`;

      const newCustomer = {
        id: 'KH' + String(customers.length + 1).padStart(3, '0'),
        name: name,
        email: email,
        phone: cleanPhone,
        password: password,
        joined: joinedFormatted,
        orders: 0,
        locked: false,
        addresses: [] // Khởi tạo mảng địa chỉ rỗng cho tài khoản mới theo yêu cầu
      };

      customers.push(newCustomer);
      saveCustomers(customers);
      setCurrentUser(newCustomer);

      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');
      const targetUrl = redirectUrl
        ? (redirectUrl.startsWith('http') || redirectUrl.startsWith('/') ? redirectUrl : `${customerPath}${redirectUrl}`)
        : homeUrl;

      showCustomDialog(`Chúc mừng <b>${newCustomer.name}</b> đã đăng ký tài khoản thành công!`, 'Đăng ký thành công', 'success', () => {
        window.location.href = targetUrl;
      });
    }
  };

  render();
}

/**
 * Initialize Profile Page & Address Management
 */
function initProfilePage(options = {}) {
  const container = document.getElementById('profilePageContent');
  if (!container) return;

  const basePath = options.basePath || '';
  const customerPath = `${basePath}view/customer/`;
  const homeUrl = options.isRoot ? 'index.html' : `${basePath}index.html`;

  // Kiểm tra đăng nhập
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (!currentUser) {
    window.location.href = `${customerPath}login.html?redirect=profile.html`;
    return;
  }

  // Lấy tab từ URL query param nếu có
  const urlParams = new URLSearchParams(window.location.search);
  let activeTab = urlParams.get('tab') || options.defaultTab || 'orders'; // 'orders', 'info', 'addr'
  // Hỗ trợ mở trực tiếp một đơn vừa đặt từ trang thanh toán.
  const focusedOrderId = urlParams.get('orderId');

  function render() {
    // Luôn lấy dữ liệu mới nhất từ LocalStorage của user hiện tại
    const customers = typeof getCustomers === 'function' ? getCustomers() : [];
    let user = customers.find(c =>
      (currentUser.id && c.id === currentUser.id) ||
      (currentUser.email && c.email === currentUser.email) ||
      (currentUser.phone && c.phone === currentUser.phone)
    ) || currentUser;

    const allProducts = typeof getProducts === 'function' ? getProducts() : [];
    const allOrders = typeof getOrders === 'function' ? getOrders() : [];

    // PHÂN QUYỀN LỊCH SỬ ĐƠN HÀNG: Chỉ lọc các đơn hàng của RIÊNG tài khoản đang đăng nhập
    const userOrders = allOrders.filter(o => {
      if (user.id && o.customerId && String(user.id) === String(o.customerId)) return true;

      const uEmail = (user.email || '').trim().toLowerCase();
      const uPhone = (user.phone || '').replace(/\D/g, '');

      const oEmail = (o.customerEmail || '').trim().toLowerCase();
      const oPhone = (o.phone || '').replace(/\D/g, '');

      if (uEmail && oEmail && uEmail === oEmail) return true;
      if (uPhone && oPhone && uPhone === oPhone) return true;
      return false;
    });

    // Orders tab HTML
    let ordersHtml = '';
    const displayedOrders = focusedOrderId
      ? userOrders.filter(order => String(order.id) === focusedOrderId)
      : userOrders;

    if (displayedOrders.length === 0) {
      ordersHtml = `
        <div class="empty-state-box" style="padding: 48px 20px; text-align: center;">
          <p style="color: var(--color-ink-3); font-size: 15px;">${focusedOrderId ? 'Không tìm thấy đơn hàng vừa đặt trong tài khoản này.' : 'Bạn chưa có đơn hàng nào.'}</p>
          <a href="${homeUrl}" class="btn btn-primary btn-sm" style="margin-top: 12px;">Khám phá sản phẩm ngay</a>
        </div>
      `;
    } else {
      ordersHtml = `${focusedOrderId ? `
        <div style="margin-bottom: 16px;">
          <a href="profile.html?tab=orders" class="btn btn-secondary btn-sm">Xem tất cả lịch sử đơn hàng</a>
        </div>
      ` : ''}${displayedOrders.map(o => {
        const tone = typeof getStatusTone === 'function' ? getStatusTone(o.status) : 'neutral';

        const itemsHtml = (o.items || []).map(it => {
          let p = null;
          let sku = '';
          let name = 'Sản phẩm';
          let price = 0;
          let qty = 1;

          if (Array.isArray(it)) {
            const [id, q] = it;
            p = allProducts.find(x => x.id === id);
            name = p ? p.name : 'Sản phẩm';
            price = p ? (p.basePrice || p.price) : 0;
            qty = q;
            sku = (p && p.variants && p.variants[0]) ? p.variants[0].sku : `SP00${id}-STD`;
          } else {
            sku = it.sku || '';
            const found = typeof findVariantBySku === 'function' ? findVariantBySku(sku) : null;
            p = found ? found.product : allProducts.find(x => x.id === it.productId);
            name = it.name || (p ? p.name : 'Sản phẩm');
            price = it.price || (found ? found.variant.price : (p ? p.basePrice || p.price : 0));
            qty = it.qty || 1;
          }

          const imgHtml = (p && p.image)
            ? `<img src="${p.image}" style="max-height: 48px; max-width: 100%; object-fit: contain;" alt="" />`
            : (p && typeof renderDeviceArt === 'function' ? renderDeviceArt(p, 'height:48px; width:auto;') : '📦');

          return `
            <div class="order-item-mini-row">
              <div class="order-item-mini-thumb" style="display: grid; place-items: center; overflow: hidden;">
                ${imgHtml}
              </div>
              <div style="flex: 1;">
                <div class="order-item-mini-name">${name}</div>
                <div class="order-item-mini-qty">
                  ${sku ? `<span style="font-family: var(--font-mono); font-size: 11px; color: var(--color-brand-700);">${sku}</span> · ` : ''}Số lượng: x${qty} · Đơn giá: ${vnd(price)}
                </div>
              </div>
              <div style="font-weight: 600; font-size: 14px; color: var(--color-ink);">${vnd(price * qty)}</div>
            </div>
          `;
        }).join('');

        return `
          <div class="order-history-card">
            <div class="order-card-header">
              <div>
                <span class="order-card-id">#${o.id}</span>
                <span class="order-card-meta">${o.date} · ${o.pay || 'Tiền mặt'}</span>
              </div>
              <span class="badge badge-${tone}">${o.status}</span>
            </div>

            <div class="order-card-items-list">
              ${itemsHtml}
            </div>

            <div class="order-card-footer">
              <span style="font-size: 14px; color: var(--color-ink-3);">Tổng tiền thanh toán</span>
              <span class="order-total-price">${vnd(o.total)}</span>
            </div>
            ${o.status === 'Mới đặt' ? `
              <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
                <button type="button" class="btn btn-ghost btn-sm" style="color: #dc2626;" onclick="handleCustomerCancelOrder('${o.id}')">Hủy đơn</button>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}`;
    }

    // Addresses list HTML
    const addresses = Array.isArray(user.addresses) ? user.addresses : [];
    let addressHtml = '';
    if (addresses.length === 0) {
      addressHtml = `
        <div class="empty-state-box" style="padding: 40px 20px; text-align: center; grid-column: 1 / -1;">
          <p style="color: var(--color-ink-3); margin-bottom: 12px;">Bạn chưa có địa chỉ nhận hàng nào trong sổ địa chỉ.</p>
        </div>
      `;
    } else {
      addressHtml = addresses.map(addr => `
        <div class="address-item-card" style="position: relative; border: 1px solid var(--color-line, #e2e8f0); border-radius: 12px; padding: 20px;">
          <div class="address-item-title-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <b style="font-size: 15px; color: var(--color-ink);">${addr.label || 'Địa chỉ'}</b>
              ${addr.isDefault ? '<span class="badge badge-success">Mặc định</span>' : ''}
            </div>
            <div style="display: flex; gap: 6px;">
              ${!addr.isDefault ? `
                <button type="button" class="btn btn-ghost btn-sm" onclick="handleSetDefaultAddress('${addr.id}')" title="Đặt làm địa chỉ giao hàng mặc định">
                  Đặt mặc định
                </button>
              ` : ''}
              <button type="button" class="btn btn-secondary btn-sm" onclick="openAddressEditModal('${addr.id}')">
                Sửa
              </button>
              <button type="button" class="btn btn-ghost btn-sm" style="color: #dc2626;" onclick="handleDeleteAddress('${addr.id}')">
                Xoá
              </button>
            </div>
          </div>
          <div style="font-size: 13.5px; color: var(--color-ink-2); margin-bottom: 4px;">
            <b>${addr.receiverName || user.name}</b> · ${addr.receiverPhone || user.phone}
          </div>
          <p class="address-item-text" style="font-size: 13.5px; color: var(--color-ink-3); margin: 0; line-height: 1.5;">
            ${addr.detail}
          </p>
        </div>
      `).join('');
    }

    const initials = (user.name || 'User')
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map(w => w[0].toUpperCase())
      .join('') || 'KH';

    container.innerHTML = `
      <div class="profile-container">
        <!-- Profile Header -->
        <div class="profile-header-card">
          <div class="profile-avatar-circle">${initials}</div>
          <div>
            <h1 class="profile-user-name">${user.name}</h1>
            <p class="profile-user-meta">${user.email || user.phone} · Thành viên từ ${user.joined || '2026'}</p>
          </div>
          <button onclick="handleUserLogout()" class="btn btn-secondary btn-md" style="margin-left: auto;">
            Đăng xuất
          </button>
        </div>

        <!-- Tabs & Body Grid -->
        <div class="profile-main-grid">
          <nav class="profile-nav-tabs">
            <button class="profile-tab-btn ${activeTab === 'orders' ? 'active' : ''}" onclick="switchProfileTab('orders')">
              Lịch sử đơn hàng (${userOrders.length})
            </button>
            <button class="profile-tab-btn ${activeTab === 'info' ? 'active' : ''}" onclick="switchProfileTab('info')">
              Thông tin cá nhân
            </button>
            <button class="profile-tab-btn ${activeTab === 'addr' ? 'active' : ''}" onclick="switchProfileTab('addr')">
              Sổ địa chỉ (${addresses.length})
            </button>
          </nav>

          <div>
            <!-- Tab 1: Orders -->
            ${activeTab === 'orders' ? `
              <div class="orders-list-wrap">
                ${ordersHtml}
              </div>
            ` : ''}

            <!-- Tab 2: Personal Info -->
            ${activeTab === 'info' ? `
              <form class="info-form-box" onsubmit="handleSaveInfo(event)">
                <div class="form-field" style="margin:0;">
                  <label class="form-label">Họ và tên *</label>
                  <input type="text" id="profNameInput" class="input-control" value="${user.name || ''}" required />
                </div>
                <div class="form-field" style="margin:0;">
                  <label class="form-label">Số điện thoại *</label>
                  <input type="tel" id="profPhoneInput" class="input-control" value="${user.phone || ''}" required pattern="0[0-9]{9}" />
                </div>
                <div class="form-field info-full-col" style="margin:0;">
                  <label class="form-label">Email</label>
                  <input type="email" class="input-control" value="${user.email || ''}" disabled title="Email không thể thay đổi trực tiếp" />
                </div>
                <div class="info-full-col" style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;">
                  <button type="button" onclick="switchProfileTab('orders')" class="btn btn-secondary btn-md">Huỷ</button>
                  <button type="submit" class="btn btn-primary btn-md">Lưu thay đổi</button>
                </div>
              </form>
            ` : ''}

            <!-- Tab 3: Address Book -->
            ${activeTab === 'addr' ? `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="font-size: 18px; font-weight: 700; color: var(--color-ink); margin: 0;">Danh sách địa chỉ nhận hàng</h3>
                <button type="button" class="btn btn-primary btn-sm" onclick="openAddressEditModal(null)">
                  + Thêm địa chỉ mới
                </button>
              </div>
              <div class="addresses-grid" style="display: grid; gap: 16px;">
                ${addressHtml}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  window.switchProfileTab = (tab) => {
    activeTab = tab;
    render();
  };

  window.handleUserLogout = () => {
    logoutUser();
    window.location.href = homeUrl;
  };

  window.handleSaveInfo = (e) => {
    e.preventDefault();
    const newName = (document.getElementById('profNameInput')?.value || '').trim();
    const newPhone = (document.getElementById('profPhoneInput')?.value || '').trim();

    if (!newName) {
      showCustomDialog('Vui lòng nhập họ và tên!', 'Thiếu thông tin', 'warning');
      return;
    }

    const cleanPhone = newPhone.replace(/\s+/g, '');
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      showCustomDialog('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số.', 'Lỗi số điện thoại', 'warning');
      return;
    }

    const customers = getCustomers();
    const idx = customers.findIndex(c =>
      (currentUser.id && c.id === currentUser.id) ||
      (currentUser.email && c.email === currentUser.email)
    );

    if (idx !== -1) {
      customers[idx].name = newName;
      customers[idx].phone = cleanPhone;
      saveCustomers(customers);
      setCurrentUser(customers[idx]);
    }

    showCustomDialog('Đã lưu thông tin thay đổi thành công!', 'Thành công', 'success');
    render();
  };

  // Mở modal Thêm / Sửa địa chỉ trong Hồ sơ
  window.openAddressEditModal = (addrId = null) => {
    const existing = document.getElementById('addressEditModal');
    if (existing) existing.remove();

    const customers = getCustomers();
    const user = customers.find(c =>
      (currentUser.id && c.id === currentUser.id) ||
      (currentUser.email && c.email === currentUser.email)
    ) || currentUser;

    const addresses = Array.isArray(user.addresses) ? user.addresses : [];
    const addr = addrId ? addresses.find(a => a.id === addrId) : null;
    const isEdit = Boolean(addr);

    const modal = document.createElement('div');
    modal.id = 'addressEditModal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:9999; display:grid; place-items:center; animation:fadeIn 0.2s ease;';

    modal.innerHTML = `
      <div style="background:#fff; border-radius:16px; width:90%; max-width:480px; padding:28px 24px; box-shadow:0 20px 60px rgba(0,0,0,0.25); animation:popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);">
        <h3 style="margin:0 0 16px; font-size:18px; font-weight:700; color:#111;">
          ${isEdit ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ nhận hàng mới'}
        </h3>
        <form onsubmit="handleSaveAddressModal(event, '${addrId || ''}')">
          <div class="form-field" style="margin-bottom:12px;">
            <label class="form-label">Loại địa chỉ</label>
            <select id="addrLabelInput" class="input-control">
              <option value="Nhà riêng" ${addr && addr.label === 'Nhà riêng' ? 'selected' : ''}>Nhà riêng</option>
              <option value="Công ty / Văn phòng" ${addr && addr.label.includes('Công ty') ? 'selected' : ''}>Công ty / Văn phòng</option>
              <option value="Khác" ${addr && addr.label === 'Khác' ? 'selected' : ''}>Khác</option>
            </select>
          </div>
          <div class="form-field" style="margin-bottom:12px;">
            <label class="form-label">Họ và tên người nhận *</label>
            <input type="text" id="addrReceiverNameInput" class="input-control" value="${addr ? addr.receiverName : user.name}" required />
          </div>
          <div class="form-field" style="margin-bottom:12px;">
            <label class="form-label">Số điện thoại nhận hàng *</label>
            <input type="tel" id="addrReceiverPhoneInput" class="input-control" value="${addr ? addr.receiverPhone : user.phone}" required pattern="0[0-9]{9}" />
          </div>
          <div class="form-field" style="margin-bottom:16px;">
            <label class="form-label">Địa chỉ chi tiết (Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP) *</label>
            <textarea id="addrDetailInput" class="input-control" rows="3" placeholder="Ví dụ: 45 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM" required style="resize:vertical;">${addr ? addr.detail : ''}</textarea>
          </div>
          <div style="margin-bottom:20px;">
            <label class="checkbox-label" style="font-size:13.5px; cursor:pointer;">
              <input type="checkbox" id="addrIsDefaultInput" ${addr && addr.isDefault ? 'checked' : (addresses.length === 0 ? 'checked' : '')} />
              Đặt làm địa chỉ nhận hàng mặc định
            </label>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn btn-secondary btn-md" onclick="document.getElementById('addressEditModal').remove()">Huỷ</button>
            <button type="submit" class="btn btn-primary btn-md">Lưu địa chỉ</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
  };

  window.handleSaveAddressModal = (e, addrId) => {
    e.preventDefault();
    const label = document.getElementById('addrLabelInput')?.value || 'Nhà riêng';
    const receiverName = (document.getElementById('addrReceiverNameInput')?.value || '').trim();
    const receiverPhone = (document.getElementById('addrReceiverPhoneInput')?.value || '').trim().replace(/\s+/g, '');
    const detail = (document.getElementById('addrDetailInput')?.value || '').trim();
    const isDefault = Boolean(document.getElementById('addrIsDefaultInput')?.checked);

    if (!receiverName || !receiverPhone || !detail) {
      showCustomDialog('Vui lòng điền đầy đủ thông tin địa chỉ!', 'Thiếu thông tin', 'warning');
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(receiverPhone)) {
      showCustomDialog('Số điện thoại nhận hàng không hợp lệ (cần 10 chữ số bắt đầu bằng 0)!', 'Lỗi số điện thoại', 'warning');
      return;
    }

    const customers = getCustomers();
    const idx = customers.findIndex(c =>
      (currentUser.id && c.id === currentUser.id) ||
      (currentUser.email && c.email === currentUser.email)
    );
    if (idx === -1) return;

    if (!Array.isArray(customers[idx].addresses)) {
      customers[idx].addresses = [];
    }

    const addrs = customers[idx].addresses;

    if (isDefault) {
      addrs.forEach(a => a.isDefault = false);
    }

    if (addrId) {
      // Chỉnh sửa
      const item = addrs.find(a => a.id === addrId);
      if (item) {
        item.label = label;
        item.receiverName = receiverName;
        item.receiverPhone = receiverPhone;
        item.detail = detail;
        item.isDefault = isDefault || addrs.length === 1;
      }
    } else {
      // Thêm mới
      const newAddr = {
        id: 'addr_' + Date.now(),
        label: label,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        detail: detail,
        isDefault: isDefault || addrs.length === 0
      };
      addrs.push(newAddr);
    }

    saveCustomers(customers);
    setCurrentUser(customers[idx]);

    const modal = document.getElementById('addressEditModal');
    if (modal) modal.remove();

    showCustomDialog('Đã lưu thông tin địa chỉ thành công!', 'Thành công', 'success');
    render();
  };

  window.handleDeleteAddress = (addrId) => {
    showCustomDialog('Bạn có chắc chắn muốn xoá địa chỉ này khỏi sổ địa chỉ không?', 'Xoá địa chỉ', 'warning', () => {
      const customers = getCustomers();
      const idx = customers.findIndex(c =>
        (currentUser.id && c.id === currentUser.id) ||
        (currentUser.email && c.email === currentUser.email)
      );
      if (idx !== -1 && Array.isArray(customers[idx].addresses)) {
        customers[idx].addresses = customers[idx].addresses.filter(a => a.id !== addrId);
        // Nếu địa chỉ bị xoá là mặc định, chọn địa chỉ đầu tiên còn lại làm mặc định
        if (customers[idx].addresses.length > 0 && !customers[idx].addresses.some(a => a.isDefault)) {
          customers[idx].addresses[0].isDefault = true;
        }
        saveCustomers(customers);
        setCurrentUser(customers[idx]);
        showCustomDialog('Đã xoá địa chỉ thành công!', 'Thông báo', 'info');
        render();
      }
    });
  };

  window.handleSetDefaultAddress = (addrId) => {
    const customers = getCustomers();
    const idx = customers.findIndex(c =>
      (currentUser.id && c.id === currentUser.id) ||
      (currentUser.email && c.email === currentUser.email)
    );
    if (idx !== -1 && Array.isArray(customers[idx].addresses)) {
      customers[idx].addresses.forEach(a => {
        a.isDefault = (a.id === addrId);
      });
      saveCustomers(customers);
      setCurrentUser(customers[idx]);
      render();
    }
  };

  render();
}

window.initAuthPage = initAuthPage;
window.initProfilePage = initProfilePage;
