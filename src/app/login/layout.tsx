import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Nhập - Truyện Hot",
  description: "Đăng nhập tài khoản Truyện Hot để đọc truyện online, lưu tiến trình đọc và mua chương trả phí.",
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
