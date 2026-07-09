import { Metadata } from "next";

const SITE_URL = "https://truyenhot.online";

export const metadata: Metadata = {
  title: "Hướng Dẫn - Truyện Hot",
  description: "Hướng dẫn sử dụng website Truyện Hot.",
  alternates: {
    canonical: `${SITE_URL}/guide`,
  },
  openGraph: {
    title: "Hướng Dẫn - Truyện Hot",
    description: "Hướng dẫn sử dụng website Truyện Hot.",
    url: `${SITE_URL}/guide`,
    type: "website",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
