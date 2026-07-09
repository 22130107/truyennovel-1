import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { InAppBrowserWarning } from "@/components/common/InAppBrowserWarning";

const SITE_URL = "https://caytredammy.com";
const SITE_NAME = "Truyện Hot";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Truyện Hot - Đọc Truyện Online Miễn Phí",
    template: "%s | Truyện Hot",
  },
  description:
    "Đọc truyện online miễn phí tại Truyện Hot. Kho truyện phong phú: tiên hiệp, kiếm hiệp, ngôn tình, đô thị, huyền huyễn. Cập nhật nhanh, đọc mượt mà trên mọi thiết bị.",
  keywords: [
    "đọc truyện online",
    "truyện hot",
    "truyện tiên hiệp",
    "truyện kiếm hiệp",
    "truyện ngôn tình",
    "truyện đô thị",
    "truyện huyền huyễn",
    "đọc truyện miễn phí",
    "truyenhot",
  ],
  authors: [{ name: "Truyện Hot", url: SITE_URL }],
  creator: "Truyện Hot",
  publisher: "Truyện Hot",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Truyện Hot - Đọc Truyện Online Miễn Phí",
    description:
      "Đọc truyện online miễn phí tại Truyện Hot. Kho truyện phong phú: tiên hiệp, kiếm hiệp, ngôn tình, đô thị, huyền huyễn.",
  },
  twitter: {
    card: "summary",
    title: "Truyện Hot - Đọc Truyện Online Miễn Phí",
    description:
      "Đọc truyện online miễn phí tại Truyện Hot. Kho truyện phong phú: tiên hiệp, kiếm hiệp, ngôn tình, đô thị, huyền huyễn.",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
  // Thêm verification khi có Google Search Console:
  // verification: { google: "your-verification-code" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased text-black min-h-screen bg-site flex flex-col">
        <div className="flex-1 flex flex-col">
          <Providers>
            {/* <InAppBrowserWarning /> */}
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
