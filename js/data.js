/**
 * Định dạng tiền tệ Việt Nam (VNĐ)
 * @param {number|string} n - Số tiền cần format
 * @returns {string} Chuỗi hiển thị VNĐ (VD: 34.990.000 ₫)
 */
function vnd(n) {
  if (typeof n !== 'number') n = Number(n) || 0;
  return n.toLocaleString('vi-VN') + ' ₫';
}

/**
 * Chuyển chuỗi tiếng Việt có dấu thành mã viết hoa không dấu dùng cho SKU
 * @param {string} str - Chuỗi ban đầu (VD: "Titan Đen")
 * @returns {string} Chuỗi slug (VD: "TITAN_DEN")
 */
function slugifySkuPart(str) {
  if (!str) return 'DEF';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase();
}

// ==========================================================================
// 1. DANH MỤC & THƯƠNG HIỆU MẶC ĐỊNH
// ==========================================================================
// 1. DANH MỤC & THƯƠNG HIỆU MẶC ĐỊNH (CÓ THUỘC TÍNH STATUS)
// ==========================================================================
const defaultCategories = [
  { id: 'DM01', name: 'Điện thoại', type: 'Thiết bị chính', status: 'active' },
  { id: 'DM02', name: 'Máy tính bảng', type: 'Thiết bị chính', status: 'active' },
  { id: 'DM03', name: 'Tai nghe', type: 'Phụ kiện & Đeo', status: 'active' },
  { id: 'DM04', name: 'Đồng hồ thông minh', type: 'Phụ kiện & Đeo', status: 'active' },
  { id: 'DM05', name: 'Phụ kiện', type: 'Phụ kiện & Đeo', status: 'active' }
];
const defaultBrands = ["Apple", "Samsung", "Xiaomi", "OPPO", "Vivo", "Realme", "ASUS", "Sony", "Anker", "Google"];

// ==========================================================================
// 2. DANH SÁCH 20 SẢN PHẨM CÔNG NGHỆ THỰC TẾ (DEFAULT_PRODUCTS)
// Phân bổ chính xác theo 5 danh mục:
// - Điện thoại: 9 sản phẩm
// - Máy tính bảng: 4 sản phẩm
// - Tai nghe: 3 sản phẩm
// - Đồng hồ thông minh: 2 sản phẩm
// - Phụ kiện: 2 sản phẩm
// ==========================================================================

const defaultProducts = [
  {
    "id": 1,
    "code": "SP001",
    "name": "iPhone 16 Pro Max",
    "brand": "Apple",
    "category": "Điện thoại",
    "description": "iPhone 16 Pro Max sở hữu màn hình Super Retina XDR 6.9\" viền siêu mỏng, chip Apple A18 Pro mạnh mẽ vượt trội cùng camera 48MP Fusion thế hệ mới. Khung viền Titan chuẩn hàng không vũ trụ siêu nhẹ và bền bỉ.",
    "image": "",
    "createdAt": "2026-09-20",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "6.9\" OLED Super Retina XDR 120Hz",
    "chip": "Apple A18 Pro",
    "camera": "48MP Fusion + 48MP Ultra Wide + 12MP Telephoto 5x",
    "battery": "4685 mAh, Sạc nhanh 30W",
    "connectivity": "5G, Wi-Fi 7, Bluetooth 5.3",
    "os": "iOS 18",
    "color": [
      "#d9d4cb",
      "#8c867b"
    ],
    "rating": 4.9,
    "isNew": true,
    "imported": 60,
    "sold": 36,
    "variants": [
      {
        "sku": "SP001-TITAN_DEN-8GB-256GB",
        "color": "Titan Đen",
        "ram": "8GB",
        "rom": "256GB",
        "cost": 30200000,
        "price": 34990000,
        "stock": 14
      },
      {
        "sku": "SP001-TITAN_TRANG-8GB-256GB",
        "color": "Titan Trắng",
        "ram": "8GB",
        "rom": "256GB",
        "cost": 30200000,
        "price": 34990000,
        "stock": 10
      },
      {
        "sku": "SP001-TITAN_TU_NHIEN-8GB-512GB",
        "color": "Titan Tự Nhiên",
        "ram": "8GB",
        "rom": "512GB",
        "cost": 34500000,
        "price": 39990000,
        "stock": 8
      },
      {
        "sku": "SP001-TITAN_SA_MAC-8GB-1TB",
        "color": "Titan Sa Mạc",
        "ram": "8GB",
        "rom": "1TB",
        "cost": 40000000,
        "price": 46990000,
        "stock": 0
      }
    ]
  },
  {
    "id": 2,
    "code": "SP002",
    "name": "iPhone 16",
    "brand": "Apple",
    "category": "Điện thoại",
    "description": "iPhone 16 mang đến chip A18 Bionic tiên tiến, nút Điều Khiển Camera hoàn toàn mới và hệ thống Camera Fusion 48MP đột phá 2 trong 1. Hỗ trợ hệ sinh thái Apple Intelligence với thiết kế mặt lưng kính pha màu rực rỡ.",
    "image": "",
    "createdAt": "2026-09-20",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "6.1\" OLED Super Retina XDR 60Hz",
    "chip": "Apple A18 Bionic",
    "camera": "48MP Fusion + 12MP Ultra Wide",
    "battery": "3561 mAh, Sạc nhanh 25W",
    "connectivity": "5G, Wi-Fi 7, Bluetooth 5.3",
    "os": "iOS 18",
    "color": [
      "#f3c9d0",
      "#d38b98"
    ],
    "rating": 4.7,
    "isNew": true,
    "imported": 80,
    "sold": 39,
    "variants": [
      {
        "sku": "SP002-HONG_PASTEL-8GB-128GB",
        "color": "Hồng Pastel",
        "ram": "8GB",
        "rom": "128GB",
        "cost": 16500000,
        "price": 18990000,
        "stock": 15
      },
      {
        "sku": "SP002-XANH_LUU_LY-8GB-128GB",
        "color": "Xanh Lưu Ly",
        "ram": "8GB",
        "rom": "128GB",
        "cost": 16500000,
        "price": 18990000,
        "stock": 10
      },
      {
        "sku": "SP002-DEN_NHAM-8GB-256GB",
        "color": "Đen Nhám",
        "ram": "8GB",
        "rom": "256GB",
        "cost": 19000000,
        "price": 21990000,
        "stock": 5
      }
    ]
  },
  {
    "id": 3,
    "code": "SP003",
    "name": "Samsung Galaxy S25 Ultra",
    "brand": "Samsung",
    "category": "Điện thoại",
    "description": "Galaxy S25 Ultra trang bị chip Snapdragon 8 Elite đỉnh cao, camera 200MP bắt trọn từng chi tiết, tích hợp bút S-Pen thông minh và bộ tính năng Galaxy AI tiên tiến nhất hiện nay cùng khung viền Titan sang trọng.",
    "image": "",
    "createdAt": "2026-09-22",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "6.9\" Dynamic AMOLED 2X 120Hz",
    "chip": "Snapdragon 8 Elite for Galaxy",
    "camera": "200MP + 50MP + 50MP + 10MP (S-Pen)",
    "battery": "5000 mAh, Sạc nhanh 45W",
    "connectivity": "5G, Wi-Fi 7, Bluetooth 5.4",
    "os": "Android 15 (One UI 7)",
    "color": [
      "#2b3a55",
      "#0f1626"
    ],
    "rating": 4.8,
    "isNew": true,
    "imported": 40,
    "sold": 32,
    "variants": [
      {
        "sku": "SP003-XANH_TITAN-12GB-256GB",
        "color": "Xanh Titan",
        "ram": "12GB",
        "rom": "256GB",
        "cost": 26000000,
        "price": 30490000,
        "stock": 15
      },
      {
        "sku": "SP003-DEN_TITAN-12GB-512GB",
        "color": "Đen Titan",
        "ram": "12GB",
        "rom": "512GB",
        "cost": 28900000,
        "price": 33490000,
        "stock": 8
      },
      {
        "sku": "SP003-XAM_TITAN-16GB-1TB",
        "color": "Xám Titan",
        "ram": "16GB",
        "rom": "1TB",
        "cost": 36000000,
        "price": 41990000,
        "stock": 4
      }
    ]
  },
  {
    "id": 4,
    "code": "SP004",
    "name": "Samsung Galaxy Z Flip6",
    "brand": "Samsung",
    "category": "Điện thoại",
    "description": "Điện thoại gập thời thượng Galaxy Z Flip6 với màn hình phụ FlexWindow thông minh, camera 50MP nâng cấp vượt bậc, vi xử lý Snapdragon 8 Gen 3 for Galaxy và viên pin 4000mAh bền bỉ suốt cả ngày.",
    "image": "",
    "createdAt": "2026-09-18",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "6.7\" Dynamic AMOLED 2X (Phụ 3.4\" Super AMOLED)",
    "chip": "Snapdragon 8 Gen 3 for Galaxy",
    "camera": "50MP Dual Pixel OIS + 12MP Ultra Wide",
    "battery": "4000 mAh, Sạc nhanh 25W",
    "connectivity": "5G, Wi-Fi 6E, Bluetooth 5.3",
    "os": "Android 14 (One UI 6.1.1)",
    "color": [
      "#a4c8e1",
      "#5d8aa8"
    ],
    "rating": 4.8,
    "imported": 50,
    "sold": 28,
    "variants": [
      {
        "sku": "SP004-XANH_MAYA-12GB-256GB",
        "color": "Xanh Maya",
        "ram": "12GB",
        "rom": "256GB",
        "cost": 18500000,
        "price": 21990000,
        "stock": 10
      },
      {
        "sku": "SP004-XAM_METAL-12GB-256GB",
        "color": "Xám Metal",
        "ram": "12GB",
        "rom": "256GB",
        "cost": 18500000,
        "price": 21990000,
        "stock": 6
      },
      {
        "sku": "SP004-VANG_SOLAR-12GB-512GB",
        "color": "Vàng Solar",
        "ram": "12GB",
        "rom": "512GB",
        "cost": 21500000,
        "price": 25490000,
        "stock": 5
      }
    ]
  },
  {
    "id": 5,
    "code": "SP005",
    "name": "Xiaomi 15 Ultra",
    "brand": "Xiaomi",
    "category": "Điện thoại",
    "description": "Xiaomi 15 Ultra đồng chế tác cùng Leica với cụm camera tiềm vọng 200MP cực khủng, màn hình 2K AMOLED 120Hz siêu sáng, vi xử lý Snapdragon 8 Elite cùng viên pin silicon-carbon dung lượng 6000mAh.",
    "image": "",
    "createdAt": "2026-09-25",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "6.73\" AMOLED 2K 120Hz LTPO",
    "chip": "Snapdragon 8 Elite",
    "camera": "Leica 50MP 1-inch + 200MP Periscope + 50MP Tele + 50MP Ultra Wide",
    "battery": "6000 mAh, Sạc nhanh 90W",
    "connectivity": "5G, Wi-Fi 7, Bluetooth 5.4",
    "os": "Xiaomi HyperOS 2.0",
    "color": [
      "#111213",
      "#faf6f0"
    ],
    "rating": 4.9,
    "isNew": true,
    "imported": 45,
    "sold": 22,
    "variants": [
      {
        "sku": "SP005-DEN_GOM-12GB-256GB",
        "color": "Đen Gốm",
        "ram": "12GB",
        "rom": "256GB",
        "cost": 21000000,
        "price": 24990000,
        "stock": 12
      },
      {
        "sku": "SP005-TRANG_GOM-16GB-512GB",
        "color": "Trắng Gốm",
        "ram": "16GB",
        "rom": "512GB",
        "cost": 24500000,
        "price": 28990000,
        "stock": 8
      }
    ]
  },
  {
    "id": 6,
    "code": "SP006",
    "name": "OPPO Find X8 Pro",
    "brand": "OPPO",
    "category": "Điện thoại",
    "description": "OPPO Find X8 Pro thiết lập chuẩn mực mới về nhiếp ảnh với cụm camera kép tiềm vọng Hasselblad, chip MediaTek Dimensity 9400 thế hệ mới, phím chụp nhanh chuyên dụng và pin siêu trâu 5910mAh.",
    "image": "",
    "createdAt": "2026-09-26",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "6.78\" AMOLED 1.5K 120Hz cong 4 cạnh",
    "chip": "MediaTek Dimensity 9400",
    "camera": "Hasselblad 50MP + 50MP Periscope đôi + 50MP Ultra Wide",
    "battery": "5910 mAh, Sạc SuperVOOC 80W",
    "connectivity": "5G, Wi-Fi 7, Bluetooth 5.4",
    "os": "ColorOS 15 (Android 15)",
    "color": [
      "#faf6f0",
      "#1c1d1f"
    ],
    "rating": 4.8,
    "isNew": true,
    "imported": 35,
    "sold": 16,
    "variants": [
      {
        "sku": "SP006-TRANG_NGOC_TRAI-12GB-256GB",
        "color": "Trắng Ngọc Trai",
        "ram": "12GB",
        "rom": "256GB",
        "cost": 19500000,
        "price": 22990000,
        "stock": 2
      },
      {
        "sku": "SP006-DEN_KHONG_GIAN-16GB-512GB",
        "color": "Đen Không Gian",
        "ram": "16GB",
        "rom": "512GB",
        "cost": 22800000,
        "price": 26990000,
        "stock": 1
      }
    ]
  },
  {
    "id": 7,
    "code": "SP007",
    "name": "Vivo X100 Pro",
    "brand": "Vivo",
    "category": "Điện thoại",
    "description": "Vivo X100 Pro tích hợp cụm ống kính quang học ZEISS đỉnh cao với cảm biến 1-inch, vi xử lý Dimensity 9300 tối ưu hóa cùng chip xử lý hình ảnh V3 độc quyền cho trải nghiệm chụp ảnh như máy ảnh cơ.",
    "image": "",
    "createdAt": "2026-09-24",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "6.78\" LTPO AMOLED 120Hz 3000 nits",
    "chip": "MediaTek Dimensity 9300",
    "camera": "ZEISS 50MP 1-inch + 50MP APO Telephoto + 50MP Ultra Wide",
    "battery": "5400 mAh, Sạc nhanh 100W",
    "connectivity": "5G, Wi-Fi 7, Bluetooth 5.4",
    "os": "Funtouch OS 14 (Android 14)",
    "color": [
      "#3b5998",
      "#1a1a1a"
    ],
    "rating": 4.7,
    "imported": 30,
    "sold": 15,
    "variants": [
      {
        "sku": "SP007-XANH_ANH_SAO-16GB-512GB",
        "color": "Xanh Ánh Sao",
        "ram": "16GB",
        "rom": "512GB",
        "cost": 18200000,
        "price": 21490000,
        "stock": 2
      },
      {
        "sku": "SP007-DEN_HUYEN_BI-16GB-512GB",
        "color": "Đen Huyền Bí",
        "ram": "16GB",
        "rom": "512GB",
        "cost": 18200000,
        "price": 21490000,
        "stock": 2
      }
    ]
  },
  {
    "id": 8,
    "code": "SP008",
    "name": "Realme GT 6",
    "brand": "Realme",
    "category": "Điện thoại",
    "description": "Sát thủ hiệu năng Realme GT 6 sở hữu màn hình sáng nhất thế giới 6000 nits, chip Snapdragon 8s Gen 3 xử lý mượt mà mọi tựa game, camera 50MP cảm biến Sony LYT-808 cao cấp và sạc siêu nhanh 120W.",
    "image": "",
    "createdAt": "2026-09-21",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "6.78\" AMOLED 1.5K 120Hz 6000 nits đỉnh",
    "chip": "Snapdragon 8s Gen 3",
    "camera": "Sony LYT-808 50MP OIS + 50MP Telephoto + 8MP Ultra Wide",
    "battery": "5500 mAh, Sạc nhanh 120W SuperVOOC",
    "connectivity": "5G, Wi-Fi 6, Bluetooth 5.4",
    "os": "realme UI 5.0 (Android 14)",
    "color": [
      "#cfd8dc",
      "#00695c"
    ],
    "rating": 4.6,
    "imported": 40,
    "sold": 22,
    "variants": [
      {
        "sku": "SP008-BAC_ANH_KIM-12GB-256GB",
        "color": "Bạc Ánh Kim",
        "ram": "12GB",
        "rom": "256GB",
        "cost": 11200000,
        "price": 13490000,
        "stock": 14
      },
      {
        "sku": "SP008-XANH_LUC_BAO-16GB-512GB",
        "color": "Xanh Lục Bảo",
        "ram": "16GB",
        "rom": "512GB",
        "cost": 13000000,
        "price": 15490000,
        "stock": 8
      }
    ]
  },
  {
    "id": 9,
    "code": "SP009",
    "name": "ASUS ROG Phone 9",
    "brand": "ASUS",
    "category": "Điện thoại",
    "description": "Quái thú gaming ASUS ROG Phone 9 trang bị chip Snapdragon 8 Elite đỉnh nóc kịch trần, tần số quét kỷ lục 185Hz, hệ thống tản nhiệt buồng hơi GameCool 9 cùng màn hình AniMe Vision mặt lưng độc đáo.",
    "image": "",
    "createdAt": "2026-09-27",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "6.78\" AMOLED FHD+ 185Hz AniMe Vision",
    "chip": "Snapdragon 8 Elite tản nhiệt buồng hơi 3D",
    "camera": "Gimbal 50MP Sony Lytia 700 + 13MP Ultra Wide + 5MP Macro",
    "battery": "5800 mAh, Sạc HyperCharge 65W",
    "connectivity": "5G kép, Wi-Fi 7, Bluetooth 5.4",
    "os": "ROG UI (Android 15)",
    "color": [
      "#111111",
      "#eeeeee"
    ],
    "rating": 4.9,
    "isNew": true,
    "imported": 25,
    "sold": 13,
    "variants": [
      {
        "sku": "SP009-DEN_PHANTOM-12GB-256GB",
        "color": "Đen Phantom",
        "ram": "12GB",
        "rom": "256GB",
        "cost": 20000000,
        "price": 23990000,
        "stock": 2
      },
      {
        "sku": "SP009-TRANG_STORM-16GB-512GB",
        "color": "Trắng Storm",
        "ram": "16GB",
        "rom": "512GB",
        "cost": 24000000,
        "price": 27990000,
        "stock": 1
      }
    ]
  },
  {
    "id": 10,
    "code": "SP010",
    "name": "iPad Pro M4",
    "brand": "Apple",
    "category": "Máy tính bảng",
    "description": "iPad Pro M4 thiết kế siêu mỏng kỷ lục 5.1mm, trang bị màn hình Ultra Retina XDR Tandem OLED tiên phong kết hợp sức mạnh phi thường từ chip Apple M4 thế hệ mới, đáp ứng hoàn hảo mọi tác vụ đồ họa chuyên sâu.",
    "image": "",
    "createdAt": "2026-09-15",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "11\" Ultra Retina XDR Tandem OLED 120Hz",
    "chip": "Apple M4 9 nhân",
    "camera": "12MP Wide sau, LiDAR Scanner, 12MP Ultra Wide trước",
    "battery": "31.29 Wh (~10 giờ lướt web)",
    "connectivity": "Wi-Fi 6E / 5G, Bluetooth 5.3",
    "os": "iPadOS 18",
    "color": [
      "#e2e4e8",
      "#1c1d1f"
    ],
    "rating": 4.9,
    "isNew": true,
    "imported": 40,
    "sold": 18,
    "variants": [
      {
        "sku": "SP010-BAC_ANH_KIM-8GB-256GB",
        "color": "Bạc Ánh Kim",
        "ram": "8GB",
        "rom": "256GB",
        "cost": 25200000,
        "price": 28990000,
        "stock": 12
      },
      {
        "sku": "SP010-DEN_KHONG_GIAN-8GB-512GB",
        "color": "Đen Không Gian",
        "ram": "8GB",
        "rom": "512GB",
        "cost": 29500000,
        "price": 34490000,
        "stock": 6
      }
    ]
  },
  {
    "id": 11,
    "code": "SP011",
    "name": "iPad Air 6",
    "brand": "Apple",
    "category": "Máy tính bảng",
    "description": "iPad Air 6 nâng cấp vượt bậc với chip Apple M2 mạnh mẽ, màn hình Liquid Retina tuyệt đẹp sắc nét, camera trước Center Stage góc siêu rộng nằm ở cạnh ngang tối ưu cho gọi video và học tập trực tuyến.",
    "image": "",
    "createdAt": "2026-09-15",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "11\" Liquid Retina IPS LED True Tone",
    "chip": "Apple M2 mạnh mẽ",
    "camera": "12MP Wide sau, 12MP Ultra Wide trước Center Stage",
    "battery": "28.93 Wh (~10 giờ liên tục)",
    "connectivity": "Wi-Fi 6E, Bluetooth 5.3",
    "os": "iPadOS 18",
    "color": [
      "#757575",
      "#64b5f6"
    ],
    "rating": 4.8,
    "imported": 50,
    "sold": 26,
    "variants": [
      {
        "sku": "SP011-XAM_KHONG_GIAN-8GB-128GB",
        "color": "Xám Không Gian",
        "ram": "8GB",
        "rom": "128GB",
        "cost": 14500000,
        "price": 16990000,
        "stock": 15
      },
      {
        "sku": "SP011-XANH_DUONG-8GB-128GB",
        "color": "Xanh Dương",
        "ram": "8GB",
        "rom": "128GB",
        "cost": 14500000,
        "price": 16990000,
        "stock": 10
      },
      {
        "sku": "SP011-TIM_PASTEL-8GB-256GB",
        "color": "Tím Pastel",
        "ram": "8GB",
        "rom": "256GB",
        "cost": 16800000,
        "price": 19490000,
        "stock": 7
      }
    ]
  },
  {
    "id": 12,
    "code": "SP012",
    "name": "Samsung Galaxy Tab S10+",
    "brand": "Samsung",
    "category": "Máy tính bảng",
    "description": "Galaxy Tab S10+ sở hữu màn hình Dynamic AMOLED 2X 12.4\" phủ lớp chống chói cao cấp, chip MediaTek Dimensity 9300+ tiến trình 4nm, kèm bút S-Pen kháng nước chuẩn IP68 và quyền năng Galaxy AI vượt trội.",
    "image": "",
    "createdAt": "2026-09-23",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "12.4\" Dynamic AMOLED 2X 120Hz chống chói",
    "chip": "MediaTek Dimensity 9300+ (Kèm bút S-Pen)",
    "camera": "13MP + 8MP Ultra Wide sau, 12MP trước",
    "battery": "10090 mAh, Sạc siêu nhanh 45W",
    "connectivity": "5G, Wi-Fi 7, Bluetooth 5.3",
    "os": "Android 14 (One UI 6.1.1, Galaxy AI)",
    "color": [
      "#686b73",
      "#e5e7eb"
    ],
    "rating": 4.8,
    "imported": 35,
    "sold": 18,
    "variants": [
      {
        "sku": "SP012-XAM_MOONSTONE-12GB-256GB",
        "color": "Xám Moonstone",
        "ram": "12GB",
        "rom": "256GB",
        "cost": 21000000,
        "price": 24990000,
        "stock": 2
      },
      {
        "sku": "SP012-BAC_PLATINUM-12GB-512GB",
        "color": "Bạc Platinum",
        "ram": "12GB",
        "rom": "512GB",
        "cost": 24500000,
        "price": 28490000,
        "stock": 2
      }
    ]
  },
  {
    "id": 13,
    "code": "SP013",
    "name": "Xiaomi Pad 6 Pro",
    "brand": "Xiaomi",
    "category": "Máy tính bảng",
    "description": "Máy tính bảng Xiaomi Pad 6 Pro mang đến màn hình 11\" tần số quét mượt mà 144Hz chuẩn màu 2.8K, vi xử lý Snapdragon 8+ Gen 1 mạnh mẽ, hệ thống 4 loa Dolby Atmos đỉnh cao và sạc siêu tốc 67W.",
    "image": "",
    "createdAt": "2026-09-17",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "RAM",
      "ROM"
    ],
    "screen": "11\" LCD 2.8K 144Hz HDR10+ Dolby Vision",
    "chip": "Snapdragon 8+ Gen 1",
    "camera": "50MP sau, 20MP trước",
    "battery": "8600 mAh, Sạc nhanh 67W",
    "connectivity": "Wi-Fi 6, Bluetooth 5.3",
    "os": "Xiaomi HyperOS",
    "color": [
      "#37474f",
      "#80deea"
    ],
    "rating": 4.7,
    "imported": 50,
    "sold": 30,
    "variants": [
      {
        "sku": "SP013-DEN_TITAN-8GB-128GB",
        "color": "Đen Titan",
        "ram": "8GB",
        "rom": "128GB",
        "cost": 7200000,
        "price": 8990000,
        "stock": 16
      },
      {
        "sku": "SP013-XANH_BANG-12GB-256GB",
        "color": "Xanh Băng",
        "ram": "12GB",
        "rom": "256GB",
        "cost": 8800000,
        "price": 10990000,
        "stock": 9
      }
    ]
  },
  {
    "id": 14,
    "code": "SP014",
    "name": "AirPods Pro 2",
    "brand": "Apple",
    "category": "Tai nghe",
    "description": "Tai nghe AirPods Pro 2 cổng sạc USB-C trang bị chip Apple H2 mang lại khả năng chống ồn chủ động ANC tốt hơn gấp 2 lần, chế độ Xuyên Âm Thích Ứng thông minh và chuẩn kháng bụi nước IP54 bền bỉ.",
    "image": "",
    "createdAt": "2026-09-16",
    "isDeleted": false,
    "attributes": [
      "Màu sắc"
    ],
    "battery": "6 giờ nghe liên tục (30 giờ kèm hộp sạc)",
    "anc": "Chống ồn chủ động ANC thế hệ 2 gấp 2 lần",
    "bluetooth": "Bluetooth 5.3, Chip Apple H2",
    "port": "USB-C, Hỗ trợ sạc MagSafe, Apple Watch Charger",
    "waterproof": "IP54 (Cả tai nghe và hộp sạc)",
    "color": [
      "#ffffff",
      "#e0e0e0"
    ],
    "rating": 4.9,
    "imported": 80,
    "sold": 45,
    "variants": [
      {
        "sku": "SP014-TRANG",
        "color": "Trắng",
        "ram": null,
        "rom": null,
        "cost": 4700000,
        "price": 5690000,
        "stock": 0
      }
    ]
  },
  {
    "id": 15,
    "code": "SP015",
    "name": "Galaxy Buds3 Pro",
    "brand": "Samsung",
    "category": "Tai nghe",
    "description": "Tai nghe không dây Galaxy Buds3 Pro tái định nghĩa thiết kế với dải đèn Blade Lights hiện đại, âm thanh Hi-Fi 24-bit đỉnh cao cùng bộ khử tiếng ồn thích ứng AI thích ứng linh hoạt theo môi trường xung quanh.",
    "image": "",
    "createdAt": "2026-09-22",
    "isDeleted": false,
    "attributes": [
      "Màu sắc"
    ],
    "battery": "7 giờ nghe (30 giờ kèm hộp sạc)",
    "anc": "Chống ồn thích ứng AI, Âm thanh Hi-Fi 24-bit",
    "bluetooth": "Bluetooth 5.4, SSC Codec",
    "port": "USB-C, Sạc không dây Qi",
    "waterproof": "IP57 chuẩn cao cấp",
    "color": [
      "#cfd8dc",
      "#ffffff"
    ],
    "rating": 4.8,
    "isNew": true,
    "imported": 60,
    "sold": 28,
    "variants": [
      {
        "sku": "SP015-BAC_TITAN",
        "color": "Bạc Titan",
        "ram": null,
        "rom": null,
        "cost": 4200000,
        "price": 4990000,
        "stock": 18
      },
      {
        "sku": "SP015-TRANG_MAY",
        "color": "Trắng Mây",
        "ram": null,
        "rom": null,
        "cost": 4200000,
        "price": 4990000,
        "stock": 14
      }
    ]
  },
  {
    "id": 16,
    "code": "SP016",
    "name": "Sony WF-1000XM5",
    "brand": "Sony",
    "category": "Tai nghe",
    "description": "Sony WF-1000XM5 là đỉnh cao tai nghe chống ồn với 2 bộ xử lý chuyên dụng V2 và QN2e, màng loa Dynamic Driver X tái tạo âm thanh trung thực chuẩn Hi-Res Audio Wireless LDAC và micro định hướng AI đàm thoại rõ nét.",
    "image": "",
    "createdAt": "2026-09-19",
    "isDeleted": false,
    "attributes": [
      "Màu sắc"
    ],
    "battery": "8 giờ tai nghe (24 giờ kèm hộp sạc, sạc nhanh 3 phút được 60 phút)",
    "anc": "Bộ xử lý V2 tích hợp & QN2e chống ồn đỉnh cao hàng đầu thế giới",
    "bluetooth": "Bluetooth 5.3, Hỗ trợ LDAC, DSEE Extreme",
    "port": "USB-C, Sạc không dây Qi",
    "waterproof": "IPX4",
    "color": [
      "#212121",
      "#e0e0e0"
    ],
    "rating": 4.9,
    "imported": 40,
    "sold": 20,
    "variants": [
      {
        "sku": "SP016-DEN_NHAM",
        "color": "Đen Nhám",
        "ram": null,
        "rom": null,
        "cost": 5100000,
        "price": 5990000,
        "stock": 0
      },
      {
        "sku": "SP016-BAC_BACH_KIM",
        "color": "Bạc Bạch Kim",
        "ram": null,
        "rom": null,
        "cost": 5100000,
        "price": 5990000,
        "stock": 0
      }
    ]
  },
  {
    "id": 17,
    "code": "SP017",
    "name": "Apple Watch Series 10",
    "brand": "Apple",
    "category": "Đồng hồ thông minh",
    "description": "Apple Watch Series 10 sở hữu màn hình OLED góc rộng lớn nhất và mỏng nhất từng có trên Apple Watch, sạc nhanh ấn tượng 80% trong 30 phút cùng các cảm biến theo dõi ngưng thở khi ngủ và đo độ sâu chuẩn xác.",
    "image": "",
    "createdAt": "2026-09-20",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "ROM"
    ],
    "screen": "42mm / 46mm OLED Retina góc nhìn rộng",
    "caseSize": "42mm / 46mm",
    "battery": "18 giờ sử dụng tiêu chuẩn (36 giờ tiết kiệm pin)",
    "waterproof": "Chống nước 50m (WR50), chứng nhận lặn nông 6m",
    "sensors": "Cảm biến nhiệt độ nước, đo độ sâu, ECG, SpO2, phát hiện ngưng thở khi ngủ",
    "color": [
      "#141517",
      "#d8dade"
    ],
    "rating": 4.8,
    "isNew": true,
    "imported": 50,
    "sold": 32,
    "variants": [
      {
        "sku": "SP017-NHOM_DEN_BONG-64GB",
        "color": "Nhôm Đen Bóng",
        "ram": null,
        "rom": "64GB",
        "cost": 9200000,
        "price": 10990000,
        "stock": 3
      },
      {
        "sku": "SP017-NHOM_BAC-64GB",
        "color": "Nhôm Bạc",
        "ram": null,
        "rom": "64GB",
        "cost": 9200000,
        "price": 10990000,
        "stock": 2
      }
    ]
  },
  {
    "id": 18,
    "code": "SP018",
    "name": "Samsung Galaxy Watch7",
    "brand": "Samsung",
    "category": "Đồng hồ thông minh",
    "description": "Galaxy Watch7 trang bị vi xử lý 3nm mạnh mẽ vượt trội, cảm biến BioActive tiên tiến nhất hỗ trợ chấm điểm năng lượng Energy Score của Galaxy AI và định vị GPS tần số kép cực kỳ chính xác khi luyện tập ngoài trời.",
    "image": "",
    "createdAt": "2026-09-21",
    "isDeleted": false,
    "attributes": [
      "Màu sắc",
      "ROM"
    ],
    "screen": "40mm / 44mm Super AMOLED Sapphire",
    "caseSize": "40mm / 44mm",
    "battery": "40 giờ ở chế độ tiêu chuẩn",
    "waterproof": "5ATM + IP68, Chuẩn độ bền quân đội MIL-STD-810H",
    "sensors": "Cảm biến BioActive thế hệ mới, đo nhịp tim, huyết áp, ECG, phân tích thành phần cơ thể BIA",
    "color": [
      "#4b5320",
      "#e0dcd3"
    ],
    "rating": 4.7,
    "imported": 40,
    "sold": 21,
    "variants": [
      {
        "sku": "SP018-XANH_QUAN_DOI-32GB",
        "color": "Xanh Quân Đội",
        "ram": null,
        "rom": "32GB",
        "cost": 5500000,
        "price": 6990000,
        "stock": 0
      },
      {
        "sku": "SP018-BAC_KEM-32GB",
        "color": "Bạc Kem",
        "ram": null,
        "rom": "32GB",
        "cost": 5500000,
        "price": 6990000,
        "stock": 0
      }
    ]
  },
  {
    "id": 19,
    "code": "SP019",
    "name": "Sạc nhanh Apple MagSafe 25W",
    "brand": "Apple",
    "category": "Phụ kiện",
    "description": "Đế sạc MagSafe 25W chính hãng Apple hỗ trợ chuẩn sạc không dây thế hệ mới Qi2, cho phép sạc không dây siêu nhanh 50% chỉ trong 30 phút cho iPhone 16 series, cáp bện dù chống rối siêu bền bỉ.",
    "image": "",
    "createdAt": "2026-09-20",
    "isDeleted": false,
    "attributes": [
      "Quy cách"
    ],
    "power": "25W Max (Hỗ trợ chuẩn Qi2)",
    "port": "Cáp bện tích hợp đầu cắm USB-C",
    "cableLength": "Độ dài cáp 1 mét / 2 mét",
    "standard": "Chuẩn không dây Qi2 & MagSafe chính hãng",
    "color": [
      "#ffffff",
      "#e0e0e0"
    ],
    "rating": 4.8,
    "imported": 100,
    "sold": 65,
    "variants": [
      {
        "sku": "SP019-TRANG_1M",
        "color": "Trắng 1m",
        "ram": null,
        "rom": null,
        "cost": 850000,
        "price": 1190000,
        "stock": 25
      },
      {
        "sku": "SP019-TRANG_2M",
        "color": "Trắng 2m",
        "ram": null,
        "rom": null,
        "cost": 1100000,
        "price": 1490000,
        "stock": 20
      }
    ]
  },
  {
    "id": 20,
    "code": "SP020",
    "name": "Củ sạc Anker GaN 65W",
    "brand": "Anker",
    "category": "Phụ kiện",
    "description": "Củ sạc nhanh Anker GaNPrime 65W thiết kế siêu nhỏ gọn chân gập tiện lợi, trang bị 2 cổng USB-C và 1 cổng USB-A cho phép sạc cùng lúc laptop, máy tính bảng và điện thoại với công nghệ an toàn ActiveShield 2.0.",
    "image": "",
    "createdAt": "2026-09-22",
    "isDeleted": false,
    "attributes": [
      "Màu sắc"
    ],
    "power": "65W Max công nghệ GaNPrime",
    "port": "2 cổng USB-C + 1 cổng USB-A",
    "cableLength": "Chân gập tiện lợi, kích thước nhỏ gọn",
    "standard": "Power Delivery 3.0, PPS, Quick Charge 4.0+",
    "color": [
      "#212121",
      "#e0e0e0"
    ],
    "rating": 4.9,
    "imported": 90,
    "sold": 55,
    "variants": [
      {
        "sku": "SP020-DEN_NHAM",
        "color": "Đen Nhám",
        "ram": null,
        "rom": null,
        "cost": 580000,
        "price": 790000,
        "stock": 25
      },
      {
        "sku": "SP020-TRANG_BAC",
        "color": "Trắng Bạc",
        "ram": null,
        "rom": null,
        "cost": 580000,
        "price": 790000,
        "stock": 20
      }
    ]
  }
];

// Chuẩn hóa và tự động tính basePrice, stock cho danh sách sản phẩm mẫu
defaultProducts.forEach(p => {
  if (p.variants && p.variants.length > 0) {
    // Đồng bộ tên trường giá vốn trên sản phẩm và từng biến thể để tương thích các màn quản trị.
    p.variants.forEach(v => {
      v.costPrice = Number(v.costPrice ?? v.importPrice ?? v.cost) || 0;
      v.importPrice = v.costPrice;
    });
    const prices = p.variants.map(v => Number(v.price) || 0).filter(pr => pr > 0);
    p.basePrice = prices.length > 0 ? Math.min(...prices) : (Number(p.price) || 0);
    p.stock = p.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    p.price = p.basePrice; // Alias tương thích
    const costs = p.variants.map(v => Number(v.cost) || 0).filter(c => c > 0);
    p.cost = costs.length > 0 ? Math.min(...costs) : (Number(p.cost) || 0);
    p.costPrice = p.cost;
    p.importPrice = p.cost;
  }
});

// Alias chuẩn hóa theo đề bài
const DEFAULT_PRODUCTS = defaultProducts;

// ==========================================================================
// 3. ĐƠN HÀNG MẪU (CHUẨN HÓA LƯU THEO SKU BIẾN THỂ)
// ==========================================================================
const defaultOrders = [
  {
    id: 'DH24101',
    customer: 'Nguyễn Minh Anh',
    customerEmail: 'minhanh@mail.com',
    phone: '0901234567',
    date: '02/10/2026',
    total: 34990000,
    status: 'Mới đặt',
    pay: 'Chuyển khoản',
    address: '45 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM (Nhà riêng)',
    items: [
      { sku: 'SP001-TITAN_DEN-8GB-256GB', productId: 1, name: 'iPhone 16 Pro Max (Titan Đen - 8GB/256GB)', price: 34990000, qty: 1 }
    ]
  },
  {
    id: 'DH24102',
    customer: 'Nguyễn Minh Anh',
    customerEmail: 'minhanh@mail.com',
    phone: '0901234567',
    date: '25/09/2026',
    total: 18990000,
    status: 'Đã giao',
    pay: 'Tiền mặt',
    address: '45 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM (Nhà riêng)',
    items: [
      { sku: 'SP002-HONG_PASTEL-8GB-128GB', productId: 2, name: 'iPhone 16 (Hồng Pastel - 8GB/128GB)', price: 18990000, qty: 1 }
    ]
  },
  {
    id: 'DH24100',
    customer: 'Trần Quốc Bảo',
    customerEmail: 'quocbao@mail.com',
    phone: '0912345678',
    date: '02/10/2026',
    total: 6880000,
    status: 'Đã xác nhận',
    pay: 'Tiền mặt',
    address: '88 Nguyễn Thị Minh Khai, P. 6, Quận 3, TP.HCM',
    items: [
      { sku: 'SP014-TRANG', productId: 14, name: 'AirPods Pro 2 (Trắng)', price: 5690000, qty: 1 },
      { sku: 'SP019-TRANG_1M', productId: 19, name: 'Sạc nhanh Apple MagSafe 25W (Trắng 1m)', price: 1190000, qty: 1 }
    ]
  },
  {
    id: 'DH24099',
    customer: 'Lê Thu Hà',
    customerEmail: 'thuha@mail.com',
    phone: '0933456789',
    date: '01/10/2026',
    total: 21990000,
    status: 'Đang giao',
    pay: 'Thẻ tín dụng',
    address: '15 Thảo Điền, P. Thảo Điền, TP. Thủ Đức, TP.HCM',
    items: [
      { sku: 'SP004-XANH_MAYA-12GB-256GB', productId: 4, name: 'Samsung Galaxy Z Flip6 (Xanh Maya - 12GB/256GB)', price: 21990000, qty: 1 }
    ]
  },
  {
    id: 'DH24098',
    customer: 'Phạm Đức Long',
    customerEmail: 'duclong@mail.com',
    phone: '0944567890',
    date: '30/09/2026',
    total: 18990000,
    status: 'Đã giao',
    pay: 'Tiền mặt',
    address: '128 Trần Hưng Đạo, Quận 5, TP.HCM',
    items: [
      { sku: 'SP002-HONG_PASTEL-8GB-128GB', productId: 2, name: 'iPhone 16 (Hồng Pastel - 8GB/128GB)', price: 18990000, qty: 1 }
    ]
  },
  {
    id: 'DH24097',
    customer: 'Võ Thanh Tâm',
    customerEmail: 'thanhtam@mail.com',
    phone: '0977678901',
    date: '29/09/2026',
    total: 33490000,
    status: 'Đã giao',
    pay: 'Chuyển khoản',
    address: '205 Hai Bà Trưng, P. 6, Quận 3, TP.HCM',
    items: [
      { sku: 'SP003-DEN_TITAN-12GB-512GB', productId: 3, name: 'Samsung Galaxy S25 Ultra (Đen Titan - 12GB/512GB)', price: 33490000, qty: 1 }
    ]
  },
  {
    id: 'DH24096',
    customer: 'Đặng Hoàng Nam',
    customerEmail: 'hoangnam@mail.com',
    phone: '0988789012',
    date: '28/09/2026',
    total: 10990000,
    status: 'Đã huỷ',
    pay: 'Thẻ tín dụng',
    address: '42 Nguyễn Huệ, Quận 1, TP.HCM',
    items: [
      { sku: 'SP017-NHOM_DEN_BONG-64GB', productId: 17, name: 'Apple Watch Series 10 (Nhôm Đen Bóng - 64GB)', price: 10990000, qty: 1 }
    ]
  },
  {
    id: 'DH24095',
    customer: 'Bùi Khánh Linh',
    customerEmail: 'khanhlinh@mail.com',
    phone: '0966554433',
    date: '27/09/2026',
    total: 28990000,
    status: 'Đã giao',
    pay: 'Chuyển khoản',
    address: '10 Nguyễn Trãi, Quận 1, TP.HCM',
    items: [
      { sku: 'SP010-BAC_ANH_KIM-8GB-256GB', productId: 10, name: 'iPad Pro M4 (Bạc Ánh Kim - 8GB/256GB)', price: 28990000, qty: 1 }
    ]
  }
];

// ==========================================================================
// 4. DANH SÁCH KHÁCH HÀNG & PHIẾU NHẬP
// ==========================================================================
const defaultCustomers = [
  {
    id: 'KH001',
    name: 'Nguyễn Minh Anh',
    email: 'minhanh@mail.com',
    phone: '0901234567',
    joined: '12/03/2025',
    orders: 8,
    locked: false,
    addresses: [
      {
        id: 'addr_1',
        label: 'Nhà riêng',
        receiverName: 'Nguyễn Minh Anh',
        receiverPhone: '0901234567',
        detail: '45 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM',
        isDefault: true
      },
      {
        id: 'addr_2',
        label: 'Công ty',
        receiverName: 'Nguyễn Minh Anh',
        receiverPhone: '0901234567',
        detail: 'Tòa nhà Bitexco, 2 Hải Triều, P. Bến Nghé, Quận 1, TP.HCM',
        isDefault: false
      }
    ]
  },
  {
    id: 'KH002',
    name: 'Trần Quốc Bảo',
    email: 'quocbao@mail.com',
    phone: '0912345678',
    joined: '28/05/2025',
    orders: 3,
    locked: false,
    addresses: [
      {
        id: 'addr_3',
        label: 'Nhà riêng',
        receiverName: 'Trần Quốc Bảo',
        receiverPhone: '0912345678',
        detail: '88 Nguyễn Thị Minh Khai, P. 6, Quận 3, TP.HCM',
        isDefault: true
      }
    ]
  },
  {
    id: 'KH003',
    name: 'Lê Thu Hà',
    email: 'thuha@mail.com',
    phone: '0933456789',
    joined: '02/07/2025',
    orders: 5,
    locked: false,
    addresses: [
      {
        id: 'addr_4',
        label: 'Nhà riêng',
        receiverName: 'Lê Thu Hà',
        receiverPhone: '0933456789',
        detail: '15 Thảo Điền, P. Thảo Điền, TP. Thủ Đức, TP.HCM',
        isDefault: true
      }
    ]
  },
  {
    id: 'KH004',
    name: 'Phạm Đức Long',
    email: 'duclong@mail.com',
    phone: '0944567890',
    joined: '19/08/2025',
    orders: 1,
    locked: true,
    addresses: []
  },
  {
    id: 'KH005',
    name: 'Võ Thanh Tâm',
    email: 'thanhtam@mail.com',
    phone: '0977678901',
    joined: '04/01/2026',
    orders: 12,
    locked: false,
    addresses: [
      {
        id: 'addr_5',
        label: 'Nhà riêng',
        receiverName: 'Võ Thanh Tâm',
        receiverPhone: '0977678901',
        detail: '205 Hai Bà Trưng, P. 6, Quận 3, TP.HCM',
        isDefault: true
      }
    ]
  },
  {
    id: 'KH006',
    name: 'Đặng Hoàng Nam',
    email: 'hoangnam@mail.com',
    phone: '0988789012',
    joined: '15/02/2026',
    orders: 2,
    locked: false,
    addresses: []
  }
];

const defaultReceipts = [
  {
    id: 'PN0012',
    date: '28/09/2026',
    lines: 3,
    qty: 65,
    total: 1862000000,
    status: 'Hoàn thành',
    items: [
      { sku: 'SP001-TITAN_DEN-8GB-256GB', name: 'iPhone 16 Pro Max - Titan Đen 256GB', cost: 30200000, qty: 25 },
      { sku: 'SP003-XANH_TITAN-12GB-256GB', name: 'Galaxy S25 Ultra - Xanh Titan 256GB', cost: 26000000, qty: 20 },
      { sku: 'SP014-TRANG', name: 'AirPods Pro 2', cost: 4700000, qty: 20 }
    ]
  },
  {
    id: 'PN0011',
    date: '20/09/2026',
    lines: 2,
    qty: 40,
    total: 834000000,
    status: 'Hoàn thành',
    items: [
      { sku: 'SP002-HONG_PASTEL-8GB-128GB', name: 'iPhone 16 - Hồng Pastel 128GB', cost: 16500000, qty: 20 },
      { sku: 'SP010-BAC_ANH_KIM-8GB-256GB', name: 'iPad Pro M4 - Bạc Ánh Kim 256GB', cost: 25200000, qty: 20 }
    ]
  },
  {
    id: 'PN0010',
    date: '11/09/2026',
    lines: 2,
    qty: 80,
    total: 508000000,
    status: 'Hoàn thành',
    items: [
      { sku: 'SP019-TRANG_1M', name: 'Sạc nhanh MagSafe 25W - 1m', cost: 850000, qty: 60 },
      { sku: 'SP017-NHOM_DEN_BONG-64GB', name: 'Apple Watch Series 10 - Nhôm Đen Bóng 64GB', cost: 9200000, qty: 20 }
    ]
  },
  {
    id: 'PN0009',
    date: '03/10/2026',
    lines: 2,
    qty: 30,
    total: 474500000,
    status: 'Nháp',
    items: [
      { sku: 'SP004-XANH_MAYA-12GB-256GB', name: 'Galaxy Z Flip6 - Xanh Maya 256GB', cost: 18500000, qty: 15 },
      { sku: 'SP006-TRANG_NGOC_TRAI-12GB-256GB', name: 'OPPO Find X8 Pro - Trắng Ngọc Trai 256GB', cost: 19500000, qty: 15 }
    ]
  }
];

// ==========================================================================
// 5. CÁC HÀM HELPER TRUY XUẤT LOCALSTORAGE & BẢO TOÀN DỮ LIỆU
// ==========================================================================
function getStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error(`[LocalStorage] Lỗi đọc khóa "${key}":`, e);
    return fallback;
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`[LocalStorage] Lỗi lưu khóa "${key}":`, e);
  }
}

/**
 * Tự động đồng bộ hóa và chuẩn hóa sản phẩm:
 * - Đảm bảo variants luôn là mảng hợp lệ
 * - Tính lại basePrice = Min(variant.price)
 * - Tính lại stock = Sum(variant.stock)
 */
function normalizeProduct(p) {
  if (!p) return null;
  p.isDeleted = Boolean(p.isDeleted);
  p.attributes = Array.isArray(p.attributes) ? p.attributes : ['Màu sắc', 'RAM', 'ROM'];

  if (!Array.isArray(p.variants) || p.variants.length === 0) {
    const defaultSku = `${p.code || 'SP00' + p.id}-STD`;
    p.variants = [
      {
        sku: defaultSku,
        color: Array.isArray(p.color) ? 'Tiêu chuẩn' : (p.color || 'Tiêu chuẩn'),
        ram: p.ram || '',
        rom: p.rom || '',
        cost: p.cost || p.costPrice || p.importPrice || Math.round((p.price || 10000000) * 0.85),
        price: p.price || 10000000,
        stock: typeof p.stock === 'number' ? p.stock : 10
      }
    ];
  }

  // Luôn quét lại basePrice và tồn kho thực tế
  p.variants.forEach(v => {
    // Chuẩn hóa giá vốn theo dữ liệu cũ/mới mà không làm mất giá trị đang lưu.
    v.cost = Number(v.cost ?? v.costPrice ?? v.importPrice) || 0;
    v.costPrice = v.cost;
    v.importPrice = v.cost;
    v.price = Number(v.price) || 0;
    v.stock = Number(v.stock) || 0;
  });
  const prices = p.variants.map(v => Number(v.price) || 0).filter(pr => pr > 0);
  p.basePrice = prices.length > 0 ? Math.min(...prices) : (Number(p.price) || 0);
  p.price = p.basePrice; // Alias cho các bộ lọc cũ
  const costs = p.variants.map(v => Number(v.cost) || 0).filter(c => c > 0);
  p.cost = costs.length > 0
    ? Math.min(...costs)
    : (Number(p.cost ?? p.costPrice ?? p.importPrice) || 0);
  p.costPrice = p.cost; // Đảm bảo trường costPrice luôn sẵn sàng cho quản trị
  p.importPrice = p.cost;
  p.stock = p.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  p.rating = Number(p.rating ?? 5);
  p.sold = Number(p.sold ?? p.soldCount ?? 0);
  p.soldCount = p.sold;

  return p;
}

const DATA_VERSION = 'techno_v2.4_clean_refactor';

/**
 * Làm sạch và tự động khôi phục LocalStorage (initDefaultData)
 * Tự động kiểm tra phiên bản và tính toàn vẹn của dữ liệu:
 * - 20 sản phẩm chuẩn (12 tồn ổn định 15-50, 5 tồn thấp 1-5, 3 hết hàng 0)
 * - Danh mục có thuộc tính status: active / inactive
 * - Danh sách khách hàng với mảng địa chỉ addresses riêng
 * - Đơn hàng chuẩn hóa có email/phone phục vụ phân quyền lịch sử
 */
function initDefaultData(forceReset = false) {
  try {
    const currentVer = localStorage.getItem('techno_data_version');
    const rawProds = getStorage('techno_products', null);
    const rawCusts = getStorage('techno_customers', null);
    const rawCats = getStorage('techno_categories', null);

    let needReset = forceReset || currentVer !== DATA_VERSION || !Array.isArray(rawProds) || rawProds.length < 20;

    if (!needReset && rawCusts) {
      if (!Array.isArray(rawCusts) || rawCusts.some(c => !Array.isArray(c.addresses))) {
        needReset = true;
      }
    }

    if (!needReset && rawCats) {
      if (!Array.isArray(rawCats) || rawCats.some(c => typeof c !== 'object' || !c.status)) {
        needReset = true;
      }
    }

    if (!needReset && rawProds) {
      // Kiểm tra có đủ các mặt hàng hết hàng mẫu SP014, SP016, SP018
      const sp014 = rawProds.find(p => p.id === 14 || p.code === 'SP014');
      if (sp014 && sp014.variants && sp014.variants[0] && sp014.variants[0].stock !== 0) {
        needReset = true;
      }
    }

    if (needReset) {
      console.log('[TechnoStore] Đồng bộ Mock Data v2.3: Làm sạch và nạp 20 sản phẩm chuẩn, danh mục có status và sổ địa chỉ...');
      localStorage.setItem('techno_data_version', DATA_VERSION);
      localStorage.removeItem('techno_products');
      localStorage.removeItem('techno_categories');
      localStorage.removeItem('techno_orders');
      localStorage.removeItem('techno_receipts');
      localStorage.removeItem('techno_customers');
      localStorage.removeItem('techno_buy_now');

      setStorage('techno_products', defaultProducts);
      setStorage('techno_categories', defaultCategories);
      setStorage('techno_orders', defaultOrders);
      setStorage('techno_receipts', defaultReceipts);
      setStorage('techno_customers', defaultCustomers);

      const existingCart = getStorage('techno_cart', null);
      if (!existingCart || !Array.isArray(existingCart) || existingCart.length === 0) {
        setStorage('techno_cart', [
          { sku: 'SP001-TITAN_DEN-8GB-256GB', productId: 1, qty: 1 }
        ]);
      }
    }
  } catch (e) {
    console.error('[TechnoStore] Lỗi initDefaultData:', e);
  }
}

// Getters và Setters cho Products
function getProducts() {
  initDefaultData();
  const raw = getStorage('techno_products', defaultProducts);
  return raw.map(normalizeProduct);
}

function saveProducts(data) {
  const normalized = data.map(normalizeProduct);
  setStorage('techno_products', normalized);
}

/**
 * Lấy danh sách sản phẩm hiển thị phía Khách hàng (bỏ các sp đã bị Xóa mềm)
 */
function getActiveProducts() {
  return getProducts().filter(p => !p.isDeleted);
}

// Getters và Setters cho Orders, Customers, Receipts, Categories
function getOrders() {
  const raw = getStorage('techno_orders', defaultOrders);
  const allProducts = getProducts();
  return raw.map(order => {
    if (Array.isArray(order.items)) {
      order.items = order.items.map(it => {
        if (Array.isArray(it)) {
          const [pid, q] = it;
          const p = allProducts.find(x => x.id === pid);
          const firstVariant = (p && p.variants && p.variants[0]) ? p.variants[0] : null;
          return {
            sku: firstVariant ? firstVariant.sku : `SP00${pid}-STD`,
            productId: pid,
            name: p ? p.name : 'Sản phẩm',
            price: firstVariant ? firstVariant.price : (p ? p.price : 0),
            qty: q
          };
        }
        return it;
      });
    }
    return order;
  });
}
function saveOrders(data) {
  setStorage('techno_orders', data);
}

function getCustomers() {
  return getStorage('techno_customers', defaultCustomers);
}
function saveCustomers(data) {
  setStorage('techno_customers', data);
}

function getReceipts() {
  return getStorage('techno_receipts', defaultReceipts);
}
function saveReceipts(data) {
  setStorage('techno_receipts', data);
}

function getCategories() {
  initDefaultData();
  const raw = getStorage('techno_categories', defaultCategories);
  if (!Array.isArray(raw)) return defaultCategories;
  return raw.map((c, i) => {
    if (typeof c === 'string') {
      return {
        id: `DM0${i + 1}`,
        name: c,
        type: i < 2 ? 'Thiết bị chính' : 'Phụ kiện & Đeo',
        status: 'active'
      };
    }
    return {
      id: c.id || `DM0${i + 1}`,
      name: c.name || '',
      type: c.type || (i < 2 ? 'Thiết bị chính' : 'Phụ kiện & Đeo'),
      status: c.status || 'active'
    };
  });
}

function getActiveCategories() {
  return getCategories().filter(c => c.status === 'active').map(c => c.name);
}

function saveCategories(data) {
  setStorage('techno_categories', data);
}

// ==========================================================================
// 6. HELPER TÌM KIẾM BIẾN THỂ & SINH MÃ TỰ ĐỘNG
// ==========================================================================
function findVariantBySku(sku) {
  if (!sku) return null;
  const products = getProducts();
  for (const p of products) {
    if (p.variants && Array.isArray(p.variants)) {
      const v = p.variants.find(x => x.sku === sku);
      if (v) return { product: p, variant: v };
    }
  }
  return null;
}

function generateSku(productCode, color, ram, rom) {
  const pCode = productCode ? productCode.toUpperCase().trim() : 'SP000';
  const cSlug = slugifySkuPart(color);

  let parts = [pCode, cSlug];
  if (ram && ram !== 'Tiêu chuẩn') parts.push(slugifySkuPart(ram));
  if (rom && rom !== 'Tiêu chuẩn') parts.push(slugifySkuPart(rom));

  return parts.join('-');
}

function generateNextProductId() {
  const products = getProducts();
  const maxId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
  return maxId + 1;
}

function generateNextProductCode() {
  const nextId = generateNextProductId();
  return 'SP' + String(nextId).padStart(3, '0');
}

function generateNextOrderId() {
  const orders = getOrders();
  let maxNum = 24100;
  orders.forEach(o => {
    if (o.id && o.id.startsWith('DH')) {
      const num = parseInt(o.id.replace('DH', ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return 'DH' + (maxNum + 1);
}

function generateNextReceiptId() {
  const receipts = getReceipts();
  let maxNum = 12;
  receipts.forEach(r => {
    if (r.id && r.id.startsWith('PN')) {
      const num = parseInt(r.id.replace('PN', ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return 'PN' + String(maxNum + 1).padStart(4, '0');
}

// ==========================================================================
// 7. QUẢN LÝ GIỎ HÀNG (SHOPPING CART THEO SKU) & MUA NGAY (BUY NOW)
// ==========================================================================
function getCart() {
  // Đọc giỏ riêng của tài khoản đã đăng nhập, còn khách vãng lai dùng khóa chung.
  const user = getCurrentUser();
  const storageKey = user && user.id ? `techno_cart_${user.id}` : 'techno_cart';
  const fallback = storageKey === 'techno_cart'
    ? [{ sku: 'SP001-TITAN_DEN-8GB-256GB', productId: 1, qty: 1 }]
    : [];
  const raw = getStorage(storageKey, fallback);
  return raw.filter(item => Boolean(findVariantBySku(item.sku)));
}

function saveCart(cart) {
  // Ghi giỏ vào đúng phạm vi người dùng để không trộn dữ liệu giữa các tài khoản.
  const user = getCurrentUser();
  const storageKey = user && user.id ? `techno_cart_${user.id}` : 'techno_cart';
  setStorage(storageKey, cart);
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: getCartCount() } }));
}

/**
 * Quản lý dữ liệu mua ngay tạm thời (Buy Now Item)
 */
function getBuyNow() {
  return getStorage('techno_buy_now', null);
}

function setBuyNow(item) {
  setStorage('techno_buy_now', item);
}

function clearBuyNow() {
  localStorage.removeItem('techno_buy_now');
}

/**
 * Thêm sản phẩm vào giỏ hàng theo SKU với ràng buộc kiểm tra tồn kho
 * @param {string|number} skuOrId - SKU biến thể (hoặc productId để tương thích)
 * @param {number} qty - Số lượng thêm
 * @returns {{ success: boolean, message: string }}
 */
function addToCart(skuOrId, qty = 1) {
  let sku = skuOrId;
  let targetProduct = null;
  let targetVariant = null;

  if (typeof skuOrId === 'number') {
    const prod = getProducts().find(p => p.id === skuOrId && !p.isDeleted);
    if (!prod) return { success: false, message: 'Không tìm thấy sản phẩm!' };
    const v = prod.variants.find(x => x.stock > 0) || prod.variants[0];
    if (!v) return { success: false, message: 'Sản phẩm này chưa có phiên bản khả dụng!' };
    sku = v.sku;
    targetProduct = prod;
    targetVariant = v;
  } else {
    const found = findVariantBySku(sku);
    if (!found) return { success: false, message: 'Phiên bản sản phẩm không tồn tại!' };
    targetProduct = found.product;
    targetVariant = found.variant;
  }

  if (targetVariant.stock <= 0) {
    return { success: false, message: 'Phiên bản này hiện đã hết hàng, vui lòng chọn phiên bản khác!' };
  }

  const cart = getCart();
  const existing = cart.find(item => item.sku === sku);
  const currentInCart = existing ? existing.qty : 0;
  const newTotalQty = currentInCart + qty;

  if (newTotalQty > targetVariant.stock) {
    return {
      success: false,
      message: `Tồn kho chỉ còn ${targetVariant.stock} sản phẩm. Bạn đã có ${currentInCart} trong giỏ hàng!`
    };
  }

  if (existing) {
    existing.qty = newTotalQty;
  } else {
    cart.push({
      sku: sku,
      productId: targetProduct.id,
      qty: qty
    });
  }

  saveCart(cart);
  return { success: true, message: 'Đã thêm vào giỏ hàng thành công!' };
}

function setCartQty(sku, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter(item => item.sku !== sku);
  } else {
    const item = cart.find(i => i.sku === sku);
    if (item) {
      const found = findVariantBySku(sku);
      const maxStock = found ? found.variant.stock : 999;
      item.qty = Math.min(qty, maxStock);
    }
  }
  saveCart(cart);
}

function removeFromCart(sku) {
  let cart = getCart();
  cart = cart.filter(item => item.sku !== sku);
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.qty || 0), 0);
}

// ==========================================================================
// 8. TRẠNG THÁI XÁC THỰC (CUSTOMER & ADMIN AUTH)
// ==========================================================================
function getCurrentUser() {
  return getStorage('techno_user', null);
}

function setCurrentUser(user) {
  // Gộp giỏ khách vào giỏ tài khoản trước khi chuyển sang chế độ lưu trữ cá nhân.
  if (user && user.id) {
    const guestCart = getStorage('techno_cart', []);
    if (Array.isArray(guestCart) && guestCart.length > 0) {
      const storageKey = `techno_cart_${user.id}`;
      const personalCart = getStorage(storageKey, []);
      const mergedCart = Array.isArray(personalCart) ? personalCart : [];
      guestCart.forEach(item => {
        const found = findVariantBySku(item.sku);
        if (!found) return;
        const stock = Number(found.variant.stock) || 0;
        if (stock <= 0) return;
        const existing = mergedCart.find(cartItem => cartItem.sku === item.sku);
        const nextQty = (Number(existing ? existing.qty : 0) || 0) + (Number(item.qty) || 0);
        if (existing) {
          existing.qty = Math.min(nextQty, stock);
        } else {
          mergedCart.push({
            sku: item.sku,
            productId: found.product.id,
            qty: Math.min(Number(item.qty) || 0, stock)
          });
        }
      });
      setStorage(storageKey, mergedCart.filter(item => item.qty > 0));
      localStorage.removeItem('techno_cart');
    }
  }
  setStorage('techno_user', user);
  // Đồng bộ số lượng giỏ hàng theo tài khoản vừa đăng nhập.
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: getCartCount() } }));
}

function logoutUser() {
  localStorage.removeItem('techno_user');
  localStorage.removeItem('techno_cart');
  localStorage.removeItem('techno_buy_now');
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: 0 } }));
  const badge = document.getElementById('headerCartCount');
  if (badge) {
    badge.textContent = '0';
    badge.style.display = 'none';
  }
}

function getAdminUser() {
  return getStorage('techno_admin', null);
}

function setAdminUser(status) {
  setStorage('techno_admin', status);
}

function logoutAdmin() {
  localStorage.removeItem('techno_admin');
}

/**
 * Lấy lịch sử đơn hàng của người dùng hiện tại đang đăng nhập
 */
function getOrdersForCurrentUser() {
  const user = getCurrentUser();
  if (!user) return [];
  const allOrders = getOrders();
  return allOrders.filter(o => {
    const uEmail = (user.email || '').trim().toLowerCase();
    const uPhone = (user.phone || '').replace(/\D/g, '');
    const uName = (user.name || '').trim().toLowerCase();

    const oEmail = (o.customerEmail || '').trim().toLowerCase();
    const oPhone = (o.phone || '').replace(/\D/g, '');
    const oName = (o.customer || '').trim().toLowerCase();

    if (uEmail && oEmail && uEmail === oEmail) return true;
    if (uPhone && oPhone && uPhone === oPhone) return true;
    if (uName && oName && uName === oName) return true;
    return false;
  });
}

// ==========================================================================
// 9. CÁC HÀM TIỆN ÍCH BỔ SUNG
// ==========================================================================

/**
 * Cộng / Trừ tồn kho cho một biến thể theo SKU.
 * Dùng khi hủy đơn hàng (cộng +qty) hoặc phục hồi đơn (trừ -qty).
 * @param {string} sku  - Mã SKU biến thể
 * @param {number} delta - Số lượng thay đổi (dương = cộng, âm = trừ)
 */
function updateVariantStock(sku, delta) {
  if (!sku || !delta) return;
  const allProds = getProducts();
  let changed = false;
  allProds.forEach(p => {
    if (Array.isArray(p.variants)) {
      const v = p.variants.find(x => x.sku === sku);
      if (v) {
        // Đảm bảo tồn kho không âm
        v.stock = Math.max(0, (Number(v.stock) || 0) + delta);
        // Cập nhật lại trường stock tổng hợp của sản phẩm cha
        p.stock = p.variants.reduce((sum, vv) => sum + (Number(vv.stock) || 0), 0);
        changed = true;
      }
    }
  });
  if (changed) {
    saveProducts(allProds);
  }
}

// Tự động khởi tạo dữ liệu chuẩn ngay khi nạp file
initDefaultData();

// Xuất biến toàn cục
window.DEFAULT_PRODUCTS = defaultProducts;
window.initDefaultData = initDefaultData;
window.getBuyNow = getBuyNow;
window.setBuyNow = setBuyNow;
window.clearBuyNow = clearBuyNow;
window.getOrdersForCurrentUser = getOrdersForCurrentUser;
window.updateVariantStock = updateVariantStock;
