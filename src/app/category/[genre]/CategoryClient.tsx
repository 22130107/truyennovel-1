"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
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
  rating: number;
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

export default function CategoryClient() {
  const params  = useParams();
  const router  = useRouter();
  const genre   = decodeURIComponent(params?.genre as string);

  const [novels,  setNovels]  = useState<Novel[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort,    setSort]    = useState("default");
  const [status,  setStatus]  = useState("all");

  const fetchNovels = useCallback(async (s: string, st: string) => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ genre });
      if (s !== "default") p.set("sort", s);
      if (st !== "all")    p.set("status", st);
      const res  = await fetch(`/api/novels/search?${p.toString()}`);
      const data = await res.json();
      setNovels(data.novels || []);
      setTotal(data.total   || 0);
    } catch {
      setNovels([]);
    } finally {
      setLoading(false);
    }
  }, [genre]);

  useEffect(() => { fetchNovels(sort, status); }, [fetchNovels]);

  const statusLabel = (s: string) =>
    s === "COMPLETED" ? "Hoàn thành" : s === "PAUSED" ? "Tạm dừng" : "Đang ra";

  return (
    <div className="min-h-screen bg-site text-black flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20 flex-1 w-full">
        {/* Header */}
        <div className="flex items-baseline gap-4 mb-8">
          <h1 className="text-3xl font-bold">Thể loại: <span className="text-pink">{genre}</span></h1>
          {!loading && <span className="text-muted text-sm">{total} truyện</span>}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-1 bg-white border-3 border-pink rounded-lg p-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setStatus(opt.value); fetchNovels(sort, opt.value); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  status === opt.value ? "bg-pink text-white" : "text-muted hover:text-black"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Sắp xếp:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); fetchNovels(e.target.value, status); }}
              className="bg-white border-3 border-pink text-black text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-pink transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl aspect-video" />
            ))}
          </div>
        ) : novels.length === 0 ? (
          <div className="text-center py-24 text-black">
            <p className="text-lg">Chưa có truyện nào trong thể loại này</p>
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
                    <h3 className="font-bold text-lg mb-1 line-clamp-1 text-[#0a0a0a]">{novel.title}</h3>
                    <p className="text-[#0a0a0a]/60 text-sm mb-3">{novel.author}</p>
                    <div className="flex justify-between text-sm text-[#0a0a0a]/70 font-medium">
                      <span>Lượt xem: <span className="font-bold text-[#0a0a0a]">{novel.views.toLocaleString()}</span></span>
                      <span>Chương <span className="font-bold text-[#0a0a0a]">{novel.chapterCount}</span></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
