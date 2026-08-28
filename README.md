# Hệ Thống Thu Thập, Lưu Trữ Và Phân Tích Hành Vi Đọc Tin Tức của User trên Chrome.

# Instructions for installing and running the system.
# Download link git
## 1. Chrome Extension (Thư mục `extension/`)

Source (vnexpress.net, dantri.com.vn, tuoitre.vn).

- **Install:**
  1. Mở Chrome, truy cập `chrome://extensions/`.
  2. Bật chế độ **Developer mode** (góc trên bên phải).
  3. Nhấn **Load unpacked** và chọn thư mục `extension` trong dự án này.
- **Tính năng nổi bật:**
  - Lắng nghe các event (scroll, mousemove, keydown) kết hợp với `Page Visibility API` để theo dõi chính xác thời gian đọc thực tế.
  - Sử dụng cơ chế hàng đợi (queue) và `chrome.storage.local` để lưu trữ event khi mất mạng và tự động đồng bộ khi có mạng lại.
  - Bắt sự kiện người dùng đóng tab đột ngột qua Background script (`chrome.tabs.onRemoved`).

## 2. Central Server (Thư mục `server/`)

- **Run:**
  1. Mở terminal, truy cập thư mục `server/`.
  2. Chạy lệnh: `npm install`
  3. Khởi động server: `npm run start:dev`
     (Server sẽ chạy tại `http://localhost:3000`)
- **API:**
  - `POST /api/events`: Nhận event từ Extension, lưu vào SQLite (xử lý trùng lặp bằng `event_id`).
  - `GET /api/sessions`: Lấy danh sách phiên đọc báo, phục vụ thống kê tổng thời gian.
  - `GET /api/articles`: Truy xuất dữ liệu các bài báo đã đọc.
  - Tích hợp `Socket.io` đẩy thông báo realtime khi có event mới.

## 3. Dashboard (Thư mục `dashboard/`)

- **Run:**
  1. Mở terminal, truy cập thư mục `dashboard/`.
  2. Chạy lệnh: `npm install`
  3. Khởi động ứng dụng: `npm run dev`
     (Dashboard sẽ chạy tại `http://localhost:5173`)

## Tech & tools

- **Frontend:** React, TailwindCSS, Chart.js, Socket.io-client.
- **Backend:** NestJS, TypeORM, SQLite, Socket.io.
- **Extension:** Chrome Manifest V3, Content script, Background script.
- **Database:** SQLite.
- **Luồng dữ liệu:** `Content Script` -> Lắng nghe hành vi -> Gửi message -> `Background Script` -> Call API POST -> `NestJS Server` -> Save `SQLite` -> Emit Event `Socket.io` -> `React Dashboard` Update UI.

## Features

- Dashboard: Liệt kê các bài báo đã đọc, tính toán tổng thời gian thực tế bằng cách nhóm theo `session_id`. Biểu đồ hình tròn (Pie chart) hiển thị tổng thời gian đọc theo Domain. Timeline hiển thị luồng sự kiện được cập nhật realtime (qua Socket.io).
- Extension: Thu thập URL, Title, Content trên 3 trang web được chỉ định. Tính toán thời gian đọc thực tế (Scroll, visibility, idle 30s). Xử lý queue local khi mất mạng, xử lý khi đóng tab đột ngột.
- RESTful API (lưu sự kiện vào SQLite), xử lý trùng lặp event (idempotency key), đẩy Real-time (Socket.io).

## Hạn chế

- Extension đang dùng query selector tĩnh (phụ thuộc vào DOM HTML của báo).
- Cần tối ưu truy vấn Group By ở Backend khi lượng dữ liệu phình to.
- Dashboard giao diện còn ở mức MVP, chưa có tính năng export báo cáo hay lọc theo ngày tháng.

## Quyết định kỹ thuật

- Lưu dữ liệu dạng Event Log (Time-series) thay vì cập nhật 1 bản ghi duy nhất.
- Dùng Background Service Worker làm Proxy / Queue để tránh mất dữ liệu khi rớt mạng.
- Sử dụng SQLite và TypeORM để dễ test (chỉ cần npm install và npm run start) nhưng vẫn sẵn sàng scale lên MySQL/PostgreSQL.
