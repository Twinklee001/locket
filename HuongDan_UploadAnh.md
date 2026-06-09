# Hướng dẫn tải lên và cấu hình hình ảnh cho dự án Locket 📸

Tài liệu này sẽ hướng dẫn chi tiết cách tải ảnh mới lên và chỉnh sửa mã nguồn để ảnh xuất hiện trên khung hình lưới (Gallery) và trình phát nhạc của bạn.

---

## Bước 1: Chuẩn bị hình ảnh
1. Chọn ảnh bạn muốn hiển thị (khuyên dùng định dạng `.jpg` hoặc `.png`, tỉ lệ vuông 1:1 là đẹp nhất).
2. Di chuyển các tệp ảnh này vào thư mục:
   `style/img/`

---

## Bước 2: Khai báo ảnh trong mã nguồn `script.js`
Sau khi bỏ ảnh vào thư mục `style/img/`, bạn cần khai báo các tệp ảnh này trong tệp tin `style/script.js` để trang web nhận diện được.

1. Mở tệp tin `style/script.js`.
2. Tìm kiếm danh sách mảng `const images = [...]` (nằm ở khoảng dòng 134).
3. Thêm đường dẫn của ảnh mới vào mảng theo định dạng sau:
   `"style/img/<Tên_ảnh_của_bạn>.<đuôi_ảnh>"`

**Ví dụ:**
Nếu bạn thêm ảnh `my_photo.jpg` vào thư mục `style/img/`, mảng `images` sẽ được cập nhật như sau:

```javascript
    const images = [
        "style/img/image.png",
        "style/img/my_photo.jpg", // <-- Dòng ảnh bạn vừa thêm
        "style/img/z7919142221297_0db8588409a77673c640c35887dbbdb5.jpg",
        ...
    ];
```

*Lưu ý: Đảm bảo viết chính xác tên tệp tin và phần mở rộng (ví dụ: `.jpg`, `.png`, `.jpeg`).*

---

## Bước 3: Đổi ảnh đại diện bài hát (Album Art)
Nếu muốn thay thế ảnh bìa của bài hát trong trình phát nhạc (ví dụ bài "Ai Ngoài Anh 💖"):

1. Chuẩn bị một ảnh mới, bỏ vào thư mục `style/img/`.
2. Mở tệp tin `style/script.js`.
3. Tìm mảng `const songs = [...]` (ở khoảng dòng 45).
4. Sửa giá trị của thuộc tính `img` trỏ tới ảnh mới của bạn.

**Ví dụ:**
```javascript
        { 
            title: "Ai Ngoài Anh 💖", 
            src: "style/sound/VSTRA - Ai Ngoài Anh (Official Audio) [cthtCRmTcgA] (mp3cut.net).mp3", 
            img: "style/img/<Tên_ảnh_mới_của_bạn>.<đuôi_ảnh>" // <-- Cập nhật ở đây
        },
```

---

## Bước 4: Đẩy lên GitHub và cập nhật trang Vercel
Sau khi chỉnh sửa xong các file, chạy các lệnh Git sau trong Terminal của bạn (hoặc nhấn nút Commit trên VS Code) để cập nhật trang web trực tuyến:

```bash
# Thêm tất cả ảnh mới và file chỉnh sửa vào Git
git add -A

# Tạo một ghi chú commit
git commit -m "update: thêm ảnh kỷ niệm mới"

# Đẩy lên GitHub (Vercel sẽ tự động build và cập nhật sau 15-30 giây)
git push origin main
```
