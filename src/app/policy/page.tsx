import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Chính Sách Cung Cấp Dịch Vụ",
  description:
    "Chính sách cung cấp dịch vụ của Website Tiệm Ăn Vặt - nền tảng đọc truyện trực tuyến.",
  alternates: {
    canonical: "https://truyenhot.online/policy",
  },
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-32 pb-20">
        <h1 className="text-2xl font-bold text-center mb-8">
          Chính Sách Cung Cấp Dịch Vụ
        </h1>

        <p className="text-gray-300 mb-8">
          Chính sách này quy định chi tiết về các dịch vụ Nền tảng đọc truyện trực tuyến Website Tiệm Ăn Vặt cung cấp đến độc giả, các tiêu chuẩn vận hành và trách nhiệm của chúng tôi nhằm đảm bảo trải nghiệm đọc truyện tốt nhất.
        </p>

        <div className="space-y-8 text-gray-300">

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Phân loại Dịch vụ và Quyền truy cập</h2>
            <p className="mb-3">
              <strong className="text-white">Truyện miễn phí:</strong> Độc giả có thể truy cập và đọc tự do các tác phẩm hoặc các chương đầu của một bộ truyện mà không cần trả phí.
            </p>
            <p>
              <strong className="text-white">Truyện trả phí (Chương VIP):</strong> Là những nội dung đặc quyền yêu cầu độc giả sử dụng tiền tệ nội bộ 🪙 để mở khóa. Sau khi mở khóa thành công, quyền truy cập vào chương truyện đó sẽ được gắn cố định vào tài khoản của người dùng, cho phép đọc lại bất cứ lúc nào miễn là nền tảng còn hoạt động và tài khoản không vi phạm quy định.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Cam kết về Nội dung và Chất lượng Bản dịch</h2>
            <p className="mb-3">
              <strong className="text-white">Tiêu chuẩn dịch thuật:</strong> Chúng tôi nỗ lực mang đến những bản dịch chất lượng cao, bám sát nguyên tác. Các yếu tố như văn phong, hệ thống xưng hô của nhân vật, và bối cảnh truyện đều được biên tập kỹ lưỡng để đảm bảo trải nghiệm mạch lạc cho độc giả.
            </p>
            <p>
              <strong className="text-white">Quyền chỉnh sửa nội dung:</strong> Website Tiệm Ăn Vặt bảo lưu quyền chỉnh sửa các lỗi chính tả, điều chỉnh lại danh xưng nhân vật hoặc tối ưu hóa câu chữ trong các chương truyện (kể cả chương VIP đã đăng tải) nhằm nâng cao chất lượng nội dung mà không cần thông báo trước.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Chính sách Lịch đăng và Xử lý Truyện tạm ngưng</h2>
            <p className="mb-3">
              <strong className="text-white">Lịch cập nhật:</strong> Đội ngũ dịch giả cam kết duy trì lịch đăng chương mới theo đúng tiến độ đã thông báo tại phần giới thiệu của từng bộ truyện (trừ các trường hợp ốm đau hoặc sự cố bất khả kháng).
            </p>
            <p>
              <strong className="text-white">Xử lý khi truyện VIP bị ngừng dịch:</strong> Trong trường hợp bất khả kháng khiến một bộ truyện đang thu phí không thể tiếp tục thực hiện, chúng tôi sẽ có chính sách hỗ trợ (ví dụ: hoàn lại số xu 🪙 tương đương với số chương VIP gần nhất mà độc giả đã mua của bộ truyện đó) vào ví nội bộ.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Cam kết Chất lượng Nền tảng</h2>
            <p className="mb-3">
              <strong className="text-white">Hoạt động ổn định:</strong> Chúng tôi hướng tới việc duy trì hệ thống hoạt động liên tục 24/7.
            </p>
            <p className="mb-3">
              <strong className="text-white">Bảo trì định kỳ:</strong> Để nâng cấp hệ thống và vá lỗi, nền tảng có thể tạm ngưng dịch vụ. Thông báo bảo trì sẽ được hiển thị trên trang chủ hoặc gửi qua hệ thống thông báo trước tối thiểu 12 - 24 giờ.
            </p>
            <p>
              <strong className="text-white">Sự cố ngoài ý muốn:</strong> Đối với các sự cố đứt cáp quang, lỗi máy chủ trung tâm dữ liệu hoặc các sự kiện bất khả kháng, chúng tôi sẽ dốc toàn lực khắc phục trong thời gian ngắn nhất nhưng được miễn trừ trách nhiệm bồi thường.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Chính sách Hỗ trợ Khách hàng</h2>
            <p className="mb-3">
              <strong className="text-white">Phạm vi hỗ trợ:</strong> Cấp lại mật khẩu, xử lý lỗi nạp xu không vào tài khoản, lỗi đã trừ phí nhưng không mở được chương VIP, và ghi nhận báo cáo lỗi chính tả từ độc giả.
            </p>
            <p>
              <strong className="text-white">Thời gian xử lý:</strong> Mọi yêu cầu hỗ trợ sẽ được tiếp nhận và xử lý trong vòng 24 - 48 giờ làm việc.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Quyền Từ chối Phục vụ</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Có dấu hiệu cào dữ liệu (crawl data), chụp ảnh màn hình chương VIP để phát tán trái phép.</li>
              <li>Cố tình lợi dụng lỗ hổng hệ thống để gian lận tiền tệ nội bộ.</li>
              <li>Spam bình luận, gây rối hoặc có hành vi xúc phạm dịch giả và cộng đồng.</li>
            </ul>
          </section>

        </div>

        <div className="mt-12 flex justify-center">
          <img src="/detailimg.png" alt="Chi tiết" className="max-w-full rounded-lg" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
