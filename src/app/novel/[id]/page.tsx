import type { Metadata } from "next";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import NovelDetailClient from "./NovelDetailClient";

const SITE_URL = "https://truyenhot.online";

interface Props {
  params: Promise<{ id: string }>;
}

async function getNovelMeta(idOrSlug: string) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT n.id, n.title, n.slug, n.description, n.coverUrl, n.author, n.status, n.updatedAt,
              ROUND(COALESCE(AVG(r.score), 0), 1) AS avgRating,
              COUNT(DISTINCT r.id) AS totalRatings,
              COUNT(DISTINCT c.id) AS chapterCount
       FROM novel n
       LEFT JOIN rating r ON r.novelId = n.id
       LEFT JOIN chapter c ON c.novelId = n.id
       WHERE n.id = ? OR n.slug = ?
       GROUP BY n.id`,
      [idOrSlug, idOrSlug]
    );
    if (rows.length === 0) return null;

    const realId = rows[0].id;
    const [genres] = await pool.query<RowDataPacket[]>(
      `SELECT g.name FROM genre g JOIN novelgenre ng ON g.id = ng.genreId WHERE ng.novelId = ?`,
      [realId]
    );

    return {
      ...rows[0],
      genres: genres.map((g) => g.name) as string[],
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const novel = await getNovelMeta(id);

  if (!novel) {
    return {
      title: "Không tìm thấy truyện",
      description: "Truyện bạn tìm kiếm không tồn tại.",
    };
  }

  const statusLabel =
    novel.status === "COMPLETED" ? "Hoàn Thành"
    : novel.status === "PAUSED"  ? "Tạm Dừng"
    : "Đang Ra";

  const rawDesc = novel.description
    ? novel.description.replace(/\n/g, " ").trim()
    : `Đọc truyện ${novel.title} của tác giả ${novel.author} tại Truyện Hot. ${novel.chapterCount} chương - ${statusLabel}.`;

  const description = rawDesc.length > 160
    ? rawDesc.slice(0, 157) + "..."
    : rawDesc;

  const title = `${novel.title} - ${novel.author}`;
  const slugOrId = novel.slug || id;
  const url = `${SITE_URL}/novel/${slugOrId}`;
  const imageUrl = novel.coverUrl || `${SITE_URL}/logo.png`;

  return {
    title,
    description,
    keywords: [
      novel.title,
      novel.author,
      "đọc truyện online",
      ...novel.genres,
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

export default async function DetailPage({ params }: Props) {
  const { id } = await params;
  const novel = await getNovelMeta(id);

  const statusLabel =
    novel?.status === "COMPLETED" ? "Hoàn Thành"
    : novel?.status === "PAUSED"  ? "Tạm Dừng"
    : "Đang Ra";

  // JSON-LD Structured Data
  const jsonLd = novel
    ? {
        "@context": "https://schema.org",
        "@type": "Book",
        name: novel.title,
        author: {
          "@type": "Person",
          name: novel.author,
        },
        url: `${SITE_URL}/novel/${novel.slug || id}`,
        image: novel.coverUrl || `${SITE_URL}/logo.png`,
        description: novel.description
          ? novel.description.slice(0, 300).replace(/\n/g, " ").trim()
          : "",
        numberOfPages: novel.chapterCount,
        bookFormat: "EBook",
        inLanguage: "vi",
        genre: novel.genres,
        aggregateRating:
          novel.totalRatings > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: Number(novel.avgRating).toFixed(1),
                reviewCount: Number(novel.totalRatings),
                bestRating: "5",
                worstRating: "1",
              }
            : undefined,
        publisher: {
          "@type": "Organization",
          name: "Truyện Hot",
          url: SITE_URL,
        },
      }
    : null;

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
        name: novel?.title || "Truyện",
        item: `${SITE_URL}/novel/${novel?.slug || id}`,
      },
    ],
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <NovelDetailClient />
    </>
  );
}
