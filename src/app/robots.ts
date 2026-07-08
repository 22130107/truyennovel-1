import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/profile",
          "/library",
          "/topup",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: "https://truyenhot.online/sitemap.xml",
  };
}
