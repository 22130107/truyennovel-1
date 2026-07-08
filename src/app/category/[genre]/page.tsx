import type { Metadata } from "next";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import CategoryClient from "./CategoryClient";

const SITE_URL = "https://truyenhot.online";

interface Props {
  params: Promise<{ genre: string }>;
}

async function getGenreInfo(genreName: string) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT ng.novelId) AS novelCount
       FROM genre g
       JOIN novelgenre ng ON g.id = ng.genreId
       WHERE g.name = ?`,
      [genreName]
    );
    return rows[0]?.novelCount ?? 0;
  } catch {
    return 0;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre } = await params;
  const genreName = decodeURIComponent(genre);
  const novelCount = await getGenreInfo(genreName);

  const title = `Truyện ${genreName} - Đọc Truyện ${genreName} Online`;
  const description = `Đọc truyện ${genreName} online miễn phí tại Truyện Hot. Tổng hợp ${novelCount} truyện ${genreName} hay nhất, cập nhật nhanh nhất.`;
  const url = `${SITE_URL}/category/${genre}`;

  return {
    title,
    description,
    keywords: [
      `truyện ${genreName}`,
      `đọc truyện ${genreName}`,
      `truyện ${genreName} online`,
      `truyện ${genreName} hay`,
      "đọc truyện online",
      "truyenhot",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Truyện Hot",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { genre } = await params;
  const genreName = decodeURIComponent(genre);

  // JSON-LD CollectionPage
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Truyện ${genreName}`,
    description: `Danh sách truyện thể loại ${genreName} tại Truyện Hot`,
    url: `${SITE_URL}/category/${genre}`,
    publisher: {
      "@type": "Organization",
      name: "Truyện Hot",
      url: SITE_URL,
    },
    inLanguage: "vi",
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Thể loại ${genreName}`,
        item: `${SITE_URL}/category/${genre}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryClient />
    </>
  );
}
