"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../home/Logo";

interface ReadingHeaderProps {
  novelId: string;
  chapterNumber: number;
  chapterTitle: string;
  prevChapter?: number | null;
  nextChapter?: number | null;
  onToggleSettings: () => void;
}

function getUserId(): string | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw).id : null;
  } catch { return null; }
}

export function ReadingHeader({ novelId, chapterNumber, chapterTitle, prevChapter, nextChapter, onToggleSettings }: ReadingHeaderProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [chapters, setChapters] = useState<{ number: number; title: string; isLocked: boolean; isPurchased: boolean }[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load trạng thái ban đầu
  useEffect(() => {
    if (!novelId) return;
    const userId = getUserId();
    if (!userId) return;

    // Check liked
    fetch(`/api/novels/${novelId}/like?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => setLiked(data.liked))
      .catch(() => {});

    // Check bookmarked
    fetch(`/api/novels/${novelId}/bookmark?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => setBookmarked(data.bookmarked))
      .catch(() => {});

    // Check rating
    fetch(`/api/novels/${novelId}/rating?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => setUserRating(data.score ?? null))
      .catch(() => {});
  }, [novelId]);

  const handleLike = async () => {
    const userId = getUserId();
    if (!userId) return;
    setLoadingLike(true);
    try {
      await fetch(`/api/novels/${novelId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setLiked(!liked);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleBookmark = async () => {
    const userId = getUserId();
    if (!userId) return;
    setLoadingBookmark(true);
    try {
      await fetch(`/api/novels/${novelId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setBookmarked(!bookmarked);
    } finally {
      setLoadingBookmark(false);
    }
  };

  const handleRate = async (score: number) => {
    const userId = getUserId();
    if (!userId) return;
    setLoadingRating(true);
    try {
      await fetch(`/api/novels/${novelId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, score }),
      });
      setUserRating(score);
      setShowRating(false);
    } finally {
      setLoadingRating(false);
    }
  };

  // Fetch chapters when opening dropdown
  useEffect(() => {
    if (!isOpen || chapters.length > 0) return;
    setLoadingChapters(true);
    const userId = getUserId();
    const url = `/api/novels/${novelId}${userId ? `?userId=${userId}` : ''}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.chapters) {
          setChapters(data.chapters.map((c: any) => ({
            number: c.number,
            title: c.title,
            isLocked: c.isLocked,
            isPurchased: c.isPurchased ?? false,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingChapters(false));
  }, [isOpen, novelId, chapters.length]);

  // Scroll to active chapter
  useEffect(() => {
    if (isOpen && listRef.current && chapters.length > 0) {
      const activeEl = listRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center' });
      }
    }
  }, [isOpen, chapters]);

  // Close when click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fixed left-0 top-0 right-0 bg-white/90 backdrop-blur-md border-b-[2px] border-pink z-[50] py-1">
      <div className="w-full px-4 lg:px-8">
        <div className="items-center flex justify-between">
          {/* Logo */}
          <div className="items-center flex shrink-0">
            <Link href="/" className="items-center flex transition-opacity">
              <Logo size="custom" customSize="w-20 h-10 md:w-28 md:h-14" />
            </Link>
          </div>

          {/* Chapter Navigation */}
          <div className="flex items-center mx-2" ref={dropdownRef}>
            {/* Nút lùi */}
            {prevChapter ? (
              <Link href={`/novel/${novelId}/${prevChapter}`} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-pink text-white rounded-full hover:bg-pink/80 shadow-md transition-all hover:scale-105 active:scale-95 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </Link>
            ) : (
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gray-100 text-gray-300 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </div>
            )}

            {/* Chapter dropdown */}
            <div className="relative mx-2">
              <div 
                onClick={() => setIsOpen((v) => !v)}
                className="flex items-center justify-center text-black text-[12px] md:text-[15px] font-medium bg-white px-3 md:px-5 py-1.5 md:py-2 rounded-full border-2 border-pink overflow-hidden cursor-pointer hover:bg-pink/5 transition-colors shadow-sm"
              >
                <span className="text-pink shrink-0 font-bold">Chương {chapterNumber}</span>
                <span className="hidden md:inline mx-3 text-gray-300">|</span>
                <span className="hidden md:inline text-black truncate max-w-[120px] lg:max-w-[250px]">{chapterTitle}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ml-2 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>

              {isOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white border-2 border-pink rounded-xl shadow-2xl z-[60] overflow-hidden">
                  {loadingChapters ? (
                    <div className="py-6 text-center text-sm text-black">Đang tải...</div>
                  ) : chapters.length === 0 ? (
                    <div className="py-6 text-center text-sm text-black">Không có chương</div>
                  ) : (
                    <div ref={listRef} className="overflow-y-auto max-h-64 custom-scrollbar">
                      {chapters.map((ch) => {
                        const isActive = ch.number === chapterNumber;
                        return (
                          <button
                            key={ch.number}
                            data-active={isActive}
                            onClick={() => {
                              setIsOpen(false);
                              router.push(`/novel/${novelId}/${ch.number}`);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-[13px] transition-colors
                              ${isActive
                                ? 'bg-pink/10 text-pink font-semibold'
                                : 'text-black hover:bg-black/5'
                              }`}
                          >
                            <span className="truncate">
                              Chương {ch.number}{ch.title ? `: ${ch.title}` : ''}
                            </span>
                            {ch.isLocked && !ch.isPurchased && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-yellow-400 shrink-0 ml-2">
                                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                              </svg>
                            )}
                            {ch.isLocked && ch.isPurchased && (
                              <span className="text-[10px] font-semibold text-green-400 border border-green-400/40 rounded px-1 py-0.5 shrink-0 ml-2">
                                Đã mở
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nút tiến */}
            {nextChapter ? (
              <Link href={`/novel/${novelId}/${nextChapter}`} className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-pink text-white rounded-full hover:bg-pink/80 shadow-md transition-all hover:scale-105 active:scale-95 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ) : (
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gray-100 text-gray-300 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="items-center flex gap-1 md:gap-2">
            {/* Settings */}
            <button
              onClick={onToggleSettings}
              title="Cài đặt giao diện"
              className="p-1.5 md:p-2 text-black hover:text-pink transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6">
                <path d="M21 14h-5" />
                <path d="M16 16v-3.5a2.5 2.5 0 0 1 5 0V16" />
                <path d="M4.5 13h6" />
                <path d="M3 16l4.5-9 4.5 9" />
              </svg>
            </button>

            {/* Yêu thích */}
            <button
              onClick={handleLike}
              disabled={loadingLike}
              title={liked ? "Bỏ yêu thích" : "Yêu thích"}
              className={`hidden sm:block p-1.5 md:p-2 transition-all disabled:opacity-50 ${liked ? "text-red-500" : "text-black hover:text-red-500"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6" fill={liked ? "currentColor" : "none"}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>

            {/* Đánh giá — star popup */}
            <div className="relative">
              <button
                onClick={() => setShowRating((v) => !v)}
                title="Đánh giá truyện"
                className={`p-1.5 md:p-2 transition-all ${userRating ? "text-pink" : "text-black hover:text-pink"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6" fill={userRating ? "currentColor" : "none"}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>

              {showRating && (
                <div className="absolute top-full right-0 mt-2 bg-white border-2 border-pink rounded-xl shadow-2xl p-3 z-50">
                  <p className="text-xs text-black mb-2 text-center whitespace-nowrap">
                    {userRating ? `Đánh giá của bạn: ${userRating}★` : "Chọn số sao"}
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(star)}
                        disabled={loadingRating}
                        className={`p-1 transition-all disabled:opacity-50 ${
                          userRating && star <= userRating ? "text-pink" : "text-black hover:text-pink"
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Đánh dấu (bookmark) */}
            <button
              onClick={handleBookmark}
              disabled={loadingBookmark}
              title={bookmarked ? "Bỏ lưu" : "Lưu truyện"}
              className={`p-1.5 md:p-2 transition-all disabled:opacity-50 ${bookmarked ? "text-blue-400" : "text-black hover:text-blue-400"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6" fill={bookmarked ? "currentColor" : "none"}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
