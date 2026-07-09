"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface HeroNovel {
  id: string;
  slug?: string;
  title: string;
  description: string;
  posterUrl: string | null;
  coverUrl: string | null;
  author: string;
  views: number;
  status: string;
  chapterCount: number;
}

export function HeroSection() {
  const [novels, setNovels] = useState<HeroNovel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/novels/top-viewed")
      .then((r) => r.json())
      .then((data: HeroNovel[]) => {
        if (data.length > 0) setNovels(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (novels.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % novels.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [novels.length]);

  if (novels.length === 0) {
    return (
      <section className="w-full h-[550px] md:h-[700px] bg-neutral-900 animate-pulse" />
    );
  }

  const current = novels[currentIndex];
  // Ưu tiên posterUrl, fallback về coverUrl
  const bgImage = current.posterUrl || current.coverUrl || "";

  return (
    <section className="items-center justify-center">
      <div className="ml-auto mr-auto">
        <section className="overflow-hidden relative w-full h-[550px] md:h-[700px]">

          {/* Background Images */}
          {novels.map((novel, index) => {
            const img = novel.posterUrl || novel.coverUrl || "";
            return (
              <div
                key={novel.id}
                className={`absolute w-full h-full left-0 top-0 transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                {img && (
                  <img
                    src={img}
                    className="block size-full max-w-full object-cover absolute inset-0"
                    alt={novel.title}
                  />
                )}
              </div>
            );
          })}

          {/* Gradients */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <div
              className="pointer-events-none absolute w-full md:w-[60%] left-0 top-0 bottom-0"
              style={{ backgroundImage: "linear-gradient(to right, rgba(244,232,218,0.2) 20%, rgba(244,232,218,0.1) 60%, rgba(244,232,218,0))" }}
            />
            <div
              className="hidden md:block pointer-events-none absolute w-[30%] top-0 right-0 bottom-0"
              style={{ backgroundImage: "linear-gradient(to left, rgba(244,232,218,0.15), rgba(244,232,218,0))" }}
            />
            <div
              className="pointer-events-none absolute h-[60%] md:h-[40%] left-0 right-0 bottom-0"
              style={{ backgroundImage: "linear-gradient(to top, rgba(244,232,218,0.3), rgba(244,232,218,0.1) 60%, rgba(244,232,218,0))" }}
            />
          </div>

          {/* Content */}
          <div className="items-end flex h-full justify-start relative pt-20 px-4 md:px-16 pb-12 md:pb-8 z-30">
            <div className="text-left text-black max-w-sm transition-all duration-500">

              {/* Status badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm ${
                  current.status === "COMPLETED"
                    ? "bg-green-500 text-white border border-green-600"
                    : "bg-yellow-500 text-white border border-yellow-600"
                }`}>
                  {current.status === "COMPLETED" ? "Đã hoàn" : "Đang ra"}
                </span>
                <span className="text-xs text-black">{current.chapterCount} chương</span>
              </div>

              {/* Title */}
              <h1 
                className="font-bold text-[24px] md:text-[38px] leading-tight mb-3 line-clamp-2"
                style={{ textShadow: "0 0 10px var(--color-site), 0 0 20px var(--color-site), 0 0 30px var(--color-site), 0 0 40px var(--color-site)" }}
              >
                {current.title}
              </h1>

              {/* Author */}
              <p 
                className="text-sm text-black mb-3"
                style={{ textShadow: "0 0 8px var(--color-site), 0 0 16px var(--color-site)" }}
              >
                Tác giả: <span className="text-black font-medium">{current.author}</span>
              </p>

              {/* Description — 2 dòng rồi ... */}
              <p 
                className="text-black text-sm leading-relaxed mb-5 hidden md:block overflow-hidden" 
                style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: "0 0 8px var(--color-site), 0 0 16px var(--color-site)"}}
              >
                {current.description}
              </p>

              {/* CTA */}
              <Link
                href={`/novel/${current.slug || current.id}`}
                className="inline-block font-semibold border-pink border-[2px] py-2 px-6 rounded-full hover:bg-pink hover:text-white transition-colors text-sm md:text-base"
              >
                ĐỌC NGAY
              </Link>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="hidden sm:flex justify-end absolute w-full bottom-4 px-16 z-40 pointer-events-none">
            <div className="flex overflow-auto gap-2 no-scrollbar py-2 px-2 pointer-events-auto">
              {novels.map((novel, index) => {
                const thumb = novel.posterUrl || novel.coverUrl || "";
                return (
                  <img
                    key={novel.id}
                    src={thumb}
                    onClick={() => setCurrentIndex(index)}
                    className={`cursor-pointer block object-cover w-16 h-10 md:w-20 md:h-12 rounded-lg transition-all duration-300 ${
                      index === currentIndex
                        ? "ring-2 ring-pink scale-110 z-10"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    alt={novel.title}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="pointer-events-none absolute h-[150px] md:h-[200px] left-0 right-0 bottom-0 z-20"
            style={{ backgroundImage: "linear-gradient(0deg, var(--color-site), rgba(244,232,218,0.7) 40%, rgba(244,232,218,0))" }}
          />
        </section>
      </div>
    </section>
  );
}
