# Giải Pháp Hệ Thống Thu Thập Và Phân Tích Hành Vi Đọc Tin Tức

Hệ thống được thiết kế theo yêu cầu bài test Full-stack, bao gồm 3 thành phần chính:

## 1. Chrome Extension (Thư mục `extension/`)
Tiện ích mở rộng thu thập dữ liệu hành vi người dùng trên 3 trang web (vnexpress.net, dantri.com.vn, tuoitre.vn).
- **Cách cài đặt:**
  1. Mở Chrome, truy cập `chrome://extensions/`.
  2. Bật chế độ **Developer mode** (góc trên bên phải).
  3. Nhấn **Load unpacked** và chọn thư mục `extension` trong dự án này.
- **Tính năng nổi bật:**
  - Lắng nghe các event (scroll, mousemove, keydown) kết hợp với `Page Visibility API` để theo dõi chính xác thời gian đọc thực tế.
  - Sử dụng cơ chế hàng đợi (queue) và `chrome.storage.local` để lưu trữ event khi mất mạng và tự động đồng bộ khi có mạng lại.
  - Bắt sự kiện người dùng đóng tab đột ngột qua Background script (`chrome.tabs.onRemoved`).

## 2. Central Server (Thư mục `server/`)
Máy chủ nhận, xử lý và lưu trữ dữ liệu các events sử dụng NestJS và SQLite.
- **Cách chạy:**
  1. Mở terminal, truy cập thư mục `server/`.
  2. Chạy lệnh: `npm install`
  3. Khởi động server: `npm run start:dev`
  (Server sẽ chạy tại `http://localhost:3000`)
- **API cung cấp:**
  - `POST /api/events`: Nhận event từ Extension, lưu vào SQLite (xử lý trùng lặp bằng `event_id`).
  - `GET /api/sessions`: Lấy danh sách phiên đọc báo, phục vụ thống kê tổng thời gian.
  - `GET /api/articles`: Truy xuất dữ liệu các bài báo đã đọc.
  - Tích hợp `Socket.io` đẩy thông báo realtime khi có event mới.

## 3. Dashboard (Thư mục `dashboard/`)
Giao diện quản trị, hiển thị dữ liệu thời gian thực được xây dựng bằng ReactJS, TailwindCSS, Chart.js.
- **Cách chạy:**
  1. Mở terminal, truy cập thư mục `dashboard/`.
  2. Chạy lệnh: `npm install`
  3. Khởi động ứng dụng: `npm run dev`
  (Dashboard sẽ chạy tại `http://localhost:5173`)
- **Tính năng nổi bật:**
  - Liệt kê các bài báo đã đọc, tính toán tổng thời gian thực tế bằng cách nhóm theo `session_id`.
  - Biểu đồ hình tròn (Pie chart) hiển thị tổng thời gian đọc theo Domain.
  - Timeline hiển thị luồng sự kiện được cập nhật realtime (qua Socket.io).

## Kiến Trúc Hệ Thống
- **Frontend:** React, TailwindCSS, Chart.js, Socket.io-client.
- **Backend:** NestJS, TypeORM, SQLite, Socket.io.
- **Extension:** Chrome Manifest V3, Content script, Background script.
- **Cơ sở dữ liệu:** SQLite (Dễ dàng thay đổi thành MySQL thông qua cấu hình của TypeORM).
- **Luồng dữ liệu:** `Content Script` -> Lắng nghe hành vi -> Gửi message -> `Background Script` -> Gọi API POST -> `NestJS Server` -> Lưu `SQLite` -> Emit Event `Socket.io` -> `React Dashboard` cập nhật UI.
# role_fullstack_tienphamvan
