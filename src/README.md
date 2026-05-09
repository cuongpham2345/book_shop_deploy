# Book Shop - Backend

Spring Boot REST API cho ứng dụng bán sách.

## Yêu cầu

- Java 17+
- Maven 3.8+
- MySQL 8.0+

## Cài đặt

### 1. Tạo database và import dữ liệu

```sql
CREATE DATABASE book_shop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Sau đó import toàn bộ schema + dữ liệu:

```bash
mysql -u root -p book_shop_db < database.sql
```

### 2. Cấu hình kết nối DB (nếu cần)

Mở `src/main/resources/application.yaml`, sửa thông tin nếu DB của bạn khác:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/book_shop_db
    username: root
    password: 12345678
```

### 3. Chạy backend

```bash
mvn spring-boot:run
```

Server chạy tại: `http://localhost:8080`

## Tài khoản mặc định

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin1234` |

## API chính

| Endpoint | Mô tả |
|----------|-------|
| `POST /api/auth/login` | Đăng nhập |
| `POST /api/auth/register` | Đăng ký |
| `GET /api/books` | Danh sách sách |
| `GET /api/admin/orders` | Quản lý đơn hàng (Admin) |
| `GET /api/notifications` | Thông báo |
