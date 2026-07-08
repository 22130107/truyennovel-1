"use client";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TABS = [
  { key: "reading",   label: "Đang đọc" },
  { key: "completed", label: "Hoàn thành" },
  { key: "bookmarked",label: "Đánh dấu" },
  { key: "purchased", label: "Đã mua" },
  { key: "saved",     label: "Đã lưu" },
  { key: "liked",     label: "Yêu thích" },
  { key: "all",       label: "Tất cả" },
];

interface LibraryBook {
  id: string;
  slug?: string;
  title: string;
  author: string;
  coverUrl: string;
  status: string;
  rating: number;
  chapterCount: number;
  lastChapter: number | null;
  libStatus: string;
  updatedAt: string;
}

function getStatusLabel(status: string) {
  if (status === "COMPLETED") return "Hoàn thành";
  if (status === "PAUSED") return "Tạm dừng";
  return "Đang ra";
}

function getLibStatusBadge(libStatus: string) {
  switch (libStatus) {
    case "READING":    return { label: "Đang đọc",   color: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
    case "COMPLETED":  return { label: "Hoàn thành", color: "bg-green-500/20 text-green-300 border-green-500/30" };
    case "SAVED":      return { label: "Đã lưu",     color: "bg-purple-500/20 text-purple-300 border-purple-500/30" };
    case "LIKED":      return { label: "Yêu thích",  color: "bg-red-500/20 text-red-300 border-red-500/30" };
    case "BOOKMARKED": return { label: "Đánh dấu",   color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" };
    case "PURCHASED":  return { label: "Đã mua",     color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
    default:           return { label: libStatus,    color: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30" };
  }
}

export default function LibraryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("reading");
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      if (!u?.id) { router.push("/login"); return; }
      setUserId(u.id);
    } catch {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/library?userId=${userId}&tab=${activeTab}`)
      .then((r) => r.json())
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [userId, activeTab]);

  const handleRemove = async (novelId: string) => {
    if (!userId) return;
    await fetch(`/api/library/progress?userId=${userId}&novelId=${novelId}`, { method: "DELETE" });
    setBooks((prev) => prev.filter((b) => b.id !== novelId));
  };

  const handleStatusChange = async (novelId: string, newStatus: string) => {
    if (!userId) return;
    await fetch("/api/library/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, novelId, status: newStatus }),
    });
    setBooks((prev) =>
      prev.map((b) => b.id === novelId ? { ...b, libStatus: newStatus } : b)
    );
  };

  return (
    <div className="min-h-screen bg-site text-black flex flex-col" style={{ fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif" }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20 flex-1 w-full">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Thư viện của tôi</h1>
          <p className="text-muted">Quản lý bộ sưu tập của bạn và theo dõi tiến trình đọc</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-6 mb-10 border-b border-pink/30 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-[14px] md:text-[15px] font-medium transition-all relative pb-4 ${
                activeTab === tab.key
                  ? "text-pink"
                  : "text-muted hover:text-black"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink shadow-[0_0_10px_rgba(233,30,145,0.5)]" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200/40 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-300" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-300 rounded w-3/4" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-muted text-lg font-medium mb-2">Chưa có truyện nào</p>
            <p className="text-muted text-sm mb-6">Hãy bắt đầu đọc để thêm truyện vào thư viện</p>
            <Link href="/browse" className="bg-pink text-white font-bold px-6 py-2.5 rounded-xl hover:bg-pink/80 transition-colors text-sm">
              Khám phá truyện
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => {
              const progress = book.lastChapter && book.chapterCount
                ? Math.min(Math.round((book.lastChapter / book.chapterCount) * 100), 100)
                : null;
              const badge = getLibStatusBadge(book.libStatus);
              const continueChapter = book.lastChapter || 1;

              return (
                <div key={book.id} className="group bg-white border-2 border-pink rounded-xl overflow-hidden hover:border-pink/70 transition-all hover:shadow-2xl">
                  {/* Cover */}
                  <Link href={`/novel/${book.slug || book.id}/${continueChapter}`}>
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={book.coverUrl || "/logo.png"}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-site/80 via-site/20 to-transparent" />

                      {/* Progress bar */}
                      {progress !== null && (
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                              Chương {book.lastChapter} / {book.chapterCount}
                            </span>
                            <span className="text-[10px] font-bold text-pink">{progress}%</span>
                          </div>
                            <div className="w-full h-1 bg-site/40 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-pink shadow-[0_0_8px_rgba(233,30,145,0.6)] transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Status badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <Link href={`/novel/${book.slug || book.id}`}>
                      <h3 className="font-bold text-[15px] mb-1 line-clamp-1 hover:text-pink transition-colors">{book.title}</h3>
                    </Link>
                    <p className="text-sm text-muted mb-3 truncate">Tác giả: {book.author}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-pink">
                            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                          </svg>
                          {book.rating.toFixed(1)}
                        </span>
                        <span className="text-black">•</span>
                        <span>{getStatusLabel(book.status)}</span>
                      </div>

                      {/* Actions */}
                      {(book.libStatus === "READING" || book.libStatus === "COMPLETED" || book.libStatus === "SAVED" || book.libStatus === "LIKED") && (
                        <div className="flex items-center gap-1">
                          {/* Quick status change */}
                          <select
                            value={book.libStatus}
                            onChange={(e) => handleStatusChange(book.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] bg-gray-200 border-2 border-pink text-black rounded-lg px-2 py-1 cursor-pointer hover:border-pink/70 transition-colors"
                          >
                            <option value="READING">Đang đọc</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="SAVED">Đã lưu</option>
                            <option value="LIKED">Yêu thích</option>
                          </select>
                          <button
                            onClick={() => handleRemove(book.id)}
                            title="Xóa khỏi thư viện"
                            className="p-1.5 text-black hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Continue reading button */}
                    {book.lastChapter && (
                      <Link href={`/novel/${book.slug || book.id}/${continueChapter}`}>
                        <button className="mt-3 w-full flex items-center justify-center gap-2 bg-pink/10 hover:bg-pink/20 border border-pink/20 hover:border-pink/40 text-pink text-[12px] font-semibold py-2 rounded-lg transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z" clipRule="evenodd" />
                          </svg>
                          Tiếp tục chương {continueChapter}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
