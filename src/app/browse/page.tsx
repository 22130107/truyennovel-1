import type { Metadata } from "next";
import BrowseClient from "./BrowseClient";

const SITE_URL = "https://truyenhot.online";

export const metadata: Metadata = {
  title: "Tìm Kiếm Truyện - Đọc Truyện Online",
  description:
    "Tìm kiếm và khám phá hàng nghìn bộ truyện online tại Truyện Hot. Lọc theo thể loại, trạng thái, sắp xếp theo lượt xem, mới nhất.",
  keywords: [
    "tìm kiếm truyện",
    "đọc truyện online",
    "truyện hay",
    "truyện mới nhất",
    "truyện xem nhiều",
    "truyenhot",
  ],
  alternates: {
    canonical: `${SITE_URL}/browse`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/browse`,
    title: "Tìm Kiếm Truyện - Truyện Hot",
    description:
      "Tìm kiếm và khám phá hàng nghìn bộ truyện online tại Truyện Hot.",
    siteName: "Truyện Hot",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary",
    title: "Tìm Kiếm Truyện - Truyện Hot",
    description: "Tìm kiếm và khám phá hàng nghìn bộ truyện online tại Truyện Hot.",
  },
};

export default function BrowsePage() {
  return <BrowseClient />;
}
