import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Ký Tài Khoản - Truyện Hot",
  description: "Tạo tài khoản Truyện Hot miễn phí để đọc truyện online, lưu thư viện và nhận ưu đãi.",
  robots: { index: false, follow: true },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
