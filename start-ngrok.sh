#!/bin/bash
# Script khởi động ngrok và lấy URL tự động

NGROK_EXE="/tmp/ngrok_new/ngrok.exe"

# Kiểm tra ngrok có tồn tại không
if [ ! -f "$NGROK_EXE" ]; then
  echo "❌ Không tìm thấy ngrok tại $NGROK_EXE"
  echo "   Tải lại tại: https://ngrok.com/download"
  exit 1
fi

echo "🚀 Đang khởi động ngrok..."
"$NGROK_EXE" http 3000 &
NGROK_PID=$!

# Chờ ngrok khởi động
sleep 3

# Lấy URL public
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*"' | grep https | cut -d'"' -f4)

if [ -z "$PUBLIC_URL" ]; then
  echo "❌ Không lấy được URL. Kiểm tra lại ngrok."
  exit 1
fi

echo ""
echo "✅ Ngrok đang chạy!"
echo ""
echo "🌐 URL Public:    $PUBLIC_URL"
echo "🔗 Webhook URL:   $PUBLIC_URL/api/payment/webhook"
echo "🔍 Ngrok UI:      http://localhost:4040"
echo ""
echo "👉 Cập nhật URL webhook này trên SePay dashboard"
echo ""
echo "Nhấn Ctrl+C để dừng ngrok"

wait $NGROK_PID
