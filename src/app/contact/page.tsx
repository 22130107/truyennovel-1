import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Liên Hệ Với Chúng Tôi",
  description:
    "Liên hệ với Truyện Hot qua fanpage Facebook. Chúng tôi luôn sẵn sàng hỗ trợ bạn.",
  alternates: {
    canonical: "https://truyenhot.online/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-32 pb-20">
        <h1 className="text-2xl font-bold text-center mb-6">Liên Hệ Với Chúng Tôi</h1>

        <p className="text-gray-300 mb-6">
          Nếu bạn có bất kỳ thắc mắc, góp ý hoặc cần hỗ trợ trong quá trình sử dụng website, vui lòng liên hệ với chúng tôi qua các kênh dưới đây:
        </p>

        <ul className="space-y-3 text-gray-300 mb-6">
          <li className="flex items-center gap-2">
            <span>🕐</span>
            <span>Thời gian làm việc: 9:00 – 23:00</span>
          </li>
        </ul>

        <p className="text-gray-300">
          Chúng tôi tiếp nhận mọi ý kiến đóng góp nhằm nâng cao chất lượng nội dung và trải nghiệm người đọc.
        </p>

        <div className="mt-12 flex justify-center">
          <img src="/detailimg.png" alt="Chi tiết" className="max-w-full rounded-lg" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
