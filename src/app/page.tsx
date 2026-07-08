import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const SITE_URL = "https://truyenhot.online";

export const metadata: Metadata = {
  title: "Truyện Hot - Đọc Truyện Online Miễn Phí",
  description:
    "Đọc truyện online miễn phí tại Truyện Hot. Kho truyện phong phú: tiên hiệp, kiếm hiệp, ngôn tình, đô thị, huyền huyễn. Cập nhật nhanh, đọc mượt mà trên mọi thiết bị.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Truyện Hot - Đọc Truyện Online Miễn Phí",
    description:
      "Đọc truyện online miễn phí tại Truyện Hot. Kho truyện phong phú: tiên hiệp, kiếm hiệp, ngôn tình, đô thị, huyền huyễn.",
    siteName: "Truyện Hot",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary",
    title: "Truyện Hot - Đọc Truyện Online Miễn Phí",
    description:
      "Đọc truyện online miễn phí tại Truyện Hot. Kho truyện phong phú: tiên hiệp, kiếm hiệp, ngôn tình, đô thị, huyền huyễn.",
  },
};

export default function HomePage() {
  // JSON-LD Organization + WebSite
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Truyện Hot",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Truyện Hot",
    url: SITE_URL,
    description:
      "Đọc truyện online miễn phí. Kho truyện phong phú: tiên hiệp, kiếm hiệp, ngôn tình, đô thị, huyền huyễn.",
    inLanguage: "vi",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/browse?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
