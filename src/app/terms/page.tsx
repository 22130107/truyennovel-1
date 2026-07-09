import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Điều Khoản & Điều Kiện Sử Dụng",
  description:
    "Điều khoản và điều kiện sử dụng dịch vụ đọc truyện tại Truyện Hot - Website Tiệm Ăn Vặt.",
  alternates: {
    canonical: "https://truyenhot.online/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-32 pb-20">
        <h1 className="text-2xl font-bold text-center mb-8">
          Điều Khoản & Điều Kiện Sử Dụng
        </h1>

        <p className="text-gray-300 mb-8">
          Chào mừng bạn đến với Website Tiệm Ăn Vặt. Khi truy cập, đăng ký tài khoản và sử dụng các dịch vụ đọc truyện trên website của chúng tôi, bạn đồng ý tuân thủ toàn bộ các điều khoản và điều kiện dưới đây.
        </p>

        <div className="space-y-8 text-gray-300">

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Quy định về Tài khoản Người dùng</h2>
            <p className="mb-3">
              <strong className="text-white">Đăng ký:</strong> Người dùng cần cung cấp thông tin chính xác khi tạo tài khoản. Bạn hoàn toàn chịu trách nhiệm về việc bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình.
            </p>
            <p>
              Website Tiệm Ăn Vặt có quyền khóa hoặc xóa tài khoản vĩnh viễn mà không cần báo trước nếu phát hiện người dùng vi phạm các điều khoản sử dụng, đặc biệt là các vi phạm liên quan đến bản quyền nội dung.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Quyền Sở hữu</h2>
            <p className="mb-3">
              Toàn bộ nội dung trên website, bao gồm nhưng không giới hạn ở các bản dịch truyện (tiên hiệp, ngôn tình, trường học, v.v.), hình ảnh minh họa, giao diện và logo đều thuộc quyền sở hữu hợp pháp của Website Tiệm Ăn Vặt hoặc các dịch giả.
            </p>
            <p className="mb-3">
              Người dùng không được phép sao chép, chụp màn hình, trích xuất văn bản hoặc chia sẻ các chương truyện trả phí lên bất kỳ nền tảng, hội nhóm hoặc website nào khác dưới mọi hình thức khi chưa có sự chấp thuận của dịch giả hoặc Website Tiệm Ăn Vặt.
            </p>
            <p>
              Mọi hành vi phát tán nội dung trái phép sẽ dẫn đến việc khóa tài khoản vĩnh viễn, tước bỏ toàn bộ số dư trong tài khoản.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Chính sách Thanh toán và Dịch vụ Trả phí</h2>
            <p className="mb-3">
              Việc thanh toán để mở khóa các chương truyện VIP được thực hiện thông qua hệ thống tiền tệ nội bộ 🪙 nạp vào từ các cổng thanh toán hợp lệ (chuyển khoản ngân hàng, ví điện tử).
            </p>
            <p>
              Tỷ lệ quy đổi từ tiền thật sang tiền tệ nội bộ và mức phí cho từng chương truyện sẽ được niêm yết công khai trên website. Website Tiệm Ăn Vặt có quyền điều chỉnh mức giá này và sẽ thông báo trước trên hệ thống.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Chính sách Hoàn tiền</h2>
            <p>
              Các giao dịch mua xu 🪙 và thanh toán mở khóa chương truyện là sản phẩm nội dung số. Do đặc thù của dịch vụ, Website Tiệm Ăn Vặt không áp dụng chính sách hoàn tiền sau khi giao dịch đã thực hiện thành công, ngoại trừ các trường hợp lỗi phát sinh từ hệ thống kỹ thuật của chúng tôi khiến bạn không thể truy cập nội dung đã mua.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Hành vi Người dùng và Quy định Tương tác</h2>
            <p className="mb-3">
              Khu vực bình luận và đánh giá truyện được tạo ra để kết nối cộng đồng. Người dùng phải sử dụng ngôn từ lịch sự, tôn trọng dịch giả và các độc giả khác.
            </p>
            <p>
              Nghiêm cấm các hành vi: sử dụng ngôn từ đả kích, xúc phạm; quảng cáo cho các website đối thủ; bàn luận các vấn đề nhạy cảm liên quan đến chính trị, tôn giáo; hoặc chia sẻ liên kết chứa mã độc.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Giới hạn Trách nhiệm</h2>
            <p className="mb-3">
              Chúng tôi luôn nỗ lực đảm bảo website hoạt động ổn định, nhưng không cam kết website sẽ hoàn toàn không có lỗi kỹ thuật hoặc gián đoạn dịch vụ do các yếu tố khách quan (bảo trì máy chủ, lỗi đường truyền mạng).
            </p>
            <p>
              Website Tiệm Ăn Vặt không chịu trách nhiệm pháp lý đối với bất kỳ thiệt hại gián tiếp nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <p className="text-black text-sm pt-4 border-t border-neutral-800">
            Việc tiếp tục sử dụng website đồng nghĩa với việc bạn chấp nhận toàn bộ các điều khoản và điều kiện đã nêu.
          </p>

        </div>

        <div className="mt-12 flex justify-center">
          <img src="/detailimg.webp" alt="Chi tiết" className="max-w-full rounded-lg" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
