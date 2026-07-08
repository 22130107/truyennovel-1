import type { Metadata } from "next";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import ChapterReadingClient from "./ChapterReadingClient";

const SITE_URL = "https://truyenhot.online";

interface Props {
  params: Promise<{ id: string; chapterId: string }>;
}

async function getChapterMeta(idOrSlug: string, chapterNumber: string) {
  try {
    const num = parseInt(chapterNumber, 10);
    if (isNaN(num)) return null;

    const [chapters] = await pool.query<RowDataPacket[]>(
      `SELECT c.id, c.chapterNumber, c.title, c.isLocked, c.createdAt,
              n.title AS novelTitle, n.slug AS novelSlug, n.author, n.coverUrl, n.id AS novelId
       FROM chapter c
       JOIN novel n ON n.id = c.novelId
       WHERE (n.id = ? OR n.slug = ?) AND c.chapterNumber = ?
       LIMIT 1`,
      [idOrSlug, idOrSlug, num]
    );

    if (chapters.length === 0) return null;
    return chapters[0];
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, chapterId } = await params;
  const chapter = await getChapterMeta(id, chapterId);

  if (!chapter) {
    return {
      title: "Không tìm thấy chương",
      description: "Chương bạn tìm kiếm không tồn tại.",
    };
  }

  const chapterTitle = chapter.title
    ? `Chương ${chapter.chapterNumber}: ${chapter.title}`
    : `Chương ${chapter.chapterNumber}`;

  const title = `${chapterTitle} - ${chapter.novelTitle}`;
  const description = chapter.isLocked
    ? `${chapterTitle} của truyện ${chapter.novelTitle} (${chapter.author}) - Chương trả phí tại Truyện Hot.`
    : `Đọc ${chapterTitle} của truyện ${chapter.novelTitle} tác giả ${chapter.author} tại Truyện Hot.`;

  const slugOrId = chapter.novelSlug || id;
  const url = `${SITE_URL}/novel/${slugOrId}/${chapterId}`;
  const imageUrl = chapter.coverUrl || `${SITE_URL}/logo.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Truyện Hot",
      locale: "vi_VN",
      authors: [chapter.author],
      publishedTime: new Date(chapter.createdAt).toISOString(),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ReadingPage({ params }: Props) {
  const { id, chapterId } = await params;
  const chapter = await getChapterMeta(id, chapterId);

  const chapterTitle = chapter?.title
    ? `Chương ${chapter.chapterNumber}: ${chapter.title}`
    : `Chương ${chapter?.chapterNumber ?? chapterId}`;

  // JSON-LD Article
  const articleJsonLd = chapter
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${chapterTitle} - ${chapter.novelTitle}`,
        author: {
          "@type": "Person",
          name: chapter.author,
        },
        publisher: {
          "@type": "Organization",
          name: "Truyện Hot",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logo.png`,
          },
        },
        url: `${SITE_URL}/novel/${chapter.novelSlug || id}/${chapterId}`,
        image: chapter.coverUrl || `${SITE_URL}/logo.png`,
        datePublished: new Date(chapter.createdAt).toISOString(),
        inLanguage: "vi",
        isPartOf: {
          "@type": "Book",
          name: chapter.novelTitle,
          url: `${SITE_URL}/novel/${chapter.novelSlug || id}`,
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
        name: chapter?.novelTitle || "Truyện",
        item: `${SITE_URL}/novel/${chapter?.novelSlug || id}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: chapterTitle,
        item: `${SITE_URL}/novel/${chapter?.novelSlug || id}/${chapterId}`,
      },
    ],
  };

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ChapterReadingClient />
    </>
  );
}
