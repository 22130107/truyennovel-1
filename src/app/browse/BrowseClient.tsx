"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import Link from "next/link";

interface Novel {
  id: string;
  slug?: string;
  title: string;
  author: string;
  coverUrl: string;
  views: number;
  chapterCount: number;
  status: string;
}

const SORT_OPTIONS = [
  { value: "default",  label: "Mặc định" },
  { value: "views",    label: "Xem nhiều nhất" },
  { value: "newest",   label: "Mới nhất" },
  { value: "chapters", label: "Nhiều chương nhất" },
];

const STATUS_OPTIONS = [
  { value: "all",       label: "Tất cả" },
  { value: "ONGOING",   label: "Đang ra" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "PAUSED",    label: "Tạm dừng" },
];

function statusLabel(s: string) {
  if (s === "COMPLETED") return "Hoàn thành";
  if (s === "PAUSED")    return "Tạm dừng";
  return "Đang ra";
}

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query,   setQuery]   = useState(searchParams.get("q")      ?? "");
  const [sort,    setSort]    = useState(searchParams.get("sort")   ?? "default");
  const [status,  setStatus]  = useState(searchParams.get("status") ?? "all");
  const [novels,  setNovels]  = useState<Novel[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNovels = useCallback(async (q: string, s: string, st: string) => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (q)               p.set("q", q);
      if (s !== "default") p.set("sort", s);
      if (st !== "all")    p.set("status", st);
      const res  = await fetch(`/api/novels/search?${p.toString()}`);
      const data = await res.json();
      setNovels(Array.isArray(data.novels) ? data.novels : []);
      setTotal(data.total ?? 0);
    } catch {
      setNovels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q  = searchParams.get("q")      ?? "";
    const s  = searchParams.get("sort")   ?? "default";
    const st = searchParams.get("status") ?? "all";
    setQuery(q); setSort(s); setStatus(st);
    fetchNovels(q, s, st);
  }, [searchParams, fetchNovels]);

  function applyFilters(newQ = query, newSort = sort, newStatus = status) {
    const p = new URLSearchParams();
    if (newQ)                  p.set("q", newQ);
    if (newSort !== "default") p.set("sort", newSort);
    if (newStatus !== "all")   p.set("status", newStatus);
    router.push(`/browse?${p.toString()}`);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
      <div className="flex items-baseline gap-4 mb-8">
        <h1 className="text-3xl font-bold">
          {query ? `Kết quả cho "${query}"` : "Tìm kiếm truyện"}
        </h1>
        {!loading && <span className="text-black text-sm">{total} kết quả</span>}
      </div>

      <div className="space-y-4 mb-10">
        <form
          onSubmit={(e) => { e.preventDefault(); applyFilters(); }}
          className="relative group"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên truyện, tác giả, ..."
            className="w-full bg-white border-2 border-pink p-4 pl-12 pr-28 rounded-xl focus:outline-none focus:border-pink transition-all text-black"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-[rgb(208,203,203)] hover:bg-white text-neutral-900 font-bold text-sm px-4 py-2 rounded-lg transition-colors">
            Tìm
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-white border-2 border-pink rounded-lg p-1">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setStatus(opt.value); applyFilters(query, sort, opt.value); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    status === opt.value ? "bg-pink text-white" : "text-muted hover:text-black"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {(query || sort !== "default" || status !== "all") && (
              <button
                onClick={() => { setQuery(""); setSort("default"); setStatus("all"); router.push("/browse"); }}
                className="text-black hover:text-red-400 text-sm transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-black">Sắp xếp:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); applyFilters(query, e.target.value, status); }}
              className="bg-white border-2 border-pink text-black text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-pink transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl aspect-video" />
          ))}
        </div>
      ) : novels.length === 0 ? (
        <div className="text-center py-24 text-muted">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 opacity-30">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="text-lg">Không tìm thấy truyện nào</p>
          {query && <p className="text-sm mt-1">Thử tìm với từ khóa khác</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {novels.map((novel) => (
            <Link key={novel.id} href={`/novel/${novel.slug || novel.id}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden hover:scale-[1.02] transition-all shadow-lg">
                <div className="relative aspect-video">
                  <img
                    src={novel.coverUrl || "/logo.png"}
                    alt={`Ảnh bìa truyện ${novel.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-site/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[rgb(122,213,195)] border border-white/10 uppercase tracking-wider">
                    {statusLabel(novel.status)}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1 text-black">{novel.title}</h3>
                  <p className="text-black/60 text-sm mb-3">{novel.author}</p>
                  <div className="flex justify-between text-sm text-black/70 font-medium">
                    <span>Lượt xem: <span className="font-bold text-black">{novel.views.toLocaleString()}</span></span>
                    <span>Chương <span className="font-bold text-black">{novel.chapterCount}</span></span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default function BrowseClient() {
  return (
    <div className="min-h-screen bg-site text-black flex flex-col">
      <Header />
      <div className="flex-1">
        <Suspense
          fallback={
            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-xl aspect-video" />
                ))}
              </div>
            </main>
          }
        >
          <BrowseContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
