# ✅ Ngrok đã được cài đặt và chạy thành công!

## 🌐 URL Public của bạn

```
https://rekindle-even-landlady.ngrok-free.dev
```

**Webhook URL cho SePay:**
```
https://rekindle-even-landlady.ngrok-free.dev/api/payment/webhook
```

---

## 📋 Các bước tiếp theo

### 1. Cấu hình Webhook trên SePay

Vào [SePay Dashboard → Webhooks](https://my.sepay.vn/userapi/webhooks):

1. **Tên webhook**: `truyenhot` (hoặc tên bất kỳ)
2. **URL nhận webhook**: 
   ```
   https://rekindle-even-landlady.ngrok-free.dev/api/payment/webhook
   ```
3. **Loại giao dịch**: **Tiền vào** (chọn JSON)
4. **Tài khoản**: Chọn tài khoản ngân hàng nhận tiền
5. **Bảo mật**: Copy API token và điền vào `.env` (xem bước 2)

### 2. Cập nhật file `.env`

Mở file `.env` và điền đầy đủ thông tin:

```env
# SePay
SEPAY_API_TOKEN=<token_từ_sepay_dashboard>

# Thông tin tài khoản ngân hàng nhận tiền
BANK_ID=MB                        # Mã ngân hàng (MB, VCB, TCB, ...)
BANK_ACCOUNT_NUMBER=0123456789    # Số tài khoản
BANK_ACCOUNT_NAME=NGUYEN VAN A    # Tên chủ tài khoản
```

### 3. Chạy Next.js dev server

Mở terminal mới và chạy:

```bash
npm run dev
```

### 4. Test thanh toán

1. Mở trình duyệt: `http://localhost:3000` (hoặc dùng URL ngrok)
2. Đăng nhập vào tài khoản
3. Vào trang **Nạp xu** → chọn gói → QR hiện ra
4. Chuyển khoản với **đúng nội dung** (mã `NAPxxx...`)
5. Xu được cộng tự động sau vài giây

---

## 🔍 Xem log webhook realtime

Mở trình duyệt: http://localhost:4040

Tại đây bạn thấy:
- Tất cả request SePay gửi đến
- Body JSON chi tiết
- Response từ server
- Rất tiện để debug

---

## ⚠️ Lưu ý quan trọng

### URL ngrok thay đổi mỗi lần restart

Mỗi lần restart ngrok (hoặc tắt máy), URL sẽ thay đổi. Bạn cần:
1. Lấy URL mới từ terminal ngrok hoặc `http://localhost:4040`
2. Cập nhật lại webhook URL trên SePay

### Giữ URL cố định (tùy chọn)

Nếu muốn URL không đổi, dùng static domain của ngrok (free plan có 1 domain miễn phí):

```bash
/tmp/ngrok_new/ngrok.exe http 3000 --domain=your-static-domain.ngrok-free.app
```

Đăng ký static domain tại: https://dashboard.ngrok.com/domains

---

## 🚀 Script nhanh

Để khởi động lại ngrok sau này, chạy:

```bash
/tmp/ngrok_new/ngrok.exe http 3000
```

Hoặc dùng script `start-ngrok.sh` đã tạo sẵn:

```bash
bash start-ngrok.sh
```

---

## 🧪 Test mode SePay

SePay có **Test mode** — bật lên để test mà không cần chuyển khoản thật:
- Vào SePay dashboard → toggle "Test mode"
- SePay sẽ gửi webhook giả lập
- Tiện để test logic mà không tốn tiền

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra log ngrok tại `http://localhost:4040`
2. Kiểm tra log Next.js trong terminal dev server
3. Kiểm tra log webhook trong code: `src/app/api/payment/webhook/route.ts`
