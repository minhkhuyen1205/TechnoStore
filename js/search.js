/* ==========================================================================
   Search & Filter Controller
   TechnoStore - Pure JavaScript
   ========================================================================== */

const ITEMS_PER_PAGE = 6;

class FilterController {
  constructor(options = {}) {
    this.options = options;
    this.allProducts = getProducts().filter(p => !p.isDeleted);

    // State
    this.category = options.category || 'Tất cả';
    this.brands = options.brands || [];
    this.minPrice = options.minPrice || 0;
    this.maxPrice = options.maxPrice || 50000000;
    this.keyword = options.keyword || '';
    this.sortBy = options.sortBy || 'pop';
    this.page = options.page || 1;

    this.detailUrlPrefix = options.detailUrlPrefix || 'detail.html?id=';
    this.isHome = Boolean(options.isHome || (typeof window !== 'undefined' && (
      window.location.pathname.endsWith('index.html') ||
      window.location.pathname.endsWith('/') ||
      (!window.location.pathname.includes('search.html') &&
        !window.location.pathname.includes('detail.html') &&
        !window.location.pathname.includes('admin.html') &&
        !window.location.pathname.includes('cart.html') &&
        !window.location.pathname.includes('checkout.html') &&
        !window.location.pathname.includes('history.html') &&
        !window.location.pathname.includes('profile.html'))
    )));
  }

  init() {
    // Render động danh sách checkbox Hãng sản xuất từ dữ liệu thực tế
    this.renderBrandCheckboxes();
    this.filterActiveCategoryElements();
    this.readUrlParams();
    this.bindEvents();
    this.render();
  }

  /**
   * Render động danh sách checkbox Hãng sản xuất từ dữ liệu sản phẩm thực tế.
   * Không hardcode, tự động cập nhật khi thêm sản phẩm mới.
   */
  renderBrandCheckboxes() {
    const container = document.getElementById('brandCheckboxList');
    if (!container) return;

    // Thu thập danh sách hãng từ dữ liệu thực, bỏ trùng, sắp xếp a-z
    // Kết hợp hãng đang có sản phẩm với danh mục thương hiệu đã cấu hình sẵn.
    const brandSet = new Set([
      ...this.allProducts.map(p => p.brand).filter(Boolean),
      ...(Array.isArray(defaultBrands) ? defaultBrands : [])
    ]);
    const brandList = Array.from(brandSet).sort();

    if (brandList.length === 0) return;

    container.innerHTML = brandList.map(brand => `
      <label class="checkbox-label">
        <input type="checkbox" class="brand-filter-cb" value="${brand}" ${this.allProducts.some(p => p.brand === brand) ? '' : 'disabled title="Chưa có sản phẩm của hãng này trong danh sách mẫu"'} />
        ${brand}${this.allProducts.some(p => p.brand === brand) ? '' : ' (chưa có sản phẩm)'}
      </label>
    `).join('');

    // Đánh dấu lại nếu đang có brands đã chọn từ URL params
    if (this.brands.length > 0) {
      container.querySelectorAll('.brand-filter-cb').forEach(cb => {
        cb.checked = this.brands.includes(cb.value);
      });
    }
  }

  filterActiveCategoryElements() {
    const activeCats = typeof getActiveCategories === 'function' ? getActiveCategories() : [];
    if (!activeCats || activeCats.length === 0) return;

    // Ẩn nút Pill của danh mục không hoạt động (inactive)
    document.querySelectorAll('.cat-pill-btn').forEach(btn => {
      const cat = btn.dataset.category;
      if (cat && cat !== 'Tất cả') {
        btn.style.display = activeCats.includes(cat) ? '' : 'none';
      }
    });

    // Ẩn option của danh mục không hoạt động (inactive) trong Dropdown select
    const catSelect = document.getElementById('filterCategorySelect');
    if (catSelect) {
      Array.from(catSelect.options).forEach(opt => {
        if (opt.value && opt.value !== 'Tất cả') {
          opt.style.display = activeCats.includes(opt.value) ? '' : 'none';
          opt.disabled = !activeCats.includes(opt.value);
        }
      });
    }
  }

  readUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('q')) {
      this.keyword = urlParams.get('q');
      const kwInput = document.getElementById('filterKeywordInput');
      if (kwInput) kwInput.value = this.keyword;
      const searchLargeInput = document.getElementById('searchLargeInput');
      if (searchLargeInput) searchLargeInput.value = this.keyword;
    }
    if (urlParams.has('cat')) {
      this.category = urlParams.get('cat');
      const catSelect = document.getElementById('filterCategorySelect');
      if (catSelect) catSelect.value = this.category;
    }
  }

  bindEvents() {
    // Keyword input trong sidebar filter
    const kwInput = document.getElementById('filterKeywordInput');
    if (kwInput) {
      kwInput.addEventListener('input', (e) => {
        this.keyword = e.target.value.trim();
        this.page = 1;
        // Đồng bộ 2 chiều: cập nhật ô tìm kiếm lớn phía trên
        const searchLargeInput = document.getElementById('searchLargeInput');
        if (searchLargeInput) searchLargeInput.value = this.keyword;
        const headerInput = document.getElementById('headerSearchInput');
        if (headerInput) headerInput.value = this.keyword;
        this.applyFilters();
      });
    }

    // Đồng bộ từ khóa nhập ở thanh tìm kiếm Header về bộ lọc bên trái.
    const headerInput = document.getElementById('headerSearchInput');
    if (headerInput) {
      headerInput.addEventListener('input', (e) => {
        this.keyword = e.target.value.trim();
        this.page = 1;
        const kwInput = document.getElementById('filterKeywordInput');
        const searchLargeInput = document.getElementById('searchLargeInput');
        if (kwInput) kwInput.value = this.keyword;
        if (searchLargeInput) searchLargeInput.value = this.keyword;
        this.applyFilters();
      });
    }

    // Category select or pills
    const catSelect = document.getElementById('filterCategorySelect');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.category = e.target.value;
        this.page = 1;
        this.applyFilters();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('filterSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    // Price range slider
    const priceRange = document.getElementById('filterPriceRange');
    const priceMaxInput = document.getElementById('filterPriceMax');
    const priceMinInput = document.getElementById('filterPriceMin');
    const priceRangeLabel = document.getElementById('priceRangeLabel');

    if (priceRange) {
      priceRange.addEventListener('input', (e) => {
        this.maxPrice = Number(e.target.value);
        if (priceMaxInput) priceMaxInput.value = this.maxPrice;
        if (priceRangeLabel) priceRangeLabel.textContent = `${vnd(this.minPrice)} – ${vnd(this.maxPrice)}`;
        this.page = 1;
        this.applyFilters();
      });
    }

    if (priceMinInput) {
      priceMinInput.addEventListener('change', (e) => {
        this.minPrice = Number(e.target.value) || 0;
        if (priceRangeLabel) priceRangeLabel.textContent = `${vnd(this.minPrice)} – ${vnd(this.maxPrice)}`;
        this.page = 1;
        this.applyFilters();
      });
    }

    if (priceMaxInput) {
      priceMaxInput.addEventListener('change', (e) => {
        this.maxPrice = Number(e.target.value) || 50000000;
        if (priceRange) priceRange.value = this.maxPrice;
        if (priceRangeLabel) priceRangeLabel.textContent = `${vnd(this.minPrice)} – ${vnd(this.maxPrice)}`;
        this.page = 1;
        this.applyFilters();
      });
    }

    // Brand Checkboxes - dùng event delegation để hỗ trợ checkbox render động
    const brandList = document.getElementById('brandCheckboxList');
    if (brandList) {
      brandList.addEventListener('change', () => {
        const checked = Array.from(document.querySelectorAll('.brand-filter-cb:checked')).map(el => el.value);
        this.brands = checked;
        this.page = 1;
        this.applyFilters();
      });
    } else {
      // Fallback cho checkbox đã render sẵn trong HTML
      document.querySelectorAll('.brand-filter-cb').forEach(cb => {
        cb.addEventListener('change', () => {
          const checked = Array.from(document.querySelectorAll('.brand-filter-cb:checked')).map(el => el.value);
          this.brands = checked;
          this.page = 1;
          this.applyFilters();
        });
      });
    }
  }

  setCategory(cat) {
    this.category = cat;
    this.page = 1;

    // Update active pill button
    document.querySelectorAll('.cat-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === cat);
    });

    const catSelect = document.getElementById('filterCategorySelect');
    if (catSelect) catSelect.value = cat;

    this.applyFilters();
  }

  reset() {
    this.category = 'Tất cả';
    this.brands = [];
    this.minPrice = 0;
    this.maxPrice = 50000000;
    this.keyword = '';
    this.sortBy = 'pop';
    this.page = 1;

    // Reset DOM controls
    const kwInput = document.getElementById('filterKeywordInput');
    if (kwInput) kwInput.value = '';

    // Đồng bộ 2 chiều: xóa ô tìm kiếm lớn phía trên
    const searchLargeInput = document.getElementById('searchLargeInput');
    if (searchLargeInput) searchLargeInput.value = '';
    const headerInput = document.getElementById('headerSearchInput');
    if (headerInput) headerInput.value = '';

    const catSelect = document.getElementById('filterCategorySelect');
    if (catSelect) catSelect.value = 'Tất cả';

    const sortSelect = document.getElementById('filterSortSelect');
    if (sortSelect) sortSelect.value = 'pop';

    const priceRange = document.getElementById('filterPriceRange');
    if (priceRange) priceRange.value = 50000000;

    const priceMin = document.getElementById('filterPriceMin');
    if (priceMin) priceMin.value = 0;

    const priceMax = document.getElementById('filterPriceMax');
    if (priceMax) priceMax.value = 50000000;

    const priceLabel = document.getElementById('priceRangeLabel');
    if (priceLabel) priceLabel.textContent = `${vnd(0)} – ${vnd(50000000)}`;

    document.querySelectorAll('.brand-filter-cb').forEach(cb => cb.checked = false);
    document.querySelectorAll('.cat-pill-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.category === 'Tất cả'));

    // Làm sạch URL (xóa ?q=...&cat=... khỏi thanh địa chỉ trình duyệt)
    window.history.replaceState({}, document.title, window.location.pathname);

    this.applyFilters();
  }

  filterList() {
    const kw = this.keyword.toLowerCase();

    let list = this.allProducts.filter(p => {
      const matchCat = this.category === 'Tất cả' || p.category === this.category;
      const matchBrand = this.brands.length === 0 || this.brands.includes(p.brand);
      const curPrice = p.basePrice || p.price || 0;
      const matchPrice = curPrice >= this.minPrice && curPrice <= this.maxPrice;
      const matchName = !kw ||
        p.name.toLowerCase().includes(kw) ||
        p.brand.toLowerCase().includes(kw) ||
        (p.variants && p.variants.some(v => v.sku.toLowerCase().includes(kw) || v.color.toLowerCase().includes(kw) || (v.rom && v.rom.toLowerCase().includes(kw))));
      return matchCat && matchBrand && matchPrice && matchName;
    });

    // 1. TRANG CHỦ: ẨN HOÀN TOÀN các sản phẩm có tổng tồn kho bằng 0
    if (this.isHome) {
      list = list.filter(p => (Number(p.stock) || 0) > 0);
    }

    // 2. Sắp xếp theo tiêu chí người dùng chọn
    if (this.sortBy === 'asc') {
      list.sort((a, b) => (a.basePrice || a.price) - (b.basePrice || b.price));
    } else if (this.sortBy === 'desc') {
      list.sort((a, b) => (b.basePrice || b.price) - (a.basePrice || a.price));
    } else {
      // 'pop' = bán chạy nhất
      list.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    }

    // 3. TRANG DANH MỤC & TÌM KIẾM (search.html):
    // TỰ ĐỘNG ĐẨY SẢN PHẨM HẾT HÀNG XUỐNG DƯỚI CÙNG của danh sách kết quả
    if (!this.isHome) {
      list.sort((a, b) => {
        const aInStock = (Number(a.stock) || 0) > 0 ? 1 : 0;
        const bInStock = (Number(b.stock) || 0) > 0 ? 1 : 0;
        if (aInStock !== bInStock) {
          return bInStock - aInStock; // 1 (còn hàng) xếp trước, 0 (hết hàng) xếp sau
        }
        return 0; // Giữ nguyên thứ tự ưu tiên đã sắp xếp trước đó
      });
    }

    return list;
  }

  setPage(p) {
    this.page = p;
    this.render();
    const target = document.getElementById('list') || document.getElementById('productsGrid');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Dùng chung một điểm vào khi áp dụng mọi thay đổi trên các bộ lọc.
  applyFilters() {
    this.render();
  }

  render() {
    const filtered = this.filterList();
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
    this.page = Math.min(this.page, totalPages);

    const startIndex = (this.page - 1) * ITEMS_PER_PAGE;
    const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Cập nhật số lượng kết quả
    const countEl = document.getElementById('productCountDisplay');
    if (countEl) {
      countEl.textContent = `${totalCount} sản phẩm phù hợp`;
    }

    // Render lưới sản phẩm
    renderProductGrid('productsGrid', pageItems, {
      detailUrl: (p) => `${this.detailUrlPrefix}${p.id}`,
      isHome: this.isHome
    });

    // Render phân trang
    const paginationContainer = document.getElementById('paginationContainer');
    if (paginationContainer) {
      paginationContainer.innerHTML = renderPagination(this.page, totalPages, 'window.filterCtrl.setPage.bind(window.filterCtrl)');
    }
  }
}
