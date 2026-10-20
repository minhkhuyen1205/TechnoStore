/* ==========================================================================
   Display & Product Card Renderer (Kiến trúc Product Variant Matrix)
   TechnoStore - Pure Vanilla JavaScript (ES6+)
   ========================================================================== */

/**
 * Render một thẻ sản phẩm đơn lẻ (Product Card)
 * Nghiệp vụ:
 * 1. Tính toán trực tiếp URL chi tiết sản phẩm
 * 2. Hiển thị mức giá "Từ [basePrice]" cho sản phẩm đa biến thể
 * 3. Hiển thị ảnh thật upload (FileReader) hoặc fallback sang đồ họa SVG Device Art
 * 4. Phân bổ trạng thái tồn kho chuẩn hóa:
 *    - Tồn kho = 0: Gán class .disabled, bôi xám, gắn badge [HẾT HÀNG], chặn nút mua (+)
 *    - Tồn kho thấp (1 - 5 cái): Gắn badge vàng [SẮP HẾT HÀNG], hiển thị "Sắp hết (còn X cái)"
 *    - Tồn kho ổn định (>= 15 cái): Hiển thị bình thường kèm badge MỚI hoặc % Giảm giá
 * 5. Nút mua nhanh (+): Sản phẩm có biến thể chuyển hướng chi tiết, sản phẩm đơn thêm vào giỏ
 * 
 * @param {Object} p - Thông tin sản phẩm
 * @param {Object} options - { detailUrl, detailUrlPrefix, basePath, isRoot }
 */
function renderProductCard(p, options = {}) {
  if (!p || p.isDeleted) return '';

  // 1. Tính toán trực tiếp URL chi tiết sản phẩm
  let detailUrl = '';
  if (typeof options.detailUrl === 'function') {
    detailUrl = options.detailUrl(p);
  } else if (typeof options.detailUrl === 'string' && options.detailUrl.trim() !== '') {
    detailUrl = options.detailUrl;
  } else {
    const prefix = options.detailUrlPrefix || (options.isRoot ? 'view/customer/detail.html?id=' : 'detail.html?id=');
    detailUrl = `${prefix}${p.id}`;
  }

  const displayPrice = p.basePrice || p.price || 0;
  const off = p.old ? Math.round((1 - displayPrice / p.old) * 100) : 0;
  const totalStock = typeof p.stock === 'number' ? p.stock : 0;
  const isOutOfStock = totalStock <= 0;
  const isLowStock = !isOutOfStock && totalStock <= 5;
  const hasVariants = Boolean(p.variants && p.variants.length > 1);

  // Render các tag/badge chuẩn hóa
  let badgesHtml = '';
  if (isOutOfStock) {
    badgesHtml += `<span class="product-tag product-tag-sale" style="background-color: #dc2626; color: #ffffff; font-weight: 700;">HẾT HÀNG</span>`;
  } else if (isLowStock) {
    badgesHtml += `<span class="product-tag product-tag-warning" style="background-color: #eab308; color: #1e293b; font-weight: 700;">SẮP HẾT</span>`;
  } else {
    if (p.isNew) {
      badgesHtml += `<span class="product-tag product-tag-new">MỚI</span>`;
    }
    if (off > 0) {
      badgesHtml += `<span class="product-tag product-tag-sale">-${off}%</span>`;
    }
  }

  // Khối hình ảnh: Ảnh thật hoặc SVG Art
  const artworkHtml = p.image
    ? `<img src="${p.image}" style="max-height: 192px; max-width: 100%; object-fit: contain; transition: transform 0.3s ease;" alt="${p.name}" />`
    : (typeof renderDeviceArt === 'function' ? renderDeviceArt(p, 'height:192px; width:auto;') : '');

  // Trạng thái tồn kho text
  let stockText = '';
  if (isOutOfStock) {
    stockText = '<b style="color:#dc2626;">Tạm hết hàng</b>';
  } else if (isLowStock) {
    stockText = `<b style="color:#d97706;">Sắp hết (còn ${totalStock})</b>`;
  } else {
    // Hiển thị lượt bán thật từ dữ liệu thay vì tạo số minh họa gây sai lệch.
    stockText = `Đã bán ${Number(p.sold ?? p.soldCount) || 0}`;
  }

  return `
    <article class="product-card ${isOutOfStock ? 'disabled' : ''}" data-id="${p.id}" style="${isOutOfStock ? 'opacity: 0.75;' : ''}">
      <button onclick="window.location.href='${detailUrl}'" class="product-img-btn" aria-label="Xem chi tiết ${p.name}">
        ${badgesHtml ? `<div class="product-badges">${badgesHtml}</div>` : ''}
        <div class="product-art-wrap" style="${isOutOfStock ? 'filter: grayscale(80%);' : ''}">
          ${artworkHtml}
        </div>
      </button>

      <div class="product-card-body" style="${isOutOfStock ? 'filter: grayscale(80%);' : ''}">
        <span class="product-brand">${p.brand}</span>
        <button onclick="window.location.href='${detailUrl}'" class="product-title" title="${p.name}">
          ${p.name}
        </button>

        <div class="product-rating">
          <span class="star-icon">★</span>
          <span>${Number(p.rating ?? 5).toFixed(1)}</span>
          <span>·</span>
          <span>${stockText}</span>
        </div>

        <div class="product-bottom-row">
          <div>
            <!-- Hiển thị giá dạng "Từ 34.990.000 ₫" nếu có nhiều phiên bản -->
            <div class="product-price">
              ${hasVariants ? '<span style="font-size: 13px; font-weight: 500; color: var(--color-ink-3);">Từ </span>' : ''}
              ${vnd(displayPrice)}
            </div>
            ${p.old ? `<div class="product-old-price">${vnd(p.old)}</div>` : ''}
          </div>

          <!-- Nút hành động: Dấu (+) đồng bộ cho toàn bộ sản phẩm -->
          <button 
            type="button" 
            onclick="handleCardAction(event, ${p.id})" 
            class="product-add-btn" 
            aria-label="${hasVariants ? 'Chọn phiên bản' : 'Thêm vào giỏ'}"
            title="${isOutOfStock ? 'Sản phẩm tạm hết hàng' : (hasVariants ? 'Chọn phiên bản' : 'Thêm nhanh vào giỏ hàng')}"
            ${isOutOfStock ? 'disabled style="opacity:0.35; cursor:not-allowed;"' : ''}
          >
            +
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render danh sách sản phẩm vào một container
 */
function renderProductGrid(containerId, productList, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Lọc bỏ sản phẩm đã bị xóa mềm (Soft Delete)
  let activeList = (productList || []).filter(p => !p.isDeleted);

  // Trang chủ chỉ ẩn sản phẩm hết hàng khi không hiển thị kết quả đã lọc.
  const isHomePage = options.isHome || (typeof window !== 'undefined' && (
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname.endsWith('/') ||
    (!window.location.pathname.includes('search.html') &&
      !window.location.pathname.includes('detail.html') &&
      !window.location.pathname.includes('admin.html') &&
      !window.location.pathname.includes('cart.html') &&
      !window.location.pathname.includes('checkout.html') &&
      !window.location.pathname.includes('history.html') &&
      !window.location.pathname.includes('profile.html'))
  ));

  if (isHomePage && !options.includeOutOfStock) {
    activeList = activeList.filter(p => (Number(p.stock) || 0) > 0);
  }

  if (activeList.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1; padding: 48px 20px; text-align: center;">
        <p style="color: var(--color-ink-3); font-size: 16px;">Không tìm thấy sản phẩm phù hợp.</p>
        <button onclick="if(typeof resetFilters === 'function') resetFilters();" class="btn btn-ghost btn-sm" style="margin-top: 12px;">
          Xoá bộ lọc tìm kiếm
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = activeList.map(p => renderProductCard(p, options)).join('');
}

/**
 * Xử lý nút hành động trên thẻ sản phẩm: Dấu (+)
 * Nghiệp vụ:
 * 1. Dùng event.stopPropagation() để không kích hoạt thẻ cha
 * 2. Nếu sản phẩm hết hàng -> Thông báo toast và chặn
 * 3. Nếu sản phẩm có biến thể -> Chuyển hướng sang trang chi tiết để khách chọn Màu & ROM
 * 4. Nếu là sản phẩm đơn / phụ kiện -> Gọi addToCart thêm nhanh vào giỏ
 */
function handleCardAction(event, productId) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const products = typeof getProducts === 'function' ? getProducts() : [];
  const p = products.find(item => item.id === productId || item.code === productId);
  if (!p) return;

  // Kiểm tra nếu sản phẩm đã hết hàng
  const isOutOfStock = (p.stock || 0) <= 0;
  if (isOutOfStock) {
    showToast('Sản phẩm này hiện đang tạm hết hàng!');
    return;
  }

  const hasVariants = Boolean(p.variants && p.variants.length > 1);

  if (hasVariants) {
    // Sản phẩm có biến thể -> Chuyển hướng sang trang chi tiết để khách chọn Màu & ROM
    const isCustomerDir = window.location.pathname.includes('/customer/') || window.location.pathname.includes('/view/');
    const detailUrl = isCustomerDir ? `detail.html?id=${p.id}` : `view/customer/detail.html?id=${p.id}`;
    window.location.href = detailUrl;
  } else {
    // Sản phẩm đơn / phụ kiện -> Gọi addToCart thêm nhanh vào giỏ
    if (typeof addToCart === 'function') {
      const res = addToCart(p.id, 1);
      if (res && res.success === false) {
        showToast(res.message);
      } else {
        showToast(`Đã thêm ${p.name} vào giỏ hàng!`);
      }
    }
  }
}

// Giữ alias cho tương thích ngược
window.handleCardAction = handleCardAction;
window.handleQuickAddToCart = handleCardAction;

/**
 * Toast thông báo thời gian thực góc màn hình
 */
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 76px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #0b1220;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 9999px;
      font-size: 13.5px;
      font-weight: 500;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.35);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color: #10b981; font-weight: 700;">✓</span> <span>${message}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 2400);
}

/**
 * Mapping màu sắc trạng thái
 */
function getStatusTone(s) {
  const map = {
    'Mới đặt': 'info',
    'Đã xác nhận': 'warning',
    'Đang giao': 'warning',
    'Đã giao': 'success',
    'Đã huỷ': 'danger',
    'Hoàn thành': 'success',
    'Nháp': 'neutral',
    'Hoạt động': 'success',
    'Bị khoá': 'danger',
    'Còn hàng': 'success',
    'Hết hàng': 'danger'
  };
  return map[s] || 'neutral';
}

/**
 * Helper hiển thị Lịch sử đơn hàng của riêng khách hàng đang đăng nhập (Dùng cho history.html và profile)
 */
function renderCustomerOrderHistory(containerId = 'orderHistoryList', activeStatus = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (!user) {
    container.innerHTML = `
      <div class="empty-state-box" style="padding: 48px 20px; text-align: center;">
        <p style="color: var(--color-ink-3); font-size: 15px;">Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.</p>
        <a href="login.html?redirect=history.html" class="btn btn-primary btn-sm" style="margin-top: 12px;">Đăng nhập ngay</a>
      </div>
    `;
    return;
  }

  // PHÂN QUYỀN LỊCH SỬ ĐƠN HÀNG: Lọc chính xác theo email hoặc SĐT của riêng tài khoản đăng nhập
  let orders = typeof getOrdersForCurrentUser === 'function' ? getOrdersForCurrentUser() : [];
  // Nếu URL chỉ định đơn hàng vừa đặt, giới hạn kết quả ở đúng đơn đó.
  const focusedOrderId = new URLSearchParams(window.location.search).get('orderId');
  if (focusedOrderId) {
    orders = orders.filter(order => String(order.id) === focusedOrderId);
  }
  if (activeStatus) {
    orders = orders.filter(o => o.status === activeStatus);
  }

  const allProducts = typeof getProducts === 'function' ? getProducts() : [];

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="padding: 48px 20px; text-align: center;">
        <p style="color: var(--color-ink-3); font-size: 15px;">Bạn chưa có đơn hàng nào trong mục này.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `${focusedOrderId ? `
      <div style="margin-bottom: 16px;">
        <a href="profile.html?tab=orders" class="btn btn-secondary btn-sm">Xem tất cả lịch sử đơn hàng</a>
      </div>
    ` : ''}${orders.map(o => {
    const tone = getStatusTone(o.status);
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
              <span style="font-family: var(--font-mono); font-size: 11px; color: var(--color-brand-700);">${sku}</span> · Số lượng: ${qty} · Giá: ${vnd(price)}
            </div>
          </div>
          <div style="font-weight: 600; font-size: 14px;">${vnd(price * qty)}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="order-history-card">
        <div class="order-card-header">
          <div>
            <span class="order-card-id">#${o.id}</span>
            <span class="order-card-meta">${o.date} · Thanh toán: ${o.pay || 'Tiền mặt'}</span>
          </div>
          <span class="badge badge-${tone}">${o.status}</span>
        </div>

        <div class="order-card-items-list">
          ${itemsHtml}
        </div>

        <div class="order-card-footer">
          <span style="font-size: 14px; color: var(--color-ink-3);">Tổng tiền thanh toán</span>
          <span class="order-total-price" style="color: var(--color-brand-600); font-size: 18px;">${vnd(o.total)}</span>
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

// Khách chỉ được hủy đơn "Mới đặt" thuộc tài khoản của mình; tồn kho được hoàn lại theo SKU.
function handleCustomerCancelOrder(orderId) {
  const order = getOrdersForCurrentUser().find(item => String(item.id) === String(orderId));
  if (!order || order.status !== 'Mới đặt') {
    showCustomDialog('Chỉ có thể hủy đơn hàng đang ở trạng thái "Mới đặt".', 'Không thể hủy đơn', 'warning');
    return;
  }

  showCustomDialog(
    `Bạn có chắc chắn muốn hủy đơn hàng #${order.id}? Số lượng sản phẩm sẽ được hoàn lại kho.`,
    'Xác nhận hủy đơn',
    'warning',
    () => {
      const allOrders = getOrders();
      const target = allOrders.find(item => String(item.id) === String(orderId));
      if (!target || target.status !== 'Mới đặt') {
        showCustomDialog('Trạng thái đơn hàng đã thay đổi, vui lòng tải lại trang.', 'Không thể hủy đơn', 'error');
        return;
      }

      // Kiểm tra SKU trước để không đổi trạng thái đơn nếu không thể hoàn kho đầy đủ.
      const invalidItem = (target.items || []).find(item => !item.sku || !findVariantBySku(item.sku));
      if (invalidItem) {
        showCustomDialog(`Không thể hoàn kho cho sản phẩm có SKU "${invalidItem.sku || 'không xác định'}". Vui lòng liên hệ cửa hàng để được hỗ trợ.`, 'Không thể hủy đơn', 'error');
        return;
      }

      (target.items || []).forEach(item => {
        updateVariantStock(item.sku, Math.max(1, Math.floor(Number(item.qty) || 1)));
      });
      target.status = 'Đã huỷ';
      saveOrders(allOrders);
      showToast(`Đã hủy đơn #${target.id} và hoàn trả tồn kho.`);

      if (typeof window.switchProfileTab === 'function') {
        window.switchProfileTab('orders');
      } else {
        renderCustomerOrderHistory('orderHistoryList', window.activeStatusFilter || '');
      }
    },
    { confirmText: 'Hủy đơn', cancelText: 'Giữ đơn hàng' }
  );
}

window.renderProductCard = renderProductCard;
window.renderProductGrid = renderProductGrid;
window.showToast = showToast;
window.getStatusTone = getStatusTone;
window.renderCustomerOrderHistory = renderCustomerOrderHistory;
window.handleCustomerCancelOrder = handleCustomerCancelOrder;
