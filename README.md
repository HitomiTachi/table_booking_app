# Table Booking API

Hệ thống RESTful dùng Express + Mongoose để quản lý bàn, dịch vụ, đặt chỗ và lịch sử thao tác cho mô hình quán ăn/quán cà phê. Dự án đã tích hợp cơ chế phân quyền cơ bản theo vai trò (admin, owner, staff, customer).

## Kiến trúc & Thư mục chính

- `index.js`: khởi tạo Express app, mount các router `/api/users`, `/api/tables`, `/api/services`, `/api/bookings`, `/api/history`.
- `db.js`: kết nối MongoDB (URI mặc định `mongodb://localhost:27017/table_booking_app`).
- `routes/`: định nghĩa các API; mỗi file tương ứng một tài nguyên.
- `src/model/`: schema Mongoose cho `User`, `Table`, `Service`, `Booking`, `Log`.
- `src/middleware/auth.js`: middleware đọc header `x-user-id`, nạp user và hàm `authorize(...roles)` để chặn truy cập.
- `src/utils/`: `asyncHandler` (bọc Promise) và `logAction` (ghi lịch sử).
- `sampleData.js`: script seed dữ liệu mẫu.
- `tests/api.http`: bộ request mẫu cho Postman / VS Code REST Client.

## Chuẩn bị môi trường

Yêu cầu:

- Node.js ≥ 18
- MongoDB cài local (hoặc chỉnh `db.js` sang URI khác)

Bước cài đặt:

```bash
npm install
```

## Chạy ứng dụng

```bash
# Khởi động MongoDB (nếu chưa chạy)
# Sau đó start API
node index.js
```

Mặc định server chạy ở `http://localhost:3000`.

## Seed dữ liệu mẫu

```bash
node sampleData.js
```

Script sẽ xóa sạch các collection chính rồi tạo:

- 4 user (Admin / Owner1 / Staff1 / Customer1)
- 2 bàn, 2 dịch vụ thuộc Owner1
- 1 booking mẫu

Sau khi seed, hãy dùng `_id` thực tế từ Mongo để test API.

## Xác thực & Phân quyền

- Tất cả request (trừ `POST /api/users/login`) phải gửi header `x-user-id` = `_id` của user.
- Middleware `authorize` kiểm soát ai được gọi route:

| Vai trò     | Quyền chính                                                                 |
|-------------|------------------------------------------------------------------------------|
| `customer`  | CRUD booking của chính mình. Không truy cập tables/services/history.         |
| `staff`     | CRUD booking cho mọi khách, cập nhật table/service (không tạo/xóa).          |
| `owner`     | CRUD table/service của cơ sở mình, xem booking thuộc cơ sở.                  |
| `admin`     | Toàn quyền tất cả API, bao gồm quản lý user và log.                          |

Ghi chú: các thao tác quan trọng đều gọi `logAction` để lưu vào collection `Log` (History API chỉ hiển thị dữ liệu này).

## Tóm tắt endpoint

### Auth & User
- `POST /api/users/login` – đăng nhập (không cần header).
- `GET /api/users?role=...` – chỉ admin xem danh sách.
- `PATCH /api/users/:id/role` – admin cập nhật role.

### Tables
- `GET /api/tables?status=...` – admin/staff xem toàn bộ, owner chỉ xem của mình.
- `POST /api/tables` – admin hoặc owner tạo bàn (ownerId tự gắn theo user).
- `PUT /api/tables/:id` – admin/owner/staff chỉnh sửa; owner chỉ sửa bàn của mình.
- `PATCH /api/tables/:id/status` – update trạng thái.
- `DELETE /api/tables/:id` – admin hoặc owner xóa bàn của mình.

### Services
Luồng tương tự table; `Service` có trường `ownerId` để ràng buộc cơ sở.

### Bookings
- `GET /api/bookings` – filter theo role:
  - customer: tự động `userId = req.user._id`
  - owner: tự động `ownerId = req.user._id`
  - staff/admin: có thể truyền query `userId`/`ownerId`/`status`.
- `POST /api/bookings` – customer tạo booking cho chính mình; staff/admin có thể tạo cho khách khác.
- `PUT /api/bookings/:id`, `PATCH /:id/status`, `PATCH /:id/cancel` – chỉ admin/staff hoặc chính customer được thao tác (hàm `canModifyBooking` chịu trách nhiệm kiểm tra).

### History
- `GET /api/history?actorId=&action=` – chỉ admin/owner/staff xem log.
- `POST /api/history` – chỉ admin thêm log thủ công (đa phần log được tạo tự động).

## Kiểm thử nhanh

1. Seed dữ liệu (`node sampleData.js`).
2. Start server (`node index.js`).
3. Dùng Postman, VS Code REST Client hoặc `curl` gửi request với header `x-user-id`.
4. File `tests/api.http` chứa sẵn kịch bản mẫu (login, CRUD tables/services/bookings, cancel booking, xem history). Với VS Code REST Client chỉ cần mở file và nhấn “Send Request”.

Ví dụ gọi đăng nhập bằng `curl`:

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

Ví dụ gọi API cần phân quyền:

```bash
curl http://localhost:3000/api/tables \
  -H "x-user-id: <admin_or_owner_id>"
```

## Hướng phát triển tiếp

- Thay header thủ công bằng JWT/bearer token.
- Liên kết staff với một owner cụ thể.
- Thêm validation chi tiết (Joi/Zod) và test tự động (Jest + Supertest).
- Tối ưu `db.js`: bỏ tùy chọn `useNewUrlParser`/`useUnifiedTopology` vì driver mới không cần.

---

Chúc bạn triển khai suôn sẻ! Nếu cần hỗ trợ thêm (ví dụ viết Postman collection sẵn, bổ sung Swagger UI, hay deploy), hãy yêu cầu để được trợ giúp. 

