### DECAR - Ứng dụng giới thiệu xe điện

- **Frontend**: React + Vite, React Router, React-Bootstrap, React-Bootstrap-Icons
- **API giả lập**: json-server (đọc dữ liệu từ `db.json`)
- **UI**: Giao diện sáng mặc định, navbar blur nhẹ, card có hover, modal xem nhanh có ảnh hero, thông số kèm icon, giá có icon.

### Tính năng chính
- **Danh sách xe** theo hãng, thẻ xe (card) có ảnh, thông số cơ bản.
- **Xem nhanh** bằng modal: ảnh hero trên cùng, tên ở tiêu đề modal, 3 thông số dàn ngang, bên dưới là giá và mô tả.
- **Trang chi tiết** khi bấm "Xem chi tiết", có hiển thị đánh giá bằng biểu tượng ngôi sao và form gửi feedback cho thành viên.
- **Navbar** điều hướng: Home, About, Tesla, VinFast, BYD, có hiển thị tên người dùng đã đăng nhập.
- **Quản lý trạng thái**: Sử dụng React Context API cho các trạng thái toàn cục như tìm kiếm, chủ đề giao diện và xác thực người dùng.
- **Hệ thống đăng nhập/đăng xuất**: Tích hợp Formik/Yup cho form đăng nhập với timeout tự động, giao diện đăng nhập được cải tiến. Chỉ thành viên mới có thể gửi feedback.
- **Quản lý người dùng**: Trang quản lý thành viên với Formik và Yup để tối ưu hóa việc thêm/sửa/xoá người dùng, bao gồm hiển thị mật khẩu khi chỉnh sửa (theo yêu cầu).
- **Quản lý xe**: Trang quản lý xe với Formik và Yup, giới hạn hãng xe khi thêm mới (Tesla, VinFast, BYD).
- **Quản lý Feedback**: Trang quản lý riêng cho admin để xem, chỉnh sửa và xóa feedback của người dùng.

### Yêu cầu môi trường
- Node.js 18+
- npm 9+

### Cài đặt
```bash
npm install
```

### Chạy ứng dụng
- Chạy API giả lập (nếu dùng `db.json`):
```bash
npx json-server --watch db.json --port 3001
```
- Chạy frontend (Vite):
```bash
npm run dev
```
- Ứng dụng sẽ chạy tại: `http://localhost:5173`
- API giả lập (nếu bật): `http://localhost:3001`

### Cấu trúc dự án (thư mục chính)
```
src/
├─ App.jsx
├─ main.jsx
├─ index.css
├─ Styles/
│  ├─ AboutPage.module.css
│  ├─ BrandPage.module.css
│  ├─ CarDetailpage.module.css
│  ├─ CarManagementPage.module.css
│  ├─ DashboardPage.module.css
│  ├─ FeedbackManagementPage.module.css
│  ├─ HomePage.module.css
│  ├─ LoginPage.module.css
│  ├─ MyCards.module.css
│  ├─ Myfooter.module.css
│  ├─ MyNavbar.module.css
│  ├─ RegisterPage.module.css
│  └─ UserManagementPage.module.css
├─ components/
│  ├─ MyNavbar.jsx
│  ├─ MyCards.jsx
│  └─ Myfooter.jsx
├─ contexts/
│  ├─ SearchContext.jsx
│  ├─ ThemeContext.jsx
│  └─ AuthContext.jsx
└─ pages/
   ├─ Home.jsx
   ├─ About.jsx
   ├─ TeslaPage.jsx
   ├─ VinFastPage.jsx
   ├─ BYDPage.jsx
   ├─ CarDetailPage.jsx
   ├─ LoginPage.jsx
   ├─ RegisterPage.jsx
   ├─ DashboardPage.jsx
   ├─ UserManagementPage.jsx
   ├─ CarManagementPage.jsx
   └─ FeedbackManagementPage.jsx
```

### Ghi chú triển khai
- Sử dụng `index.css` cho các style chung toàn ứng dụng, bao gồm thiết lập sticky footer.
- Đã chuẩn hoá CSS Modules trong `Styles/*` và import theo `../Styles/...`. Tất cả các trang và component đều sử dụng CSS Modules riêng.
- Card: tiêu đề căn giữa, thông số căn trái, có icon `BatteryCharging`, `GeoAlt`, `Speedometer`.
- Modal: tiêu đề ở header, ảnh hero trên cùng (mặc định cao 340px), hàng thông số phía dưới ảnh, kế tiếp là giá (kèm `CurrencyDollar`) và mô tả.
- Có thể mở rộng Dark Mode bằng cách thêm lớp chủ đề hoặc toggle trong `MyNavbar`.
- Footer được căn giữa và có thông tin liên hệ, kèm icon xe phía trên dòng bản quyền.

### Lệnh hữu ích
- Kiểm tra lint (nếu cấu hình):
```bash
npm run lint
```
- Build sản phẩm:
```bash
npm run build
```
- Preview build:
```bash
npm run preview
```

### Thư mục phụ (tuỳ chọn)
- `my-react-router-app/`: mẫu cấu hình React Router/Vite khác (không bắt buộc để chạy phần chính ở `src/`).

### Liên hệ/Đóng góp
- Tạo PR/Issue để đề xuất tính năng, chỉnh sửa UI (ví dụ: thêm Dark Mode toggle, tuỳ biến object-position ảnh hero, v.v.).
