# BÁO CÁO ĐỒ ÁN MÔN HỌC
## ỨNG DỤNG WEB MUA BÁN SÁCH TRỰC TUYẾN

---

**TRƯỜNG ĐẠI HỌC THĂNG LONG**
**KHOA CÔNG NGHỆ THÔNG TIN**

---

| Thông tin | Chi tiết |
|---|---|
| Môn học | Lập trình Java |
| Giáo viên hướng dẫn | Nguyễn Hùng Cường |
| Năm học | 2024 – 2025 |

---

### DANH SÁCH THÀNH VIÊN

| STT | Họ và tên | Mã sinh viên |
|---|---|---|
| 1 | | |
| | | |
| 2 | | |
| | | |
| 3 | | |
| | | |
| 4 | | |
| | | |

---

*Hà Nội, tháng 05 năm 2025*

---

## MỤC LỤC

1. [Tổng quan đề tài](#1-tổng-quan-đề-tài)
2. [Phân tích yêu cầu hệ thống](#2-phân-tích-yêu-cầu-hệ-thống)
3. [Thiết kế hệ thống](#3-thiết-kế-hệ-thống)
4. [Công nghệ sử dụng](#4-công-nghệ-sử-dụng)
5. [Cài đặt và triển khai](#5-cài-đặt-và-triển-khai)
6. [Mô tả chi tiết chức năng](#6-mô-tả-chi-tiết-chức-năng)
7. [Bảo mật hệ thống](#7-bảo-mật-hệ-thống)
8. [Kết quả đạt được](#8-kết-quả-đạt-được)
9. [Kết luận và hướng phát triển](#9-kết-luận-và-hướng-phát-triển)
10. [Tài liệu tham khảo](#10-tài-liệu-tham-khảo)

---

## 1. TỔNG QUAN ĐỀ TÀI

### 1.1. Đặt vấn đề

Thương mại điện tử đang ngày càng phát triển mạnh mẽ tại Việt Nam, đặc biệt trong lĩnh vực mua bán sách trực tuyến. Nhu cầu của người dùng về một nền tảng mua bán sách tiện lợi, nhanh chóng và an toàn ngày càng tăng cao. Các sàn thương mại điện tử lớn như Tiki, Fahasa hay Shopee đã chứng minh tiềm năng khổng lồ của thị trường này.

Xuất phát từ thực tiễn đó, nhóm quyết định xây dựng một ứng dụng web mua bán sách trực tuyến với đầy đủ các chức năng cần thiết cho ba nhóm người dùng: khách hàng, người bán và quản trị viên. Đây cũng là cơ hội để nhóm áp dụng các kiến thức đã học trong môn Lập trình Java vào một dự án thực tế có quy mô vừa.

### 1.2. Mục tiêu đề tài

- Xây dựng hệ thống web mua bán sách trực tuyến hoàn chỉnh, hỗ trợ đa vai trò người dùng
- Áp dụng kiến trúc phần mềm hiện đại (REST API, SPA) và các công nghệ Java/Spring Boot tiên tiến
- Triển khai bảo mật theo chuẩn JWT với mã hóa RSA
- Đưa ứng dụng lên môi trường cloud thực tế (Railway)

### 1.3. Phạm vi đề tài

Hệ thống bao gồm:
- Ứng dụng web phía khách hàng (Frontend – React + TypeScript)
- Dịch vụ API phía máy chủ (Backend – Spring Boot)
- Cơ sở dữ liệu quan hệ (MySQL)
- Triển khai cloud thông qua Docker và Railway

---

## 2. PHÂN TÍCH YÊU CẦU HỆ THỐNG

### 2.1. Các tác nhân (Actor)

Hệ thống có ba loại người dùng chính:

| Tác nhân | Mô tả |
|---|---|
| **Khách vãng lai (Guest)** | Người dùng chưa đăng nhập, có thể xem danh sách sách, tìm kiếm, xem chi tiết sách |
| **Khách hàng (USER)** | Người dùng đã đăng ký, có thể thêm vào giỏ hàng, đặt hàng, quản lý đơn hàng, cập nhật hồ sơ |
| **Người bán (SELLER)** | Có thể đăng bán sách, quản lý kho hàng và xem/xử lý đơn hàng của mình |
| **Quản trị viên (ADMIN)** | Toàn quyền quản lý hệ thống: người dùng, người bán, danh mục, sách, đơn hàng, nhật ký thao tác |

### 2.2. Yêu cầu chức năng

#### 2.2.1. Đối với Khách vãng lai

- Xem trang chủ với sản phẩm nổi bật
- Duyệt danh sách sách theo danh mục
- Tìm kiếm sách theo từ khóa (tên sách, tác giả)
- Lọc sách theo giá, năm xuất bản, trạng thái giảm giá
- Xem chi tiết sách (thông tin, giá, tồn kho, người bán)
- Đăng ký tài khoản (USER hoặc SELLER)
- Đăng nhập vào hệ thống

#### 2.2.2. Đối với Khách hàng (USER)

- Tất cả quyền của Khách vãng lai
- Quản lý giỏ hàng: thêm, xóa, cập nhật số lượng
- Đặt hàng (toàn bộ hoặc chọn từng sản phẩm trong giỏ)
- Xem lịch sử đơn hàng và chi tiết từng đơn
- Hủy đơn hàng ở trạng thái chờ xác nhận
- Xác nhận đã nhận hàng
- Xem và quản lý thông báo cá nhân
- Xem hồ sơ cá nhân
- Gửi yêu cầu cập nhật thông tin hồ sơ (chờ Admin duyệt)

#### 2.2.3. Đối với Người bán (SELLER)

- Tất cả quyền của Khách hàng
- Thêm mới sách vào hệ thống
- Chỉnh sửa thông tin sách (tiêu đề, giá, số lượng, ảnh, v.v.)
- Ẩn/kích hoạt sách
- Xem danh sách đơn hàng có chứa sách của mình
- Cập nhật trạng thái đơn hàng (xác nhận, đang giao)
- Nhận thông báo khi có đơn hàng mới

#### 2.2.4. Đối với Quản trị viên (ADMIN)

- Tất cả quyền của Người bán
- Quản lý người dùng: xem danh sách, khóa/mở khóa tài khoản
- Quản lý người bán: duyệt, khóa/mở khóa tài khoản
- Quản lý danh mục sách: thêm, sửa, xóa
- Quản lý toàn bộ sách trên hệ thống
- Xem và quản lý tất cả đơn hàng
- Tạo đơn hàng thủ công
- Duyệt yêu cầu cập nhật hồ sơ của người dùng
- Xem nhật ký thao tác (Audit Log) đầy đủ

### 2.3. Yêu cầu phi chức năng

| Yêu cầu | Mô tả |
|---|---|
| **Bảo mật** | Xác thực bằng JWT (RSA), phân quyền theo vai trò, mã hóa mật khẩu BCrypt |
| **Hiệu năng** | Phân trang dữ liệu, lazy loading quan hệ JPA |
| **Khả dụng** | Triển khai 24/7 trên cloud Railway |
| **Giao diện** | Responsive, hỗ trợ đa thiết bị với TailwindCSS |
| **Tích hợp** | API RESTful chuẩn, CORS cấu hình linh hoạt |

---

## 3. THIẾT KẾ HỆ THỐNG

### 3.1. Kiến trúc tổng thể

Hệ thống sử dụng kiến trúc **Monorepo Full-Stack** với hai tầng tách biệt:

```
┌─────────────────────────────────────────────┐
│               RAILWAY CLOUD                 │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │         Docker Container             │   │
│  │                                      │   │
│  │  ┌─────────────┐  ┌───────────────┐  │   │
│  │  │  React SPA  │  │  Spring Boot  │  │   │
│  │  │ (static)    │◄─►│  REST API     │  │   │
│  │  └─────────────┘  └──────┬────────┘  │   │
│  │                          │           │   │
│  └──────────────────────────┼───────────┘   │
│                             │               │
│  ┌──────────────────────────▼───────────┐   │
│  │         MySQL Database               │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

Frontend React được build thành các file tĩnh, sau đó được nhúng vào trong tài nguyên static của Spring Boot. Khi triển khai, chỉ cần một Docker container duy nhất chạy Spring Boot, vừa phục vụ REST API vừa phục vụ SPA frontend.

### 3.2. Kiến trúc Backend (Layered Architecture)

Backend tuân theo kiến trúc phân tầng chuẩn của Spring Boot:

```
┌──────────────────────────────────┐
│         Controller Layer         │  ← Nhận HTTP request, trả response
├──────────────────────────────────┤
│          Service Layer           │  ← Xử lý nghiệp vụ (interface + impl)
├──────────────────────────────────┤
│        Repository Layer          │  ← Tương tác CSDL (Spring Data JPA)
├──────────────────────────────────┤
│          Entity Layer            │  ← Ánh xạ bảng CSDL
└──────────────────────────────────┘
```

Bên cạnh đó còn có các tầng hỗ trợ:
- **DTO Layer**: `dto/request` và `dto/response` – tách biệt dữ liệu vào/ra khỏi entity
- **Exception Layer**: xử lý lỗi tập trung qua `GlobalExceptionHandler`
- **Configuration Layer**: cấu hình Security, JWT, CORS
- **Constant Layer**: các enum `Role`, `OrderStatus`, `BookStatus`, `PaymentMethod`, `PaymentStatus`

### 3.3. Thiết kế cơ sở dữ liệu

#### Sơ đồ thực thể (ERD – mô tả)

Hệ thống gồm 9 bảng chính:

**Bảng `users`**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT PK | Khóa chính tự tăng |
| username | VARCHAR(50) UNIQUE | Tên đăng nhập |
| email | VARCHAR(100) UNIQUE | Địa chỉ email |
| password | VARCHAR | Mật khẩu đã mã hóa BCrypt |
| full_name | VARCHAR(100) | Họ tên đầy đủ |
| phone_number | VARCHAR(15) | Số điện thoại |
| address | VARCHAR(255) | Địa chỉ |
| avatar_url | VARCHAR | URL ảnh đại diện |
| role | ENUM | USER / SELLER / ADMIN |
| is_active | BOOLEAN | Trạng thái tài khoản |
| created_at | DATETIME | Thời điểm tạo |
| updated_at | DATETIME | Thời điểm cập nhật |

**Bảng `books`**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT PK | Khóa chính |
| title | VARCHAR(255) | Tên sách |
| author | VARCHAR(100) | Tác giả |
| publisher | VARCHAR(100) | Nhà xuất bản |
| publish_year | INT | Năm xuất bản |
| description | TEXT | Mô tả |
| price | DECIMAL(10,2) | Giá gốc |
| discount_price | DECIMAL(10,2) | Giá khuyến mãi |
| stock_quantity | INT | Số lượng tồn kho |
| image_url | VARCHAR | URL ảnh bìa |
| isbn | VARCHAR(20) | Mã ISBN |
| page_count | INT | Số trang |
| language | VARCHAR(50) | Ngôn ngữ |
| category_id | BIGINT FK | Danh mục (→ categories) |
| seller_id | BIGINT FK | Người bán (→ users) |
| status | ENUM | ACTIVE / INACTIVE |
| avg_rating | DOUBLE | Điểm đánh giá trung bình |
| total_sold | INT | Tổng số đã bán |
| active | BOOLEAN | Trạng thái hiển thị |
| created_at | DATETIME | Thời điểm đăng |
| updated_at | DATETIME | Thời điểm cập nhật |

**Bảng `categories`**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT PK | Khóa chính |
| name | VARCHAR(100) | Tên danh mục |
| description | TEXT | Mô tả danh mục |

**Bảng `orders`**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT PK | Khóa chính |
| user_id | BIGINT FK | Người đặt hàng (→ users) |
| order_code | VARCHAR(30) UNIQUE | Mã đơn hàng (VD: ORD1716000000) |
| status | ENUM | PENDING / CONFIRMED / SHIPPING / DELIVERED / CANCELLED |
| payment_method | ENUM | COD / BANK_TRANSFER / ... |
| payment_status | ENUM | UNPAID / PAID |
| shipping_address | VARCHAR(500) | Địa chỉ giao hàng |
| recipient_name | VARCHAR(150) | Tên người nhận |
| recipient_phone | VARCHAR(20) | SĐT người nhận |
| total_amount | DECIMAL(14,2) | Tổng tiền |
| note | VARCHAR(1000) | Ghi chú / lý do hủy |
| created_at | DATETIME | Thời điểm đặt hàng |
| updated_at | DATETIME | Thời điểm cập nhật |

**Bảng `order_items`**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT PK | Khóa chính |
| order_id | BIGINT FK | Đơn hàng (→ orders) |
| book_id | BIGINT FK | Sách (→ books) |
| quantity | INT | Số lượng |
| unit_price | DECIMAL(10,2) | Đơn giá tại thời điểm đặt |
| total_price | DECIMAL(10,2) | Thành tiền |

**Bảng `carts` và `cart_items`**

| Bảng | Mô tả |
|---|---|
| carts | Mỗi người dùng có một giỏ hàng (1-1 với users) |
| cart_items | Các mặt hàng trong giỏ (N-1 với carts, N-1 với books) |

**Bảng `notifications`**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT PK | Khóa chính |
| user_id | BIGINT FK | Người nhận thông báo |
| title | VARCHAR | Tiêu đề |
| message | TEXT | Nội dung |
| type | ENUM | ORDER_PLACED / ORDER_STATUS_CHANGED / ... |
| is_read | BOOLEAN | Đã đọc chưa |
| related_order_id | BIGINT | Đơn hàng liên quan |
| created_at | DATETIME | Thời điểm tạo |

**Bảng `audit_logs`**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT PK | Khóa chính |
| admin_username | VARCHAR(50) | Tên tài khoản admin thao tác |
| admin_full_name | VARCHAR(100) | Họ tên admin |
| action | VARCHAR(20) | Hành động: CREATE / UPDATE / DELETE / LOCK / UNLOCK |
| entity_type | VARCHAR(20) | Loại đối tượng: USER / SELLER / CATEGORY / BOOK |
| entity_id | BIGINT | ID đối tượng bị tác động |
| entity_name | VARCHAR(200) | Tên đối tượng |
| detail | TEXT | Mô tả chi tiết |
| old_value | TEXT | Giá trị cũ (JSON) |
| new_value | TEXT | Giá trị mới (JSON) |
| ip_address | VARCHAR(50) | Địa chỉ IP |
| created_at | DATETIME | Thời điểm thao tác |

**Bảng `profile_update_requests`**

Lưu các yêu cầu cập nhật thông tin cá nhân của người dùng, chờ Admin phê duyệt. Trạng thái: `PENDING / APPROVED / REJECTED`.

### 3.4. Thiết kế API (REST Endpoints)

#### Nhóm Authentication (`/api/auth`)

| Method | Endpoint | Mô tả | Phân quyền |
|---|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản | Public |
| POST | `/api/auth/login` | Đăng nhập, nhận JWT | Public |
| POST | `/api/auth/logout` | Đăng xuất | Public |

#### Nhóm Books (`/api/books`)

| Method | Endpoint | Mô tả | Phân quyền |
|---|---|---|---|
| GET | `/api/books` | Danh sách sách (phân trang) | Public |
| GET | `/api/books/{id}` | Chi tiết sách | Public |
| GET | `/api/books/search` | Tìm kiếm theo từ khóa | Public |
| GET | `/api/books/filter` | Lọc nâng cao | Public |
| GET | `/api/books/category/{id}` | Sách theo danh mục | Public |

#### Nhóm Categories (`/api/categories`)

| Method | Endpoint | Mô tả | Phân quyền |
|---|---|---|---|
| GET | `/api/categories` | Toàn bộ danh mục | Public |
| GET | `/api/categories/{id}` | Chi tiết danh mục | Public |

#### Nhóm Cart (`/api/cart`)

| Method | Endpoint | Mô tả | Phân quyền |
|---|---|---|---|
| GET | `/api/cart` | Xem giỏ hàng | USER+ |
| POST | `/api/cart/add` | Thêm vào giỏ | USER+ |
| PUT | `/api/cart/update/{itemId}` | Cập nhật số lượng | USER+ |
| DELETE | `/api/cart/remove/{itemId}` | Xóa sản phẩm khỏi giỏ | USER+ |

#### Nhóm Orders (`/api/orders`)

| Method | Endpoint | Mô tả | Phân quyền |
|---|---|---|---|
| POST | `/api/orders/checkout` | Đặt hàng (chọn lẻ) | USER+ |
| POST | `/api/orders/checkout-all` | Đặt tất cả trong giỏ | USER+ |
| GET | `/api/orders` | Lịch sử đơn hàng | USER+ |
| GET | `/api/orders/{id}` | Chi tiết đơn hàng | USER+ |
| POST | `/api/orders/{id}/cancel` | Hủy đơn | USER+ |
| POST | `/api/orders/{id}/confirm-received` | Xác nhận đã nhận | USER+ |

#### Nhóm Seller (`/api/seller`)

| Method | Endpoint | Mô tả | Phân quyền |
|---|---|---|---|
| POST | `/api/seller/books` | Thêm sách mới | SELLER/ADMIN |
| PUT | `/api/seller/books/{id}` | Sửa sách | SELLER/ADMIN |
| DELETE | `/api/seller/books/{id}` | Ẩn sách | SELLER/ADMIN |
| GET | `/api/seller/books/my` | Sách của tôi | SELLER/ADMIN |
| GET | `/api/seller/orders` | Đơn hàng liên quan | SELLER/ADMIN |
| PUT | `/api/seller/orders/{id}/status` | Cập nhật trạng thái đơn | SELLER/ADMIN |

#### Nhóm Admin (`/api/admin`)

| Method | Endpoint | Mô tả | Phân quyền |
|---|---|---|---|
| GET | `/api/admin/users` | Danh sách người dùng | ADMIN |
| PUT | `/api/admin/users/{id}/lock` | Khóa tài khoản | ADMIN |
| PUT | `/api/admin/users/{id}/unlock` | Mở khóa tài khoản | ADMIN |
| GET | `/api/admin/sellers` | Danh sách người bán | ADMIN |
| GET/POST/PUT/DELETE | `/api/admin/categories/**` | CRUD danh mục | ADMIN |
| GET | `/api/admin/orders` | Tất cả đơn hàng | ADMIN |
| POST | `/api/admin/orders` | Tạo đơn thủ công | ADMIN |
| GET | `/api/admin/audit-logs` | Nhật ký thao tác | ADMIN |
| GET | `/api/admin/profile-requests` | Yêu cầu cập nhật hồ sơ | ADMIN |
| PUT | `/api/admin/profile-requests/{id}/approve` | Phê duyệt yêu cầu | ADMIN |
| PUT | `/api/admin/profile-requests/{id}/reject` | Từ chối yêu cầu | ADMIN |

### 3.5. Thiết kế giao diện

Frontend sử dụng mô hình **Single Page Application (SPA)** với React Router v7. Cấu trúc các trang:

```
/                    → Trang chủ (Hero, sản phẩm nổi bật)
/books               → Danh sách sách (lọc, tìm kiếm, phân trang)
/books/:id           → Chi tiết sách
/product/:id         → Chi tiết sản phẩm (giao diện khác)
/login               → Đăng nhập
/register            → Đăng ký
/cart                → Giỏ hàng (yêu cầu đăng nhập)
/orders              → Lịch sử đơn hàng (yêu cầu đăng nhập)
/notifications       → Thông báo (yêu cầu đăng nhập)
/profile             → Hồ sơ cá nhân (yêu cầu đăng nhập)
/seller/books        → Quản lý sách (SELLER/ADMIN)
/seller/orders       → Đơn hàng người bán (SELLER/ADMIN)
/admin/orders        → Quản lý đơn hàng (ADMIN)
/admin/users         → Quản lý người dùng (ADMIN)
/admin/sellers       → Quản lý người bán (ADMIN)
/admin/categories    → Quản lý danh mục (ADMIN)
/admin/books         → Quản lý sách admin (ADMIN)
/admin/profile-requests → Yêu cầu hồ sơ (ADMIN)
/admin/audit-log     → Nhật ký thao tác (ADMIN)
```

---

## 4. CÔNG NGHỆ SỬ DỤNG

### 4.1. Backend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **Java** | 17 / 21 | Ngôn ngữ lập trình chính |
| **Spring Boot** | 3.5.4 | Framework ứng dụng web |
| **Spring Security** | 6.x | Xác thực và phân quyền |
| **Spring Data JPA** | 3.x | ORM, truy cập CSDL |
| **Spring OAuth2 Resource Server** | 3.x | Xác thực JWT |
| **Hibernate** | 6.x | ORM implementation |
| **MySQL Connector** | 8.x | Kết nối MySQL |
| **JJWT (jjwt-api)** | 0.12.6 | Tạo và xác thực JWT |
| **Nimbus JOSE** | (tích hợp) | Xử lý RSA key, JWK |
| **Lombok** | 1.18.30 | Giảm boilerplate code |
| **Jackson** | (tích hợp) | Serialize/deserialize JSON |
| **Maven** | 3.9 | Build tool |

### 4.2. Frontend

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **React** | 19.x | UI Framework |
| **TypeScript** | 5.x | Static typing cho JavaScript |
| **Vite** | 8.x | Build tool, dev server |
| **React Router DOM** | 7.x | Điều hướng SPA |
| **Axios** | 1.16 | HTTP client gọi API |
| **TailwindCSS** | 4.x | Utility-first CSS framework |
| **Lucide React** | 1.x | Icon library |
| **React Hot Toast** | 2.x | Hiển thị thông báo popup |

### 4.3. Triển khai

| Công nghệ | Mục đích |
|---|---|
| **Docker** | Đóng gói ứng dụng, multi-stage build |
| **Railway** | Cloud platform triển khai container |
| **MySQL (Railway)** | CSDL production |
| **Git / GitHub** | Quản lý mã nguồn |

### 4.4. Lý do lựa chọn công nghệ

**Spring Boot** được chọn vì là framework Java phổ biến nhất cho web backend, có hệ sinh thái phong phú, dễ cấu hình và tích hợp tốt với Spring Security và Spring Data JPA. Phiên bản 3.x hỗ trợ Java 17+ và có nhiều cải tiến về hiệu năng.

**React + TypeScript** được chọn vì là công nghệ frontend hiện đại, component-based architecture giúp tái sử dụng code hiệu quả. TypeScript bổ sung type-checking, giảm lỗi runtime và cải thiện trải nghiệm lập trình.

**JWT với RSA** được chọn thay vì HMAC vì RSA cho phép xác thực token mà không cần chia sẻ secret key, phù hợp với kiến trúc microservice trong tương lai và an toàn hơn.

**Railway + Docker** được chọn vì Railway là nền tảng cloud đơn giản, hỗ trợ deploy từ GitHub, miễn phí ở mức cơ bản và dễ cấu hình. Docker đảm bảo môi trường đồng nhất giữa development và production.

---

## 5. CÀI ĐẶT VÀ TRIỂN KHAI

### 5.1. Cấu trúc mã nguồn

```
book_shop_deploy/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/buy_book/
│   │       │   ├── BookApplication.java       ← Entry point
│   │       │   ├── configuration/             ← Security, App config
│   │       │   ├── constant/                  ← Enums
│   │       │   ├── controller/                ← REST Controllers
│   │       │   ├── dto/
│   │       │   │   ├── request/               ← Input DTOs
│   │       │   │   └── response/              ← Output DTOs
│   │       │   ├── entity/                    ← JPA Entities
│   │       │   ├── exception/                 ← Error handling
│   │       │   ├── properties/                ← RSA key config
│   │       │   ├── repository/                ← JPA Repositories
│   │       │   ├── service/                   ← Service interfaces
│   │       │   │   └── impl/                  ← Service implementations
│   │       │   └── specification/             ← JPA Specifications
│   │       └── resources/
│   │           ├── application.yaml           ← Cấu hình ứng dụng
│   │           ├── certs/                     ← RSA key pair
│   │           └── static/                    ← Frontend build (sau khi build)
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/                               ← API client modules
│   │   ├── components/                        ← Reusable components
│   │   ├── context/                           ← React Context (Auth, Notif)
│   │   ├── pages/                             ← Page components
│   │   │   ├── admin/                         ← Admin pages
│   │   │   └── seller/                        ← Seller pages
│   │   └── types/                             ← TypeScript type definitions
│   ├── package.json
│   └── vite.config.js
├── Dockerfile                                 ← Multi-stage build
├── pom.xml                                    ← Root Maven config
└── railway.json                               ← Railway deploy config
```

### 5.2. Quy trình build và triển khai (CI/CD)

Hệ thống sử dụng **Docker Multi-Stage Build** để tối ưu image size và quy trình build:

**Giai đoạn 1 – Build Frontend:**
```dockerfile
FROM node:20-alpine AS fe-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build
```
Node.js 20 cài dependencies và build React app thành các file tĩnh trong thư mục `dist/`.

**Giai đoạn 2 – Build Backend:**
```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS be-build
WORKDIR /app
COPY pom.xml ./
COPY backend/ ./backend/
COPY --from=fe-build /app/frontend/dist ./backend/src/main/resources/static/
RUN mvn clean package -DskipTests -pl backend -am
```
Maven build Spring Boot JAR, đồng thời copy frontend build vào `resources/static/` để Spring Boot phục vụ như file tĩnh.

**Giai đoạn 3 – Runtime:**
```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=be-build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```
Chỉ copy JAR file vào image runtime nhẹ (JRE), không kéo theo Maven hay Node.js, giảm đáng kể dung lượng image cuối.

### 5.3. Biến môi trường (Environment Variables)

| Biến | Mô tả | Ví dụ |
|---|---|---|
| `PORT` | Cổng server (Railway tự cấp) | `8080` |
| `DB_URL` | JDBC URL kết nối MySQL | `jdbc:mysql://host:3306/book_shop_db` |
| `DB_USERNAME` | Tên đăng nhập MySQL | `root` |
| `DB_PASSWORD` | Mật khẩu MySQL | `****` |
| `RSA_PUBLIC_KEY` | Public key RSA (PEM format) | `-----BEGIN PUBLIC KEY-----...` |
| `RSA_PRIVATE_KEY` | Private key RSA (PEM format) | `-----BEGIN PRIVATE KEY-----...` |

### 5.4. Cấu hình cơ sở dữ liệu

Spring Boot sử dụng `ddl-auto: update` – Hibernate tự động tạo và cập nhật schema dựa trên các Entity class. Điều này giúp đơn giản hóa việc quản lý schema trong môi trường development và staging.

Dữ liệu mẫu được cung cấp qua file `seed_data.sql` và `add_categories.sql` để khởi tạo danh mục và sách mẫu.

---

## 6. MÔ TẢ CHI TIẾT CHỨC NĂNG

### 6.1. Chức năng Xác thực

#### Đăng ký tài khoản

Người dùng điền form đăng ký gồm: username, email, mật khẩu, họ tên, SĐT, địa chỉ và vai trò (USER hoặc SELLER). Backend kiểm tra trùng username/email, mã hóa mật khẩu bằng BCrypt, tạo tài khoản và trả về JWT token ngay lập tức.

Lưu ý bảo mật: hệ thống không cho phép đăng ký với vai trò ADMIN – nếu người dùng truyền `role=ADMIN` thì tự động chuyển về `USER`.

#### Đăng nhập

Hỗ trợ đăng nhập bằng username **hoặc** email. Hệ thống kiểm tra tài khoản có bị khóa không, kiểm tra mật khẩu với BCryptPasswordEncoder. Nếu hợp lệ, trả về JWT token với thời hạn 24 giờ, chứa thông tin `subject` (username) và `scope` (vai trò).

#### Quản lý token phía client

Frontend lưu token vào `localStorage` thông qua `AuthContext`. Mỗi request API tự động đính kèm token vào header `Authorization: Bearer <token>` nhờ Axios interceptor. Khi token hết hạn hoặc không hợp lệ, server trả về 401 và client chuyển về trang đăng nhập.

### 6.2. Chức năng Quản lý Sách

#### Duyệt và tìm kiếm

Trang danh sách sách hỗ trợ:
- **Phân trang**: mặc định 12 sách/trang, điều hướng bằng component `Pagination`
- **Tìm kiếm**: tìm theo tên sách hoặc tên tác giả (full-text search đơn giản)
- **Lọc nâng cao**: theo danh mục, khoảng giá (min/max), năm xuất bản, có giảm giá hay không, tên người bán
- **Sắp xếp**: mới nhất, giá tăng dần/giảm dần, bán chạy nhất, đánh giá cao nhất, theo tên

Backend sử dụng **Spring Data JPA Specification** (`BookSpecification`) để xây dựng câu query động, tránh phải viết nhiều method repository.

#### Chi tiết sách

Trang chi tiết hiển thị đầy đủ thông tin: ảnh bìa, tên, tác giả, nhà xuất bản, năm xuất bản, mô tả, ISBN, số trang, ngôn ngữ, danh mục, tên người bán, giá gốc, giá khuyến mãi, tồn kho, điểm đánh giá trung bình và số lượng đã bán. Người dùng có thể thêm vào giỏ hàng trực tiếp từ trang này.

#### Quản lý sách (Seller)

Seller có trang riêng để:
- Xem danh sách sách của mình với đầy đủ thông tin
- Thêm sách mới qua form với validation
- Sửa thông tin sách
- Ẩn sách (soft delete – chuyển trạng thái sang INACTIVE thay vì xóa hẳn)

Backend kiểm tra quyền sở hữu: Seller chỉ có thể sửa/ẩn sách của chính mình. Admin có thể thao tác với mọi sách.

### 6.3. Chức năng Giỏ hàng

Mỗi user có đúng một giỏ hàng (tạo tự động khi thêm sản phẩm lần đầu). Các thao tác:

- **Thêm vào giỏ**: kiểm tra sách có active không, nếu đã có trong giỏ thì cộng thêm số lượng
- **Cập nhật số lượng**: cho phép tăng/giảm, nếu số lượng = 0 thì xóa item
- **Xóa item**: xóa một sản phẩm khỏi giỏ
- **Xem giỏ hàng**: hiển thị ảnh, tên sách, giá, số lượng, thành tiền và tổng giỏ hàng

Giao diện cho phép chọn từng item để checkout (partial checkout) hoặc chọn tất cả.

### 6.4. Chức năng Đặt hàng

#### Luồng đặt hàng

```
Giỏ hàng → Chọn sản phẩm → Nhập thông tin giao hàng
         → Xác nhận → Tạo đơn → Trừ tồn kho
         → Gửi thông báo cho User và Seller
         → Xóa item đã checkout khỏi giỏ
```

#### Hai chế độ checkout

1. **Checkout chọn lẻ** (`/api/orders/checkout`): chỉ đặt các item được chọn
2. **Checkout toàn bộ** (`/api/orders/checkout-all`): thử đặt tất cả, các item không đủ tồn kho hoặc đã ẩn sẽ bị bỏ qua và trả về danh sách `skippedItems` cho client hiển thị

Khi đặt hàng thành công, hệ thống:
- Tạo mã đơn hàng tự động (`ORD` + timestamp)
- Trừ tồn kho của từng sách
- Tăng số lượng `totalSold` của từng sách
- Gửi thông báo cho người đặt hàng
- Gửi thông báo cho từng Seller có sách trong đơn

#### Trạng thái đơn hàng

```
PENDING → CONFIRMED → SHIPPING → DELIVERED
       ↘ CANCELLED (chỉ khi PENDING)
```

- `PENDING`: Chờ xác nhận từ Seller/Admin
- `CONFIRMED`: Seller/Admin đã xác nhận
- `SHIPPING`: Đang giao hàng
- `DELIVERED`: Giao thành công (User xác nhận)
- `CANCELLED`: Đã hủy (kèm lý do, hoàn lại tồn kho)

Khi hủy đơn, hệ thống tự động **hoàn lại tồn kho** và giảm `totalSold` của các sách trong đơn.

### 6.5. Chức năng Thông báo

Hệ thống thông báo in-app với các loại (`NotificationType`):
- `ORDER_PLACED`: khi đặt hàng thành công
- `ORDER_STATUS_CHANGED`: khi trạng thái đơn thay đổi

Người dùng có thể xem danh sách thông báo, đánh dấu đã đọc. Header hiển thị số thông báo chưa đọc.

### 6.6. Chức năng Quản trị (Admin Dashboard)

#### Quản lý người dùng

Admin xem danh sách tất cả người dùng với thông tin đầy đủ. Có thể khóa (`is_active = false`) hoặc mở khóa tài khoản. Tài khoản bị khóa không thể đăng nhập.

#### Quản lý danh mục

CRUD đầy đủ cho danh mục sách. Xóa danh mục sẽ ảnh hưởng đến sách thuộc danh mục đó (cần kiểm tra trước khi xóa).

#### Quản lý đơn hàng

Admin xem tất cả đơn hàng của mọi người dùng, có thể lọc theo trạng thái, cập nhật trạng thái, và tạo đơn hàng thủ công (hữu ích cho đơn qua điện thoại/offline).

#### Nhật ký thao tác (Audit Log)

Mọi thao tác quan trọng của Admin (tạo/sửa/xóa/khóa/mở khóa) đều được ghi lại trong bảng `audit_logs` với đầy đủ thông tin: ai làm gì, lúc nào, đối tượng nào, giá trị trước/sau. Giúp kiểm tra và truy vết sự cố.

#### Duyệt yêu cầu cập nhật hồ sơ

Người dùng không thể tự sửa một số thông tin nhạy cảm (ví dụ email, SĐT). Thay vào đó họ gửi yêu cầu cập nhật (`ProfileUpdateRequest`), Admin xem xét và phê duyệt hoặc từ chối.

### 6.7. Chức năng Hồ sơ cá nhân

Người dùng xem thông tin hồ sơ cá nhân, gửi yêu cầu thay đổi thông tin. Giao diện hiển thị trạng thái yêu cầu đang chờ duyệt (PENDING) nếu có.

---

## 7. BẢO MẬT HỆ THỐNG

### 7.1. Xác thực JWT với RSA

Hệ thống sử dụng **JWT (JSON Web Token)** với thuật toán ký **RS256 (RSA SHA-256)** thay vì HMAC thông thường. Ưu điểm:

- **Bất đối xứng**: private key dùng để ký token, public key dùng để xác thực. Không cần chia sẻ secret key
- **An toàn hơn**: kể cả khi public key lộ ra ngoài, attacker không thể giả mạo token vì không có private key
- **Chuẩn OAuth2**: tương thích với Spring OAuth2 Resource Server

Cặp key RSA được lưu trong `resources/certs/` dưới dạng file PEM và được inject vào Spring context qua `RsaKeyConfigProperties`.

JWT token chứa:
- `sub`: username của user
- `scope`: vai trò (USER / SELLER / ADMIN)
- `iat`: thời điểm phát hành
- `exp`: thời điểm hết hạn (24 giờ)

### 7.2. Phân quyền (Authorization)

Spring Security cấu hình phân quyền theo URL pattern:

```
Public:          GET /api/books/**, GET /api/categories/**
                 POST /api/auth/register, /api/auth/login
USER+:           /api/cart/**, /api/orders/**, /api/profile/**
SELLER/ADMIN:    /api/seller/**
ADMIN only:      /api/admin/**
```

Phía frontend, component `RequireAuth` kiểm tra trạng thái đăng nhập và vai trò trước khi render trang. Nếu chưa đăng nhập, redirect về `/login` với state lưu URL gốc để redirect lại sau khi đăng nhập.

### 7.3. Mã hóa mật khẩu

Tất cả mật khẩu được mã hóa bằng **BCryptPasswordEncoder** trước khi lưu vào CSDL. BCrypt tự động tạo salt ngẫu nhiên cho mỗi mật khẩu, đảm bảo cùng mật khẩu nhưng hash khác nhau, chống rainbow table attack.

### 7.4. CORS (Cross-Origin Resource Sharing)

Cấu hình CORS chặt chẽ, chỉ cho phép các origin tin cậy:
- `http://localhost:5173` (dev)
- `http://localhost:3000` (dev alternative)
- `https://bookshopdeploy-production-f405.up.railway.app` (production)

### 7.5. Xử lý lỗi tập trung

`GlobalExceptionHandler` bắt tất cả exception và trả về response chuẩn với HTTP status phù hợp. `ErrorCode` enum định nghĩa tất cả mã lỗi với message tiếng Việt, giúp client hiển thị lỗi thân thiện cho người dùng.

---

## 8. KẾT QUẢ ĐẠT ĐƯỢC

### 8.1. Tính năng hoàn thành

| STT | Chức năng | Trạng thái |
|---|---|---|
| 1 | Đăng ký / Đăng nhập với JWT RSA | Hoàn thành |
| 2 | Phân quyền 3 vai trò (USER/SELLER/ADMIN) | Hoàn thành |
| 3 | Duyệt danh sách sách, phân trang | Hoàn thành |
| 4 | Tìm kiếm và lọc sách nâng cao | Hoàn thành |
| 5 | Quản lý giỏ hàng | Hoàn thành |
| 6 | Đặt hàng (partial & full checkout) | Hoàn thành |
| 7 | Quản lý trạng thái đơn hàng | Hoàn thành |
| 8 | Hủy đơn hàng và hoàn tồn kho | Hoàn thành |
| 9 | Thông báo in-app | Hoàn thành |
| 10 | Dashboard Seller (sách + đơn hàng) | Hoàn thành |
| 11 | Dashboard Admin (người dùng, danh mục, sách, đơn) | Hoàn thành |
| 12 | Audit Log | Hoàn thành |
| 13 | Yêu cầu cập nhật hồ sơ | Hoàn thành |
| 14 | Triển khai production trên Railway | Hoàn thành |
| 15 | Docker multi-stage build | Hoàn thành |

### 8.2. Giao diện người dùng

*(Phần này dành để chèn ảnh màn hình)*

**Hình 1**: Trang chủ – Hero section và sản phẩm nổi bật

**Hình 2**: Trang danh sách sách – tìm kiếm và bộ lọc

**Hình 3**: Trang chi tiết sách

**Hình 4**: Giỏ hàng và modal thanh toán

**Hình 5**: Trang lịch sử đơn hàng

**Hình 6**: Dashboard Seller – quản lý sách

**Hình 7**: Dashboard Admin – quản lý người dùng

**Hình 8**: Dashboard Admin – nhật ký thao tác (Audit Log)

**Hình 9**: Trang thông báo

**Hình 10**: Trang đăng nhập / đăng ký

### 8.3. Hiệu năng và khả năng mở rộng

- API phân trang giúp không tải toàn bộ dữ liệu một lúc
- Lazy loading quan hệ JPA (`FetchType.LAZY`) tránh N+1 query
- Soft delete sách (đặt `active = false`) thay vì xóa thật, bảo toàn lịch sử đơn hàng
- Cấu trúc service/interface tách biệt, dễ thay thế implementation

---

## 9. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 9.1. Kết luận

Qua quá trình thực hiện đồ án, nhóm đã xây dựng thành công một ứng dụng web mua bán sách trực tuyến hoàn chỉnh, đáp ứng đầy đủ các yêu cầu đề ra. Hệ thống vận hành ổn định trên môi trường cloud thực tế với kiến trúc rõ ràng, bảo mật tốt và giao diện thân thiện.

Nhóm đã học và áp dụng được nhiều công nghệ và kỹ thuật quan trọng:
- Kiến trúc REST API chuẩn với Spring Boot
- Bảo mật JWT với RSA, phân quyền theo vai trò
- ORM với Spring Data JPA và Hibernate
- Frontend SPA với React và TypeScript
- DevOps cơ bản: Docker multi-stage build, triển khai cloud

### 9.2. Hạn chế

- Chưa có chức năng đánh giá và bình luận sách (dù đã có trường `avgRating` trong CSDL)
- Thanh toán online chưa được tích hợp đầy đủ (chỉ có COD)
- Chưa có chức năng quên mật khẩu / đặt lại mật khẩu qua email
- Chưa có tìm kiếm full-text nâng cao (Elasticsearch)
- Chưa có cơ chế refresh token (JWT hiện tại sẽ hết hạn sau 24 giờ)
- Chưa có unit test / integration test

### 9.3. Hướng phát triển

- **Tích hợp thanh toán**: ZaloPay, VNPay, MoMo
- **Đánh giá và bình luận**: cho phép user đánh giá sao và viết nhận xét
- **Refresh token**: cơ chế tự động gia hạn session
- **Email service**: xác nhận đăng ký, quên mật khẩu, thông báo qua email
- **Real-time notifications**: dùng WebSocket/SSE thay vì polling
- **Search engine**: tích hợp Elasticsearch cho tìm kiếm toàn văn
- **Cache**: Redis cache cho dữ liệu danh mục, sách phổ biến
- **Microservices**: tách thành các service độc lập (auth-service, book-service, order-service)
- **Tối ưu hóa ảnh**: tích hợp CDN (Cloudinary) để lưu trữ và tối ưu ảnh bìa sách

---

## 10. TÀI LIỆU THAM KHẢO

1. Spring Boot Official Documentation – https://docs.spring.io/spring-boot/
2. Spring Security Reference – https://docs.spring.io/spring-security/
3. React Official Documentation – https://react.dev/
4. React Router v7 Documentation – https://reactrouter.com/
5. TailwindCSS Documentation – https://tailwindcss.com/docs/
6. JWT Introduction – https://jwt.io/introduction
7. Docker Official Documentation – https://docs.docker.com/
8. Railway Documentation – https://docs.railway.app/
9. Baeldung – Spring Boot Security with JWT – https://www.baeldung.com/
10. Nguyen Hung Cuong – Tài liệu bài giảng môn Lập trình Java, Trường ĐH Thăng Long

---

*Báo cáo này được lập bởi nhóm sinh viên Khoa CNTT, Trường Đại học Thăng Long.*
*Hà Nội, tháng 05 năm 2025*
