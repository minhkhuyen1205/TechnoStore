
/**
 * Khởi tạo Trang Giỏ Hàng (Cart Page)
 * Nghiệp vụ:
 * 1. Khách chưa đăng nhập vẫn xem được giỏ hàng đã lưu từ phiên trước (Guest Cart)
 * 2. Tự động kiểm tra và đồng bộ tồn kho thực tế
 * 3. Khi bấm "Tiến hành thanh toán": Chuyển sang luồng thanh toán giỏ hàng (xóa cờ mua ngay tạm)
 */
function initCartPage(options = {}) {
  const container = document.getElementById('cartPageContent');
  if (!container) return;

  const basePath = options.basePath || '';
  const customerPath = `${basePath}view/customer/`;
  const homeUrl = options.isRoot ? 'index.html' : `${basePath}index.html`;
  const selectedSkus = new Set(getCart().map(item => item.sku));

  /**
   * ĐỒNG BỘ TỒN KHO THỰC TẾ VỚI GIỎ HÀNG KHÁCH HÀNG (REAL-TIME INVENTORY RECONCILIATION)
   */
  function reconcileCartWithStock() {
    const rawCart = getCart();
    let hasAdjustment = false;
    const adjustmentMessages = [];
    const validCart = [];

    rawCart.forEach(item => {
      const found = findVariantBySku(item.sku);
      if (!found || found.product.isDeleted || !found.product.isVisible) {
        hasAdjustment = true;
        adjustmentMessages.push(`• Sản phẩm (SKU: ${item.sku}) không còn tồn tại đã được xóa khỏi giỏ.`);
        return;
      }

      const availableStock = found.variant.stock !== undefined ? Number(found.variant.stock) : 0;
      if (availableStock <= 0) {
        hasAdjustment = true;
        adjustmentMessages.push(`• Sản phẩm "${found.product.name} - ${found.variant.color}" (SKU: ${found.variant.sku}) đã hết hàng và được xóa khỏi giỏ.`);
      } else if (item.qty > availableStock) {
        hasAdjustment = true;
        adjustmentMessages.push(`• Số lượng sản phẩm "${found.product.name} - ${found.variant.color}" được tự động điều chỉnh từ ${item.qty} xuống ${availableStock} do tồn kho thay đổi.`);
        item.qty = availableStock;
        validCart.push(item);
      } else {
        validCart.push(item);
      }
    });

    if (hasAdjustment) {
      saveCart(validCart);
      const noticeText = 'Hệ thống đã tự động điều chỉnh giỏ hàng theo tồn kho thực tế:\n\n' + adjustmentMessages.join('\n');
      if (typeof showToast === 'function') {
        showToast('Giỏ hàng đã được đồng bộ lại với tồn kho thực tế!');
      }
      setTimeout(() => {
        showCustomDialog(noticeText, 'Đồng bộ tồn kho', 'warning');
      }, 50);
    }
  }

  // Thực hiện đồng bộ tồn kho ngay khi mở trang giỏ hàng
  reconcileCartWithStock();

  function render() {
    const rawCart = getCart();

    // Phân giải các món hàng trong Giỏ theo SKU phiên bản
    const items = [];
    rawCart.forEach(item => {
      const found = findVariantBySku(item.sku);
      if (found && !found.product.isDeleted && found.product.isVisible) {
        items.push({
          sku: item.sku,
          qty: item.qty,
          product: found.product,
          variant: found.variant
        });
      }
    });

    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-view">
          <div class="cart-empty-icon-circle">
            <img src="${basePath}assets/icon/gio-hang.svg" class="icon icon-32" alt="Trống" />
          </div>
          <h1 class="cart-empty-title">Giỏ hàng của bạn đang trống</h1>
          <p class="cart-empty-text">Hãy khám phá các siêu phẩm công nghệ mới nhất tại TechnoStore.</p>
          <a href="${homeUrl}" class="btn btn-primary btn-md" style="margin-top: 24px;">
            Tiếp tục mua sắm
          </a>
        </div>
      `;
      return;
    }

    const selectedItems = items.filter(item => selectedSkus.has(item.sku));
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.variant.price * item.qty), 0);
    const shipping = selectedItems.length > 0 && subtotal <= 2000000 ? 30000 : 0;
    const total = selectedItems.length > 0 ? subtotal + shipping : 0;

    const itemsHtml = items.map(item => `
      <div class="cart-item-card">
        <input
          class="cart-item-checkbox"
          type="checkbox"
          aria-label="Chọn ${item.product.name}"
          ${selectedSkus.has(item.sku) ? 'checked' : ''}
          onchange="handleToggleCartSelection('${item.sku}', this.checked)"
        />
        <div class="cart-item-thumb" style="display: grid; place-items: center; overflow: hidden;">
          ${item.product.image
        ? `<img src="${item.product.image}" style="max-height: 76px; max-width: 100%; object-fit: contain;" alt="${item.product.name}" />`
        : renderDeviceArt(item.product, 'height:80px; width:auto;')}
        </div>

        <div class="cart-item-details">
          <a href="${customerPath}detail.html?id=${item.product.id}" class="cart-item-name">
            ${item.product.name}
          </a>
          <div class="cart-item-meta" style="color: var(--color-ink-2); font-size: 13px; margin-top: 2px;">
            Phiên bản: <b style="color: var(--color-ink);">${item.variant.color}</b> · ${item.variant.rom || 'Tiêu chuẩn'}
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--color-brand-700); margin-top: 2px;">
            SKU: ${item.variant.sku}
          </div>
          <div class="cart-item-price-mobile">${vnd(item.variant.price * item.qty)}</div>
        </div>

        <!-- Quantity Stepper with Stock Limit -->
        <div class="cart-item-stepper">
          <button 
            type="button" 
            class="stepper-btn" 
            onclick="handleUpdateCartQty('${item.sku}', ${item.qty - 1})" 
            aria-label="Giảm"
          >-</button>
          <span class="stepper-num">${item.qty}</span>
          <button 
            type="button" 
            class="stepper-btn" 
            onclick="handleUpdateCartQty('${item.sku}', ${item.qty + 1})" 
            aria-label="Tăng"
            ${item.qty >= item.variant.stock ? 'disabled title="Đã đạt giới hạn tồn kho"' : ''}
          >+</button>
        </div>

        <div class="cart-item-subtotal">${vnd(item.variant.price * item.qty)}</div>

        <button 
          type="button" 
          class="cart-remove-btn" 
          onclick="handleRemoveCartItem('${item.sku}')" 
          aria-label="Xoá"
          title="Xoá sản phẩm khỏi giỏ"
        >
          <img src="${basePath}assets/icon/xoa.svg" class="icon icon-18" alt="Xoá" />
        </button>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="cart-container">
        <h1 class="cart-title">Giỏ hàng <span class="cart-title-count">(${items.length} món)</span></h1>

        <div class="cart-checkout-grid">
          <div class="cart-items-wrapper">
            ${itemsHtml}
          </div>

          <aside class="order-summary-box">
            <h2 class="summary-title">Tóm tắt đơn hàng</h2>
            <div class="summary-rows-list">
              <div class="summary-row">
                <span class="summary-row-label">Tạm tính (${selectedItems.reduce((s, i) => s + i.qty, 0)} sản phẩm)</span>
                <span class="summary-row-val">${vnd(subtotal)}</span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label">Phí vận chuyển</span>
                <span class="summary-row-val">${shipping ? vnd(shipping) : 'Miễn phí'}</span>
              </div>
              <div class="summary-total-row">
                <span class="summary-total-label">Tổng cộng</span>
                <span class="summary-grand-total">${vnd(total)}</span>
              </div>
            </div>

            <button onclick="handleProceedToCheckout()" class="btn btn-primary btn-lg btn-full" style="margin-top: 20px;" ${selectedItems.length === 0 ? 'disabled' : ''}>
              Tiến hành thanh toán
            </button>
            <a href="${homeUrl}" class="btn btn-ghost btn-md btn-full" style="margin-top: 8px;">
              ← Tiếp tục mua sắm
            </a>
          </aside>
        </div>
      </div>
    `;
  }

  window.handleUpdateCartQty = (sku, newQty) => {
    if (newQty <= 0) {
      showCustomDialog(
        'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
        'Xác nhận xóa',
        'warning',
        () => {
          removeFromCart(sku);
          selectedSkus.delete(sku);
          render();
        },
        { confirmText: 'Xác nhận xóa', cancelText: 'Hủy' }
      );
      return;
    }

    const found = findVariantBySku(sku);
    if (found && newQty > found.variant.stock) {
      showToast(`Kho chỉ còn ${found.variant.stock} sản phẩm cho phiên bản này!`);
      return;
    }
    setCartQty(sku, newQty);
    render();
  };

  window.handleToggleCartSelection = (sku, checked) => {
    if (checked) selectedSkus.add(sku);
    else selectedSkus.delete(sku);
    render();
  };

  window.handleRemoveCartItem = (sku) => {
    // Hiển thị dialog xác nhận xoá trước khi thực hiện
    showCustomDialog(
      'Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?',
      'Xác nhận xoá',
      'warning',
      () => {
        removeFromCart(sku);
        selectedSkus.delete(sku);
        render();
        showToast('Đã xoá phiên bản sản phẩm khỏi giỏ hàng');
      }
    );
  };

  window.handleProceedToCheckout = () => {
    // Xóa cờ mua ngay tạm thời để chuyển sang luồng thanh toán toàn bộ giỏ hàng
    if (typeof clearBuyNow === 'function') {
      clearBuyNow();
    } else {
      localStorage.removeItem('techno_buy_now');
    }

    if (selectedSkus.size === 0) {
      showCustomDialog('Vui lòng chọn ít nhất một sản phẩm để thanh toán.', 'Chưa chọn sản phẩm', 'warning');
      return;
    }

    try {
      sessionStorage.setItem('techno_checkout_skus', JSON.stringify(Array.from(selectedSkus)));
    } catch (error) {
      console.error('[Checkout] Không thể lưu danh sách sản phẩm đã chọn:', error);
      showCustomDialog('Không thể chuẩn bị danh sách thanh toán. Vui lòng thử lại.', 'Lỗi thanh toán', 'error');
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      showCustomDialog('Vui lòng đăng nhập tài khoản trước khi tiến hành thanh toán!', 'Yêu cầu đăng nhập', 'warning', () => {
        window.location.href = `${customerPath}login.html?redirect=checkout.html`;
      });
      return;
    }
    window.location.href = `${customerPath}checkout.html`;
  };

  render();
}

/**
 * Khởi tạo Trang Thanh Toán (Checkout Page)
 * Nghiệp vụ chuẩn hóa:
 * 1. Phân biệt rõ ràng luồng 'Mua ngay' (1 sản phẩm tạm) và 'Giỏ hàng' (các sản phẩm trong giỏ)
 */
function initCheckoutPage(options = {}) {
  const container = document.getElementById('checkoutPageContent');
  if (!container) return;

  const basePath = options.basePath || '';
  const customerPath = `${basePath}view/customer/`;
  const homeUrl = options.isRoot ? 'index.html' : `${basePath}index.html`;

  // 1. Kiểm tra đăng nhập bắt buộc
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showCustomDialog('Vui lòng đăng nhập tài khoản để thanh toán đơn hàng!', 'Yêu cầu đăng nhập', 'warning', () => {
      window.location.href = `${customerPath}login.html?redirect=checkout.html`;
    });
    return;
  }

  // 2. Xác định luồng thanh toán: 'Mua ngay' (Buy Now) hay 'Giỏ hàng' (Cart)
  const buyNowData = typeof getBuyNow === 'function' ? getBuyNow() : getStorage('techno_buy_now', null);
  const isBuyNowMode = Boolean(buyNowData && buyNowData.sku);
  let checkoutSkus = null;
  if (!isBuyNowMode) {
    try {
      const storedSkus = sessionStorage.getItem('techno_checkout_skus');
      if (storedSkus !== null) {
        const parsedSkus = JSON.parse(storedSkus);
        if (!Array.isArray(parsedSkus) || parsedSkus.some(sku => typeof sku !== 'string')) {
          throw new Error('Danh sách SKU thanh toán không hợp lệ.');
        }
        checkoutSkus = new Set(parsedSkus);
      }
    } catch (error) {
      console.error('[Checkout] Không thể đọc danh sách sản phẩm đã chọn:', error);
      showCustomDialog('Không thể tải danh sách sản phẩm thanh toán. Vui lòng quay lại giỏ hàng.', 'Lỗi thanh toán', 'error');
      return;
    }
  }

  let selectedAddressId = null;
  let selectedPayment = 'cod';
  let completedOrder = null;

  function render() {
    // Nếu đơn hàng đã hoàn tất thành công -> Hiển thị màn hình thành công kèm nút "Xem đơn hàng"
    if (completedOrder) {
      container.innerHTML = `
        <div class="order-success-view pop" style="padding: 60px 20px; text-align: center; max-width: 580px; margin: 40px auto; background: var(--color-card, #fff); border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.06);">
          <div class="order-success-icon" style="width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 32px; display: grid; place-items: center; margin: 0 auto 20px; font-weight: 700;">✓</div>
          <h1 class="order-success-title" style="font-size: 26px; font-weight: 700; color: var(--color-ink); margin-bottom: 8px;">Đặt hàng thành công!</h1>
          <p class="order-success-text" style="color: var(--color-ink-2); font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
            Cảm ơn bạn đã mua sắm tại TechnoStore.<br />
            Mã đơn hàng của bạn là <b style="color:var(--color-brand-700); font-family:var(--font-mono); font-size:18px;">#${completedOrder.id}</b>.
            <br /><span style="font-size: 13.5px; color: var(--color-ink-3);">Phương thức thanh toán: <b>${completedOrder.pay}</b></span>
          </p>
          <div class="order-success-actions" style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-md" onclick="handleViewPlacedOrder('${completedOrder.id}')" style="min-width: 150px;">
              Xem đơn hàng
            </button>
            <a href="${homeUrl}" class="btn btn-primary btn-md" style="min-width: 150px;">
              Tiếp tục mua sắm
            </a>
          </div>
        </div>
      `;
      return;
    }

    // Lấy thông tin khách hàng và sổ địa chỉ cập nhật nhất từ cơ sở dữ liệu
    const customers = typeof getCustomers === 'function' ? getCustomers() : [];
    const customer = customers.find(c =>
      (currentUser.id && c.id === currentUser.id) ||
      (currentUser.email && c.email === currentUser.email) ||
      (currentUser.phone && c.phone === currentUser.phone)
    ) || currentUser;

    const addresses = Array.isArray(customer.addresses) ? customer.addresses : [];

    // Tự động chọn địa chỉ mặc định hoặc địa chỉ đầu tiên
    if (!selectedAddressId && addresses.length > 0) {
      const def = addresses.find(a => a.isDefault) || addresses[0];
      selectedAddressId = def.id;
    }

    // 3. Tải danh sách sản phẩm theo đúng luồng
    let items = [];
    if (isBuyNowMode) {
      // Luồng Mua ngay: CHỈ hiển thị duy nhất 1 sản phẩm nằm trong dữ liệu Mua ngay tạm
      const found = findVariantBySku(buyNowData.sku);
      if (found && !found.product.isDeleted && found.product.isVisible) {
        items = [{
          sku: buyNowData.sku,
          qty: buyNowData.qty || 1,
          product: found.product,
          variant: found.variant
        }];
      }
    } else {
      // Luồng Giỏ hàng: Hiển thị danh sách các sản phẩm trong giỏ hàng chính
      const rawCart = getCart();
      if (checkoutSkus === null) checkoutSkus = new Set(rawCart.map(item => item.sku));
      rawCart.forEach(item => {
        if (!checkoutSkus.has(item.sku)) return;
        const found = findVariantBySku(item.sku);
        if (found && !found.product.isDeleted && found.product.isVisible) {
          items.push({
            sku: item.sku,
            qty: item.qty,
            product: found.product,
            variant: found.variant
          });
        }
      });
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="padding: 112px 20px; text-align: center; color: var(--color-ink-3);">
          <p style="font-size: 16px; margin-bottom: 16px;">Không tìm thấy sản phẩm cần thanh toán.</p>
          <a href="${homeUrl}" class="btn btn-primary btn-md">Tiếp tục mua sắm</a>
        </div>
      `;
      return;
    }

    const subtotal = items.reduce((sum, item) => sum + (item.variant.price * item.qty), 0);
    const shipping = subtotal > 2000000 ? 0 : 30000;
    const total = subtotal + shipping;

    const reviewItemsHtml = items.map(item => `
      <div class="review-item-row">
        <div class="review-item-thumb" style="display: grid; place-items: center; overflow: hidden;">
          ${item.product.image
        ? `<img src="${item.product.image}" style="max-height: 52px; max-width: 100%; object-fit: contain;" alt="" />`
        : renderDeviceArt(item.product, 'height:56px; width:auto;')}
        </div>
        <div class="review-item-info">
          <div class="review-item-title">${item.product.name}</div>
          <div style="font-size: 12px; color: var(--color-ink-2);">
            Phiên bản: <b>${item.variant.color}</b> · ${item.variant.rom || 'Tiêu chuẩn'}
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--color-brand-700);">
            SKU: ${item.variant.sku} · Số lượng: ${item.qty}
          </div>
        </div>
        <div class="review-item-price">${vnd(item.variant.price * item.qty)}</div>
      </div>
    `).join('');

    // HTML Khung Địa chỉ nhận hàng
    let addressSectionHtml = '';
    if (addresses.length === 0) {
      addressSectionHtml = `
        <div style="border: 1px dashed var(--color-line, #cbd5e1); border-radius: 12px; padding: 20px; background: #f8fafc;">
          <div style="font-size: 15px; font-weight: 600; color: var(--color-ink); margin-bottom: 4px;">
            Người nhận: ${currentUser.name} · ${currentUser.phone || 'Chưa có SĐT'}
          </div>
          <div style="color: #ef4444; font-size: 13.5px; margin-bottom: 14px; font-style: italic;">
            (Chưa có địa chỉ nhận hàng cụ thể. Vui lòng thêm địa chỉ để tiếp tục đặt hàng)
          </div>
          <button type="button" class="btn btn-primary btn-sm" onclick="openCheckoutAddressModal(null)">
            + Thêm địa chỉ nhận hàng
          </button>
        </div>
      `;
    } else {
      const addrCards = addresses.map(a => `
        <label class="choice-card ${selectedAddressId === a.id ? 'selected' : ''}" style="position: relative; display: block; cursor: pointer;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="display: flex; gap: 10px;">
              <input type="radio" name="checkoutAddressRadio" value="${a.id}" ${selectedAddressId === a.id ? 'checked' : ''} onchange="handleSelectCheckoutAddr('${a.id}')" style="margin-top: 3px;" />
              <div>
                <div class="choice-card-title" style="font-weight: 600; font-size: 14px;">
                  ${a.label || 'Địa chỉ'}
                  ${a.isDefault ? '<span class="badge badge-success" style="margin-left: 6px; font-size: 11px;">Mặc định</span>' : ''}
                </div>
                <div class="choice-card-sub" style="font-size: 13px; color: var(--color-ink-2); margin-top: 2px;">
                  <b>${a.receiverName || currentUser.name}</b> · ${a.receiverPhone || currentUser.phone}
                </div>
                <div class="choice-card-desc" style="font-size: 13px; color: var(--color-ink-3); margin-top: 4px; line-height: 1.4;">
                  ${a.detail}
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); openCheckoutAddressModal('${a.id}')" style="font-size: 12px; padding: 2px 8px;">
              Sửa
            </button>
          </div>
        </label>
      `).join('');

      addressSectionHtml = `
        <div class="selectable-cards-grid" style="display: grid; gap: 12px;">
          ${addrCards}
        </div>
        <div style="margin-top: 12px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="openCheckoutAddressModal(null)">
            + Thêm địa chỉ mới
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="cart-container">
        <h1 class="cart-title">
          Xác nhận thanh toán
          ${isBuyNowMode ? '<span class="badge badge-info" style="margin-left: 8px; vertical-align: middle; font-size: 12px;">Mua ngay tức thì</span>' : ''}
        </h1>

        <div class="cart-checkout-grid">
          <div class="checkout-steps-list">
            <!-- Step 1: Address -->
            <section>
              <h2 class="checkout-step-heading">
                <span class="checkout-step-number">1</span>
                Địa chỉ nhận hàng
              </h2>
              ${addressSectionHtml}
            </section>

            <!-- Step 2: Payment Method -->
            <section>
              <h2 class="checkout-step-heading">
                <span class="checkout-step-number">2</span>
                Phương thức thanh toán
              </h2>
              <div class="selectable-cards-grid three-cols">
                <label class="choice-card ${selectedPayment === 'cod' ? 'selected' : ''}">
                  <input type="radio" name="pay" value="cod" ${selectedPayment === 'cod' ? 'checked' : ''} onchange="handleSelectPayment('cod')" />
                  <div class="choice-card-content">
                    <img src="${basePath}assets/icon/tien-mat.svg" class="icon icon-20" alt="" />
                    <div class="choice-card-title" style="margin-top: 8px;">Tiền mặt</div>
                    <div class="choice-card-sub">Thanh toán khi nhận hàng (COD)</div>
                  </div>
                </label>

                <label class="choice-card ${selectedPayment === 'bank' ? 'selected' : ''}">
                  <input type="radio" name="pay" value="bank" ${selectedPayment === 'bank' ? 'checked' : ''} onchange="handleSelectPayment('bank')" />
                  <div class="choice-card-content">
                    <img src="${basePath}assets/icon/bank.svg" class="icon icon-20" alt="" />
                    <div class="choice-card-title" style="margin-top: 8px;">Chuyển khoản</div>
                    <div class="choice-card-sub">Quét mã VietQR 24/7</div>
                  </div>
                </label>

                <label class="choice-card ${selectedPayment === 'card' ? 'selected' : ''}">
                  <input type="radio" name="pay" value="card" ${selectedPayment === 'card' ? 'checked' : ''} onchange="handleSelectPayment('card')" />
                  <div class="choice-card-content">
                    <img src="${basePath}assets/icon/credit-card.svg" class="icon icon-20" alt="" />
                    <div class="choice-card-title" style="margin-top: 8px;">Thẻ tín dụng</div>
                    <div class="choice-card-sub">Visa, Mastercard, JCB</div>
                  </div>
                </label>
              </div>
            </section>

            <!-- Step 3: Review Order (Detailed SKU View) -->
            <section>
              <h2 class="checkout-step-heading">
                <span class="checkout-step-number">3</span>
                Danh sách mặt hàng (${items.length} phân loại)
              </h2>
              <div class="review-items-card">
                ${reviewItemsHtml}
              </div>
            </section>
          </div>

          <!-- Checkout Summary Sidebar -->
          <aside class="order-summary-box">
            <h2 class="summary-title">Tóm tắt thanh toán</h2>
            <div class="summary-rows-list">
              <div class="summary-row">
                <span class="summary-row-label">Tạm tính (${items.reduce((s, i) => s + i.qty, 0)} sản phẩm)</span>
                <span class="summary-row-val">${vnd(subtotal)}</span>
              </div>
              <div class="summary-row">
                <span class="summary-row-label">Phí vận chuyển</span>
                <span class="summary-row-val">${shipping ? vnd(shipping) : 'Miễn phí'}</span>
              </div>
              <div class="summary-total-row">
                <span class="summary-total-label">Tổng thanh toán</span>
                <span class="summary-grand-total">${vnd(total)}</span>
              </div>
            </div>

            <button type="button" onclick="handlePlaceOrder()" class="btn btn-primary btn-lg btn-full" style="margin-top: 20px;">
              Xác nhận đặt hàng
            </button>
            <a href="${isBuyNowMode ? (homeUrl) : (customerPath + 'cart.html')}" class="btn btn-ghost btn-md btn-full" style="margin-top: 8px;">
              ${isBuyNowMode ? '← Huỷ mua ngay' : '← Quay lại giỏ hàng'}
            </a>
          </aside>
        </div>
      </div>
    `;
  }

  window.handleSelectCheckoutAddr = (addrId) => {
    selectedAddressId = addrId;
    render();
  };

  window.handleSelectPayment = (pay) => {
    selectedPayment = pay;
    render();
  };

  // Mở Modal Thêm / Sửa Địa chỉ ngay trên trang Thanh toán
  window.openCheckoutAddressModal = (addrId = null) => {
    const existing = document.getElementById('checkoutAddressModal');
    if (existing) existing.remove();

    const customers = getCustomers();
    const customer = customers.find(c =>
      (currentUser.id && c.id === currentUser.id) ||
      (currentUser.email && c.email === currentUser.email) ||
      (currentUser.phone && c.phone === currentUser.phone)
    ) || currentUser;

    const addresses = Array.isArray(customer.addresses) ? customer.addresses : [];
    const addr = addrId ? addresses.find(a => a.id === addrId) : null;
    const isEdit = Boolean(addr);

    const modal = document.createElement('div');
    modal.id = 'checkoutAddressModal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:9999; display:grid; place-items:center; animation:fadeIn 0.2s ease;';

    modal.innerHTML = `
      <div style="background:#fff; border-radius:16px; width:90%; max-width:480px; padding:28px 24px; box-shadow:0 20px 60px rgba(0,0,0,0.25); animation:popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);">
        <h3 style="margin:0 0 16px; font-size:18px; font-weight:700; color:#111;">
          ${isEdit ? 'Chỉnh sửa địa chỉ nhận hàng' : 'Thêm địa chỉ nhận hàng mới'}
        </h3>
        <form onsubmit="handleSaveCheckoutAddress(event, '${addrId || ''}')">
          <div class="form-field" style="margin-bottom:12px;">
            <label class="form-label">Loại địa chỉ</label>
            <select id="checkoutAddrLabelInput" class="input-control">
              <option value="Nhà riêng" ${addr && addr.label === 'Nhà riêng' ? 'selected' : ''}>Nhà riêng</option>
              <option value="Công ty / Văn phòng" ${addr && addr.label.includes('Công ty') ? 'selected' : ''}>Công ty / Văn phòng</option>
              <option value="Khác" ${addr && addr.label === 'Khác' ? 'selected' : ''}>Khác</option>
            </select>
          </div>
          <div class="form-field" style="margin-bottom:12px;">
            <label class="form-label">Họ và tên người nhận *</label>
            <input type="text" id="checkoutAddrNameInput" class="input-control" value="${addr ? addr.receiverName : customer.name}" required />
          </div>
          <div class="form-field" style="margin-bottom:12px;">
            <label class="form-label">Số điện thoại nhận hàng *</label>
            <input type="tel" id="checkoutAddrPhoneInput" class="input-control" value="${addr ? addr.receiverPhone : customer.phone}" required pattern="0[0-9]{9}" />
          </div>
          <div class="form-field" style="margin-bottom:16px;">
            <label class="form-label">Địa chỉ chi tiết (Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP) *</label>
            <textarea id="checkoutAddrDetailInput" class="input-control" rows="3" placeholder="Ví dụ: 45 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM" required style="resize:vertical;">${addr ? addr.detail : ''}</textarea>
          </div>
          <div style="margin-bottom:20px;">
            <label class="checkbox-label" style="font-size:13.5px; cursor:pointer;">
              <input type="checkbox" id="checkoutAddrDefaultInput" ${addr && addr.isDefault ? 'checked' : (addresses.length === 0 ? 'checked' : '')} />
              Đặt làm địa chỉ nhận hàng mặc định
            </label>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn btn-secondary btn-md" onclick="document.getElementById('checkoutAddressModal').remove()">Huỷ</button>
            <button type="submit" class="btn btn-primary btn-md">Lưu địa chỉ</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
  };

  window.handleSaveCheckoutAddress = (e, addrId) => {
    e.preventDefault();
    const label = document.getElementById('checkoutAddrLabelInput')?.value || 'Nhà riêng';
    const receiverName = (document.getElementById('checkoutAddrNameInput')?.value || '').trim();
    const receiverPhone = (document.getElementById('checkoutAddrPhoneInput')?.value || '').trim().replace(/\s+/g, '');
    const detail = (document.getElementById('checkoutAddrDetailInput')?.value || '').trim();
    const isDefault = Boolean(document.getElementById('checkoutAddrDefaultInput')?.checked);

    if (!receiverName || !receiverPhone || !detail) {
      showCustomDialog('Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng!', 'Thiếu thông tin', 'warning');
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(receiverPhone)) {
      showCustomDialog('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số (bắt đầu bằng 0).', 'Lỗi số điện thoại', 'warning');
      return;
    }

    const customers = getCustomers();
    const idx = customers.findIndex(c =>
      (currentUser.id && c.id === currentUser.id) ||
      (currentUser.email && c.email === currentUser.email) ||
      (currentUser.phone && c.phone === currentUser.phone)
    );
    if (idx === -1) return;

    if (!Array.isArray(customers[idx].addresses)) {
      customers[idx].addresses = [];
    }

    const addrs = customers[idx].addresses;
    if (isDefault) {
      addrs.forEach(a => a.isDefault = false);
    }

    let targetId = addrId;
    if (addrId) {
      const item = addrs.find(a => a.id === addrId);
      if (item) {
        item.label = label;
        item.receiverName = receiverName;
        item.receiverPhone = receiverPhone;
        item.detail = detail;
        item.isDefault = isDefault || addrs.length === 1;
      }
    } else {
      targetId = 'addr_' + Date.now();
      const newAddr = {
        id: targetId,
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
    selectedAddressId = targetId;

    const modal = document.getElementById('checkoutAddressModal');
    if (modal) modal.remove();

    showToast('Đã cập nhật địa chỉ giao hàng thành công!');
    render();
  };

  /**
   * XỬ LÝ ĐẶT HÀNG & TRỪ TỒN KHO TỰ ĐỘNG
   */
  window.handlePlaceOrder = () => {
    // 1. Kiểm tra tài khoản có bị khóa không
    const customers = getCustomers();
    const customer = customers.find(c =>
      (currentUser.id && c.id === currentUser.id) ||
      (currentUser.email && c.email === currentUser.email) ||
      (currentUser.phone && c.phone === currentUser.phone)
    ) || currentUser;

    if (customer && customer.locked) {
      showCustomDialog('Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ quản trị viên!', 'Tài khoản bị khóa', 'error');
      return;
    }

    // 2. Kiểm tra địa chỉ nhận hàng: BẮT BUỘC CÓ ĐỊA CHỈ
    const addresses = Array.isArray(customer.addresses) ? customer.addresses : [];
    const activeAddress = addresses.find(a => a.id === selectedAddressId) || (addresses.length > 0 ? addresses[0] : null);

    if (!activeAddress || !activeAddress.detail || activeAddress.detail.trim() === '') {
      showCustomDialog('Vui lòng bổ sung địa chỉ nhận hàng!', 'Thiếu địa chỉ', 'warning');
      return;
    }

    // 2. Xác định danh sách mặt hàng cần thanh toán
    let checkoutItems = [];
    if (isBuyNowMode) {
      const found = findVariantBySku(buyNowData.sku);
      if (!found) {
        showCustomDialog('Sản phẩm mua ngay không còn tồn tại!', 'Lỗi sản phẩm', 'error');
        return;
      }
      checkoutItems = [{
        sku: buyNowData.sku,
        qty: buyNowData.qty || 1,
        product: found.product,
        variant: found.variant
      }];
    } else {
      const rawCart = getCart();
      if (rawCart.length === 0) {
        showCustomDialog('Giỏ hàng trống!', 'Thông báo', 'warning');
        return;
      }
      if (checkoutSkus === null) checkoutSkus = new Set(rawCart.map(item => item.sku));
      rawCart.forEach(item => {
        if (!checkoutSkus.has(item.sku)) return;
        const found = findVariantBySku(item.sku);
        if (found && !found.product.isDeleted && found.product.isVisible) {
          checkoutItems.push({
            sku: item.sku,
            qty: item.qty,
            product: found.product,
            variant: found.variant
          });
        }
      });
    }

    if (checkoutItems.length === 0) {
      showCustomDialog('Không có mặt hàng nào để đặt hàng!', 'Thông báo', 'warning');
      return;
    }

    // 3. Kiểm tra tồn kho thời gian thực
    const orderItems = [];
    let subtotal = 0;

    for (const item of checkoutItems) {
      const found = findVariantBySku(item.sku);
      if (!found || found.product.isDeleted || !found.product.isVisible) {
        showCustomDialog(`Biến thể sản phẩm (SKU: ${item.sku}) không còn tồn tại trong hệ thống!`, 'Lỗi sản phẩm', 'error');
        return;
      }
      if (item.qty > found.variant.stock) {
        showCustomDialog(`Sản phẩm "${found.product.name} - ${found.variant.color}" chỉ còn ${found.variant.stock} chiếc trong kho! Vui lòng điều chỉnh lại.`, 'Vượt tồn kho', 'warning');
        return;
      }

      orderItems.push({
        sku: item.sku,
        productId: found.product.id,
        name: `${found.product.name} (${found.variant.color}${found.variant.rom ? ' · ' + found.variant.rom : ''})`,
        price: found.variant.price,
        qty: item.qty
      });

      subtotal += found.variant.price * item.qty;
    }

    const ship = subtotal > 2000000 ? 0 : 30000;
    showCustomDialog(
      `Bạn xác nhận đặt đơn hàng với tổng thanh toán ${vnd(subtotal + ship)}?`,
      'Xác nhận đặt hàng',
      'warning',
      () => {
        const inventoryResult = applyOrderInventory(orderItems, 1, true);
        if (!inventoryResult.success) {
          showCustomDialog(inventoryResult.message, 'Không thể đặt hàng', 'warning');
          return;
        }

        const orderId = generateNextOrderId();
        const paymentLabelMap = {
          cod: 'Tiền mặt (COD)',
          bank: 'Chuyển khoản (VietQR)',
          card: 'Thẻ tín dụng'
        };
        const newOrder = {
          id: orderId,
          customerId: customer.id || currentUser.id || '',
          customer: activeAddress.receiverName || customer.name,
          customerEmail: customer.email || '',
          phone: activeAddress.receiverPhone || customer.phone || '',
          address: `${activeAddress.detail} (${activeAddress.label || 'Địa chỉ nhận hàng'})`,
          date: typeof formatCurrentDate === 'function' ? formatCurrentDate() : new Date().toLocaleDateString('vi-VN'),
          total: subtotal + ship,
          shippingFee: ship,
          status: 'Mới đặt',
          pay: paymentLabelMap[selectedPayment] || 'Tiền mặt',
          items: orderItems
        };

        const orders = getOrders();
        orders.unshift(newOrder);
        saveOrders(orders);
        if (typeof syncCustomerOrderCounts === 'function') {
          syncCustomerOrderCounts(orders);
        }

        if (isBuyNowMode) {
          if (typeof clearBuyNow === 'function') clearBuyNow();
          else localStorage.removeItem('techno_buy_now');
        } else {
          const selectedSkuSet = new Set(orderItems.map(item => item.sku));
          saveCart(getCart().filter(item => !selectedSkuSet.has(item.sku)));
          sessionStorage.removeItem('techno_checkout_skus');
        }

        completedOrder = newOrder;
        render();
        showToast(`Đã hoàn tất đặt đơn hàng #${orderId}!`);
      },
      { confirmText: 'Xác nhận đặt hàng', cancelText: 'Tiếp tục mua sắm' }
    );
  };

  // Mở đúng đơn hàng vừa đặt trong lịch sử tài khoản, không điều hướng tới danh sách chung.
  window.handleViewPlacedOrder = (orderId) => {
    if (!completedOrder || completedOrder.id !== orderId) return;
    window.location.href = `profile.html?tab=orders&orderId=${encodeURIComponent(completedOrder.id)}`;
  };

  render();
}

window.initCartPage = initCartPage;
window.initCheckoutPage = initCheckoutPage;
