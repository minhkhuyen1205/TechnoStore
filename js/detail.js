/* ==========================================================================
   Product Detail Controller (Kiến trúc Product Variant Matrix)
   TechnoStore - Pure Vanilla JavaScript (ES6+)
   ========================================================================== */

let currentProduct = null;
let selectedColor = null;
let selectedRom = null;
let selectedVariant = null;
let selectedQty = 1;
let currentDetailTab = 'spec';

/**
 * Khởi tạo trang Chi tiết Sản phẩm
 */
function initDetailPage() {
  // Lấy ID từ URL (Hỗ trợ cả ID số 1 và mã code SP001)
  const urlParams = new URLSearchParams(window.location.search);
  const rawId = urlParams.get('id') || '1';

  const allProducts = getProducts().filter(p => !p.isDeleted);
  currentProduct = allProducts.find(p => String(p.id) === rawId || p.code === rawId) || allProducts[0];

  if (!currentProduct) {
    document.getElementById('productDetailContainer').innerHTML = `
      <div style="padding: 80px 20px; text-align: center;">
        <h2>Không tìm thấy sản phẩm hoặc sản phẩm đã ngừng kinh doanh.</h2>
        <a href="../../index.html" class="btn btn-primary btn-md" style="margin-top: 16px;">Về trang chủ</a>
      </div>
    `;
    return;
  }

  // Khởi tạo ban đầu: KHÔNG chọn mặc định bất kỳ biến thể nào (null)
  selectedColor = null;
  selectedRom = null;
  selectedVariant = null;
  selectedQty = 1;

  loadProductDetails(currentProduct, allProducts);
}

/**
 * Render toàn bộ giao diện Chi tiết sản phẩm & Hệ thống Chips Biến thể
 */
function loadProductDetails(p, allProducts) {
  document.title = `${p.name} - TechnoStore`;

  // 1. Breadcrumbs
  const crumbCat = document.getElementById('crumbCat');
  const crumbName = document.getElementById('crumbName');
  if (crumbCat) crumbCat.textContent = p.category;
  if (crumbName) crumbName.textContent = p.name;

  // 2. Hình ảnh sản phẩm (Ưu tiên ảnh upload thật, fallback về SVG Device Art)
  const galleryMain = document.getElementById('galleryMainArt');
  if (galleryMain) {
    if (p.image) {
      galleryMain.innerHTML = `<img src="${p.image}" style="max-height: 380px; max-width: 100%; object-fit: contain;" alt="${p.name}" />`;
    } else {
      galleryMain.innerHTML = renderDeviceArt(p, 'height:380px; width:auto;');
    }
  }

  // Gallery Thumbs
  const thumbsContainer = document.getElementById('galleryThumbs');
  if (thumbsContainer) {
    const thumbsHtml = [0, 1, 2, 3].map(i => `
      <div class="gallery-thumb-item ${i === 0 ? 'active' : ''}" onclick="selectThumb(this)">
        ${p.image ? `<img src="${p.image}" style="max-height: 70px; max-width: 100%; object-fit: contain;" alt="" />` : renderDeviceArt(p, 'height:72px; width:auto;')}
      </div>
    `).join('');
    thumbsContainer.innerHTML = thumbsHtml;
  }

  // 3. Tên và Thông tin Meta (Chỉ hiển thị Tên SP và Thương hiệu, xóa hoàn toàn Mã SP và SKU)
  const titleEl = document.getElementById('productTitle');
  if (titleEl) titleEl.textContent = p.name;
  const metaEl = document.getElementById('productMeta');
  if (metaEl) {
    // Đồng bộ điểm đánh giá và lượt bán với thẻ sản phẩm từ cùng một nguồn dữ liệu.
    metaEl.innerHTML = `Thương hiệu: <b>${p.brand || 'Chính hãng'}</b> · <span style="color:#d97706;">★ ${Number(p.rating ?? 5).toFixed(1)}</span> · Đã bán ${Number(p.sold ?? p.soldCount) || 0}`;
  }

  // 4. Render Ma trận Chips Biến thể (Variant Matrix Chips)
  renderVariantSelectionChips(p);

  // 5. Cập nhật dữ liệu động (Giá, Tồn kho, Trạng thái nút)
  updateVariantDisplay();

  // 6. Bảng thông số kỹ thuật (Specs Table)
  renderSpecsTable(p);

  // 7. Mô tả chi tiết
  const descEl = document.getElementById('descText');
  if (descEl) {
    descEl.textContent = p.description ||
      `${p.name} mang đến trải nghiệm cao cấp với hiệu năng mạnh mẽ từ chip xử lý ${p.chip || 'thế hệ mới'}, màn hình ${p.screen || 'sắc nét'} và hệ thống camera chuyên nghiệp ${p.camera || ''}. Sản phẩm chính hãng, bảo hành 12 tháng tại hệ thống TechnoStore.`;
  }

  // 8. Sản phẩm tương tự (Related Products) - Ẩn hoàn toàn các sản phẩm hết hàng (totalStock === 0)
  const related = allProducts.filter(x => x.id !== p.id && x.category === p.category && (Number(x.stock) || 0) > 0).slice(0, 3);
  const relatedGrid = document.getElementById('relatedProductsGrid');
  const relatedSection = document.querySelector('.related-section');
  if (relatedGrid && related.length > 0) {
    if (relatedSection) relatedSection.style.display = '';
    renderProductGrid('relatedProductsGrid', related, {
      detailUrl: (r) => `detail.html?id=${r.id}`,
      isHome: true
    });
  } else {
    if (relatedSection) relatedSection.style.display = 'none';
  }
}

/**
 * Tự động quét và gom nhóm RAM/ROM từ mảng variants
 * Lọc ra danh sách RAM/ROM độc lập không trùng lặp và nối bằng dấu gạch ngang (VD: RAM: 12GB - 16GB, ROM: 256GB - 512GB - 1TB)
 * @param {Object} p - Thông tin sản phẩm
 * @returns {{ ramStr: string, romStr: string }}
 */
function getGroupedSpecs(p) {
  let ramStr = '';
  let romStr = '';

  if (p && Array.isArray(p.variants) && p.variants.length > 0) {
    // Lọc danh sách RAM độc lập không trùng lặp
    const ramList = Array.from(new Set(
      p.variants.map(v => v.ram).filter(Boolean).filter(r => r !== 'Tiêu chuẩn')
    ));
    ramStr = ramList.length > 0 ? ramList.join(' - ') : (p.ram || '');

    // Lọc danh sách ROM độc lập không trùng lặp
    const romList = Array.from(new Set(
      p.variants.map(v => v.rom).filter(Boolean).filter(r => r !== 'Tiêu chuẩn')
    ));
    romStr = romList.length > 0 ? romList.join(' - ') : (p.rom || '');
  } else if (p) {
    ramStr = p.ram || '';
    romStr = p.rom || '';
  }

  return { ramStr, romStr };
}

/**
 * Render khu vực chọn phiên bản dưới dạng Nút bấm (Chips/Swatches) chuẩn Shopee / Thế Giới Di Động
 * Cross-validation logic:
 * - Khi chưa chọn gì: Duyệt qua toàn bộ biến thể, Màu nào hoặc RAM/ROM nào có tổng tồn kho = 0 thì bôi xám nút đó (.disabled)
 * - Khi click chọn 1 "Màu sắc": Check xem Màu đó có những RAM/ROM nào. RAM/ROM nào không tồn tại hoặc hết hàng đối với Màu đó -> .disabled
 * - Khi click chọn 1 "RAM/ROM": Check xem RAM/ROM đó có những Màu nào. Màu nào không tồn tại hoặc hết hàng đối với RAM/ROM đó -> .disabled
 * - Với Tai nghe / Phụ kiện chỉ có thuộc tính Màu sắc/Quy cách thì chọn trực tiếp nút đó
 * - Tuyệt đối không append thêm text "(Hết)", chỉ dùng class CSS .disabled.
 */
function renderVariantSelectionChips(p) {
  const container = document.getElementById('variantSelectorContainer');
  if (!container || !p.variants || p.variants.length === 0) return;

  // Lọc danh sách ROM và Màu sắc hợp lệ (loại bỏ null, rỗng và 'Tiêu chuẩn')
  const romList = Array.from(new Set(
    p.variants.map(v => v.rom).filter(Boolean).filter(r => r !== 'Tiêu chuẩn')
  ));
  const colorList = Array.from(new Set(
    p.variants.map(v => v.color).filter(Boolean).filter(c => c !== 'Tiêu chuẩn')
  ));

  const colorMap = {
    'Titan Đen': '#1f2022', 'Titan Trắng': '#f2f3f5', 'Titan Tự Nhiên': '#9b958c',
    'Titan Sa Mạc': '#c8b29b', 'Hồng Pastel': '#f8c8d0', 'Xanh Lưu Ly': '#4682b4',
    'Đen Nhám': '#222325', 'Xanh Titan': '#2e4057', 'Đen Titan': '#181a1b',
    'Xám Titan': '#70737a', 'Xanh Maya': '#5c94d4', 'Xám Metal': '#8e9297',
    'Vàng Solar': '#ebd671', 'Đen Gốm': '#111213', 'Trắng Gốm': '#ffffff',
    'Trắng Ngọc Trai': '#faf6f0', 'Đen Không Gian': '#1c1d1f', 'Xanh Ánh Sao': '#3b5998',
    'Đen Huyền Bí': '#1a1a1a', 'Bạc Ánh Kim': '#e2e4e8', 'Xanh Lục Bảo': '#00695c',
    'Đen Phantom': '#111111', 'Trắng Storm': '#eeeeee', 'Xám Không Gian': '#757575',
    'Xanh Dương': '#64b5f6', 'Tím Pastel': '#d1c4e9', 'Xám Moonstone': '#686b73',
    'Bạc Platinum': '#e5e7eb', 'Xanh Băng': '#80deea', 'Trắng': '#ffffff',
    'Bạc Titan': '#cfd8dc', 'Trắng Mây': '#f5f5f5', 'Bạc Bạch Kim': '#e0e0e0',
    'Nhôm Đen Bóng': '#141517', 'Nhôm Bạc': '#d8dade', 'Xanh Quân Đội': '#4b5320',
    'Bạc Kem': '#e0dcd3', 'Trắng 1m': '#f5f5f7', 'Trắng 2m': '#f5f5f7',
    'Trắng Bạc': '#e0e0e0'
  };

  let html = '';

  // 1. Render cụm Dung lượng (ROM / Bộ nhớ trong) nếu có
  if (romList.length > 0) {
    const romTitle = p.category === 'Đồng hồ thông minh' ? 'Chọn bộ nhớ:' : 'Chọn dung lượng bộ nhớ:';
    const currentRam = (selectedVariant && selectedVariant.ram && selectedVariant.ram !== 'Tiêu chuẩn')
      ? selectedVariant.ram
      : (p.ram && p.ram !== 'Tiêu chuẩn' ? p.ram : '');
    const currentRamRomTitle = selectedRom ? (currentRam ? `${currentRam}/${selectedRom}` : selectedRom) : '';

    html += `
      <div class="variant-group-box">
        <div class="variant-group-title">
          <span>${romTitle}</span>
          <span class="selected-val" id="selectedRomText">${currentRamRomTitle}</span>
        </div>
        <div class="variant-chips-grid">
          ${romList.map(rom => {
      const isActive = rom === selectedRom;

      // Logic kiểm tra chéo:
      // Nếu đã chọn Màu -> chỉ cho phép ROM nếu tồn tại (selectedColor + rom) với stock > 0
      // Nếu chưa chọn Màu -> kiểm tra xem ROM này có tổng tồn kho > 0 trên tất cả các màu không
      const isDisabled = selectedColor
        ? !p.variants.some(v => v.rom === rom && v.color === selectedColor && (Number(v.stock) || 0) > 0)
        : !p.variants.some(v => v.rom === rom && (Number(v.stock) || 0) > 0);

      const variantWithRom = p.variants.find(v => v.rom === rom && (selectedColor ? v.color === selectedColor : true))
        || p.variants.find(v => v.rom === rom);
      const ramVal = (variantWithRom && variantWithRom.ram && variantWithRom.ram !== 'Tiêu chuẩn')
        ? variantWithRom.ram
        : (p.ram && p.ram !== 'Tiêu chuẩn' ? p.ram : '');
      const ramRomLabel = ramVal ? `${ramVal}/${rom}` : rom;

      return `
              <button
                type="button"
                class="variant-chip-btn ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}"
                onclick="handleSelectRom('${rom}')"
                aria-label="Chọn dung lượng ${ramRomLabel}"
                ${isDisabled ? 'disabled tabindex="-1" style="pointer-events:none; cursor:not-allowed;"' : ''}
              >
                <b>${ramRomLabel}</b>
              </button>
            `;
    }).join('')}
        </div>
      </div>
    `;
  }

  // 2. Render cụm Màu sắc / Phân loại / Quy cách
  if (colorList.length > 0) {
    let colorTitle = 'Chọn màu sắc:';
    if (p.category === 'Phụ kiện') colorTitle = 'Chọn phân loại / quy cách:';
    else if (p.category === 'Tai nghe') colorTitle = 'Chọn màu sắc / phiên bản:';

    html += `
      <div class="variant-group-box" style="${romList.length > 0 ? 'margin-top: 16px;' : ''}">
        <div class="variant-group-title">
          <span>${colorTitle}</span>
          <span class="selected-val" id="selectedColorText">${selectedColor || ''}</span>
        </div>
        <div class="variant-chips-grid">
          ${colorList.map(color => {
      const isActive = color === selectedColor;

      // Logic kiểm tra chéo:
      // Nếu có romList và đã chọn ROM -> chỉ cho phép Màu nếu tồn tại (color + selectedRom) với stock > 0
      // Nếu không có romList hoặc chưa chọn ROM -> kiểm tra xem Màu này có tồn kho > 0 không
      const isDisabled = (romList.length > 0 && selectedRom)
        ? !p.variants.some(v => v.color === color && v.rom === selectedRom && (Number(v.stock) || 0) > 0)
        : !p.variants.some(v => v.color === color && (Number(v.stock) || 0) > 0);

      const dotColor = colorMap[color] || '#8c867b';

      return `
              <button
                type="button"
                class="variant-chip-btn ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}"
                onclick="handleSelectColor('${color}')"
                aria-label="Chọn ${color}"
                ${isDisabled ? 'disabled tabindex="-1" style="pointer-events:none; cursor:not-allowed;"' : ''}
              >
                <span class="variant-color-dot" style="background-color: ${dotColor};"></span>
                <span>${color}</span>
              </button>
            `;
    }).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

/**
 * Xử lý khi khách chọn Dung lượng (ROM)
 * Hỗ trợ toggle (click lại nút đang chọn sẽ bỏ chọn) và kiểm tra chéo
 */
function handleSelectRom(rom) {
  if (!currentProduct || !currentProduct.variants) return;

  const isDisabled = selectedColor
    ? !currentProduct.variants.some(v => v.rom === rom && v.color === selectedColor && (Number(v.stock) || 0) > 0)
    : !currentProduct.variants.some(v => v.rom === rom && (Number(v.stock) || 0) > 0);
  if (isDisabled) return;

  if (selectedRom === rom) {
    selectedRom = null;
  } else {
    selectedRom = rom;
  }

  syncVariantSelection();
}

/**
 * Xử lý khi khách chọn Màu sắc (Color)
 * Hỗ trợ toggle (click lại nút đang chọn sẽ bỏ chọn) và kiểm tra chéo
 */
function handleSelectColor(color) {
  if (!currentProduct || !currentProduct.variants) return;

  const romList = Array.from(new Set(
    currentProduct.variants.map(v => v.rom).filter(Boolean).filter(r => r !== 'Tiêu chuẩn')
  ));

  const isDisabled = (romList.length > 0 && selectedRom)
    ? !currentProduct.variants.some(v => v.color === color && v.rom === selectedRom && (Number(v.stock) || 0) > 0)
    : !currentProduct.variants.some(v => v.color === color && (Number(v.stock) || 0) > 0);
  if (isDisabled) return;

  if (selectedColor === color) {
    selectedColor = null;
  } else {
    selectedColor = color;
  }

  syncVariantSelection();
}

/**
 * Đồng bộ hóa trạng thái biến thể đã chọn
 */
function syncVariantSelection() {
  if (!currentProduct || !currentProduct.variants) return;

  const romList = Array.from(new Set(
    currentProduct.variants.map(v => v.rom).filter(Boolean).filter(r => r !== 'Tiêu chuẩn')
  ));
  const colorList = Array.from(new Set(
    currentProduct.variants.map(v => v.color).filter(Boolean).filter(c => c !== 'Tiêu chuẩn')
  ));

  const hasRomOptions = romList.length > 0;
  const hasColorOptions = colorList.length > 0;

  if (hasRomOptions && hasColorOptions) {
    if (selectedColor && selectedRom) {
      selectedVariant = currentProduct.variants.find(
        v => v.color === selectedColor && v.rom === selectedRom
      ) || null;
    } else {
      selectedVariant = null;
    }
  } else if (hasColorOptions && !hasRomOptions) {
    // Với Tai nghe / Phụ kiện chỉ có 1 nhóm thuộc tính Màu sắc/Quy cách thì chọn trực tiếp nút đó
    selectedVariant = selectedColor
      ? (currentProduct.variants.find(v => v.color === selectedColor) || null)
      : null;
  } else if (hasRomOptions && !hasColorOptions) {
    selectedVariant = selectedRom
      ? (currentProduct.variants.find(v => v.rom === selectedRom) || null)
      : null;
  } else {
    selectedVariant = currentProduct.variants[0] || null;
  }

  // Reset số lượng chọn về 1
  selectedQty = 1;
  const qtyValEl = document.getElementById('detailQtyVal');
  if (qtyValEl) qtyValEl.textContent = selectedQty;

  // Render lại trạng thái active & disabled của Chips
  renderVariantSelectionChips(currentProduct);

  // Cập nhật giá bán, badge tồn kho và trạng thái nút mua
  updateVariantDisplay();

  // Cập nhật lại bảng specs table
  renderSpecsTable(currentProduct);
}

/**
 * Cập nhật Real-time: Giá bán, Tồn kho, Thương hiệu và trạng thái nút Mua
 * Đảm bảo KHÔNG hiển thị Mã SP và SKU dưới tên sản phẩm.
 */
function updateVariantDisplay() {
  if (!currentProduct) return;

  const priceEl = document.getElementById('currentPrice');
  const oldPriceEl = document.getElementById('oldPrice');
  const metaEl = document.getElementById('productMeta');
  const badgeContainer = document.getElementById('stockBadgeContainer');
  const stockNoteEl = document.getElementById('maxStockNote');
  const addBtn = document.getElementById('addToCartBtn');
  const buyBtn = document.getElementById('buyNowBtn');

  // Chỉ hiển thị Thương hiệu (Đã xóa hoàn toàn Mã SP và SKU)
  if (metaEl) {
    // Giữ thông tin social proof ổn định cả khi khách đổi phiên bản sản phẩm.
    metaEl.innerHTML = `Thương hiệu: <b>${currentProduct.brand || 'Chính hãng'}</b> · <span style="color:#d97706;">★ ${Number(currentProduct.rating ?? 5).toFixed(1)}</span> · Đã bán ${Number(currentProduct.sold ?? currentProduct.soldCount) || 0}`;
  }

  const allVariants = currentProduct.variants || [];
  const totalStock = allVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  const romList = Array.from(new Set(allVariants.map(v => v.rom).filter(Boolean).filter(r => r !== 'Tiêu chuẩn')));
  const hasMultipleAttrs = romList.length > 0;
  const selectNotice = hasMultipleAttrs ? 'Vui lòng chọn màu sắc và phiên bản' : 'Vui lòng chọn phân loại sản phẩm';

  const { ramStr, romStr } = getGroupedSpecs(currentProduct);
  const activeRam = (selectedVariant && selectedVariant.ram) ? selectedVariant.ram : ramStr;
  const activeRom = (selectedVariant && selectedVariant.rom) ? selectedVariant.rom : romStr;

  // Cập nhật Quick Specs Grid trên đầu trang
  const quickSpecsGrid = document.getElementById('quickSpecsGrid');
  if (quickSpecsGrid) {
    if (currentProduct.category === 'Điện thoại' || currentProduct.category === 'Máy tính bảng') {
      quickSpecsGrid.style.display = 'grid';
      quickSpecsGrid.innerHTML = `
        <div class="quick-spec-card">
          <div class="quick-spec-key">Chip</div>
          <div class="quick-spec-val" id="specChip">${currentProduct.chip || '-'}</div>
        </div>
        <div class="quick-spec-card">
          <div class="quick-spec-key">RAM</div>
          <div class="quick-spec-val" id="specRam">${activeRam || '-'}</div>
        </div>
        <div class="quick-spec-card">
          <div class="quick-spec-key">ROM</div>
          <div class="quick-spec-val" id="specRom">${activeRom || '-'}</div>
        </div>
      `;
    } else if (currentProduct.category === 'Đồng hồ thông minh') {
      quickSpecsGrid.style.display = 'grid';
      quickSpecsGrid.innerHTML = `
        <div class="quick-spec-card">
          <div class="quick-spec-key">Kích thước</div>
          <div class="quick-spec-val">${currentProduct.caseSize || currentProduct.screen || '-'}</div>
        </div>
        <div class="quick-spec-card">
          <div class="quick-spec-key">Thời lượng Pin</div>
          <div class="quick-spec-val">${currentProduct.battery || '-'}</div>
        </div>
        <div class="quick-spec-card">
          <div class="quick-spec-key">Bộ nhớ trong</div>
          <div class="quick-spec-val">${activeRom || '-'}</div>
        </div>
      `;
    } else if (currentProduct.category === 'Tai nghe') {
      quickSpecsGrid.style.display = 'grid';
      quickSpecsGrid.innerHTML = `
        <div class="quick-spec-card">
          <div class="quick-spec-key">Thời lượng Pin</div>
          <div class="quick-spec-val">${currentProduct.battery || '-'}</div>
        </div>
        <div class="quick-spec-card">
          <div class="quick-spec-key">Chống ồn</div>
          <div class="quick-spec-val">${currentProduct.anc ? 'ANC thế hệ mới' : '-'}</div>
        </div>
        <div class="quick-spec-card">
          <div class="quick-spec-key">Chuẩn Bluetooth</div>
          <div class="quick-spec-val">${currentProduct.bluetooth || '-'}</div>
        </div>
      `;
    } else if (currentProduct.category === 'Phụ kiện') {
      quickSpecsGrid.style.display = 'grid';
      quickSpecsGrid.innerHTML = `
        <div class="quick-spec-card">
          <div class="quick-spec-key">Công suất sạc</div>
          <div class="quick-spec-val">${currentProduct.power || '-'}</div>
        </div>
        <div class="quick-spec-card">
          <div class="quick-spec-key">Cổng sạc</div>
          <div class="quick-spec-val">${currentProduct.port || '-'}</div>
        </div>
        <div class="quick-spec-card">
          <div class="quick-spec-key">Chuẩn sạc</div>
          <div class="quick-spec-val">${currentProduct.standard || '-'}</div>
        </div>
      `;
    }
  }

  // =========================================================================
  // HELPER: Cập nhật giao diện Hết hàng (Ảnh bôi xám + badge, Nút TẠM HẾT HÀNG duy nhất)
  // =========================================================================
  function applyOutOfStockState(isOutOfStock) {
    // 1. Hình ảnh sản phẩm: Bôi xám nhẹ đè nhãn/badge "HẾT HÀNG"
    const galleryMain = document.getElementById('galleryMainArt');
    if (galleryMain) {
      const artMedia = galleryMain.querySelector('img') || galleryMain.querySelector('svg');
      let outBadge = galleryMain.querySelector('.gallery-out-badge');
      if (isOutOfStock) {
        galleryMain.style.position = 'relative';
        if (artMedia) {
          artMedia.style.filter = 'grayscale(80%)';
          artMedia.style.opacity = '0.85';
        }
        if (!outBadge) {
          outBadge = document.createElement('span');
          outBadge.className = 'product-tag product-tag-sale gallery-out-badge';
          outBadge.style.cssText = 'background-color: #dc2626; color: #ffffff; position: absolute; top: 16px; left: 16px; font-weight: 700; padding: 6px 14px; font-size: 13px; border-radius: 6px; box-shadow: 0 4px 12px rgba(220,38,38,0.4); z-index: 10; pointer-events: none;';
          outBadge.textContent = 'HẾT HÀNG';
          galleryMain.appendChild(outBadge);
        }
      } else {
        if (artMedia) {
          artMedia.style.filter = '';
          artMedia.style.opacity = '';
        }
        if (outBadge) {
          outBadge.remove();
        }
      }
    }

    // 2. Nút mua hàng: Nếu biến thể chọn/toàn bộ sản phẩm stock === 0 -> Đổi thành duy nhất 1 nút "TẠM HẾT HÀNG"
    const actionContainer = document.querySelector('.detail-action-buttons');
    if (actionContainer) {
      if (isOutOfStock) {
        actionContainer.innerHTML = `
          <button type="button" class="btn btn-secondary btn-lg btn-full" disabled style="opacity: 0.65; cursor: not-allowed; background: #94a3b8; color: #ffffff; border: none; width: 100%; font-weight: 700; padding: 14px 24px; border-radius: var(--radius-lg, 12px); font-size: 15px;">
            TẠM HẾT HÀNG
          </button>
        `;
      } else {
        if (!document.getElementById('addToCartBtn') || !document.getElementById('buyNowBtn')) {
          actionContainer.innerHTML = `
            <button type="button" id="addToCartBtn" onclick="handleDetailAddToCart()" class="btn btn-secondary btn-lg">
              Thêm vào giỏ
            </button>
            <button type="button" id="buyNowBtn" onclick="handleDetailBuyNow()" class="btn btn-primary btn-lg">
              Mua ngay
            </button>
          `;
        }
      }
    }

    // 3. Khóa stepper số lượng khi hết hàng
    const qtyBtns = document.querySelectorAll('.qty-btn');
    qtyBtns.forEach(btn => {
      btn.disabled = isOutOfStock;
      btn.style.opacity = isOutOfStock ? '0.4' : '1';
      btn.style.cursor = isOutOfStock ? 'not-allowed' : 'pointer';
    });
  }

  // =========================================================================
  // TRƯỜNG HỢP 1: Khách chưa chọn đủ thuộc tính biến thể (selectedVariant = null)
  // =========================================================================
  if (!selectedVariant) {
    const prices = allVariants.map(v => Number(v.price) || 0).filter(Boolean);
    const minPrice = prices.length ? Math.min(...prices) : (currentProduct.price || 0);
    const maxPrice = prices.length ? Math.max(...prices) : (currentProduct.price || 0);

    if (priceEl) {
      if (minPrice === maxPrice || !maxPrice) {
        priceEl.textContent = vnd(minPrice);
      } else {
        priceEl.textContent = `${vnd(minPrice)} - ${vnd(maxPrice)}`;
      }
    }

    if (oldPriceEl) {
      if (currentProduct.old) {
        oldPriceEl.textContent = vnd(currentProduct.old);
        oldPriceEl.style.display = 'inline-block';
      } else {
        oldPriceEl.style.display = 'none';
      }
    }

    const isTotallyOut = totalStock <= 0;
    if (badgeContainer) {
      if (isTotallyOut) {
        badgeContainer.innerHTML = `<span class="badge badge-danger">Hết hàng</span>`;
      } else {
        // Không hiển thị badge nhắc chọn phiên bản phía trên tiêu đề sản phẩm.
        badgeContainer.innerHTML = '';
      }
    }

    if (stockNoteEl) {
      stockNoteEl.textContent = isTotallyOut ? 'Tạm thời hết hàng' : selectNotice;
    }

    // Áp dụng trạng thái Hết hàng / Còn hàng
    applyOutOfStockState(isTotallyOut);
    return;
  }

  // =========================================================================
  // TRƯỜNG HỢP 2: Khách ĐÃ chọn đủ thuộc tính biến thể
  // =========================================================================
  if (priceEl) priceEl.textContent = vnd(selectedVariant.price);

  if (oldPriceEl) {
    if (currentProduct.old) {
      oldPriceEl.textContent = vnd(currentProduct.old);
      oldPriceEl.style.display = 'inline-block';
    } else {
      oldPriceEl.style.display = 'none';
    }
  }

  const isOut = (Number(selectedVariant.stock) || 0) <= 0 || totalStock <= 0;
  const isLow = !isOut && (Number(selectedVariant.stock) || 0) <= 5;
  const tone = isOut ? 'danger' : isLow ? 'warning' : 'success';
  const label = isOut ? 'Hết hàng' : isLow ? `Chỉ còn ${selectedVariant.stock} sản phẩm (Sắp hết)` : `Còn ${selectedVariant.stock} sản phẩm`;

  if (badgeContainer) {
    badgeContainer.innerHTML = `<span class="badge badge-${tone}">${label}</span>`;
  }

  if (stockNoteEl) {
    stockNoteEl.textContent = isOut ? 'Tạm thời hết hàng' : `Tối đa ${selectedVariant.stock} sản phẩm`;
  }

  // Áp dụng trạng thái Hết hàng / Còn hàng
  applyOutOfStockState(isOut);
}

/**
 * Render Bảng thông số kỹ thuật động theo từng danh mục
 * Tự động lọc và CHỈ RENDER NHỮNG DÒNG CÓ DỮ LIỆU THỰC TẾ.
 * Các trường để trống hoặc không thuộc danh mục (như RAM/ROM của Tai nghe/Sạc) tự động không render dòng đó.
 */
function renderSpecsTable(p) {
  const container = document.getElementById('specsRowsContainer');
  if (!container || !p) return;

  const { ramStr, romStr } = getGroupedSpecs(p);
  const activeRam = (selectedVariant && selectedVariant.ram) ? selectedVariant.ram : ramStr;
  const activeRom = (selectedVariant && selectedVariant.rom) ? selectedVariant.rom : romStr;

  let candidateSpecs = [];

  if (p.category === 'Điện thoại' || p.category === 'Máy tính bảng') {
    candidateSpecs = [
      ['Màn hình', p.screen],
      ['Chip xử lý (CPU)', p.chip],
      ['Dung lượng RAM', activeRam],
      ['Bộ nhớ trong (ROM)', activeRom],
      ['Camera', p.camera],
      ['Dung lượng Pin', p.battery],
      ['Wifi / Kết nối', p.connectivity || p.wifi],
      ['Hệ điều hành', p.os || (p.brand === 'Apple' ? (p.category === 'Máy tính bảng' ? 'iPadOS' : 'iOS') : 'Android')]
    ];
  } else if (p.category === 'Tai nghe') {
    candidateSpecs = [
      ['Thời lượng Pin', p.battery],
      ['Chống ồn (ANC)', p.anc],
      ['Chuẩn Bluetooth', p.bluetooth],
      ['Cổng sạc', p.port],
      ['Kháng nước', p.waterproof],
      ['Tương thích', p.compatibility || 'iOS, Android, Windows, macOS']
    ];
  } else if (p.category === 'Đồng hồ thông minh') {
    candidateSpecs = [
      ['Kích thước mặt', p.caseSize || p.screen],
      ['Màn hình', p.screen && p.screen !== p.caseSize ? p.screen : ''],
      ['Thời lượng Pin', p.battery],
      ['Bộ nhớ trong (ROM)', activeRom],
      ['Kháng nước', p.waterproof],
      ['Cảm biến sức khỏe', p.sensors],
      ['Tương thích', p.compatibility || (p.brand === 'Apple' ? 'iOS' : 'Android, iOS')]
    ];
  } else if (p.category === 'Phụ kiện') {
    candidateSpecs = [
      ['Công suất sạc (W)', p.power],
      ['Cổng kết nối / Đầu ra', p.port],
      ['Độ dài dây / Dung lượng', p.cableLength],
      ['Chuẩn sạc hỗ trợ', p.standard],
      ['Tính năng an toàn', p.safety || 'Bảo vệ quá dòng, chống đoản mạch MultiProtect']
    ];
  } else {
    candidateSpecs = [
      ['Màn hình', p.screen],
      ['Chip xử lý', p.chip],
      ['Dung lượng RAM', activeRam],
      ['Bộ nhớ trong (ROM)', activeRom],
      ['Camera', p.camera],
      ['Dung lượng Pin', p.battery]
    ];
  }

  // Lọc chỉ giữ lại các dòng CÓ DỮ LIỆU thực tế (bỏ các dòng rỗng hoặc '-')
  const validSpecs = candidateSpecs.filter(([k, v]) => {
    if (!v) return false;
    const str = String(v).trim();
    return str !== '' && str !== '-' && str !== 'null' && str !== 'undefined';
  });

  if (validSpecs.length === 0) {
    container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--color-ink-3);">Thông số kỹ thuật đang được cập nhật.</div>';
    return;
  }

  container.innerHTML = validSpecs.map(([k, v], idx) => `
    <div class="spec-data-row ${idx % 2 === 0 ? 'alt-row' : ''}">
      <span class="spec-row-key">${k}</span>
      <span class="spec-row-val">${v}</span>
    </div>
  `).join('');
}

/**
 * Tăng / Giảm số lượng chọn mua
 */
function changeDetailQty(delta) {
  if (!selectedVariant) {
    showCustomDialog('Vui lòng chọn màu sắc và phiên bản!', 'Thông báo', 'warning');
    return;
  }
  const maxStock = selectedVariant.stock || 0;
  if (maxStock <= 0) return;

  const next = selectedQty + delta;
  if (next >= 1 && next <= maxStock) {
    selectedQty = next;
    const qtyValEl = document.getElementById('detailQtyVal');
    if (qtyValEl) qtyValEl.textContent = selectedQty;
  } else if (next > maxStock) {
    showToast(`Kho chỉ còn ${maxStock} sản phẩm cho phiên bản này!`);
  }
}

function selectThumb(el) {
  document.querySelectorAll('.gallery-thumb-item').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

/**
 * RÀNG BUỘC NGHIỆP VỤ CHỌN BIẾN THỂ & KIỂM TRA TỒN KHO:
 * 1. BẮT BUỘC CHỌN ĐỦ THUỘC TÍNH (Màu sắc & Phiên bản/Dung lượng)
 * 2. CHO PHÉP KHÁCH CHƯA ĐĂNG NHẬP THÊM VÀO GIỎ (Guest Cart)
 * 3. KIỂM TRA TỒN KHO THỰC TẾ TRƯỚC KHI THỰC HIỆN
 */
function validateVariantSelection() {
  if (!currentProduct) return false;

  const romList = Array.from(new Set(
    (currentProduct.variants || []).map(v => v.rom).filter(Boolean).filter(r => r !== 'Tiêu chuẩn')
  ));
  const colorList = Array.from(new Set(
    (currentProduct.variants || []).map(v => v.color).filter(Boolean).filter(c => c !== 'Tiêu chuẩn')
  ));

  const hasRomOptions = romList.length > 0;
  const hasColorOptions = colorList.length > 0;

  // Bắt buộc chọn đầy đủ phiên bản (chưa chọn -> bật showCustomDialog)
  if ((hasColorOptions && !selectedColor) || (hasRomOptions && !selectedRom) || !selectedVariant) {
    showCustomDialog('Vui lòng chọn đầy đủ phiên bản!', 'Thông báo', 'warning');
    return false;
  }

  // Bắt buộc kiểm tra tồn kho
  if ((selectedVariant.stock || 0) <= 0) {
    showCustomDialog('Phiên bản này hiện đã hết hàng, vui lòng chọn phiên bản khác!', 'Hết hàng', 'warning');
    return false;
  }

  if (selectedQty > selectedVariant.stock) {
    showCustomDialog(`Số lượng bạn chọn (${selectedQty}) vượt quá số lượng còn lại trong kho (${selectedVariant.stock})!`, 'Vượt tồn kho', 'warning');
    return false;
  }

  return true;
}

/**
 * Xử lý bấm "Thêm vào giỏ"
 * Nghiệp vụ:
 * - Khách chưa đăng nhập vẫn thêm được vào giỏ hàng (Guest Cart)
 * - Chỉ lưu vào mảng giỏ hàng chính và cập nhật số lượng badge
 * - Tuyệt đối KHÔNG chuyển trang
 */
function handleDetailAddToCart() {
  if (!validateVariantSelection()) return;

  const res = addToCart(selectedVariant.sku, selectedQty);
  if (res.success) {
    showToast(`Đã thêm ${selectedQty} × ${currentProduct.name} (${selectedVariant.color}${selectedVariant.rom ? " · " + selectedVariant.rom : ""}) vào giỏ hàng!`);
  } else {
    showCustomDialog(res.message, 'Không thể thêm vào giỏ', 'error');
  }
}

/**
 * Xử lý bấm "Mua ngay"
 * Nghiệp vụ:
 * - Bắt buộc chọn đủ biến thể (chưa chọn -> showCustomDialog('Vui lòng chọn đầy đủ phiên bản!'))
 * - Lưu riêng thông tin item mua ngay vào LocalStorage dạng cờ/key tạm 'techno_buy_now' (không can thiệp mảng giỏ hàng chính)
 * - Nếu quay lại bấm Mua ngay tiếp: Cập nhật lại sản phẩm tạm (hoặc cộng dồn nếu cùng 1 SKU)
 * - Chuyển thẳng sang trang Thanh toán checkout.html
 */
function handleDetailBuyNow() {
  if (!validateVariantSelection()) return;

  // Lấy dữ liệu mua ngay tạm trước đó
  const prevBuyNow = getStorage('techno_buy_now', null);
  let qtyToBuy = selectedQty;

  if (prevBuyNow && prevBuyNow.sku === selectedVariant.sku) {
    // Nếu cùng 1 SKU thì cộng dồn nhưng không vượt quá tồn kho khả dụng
    qtyToBuy = Math.min(selectedVariant.stock, (Number(prevBuyNow.qty) || 0) + selectedQty);
  }

  // Lưu riêng vào LocalStorage tạm (Giỏ hàng chính techno_cart giữ nguyên)
  setStorage('techno_buy_now', {
    sku: selectedVariant.sku,
    productId: currentProduct.id,
    qty: qtyToBuy
  });

  // Chuyển thẳng sang trang Thanh toán
  window.location.href = 'checkout.html';
}

/**
 * Hiển thị Modal yêu cầu Đăng nhập (Chặn khách chưa đăng nhập)
 */
function showAuthRequiredModal() {
  let modal = document.getElementById('authRequiredModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'authRequiredModal';
    modal.className = 'modal-overlay pop';
    modal.innerHTML = `
      <div class="modal-box auth-modal-card">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--color-brand-50); display: grid; place-items: center; margin: 0 auto 16px;">
          <img src="../../assets/icon/con-nguoi.svg" class="icon icon-28" alt="" />
        </div>
        <h3 style="font-size: 20px; font-weight: 700; color: var(--color-ink);">Yêu cầu đăng nhập</h3>
        <p style="font-size: 14px; color: var(--color-ink-3); margin-top: 8px; line-height: 1.5;">
          Bạn cần đăng nhập tài khoản TechnoStore để thực hiện thêm sản phẩm vào giỏ hàng và đặt hàng.
        </p>

        <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 10px;">
          <a href="login.html" class="btn btn-primary btn-lg btn-full">
            Đăng nhập ngay
          </a>
          <button type="button" class="btn btn-secondary btn-md btn-full" onclick="quickGuestLoginDemo()">
            Đăng nhập nhanh (Tài khoản mẫu Nguyễn Minh Anh)
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onclick="closeAuthRequiredModal()">
            Để sau
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.style.display = 'grid';
}

function closeAuthRequiredModal() {
  const modal = document.getElementById('authRequiredModal');
  if (modal) modal.style.display = 'none';
}

/**
 * Đăng nhập nhanh tài khoản demo cho tiện kiểm thử đồ án
 */
function quickGuestLoginDemo() {
  setCurrentUser({
    id: 'KH001',
    name: 'Nguyễn Minh Anh',
    email: 'minhanh@mail.com',
    phone: '0901 234 567'
  });
  closeAuthRequiredModal();
  showToast('Đăng nhập thành công với tài khoản Nguyễn Minh Anh!');
  // Tải lại Header để cập nhật tên người dùng
  renderStoreHeader('headerContainer', {
    basePath: '../../',
    viewPath: '../'
  });
}

/**
 * Chuyển đổi tab Thông số / Mô tả
 */
function switchDetailTab(tab) {
  currentDetailTab = tab;
  document.getElementById('tabSpecBtn').classList.toggle('active', tab === 'spec');
  document.getElementById('tabDescBtn').classList.toggle('active', tab === 'desc');
  document.getElementById('tabSpecContent').style.display = tab === 'spec' ? 'block' : 'none';
  document.getElementById('tabDescContent').style.display = tab === 'desc' ? 'block' : 'none';
}
