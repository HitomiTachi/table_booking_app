# Hướng dẫn chi tiết tạo và sử dụng MongoDB

## 1. Cài đặt MongoDB
- Tải MongoDB Community tại https://www.mongodb.com/try/download/community
- Cài đặt theo hướng dẫn, chọn mặc định.
- (Khuyến nghị) Cài thêm MongoDB Compass để quản lý dữ liệu trực quan.

## 2. Khởi động MongoDB
- Mở Command Prompt, chạy lệnh:
	```cmd
	mongod
	```
- Nếu dùng Compass, chỉ cần mở ứng dụng là server tự chạy.

## 3. Tạo database và collection
- Khi chạy dự án Node.js với chuỗi kết nối như:
	```javascript
	const uri = 'mongodb://localhost:27017/table_booking_app';
	```
	MongoDB sẽ tự động tạo database và collection khi bạn insert dữ liệu đầu tiên.
- Có thể tạo database/collection thủ công bằng Compass:
	- Mở Compass, kết nối tới `localhost:27017`
	- Nhấn "Create Database" để tạo mới
	- Nhấn "Create Collection" để thêm collection

## 4. Thêm dữ liệu mẫu
- Chạy lệnh sau trong thư mục dự án để insert dữ liệu mẫu:
	```cmd
	node sampleData.js
	```
- Dữ liệu sẽ xuất hiện trong các collection tương ứng.

## 5. Quản lý dữ liệu
- Dùng Compass để xem, sửa, xóa dữ liệu trực quan.
- Có thể dùng các lệnh MongoDB shell:
	```cmd
	mongo
	use table_booking_app
	db.users.find()
	db.tables.find()
	db.services.find()
	db.bookings.find()
	db.logs.find()
	```

## 6. Kết nối và sử dụng trong Node.js
- Định nghĩa schema trong thư mục `models/`
- Kết nối bằng file `db.js`
- Sử dụng các model để thao tác dữ liệu (thêm, sửa, xóa, truy vấn)

## 7. Lưu ý
- Mỗi dự án nên dùng tên database riêng
- Không xóa database nếu chưa backup
- Có thể export/import dữ liệu bằng Compass hoặc lệnh mongodump/mongorestore
# Hướng dẫn cài đặt và sử dụng dự án

## 1. Yêu cầu hệ thống
- Node.js (>=14)
- MongoDB (Community hoặc Compass)

## 2. Cài đặt dự án
1. Tải mã nguồn về máy
2. Mở Command Prompt, chuyển vào thư mục dự án:
	```cmd
	cd c:\LTM\table-booking-app
	```
3. Cài đặt các package cần thiết:
	```cmd
	npm install
	```
4. Đảm bảo MongoDB đã chạy:
	- Nếu dùng bản Community: mở Command Prompt, chạy `mongod`
	- Nếu dùng Compass: chỉ cần mở ứng dụng

## 3. Insert dữ liệu mẫu
Chạy lệnh sau để thêm dữ liệu mẫu vào database:
```cmd
node sampleData.js
```

## 4. Khởi động server backend
Chạy lệnh sau để khởi động server:
```cmd
node index.js
```
Server sẽ chạy ở cổng 3000 (mặc định).

## 5. Kiểm thử API
Dùng Postman, Insomnia hoặc trình duyệt để kiểm thử các API:
- `GET /` kiểm tra server
- `GET /tables/:ownerId` lấy danh sách bàn theo owner
- `GET /bookings/:userId/:role` lấy booking theo user
- `PUT /booking/:bookingId/status` cập nhật trạng thái booking

## 6. Quản lý dữ liệu
Dùng MongoDB Compass để xem, sửa, xóa dữ liệu trực quan.

## 7. Lưu ý
- Mỗi dự án nên dùng tên database riêng trong file `db.js`
- Không xóa database nếu chưa backup
- Có thể mở rộng API, thêm chức năng theo nhu cầu
# Tài liệu hóa Database

## 1. Users
**Các trường:**
- name: Tên người dùng
- email: Email (duy nhất)
- password: Mật khẩu
- role: Vai trò (admin, owner, staff, customer)

## 2. Tables
**Các trường:**
- status: Trạng thái (available, reserved, occupied)
- capacity: Sức chứa
- location: Vị trí
- ownerId: Tham chiếu tới User (owner)

## 3. Services
**Các trường:**
- name: Tên dịch vụ
- duration: Thời lượng (phút)
- price: Giá
- status: Trạng thái (active, inactive)

## 4. Bookings
**Các trường:**
- userId: Tham chiếu tới User (customer)
- ownerId: Tham chiếu tới User (owner)
- tableId: Tham chiếu tới Table
- serviceId: Tham chiếu tới Service
- time: Thời gian đặt
- status: Trạng thái (pending, confirmed, completed, cancelled)

## 5. Logs (History)
**Các trường:**
- actorId: Ai thao tác (tham chiếu User)
- action: Hành động
- time: Thời gian
- target: Đối tượng thao tác

## Quan hệ giữa các collection
- User (owner) sở hữu nhiều Table
- User (customer) có thể có nhiều Booking
- Table có thể có nhiều Booking
- Service có thể được chọn trong nhiều Booking
- Log ghi lại thao tác của User lên các đối tượng khác

## Ví dụ dữ liệu mẫu (JSON)
```json
{
	"user": { "name": "Admin", "email": "admin@example.com", "role": "admin" },
	"table": { "status": "available", "capacity": 4, "location": "A1", "ownerId": "..." },
	"service": { "name": "Trà sữa", "duration": 30, "price": 30000, "status": "active" },
	"booking": { "userId": "...", "ownerId": "...", "tableId": "...", "serviceId": "...", "time": "2025-11-18T18:00:00Z", "status": "pending" },
	"log": { "actorId": "...", "action": "create booking", "time": "2025-11-18T18:01:00Z", "target": "bookingId" }
}
```
