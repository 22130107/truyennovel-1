import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Ủng Hộ Chúng Tôi",
  description: "Ủng hộ để duy trì và phát triển website",
};

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-site text-black flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-32 pb-20">
        <h1 className="text-2xl font-bold text-center mb-6 text-pink">Ủng Hộ Chúng Tôi</h1>

        <div className="bg-white border-2 border-pink/50 rounded-xl p-8 text-center shadow-lg">
          <p className="text-gray-800 mb-6">
            Sự ủng hộ của bạn là động lực to lớn giúp chúng tôi duy trì và phát triển website, mang đến những tác phẩm chất lượng hơn.
          </p>

          <p className="text-gray-800 mb-8 font-medium">
            Mọi đóng góp xin vui lòng quét mã QR dưới đây. Chân thành cảm ơn!
          </p>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-xl inline-block shadow-[0_0_15px_rgba(236,72,153,0.3)] border-2 border-pink">
              <img 
                src="/donate.jpg" 
                alt="Mã QR Donate" 
                className="max-w-[300px] w-full h-auto rounded-lg"
              />
            </div>
          </div>
          <p className="text-pink font-bold mt-4">
            Cảm ơn bạn đã đồng hành cùng chúng tôi! ❤️
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
