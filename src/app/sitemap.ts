import { MetadataRoute } from "next";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

const SITE_URL = "https://truyenhot.online";

export const revalidate = 3600; // Tái tạo mỗi 1 giờ

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Các trang tĩnh
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    // Lấy tất cả novels
    const [novels] = await pool.query<RowDataPacket[]>(
      `SELECT id, slug, updatedAt FROM novel ORDER BY updatedAt DESC LIMIT 5000`
    );

    const novelPages: MetadataRoute.Sitemap = novels.map((novel) => ({
      url: `${SITE_URL}/novel/${novel.slug || novel.id}`,
      lastModified: new Date(novel.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Lấy tất cả chapters (giới hạn để tránh sitemap quá lớn)
    const [chapters] = await pool.query<RowDataPacket[]>(
      `SELECT c.novelId, c.chapterNumber, c.createdAt, n.slug AS novelSlug
       FROM chapter c
       JOIN novel n ON n.id = c.novelId
       ORDER BY c.createdAt DESC
       LIMIT 10000`
    );

    const chapterPages: MetadataRoute.Sitemap = chapters.map((chapter) => ({
      url: `${SITE_URL}/novel/${chapter.novelSlug || chapter.novelId}/${chapter.chapterNumber}`,
      lastModified: new Date(chapter.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    // Lấy tất cả genres
    const [genres] = await pool.query<RowDataPacket[]>(
      `SELECT DISTINCT name FROM genre ORDER BY name`
    );

    const genrePages: MetadataRoute.Sitemap = genres.map((genre) => ({
      url: `${SITE_URL}/category/${encodeURIComponent(genre.name)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...genrePages, ...novelPages, ...chapterPages];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticPages;
  }
}
