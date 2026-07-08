import { Metadata } from "next";

const SITE_URL = "https://truyenhot.online";

export const metadata: Metadata = {
  title: "Hướng Dẫn Nạp Xu - Truyện Hot",
  description: "Hướng dẫn chi tiết cách nạp xu tại Truyện Hot qua chuyển khoản ngân hàng, Momo, ZaloPay. Nạp nhanh, nhận xu ngay.",
  alternates: {
    canonical: `${SITE_URL}/guide`,
  },
  openGraph: {
    title: "Hướng Dẫn Nạp Xu - Truyện Hot",
    description: "Hướng dẫn chi tiết cách nạp xu tại Truyện Hot.",
    url: `${SITE_URL}/guide`,
    type: "website",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
