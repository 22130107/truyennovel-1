"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "../home/Logo";

interface ReadingHeaderProps {
  novelId: string;
  chapterNumber: number;
  chapterTitle: string;
  onToggleSettings: () => void;
}

function getUserId(): string | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw).id : null;
  } catch { return null; }
}

export function ReadingHeader({ novelId, chapterNumber, chapterTitle, onToggleSettings }: ReadingHeaderProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);

  // Load trạng thái ban đầu
  useEffect(() => {
    if (!novelId) return;
    const userId = getUserId();
    if (!userId) return;

    // Check liked (reading_progress status = LIKED)
    fetch(`/api/library?userId=${userId}&tab=liked`)
      .then((r) => r.json())
      .then((data: { id: string }[]) => {
        if (Array.isArray(data)) setLiked(data.some((b) => b.id === novelId));
      })
      .catch(() => {});

    // Check saved (reading_progress status = SAVED)
    fetch(`/api/library?userId=${userId}&tab=saved`)
      .then((r) => r.json())
      .then((data: { id: string }[]) => {
        if (Array.isArray(data)) setBookmarked(data.some((b) => b.id === novelId));
      })
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
      if (liked) {
        // Xóa liked — đổi về READING
        await fetch("/api/library/progress", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, novelId, status: "READING" }),
        });
        setLiked(false);
      } else {
        // Upsert với status LIKED
        await fetch("/api/library/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, novelId, lastChapter: chapterNumber, status: "LIKED" }),
        });
        setLiked(true);
      }
    } finally {
      setLoadingLike(false);
    }
  };

  const handleBookmark = async () => {
    const userId = getUserId();
    if (!userId) return;
    setLoadingBookmark(true);
    try {
      if (bookmarked) {
        // Bỏ lưu — đổi về READING
        await fetch("/api/library/progress", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, novelId, status: "READING" }),
        });
        setBookmarked(false);
      } else {
        // Upsert với status SAVED
        await fetch("/api/library/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, novelId, lastChapter: chapterNumber, status: "SAVED" }),
        });
        setBookmarked(true);
      }
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

  return (
    <header className="fixed left-0 top-0 right-0 bg-white/90 backdrop-blur-md border-b-[3px] border-pink z-[50] py-1">
      <div className="w-full px-4 lg:px-8">
        <div className="items-center flex justify-between">
          {/* Logo */}
          <div className="items-center flex shrink-0">
            <Link href="/" className="items-center flex transition-opacity">
              <Logo size="custom" customSize="w-20 h-10 md:w-28 md:h-14" />
            </Link>
          </div>

          {/* Chapter info */}
          <div className="flex items-center text-black text-[12px] md:text-[15px] font-medium bg-black/5 px-3 md:px-4 py-1.5 rounded-full border-3 border-pink mx-2 overflow-hidden">
            <span className="text-pink shrink-0">Chương {chapterNumber}</span>
            <span className="hidden md:inline mx-3 text-black">|</span>
            <span className="hidden md:inline text-black truncate max-w-[200px] lg:max-w-[300px]">{chapterTitle}</span>
          </div>

          {/* Actions */}
          <div className="items-center flex gap-1 md:gap-2">
            {/* Settings */}
            <button
              onClick={onToggleSettings}
              title="Cài đặt giao diện"
              className="p-1.5 md:p-2 text-black hover:text-pink transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21L15.75 9.75M4.5 19.5L10.5 6L14.25 15M18.75 18L15 9.75L11.25 18M21 19.5H3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15h7.5" />
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
                <div className="absolute top-full right-0 mt-2 bg-white border-3 border-pink rounded-xl shadow-2xl p-3 z-50">
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
