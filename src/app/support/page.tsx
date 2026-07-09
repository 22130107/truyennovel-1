import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Trung Tâm Hỗ Trợ",
  description:
    "Trung tâm hỗ trợ Truyện Hot. Liên hệ qua email hoặc fanpage để được hỗ trợ.",
  alternates: {
    canonical: "https://caytredammy.com/support",
  },
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-32 pb-20">
        <h1 className="text-2xl font-bold text-center mb-6">Trung Tâm Hỗ Trợ</h1>

        <p className="text-gray-300 mb-6">
          Chúng tôi luôn sẵn sàng hỗ trợ người dùng trong quá trình trải nghiệm đọc truyện trên nền tảng.
        </p>

        <p className="font-bold text-white mb-3">Các vấn đề thường gặp:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
          <li>Đăng ký / đăng nhập tài khoản</li>
          <li>Thanh toán, nạp tiền</li>
          <li>Lỗi hiển thị nội dung truyện</li>
          <li>Khiếu nại bản quyền nội dung</li>
          <li>Góp ý cải thiện dịch vụ</li>
        </ul>

        <div className="mt-12 flex justify-center">
          <img src="/detailimg.webp" alt="Chi tiết" className="max-w-full rounded-lg" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
