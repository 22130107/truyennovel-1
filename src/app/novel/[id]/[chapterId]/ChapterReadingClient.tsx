"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ReadingHeader } from "@/components/reading/ReadingHeader";
import { SettingsPopup, ReadingSettings } from "@/components/reading/SettingsPopup";
import { ChapterContent } from "@/components/reading/ChapterContent";
import { ChapterSelector } from "@/components/reading/ChapterSelector";
import { CommentSection } from "@/components/reading/CommentSection";

interface ChapterData {
  id: string;
  novelId: string;
  novelTitle: string;
  chapterNumber: number;
  title: string;
  isLocked: boolean;
  isPurchased: boolean;
  price: number;
  content: string | null;
  prevChapter: number | null;
  nextChapter: number | null;
}

interface AffiliateLink {
  id: string;
  url: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
}

export default function ChapterReadingClient() {
  const params = useParams();
  const novelId = params?.id as string;
  const chapterNum = params?.chapterId as string;
  const fallbackChapterNumber = Number.isNaN(Number(chapterNum)) ? 0 : parseInt(chapterNum, 10);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<ReadingSettings>({ fontSize: 20, fontFamily: "Google Sans" });
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  const getUserId = () => {
    try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw).id : null; } catch { return null; }
  };

  const fetchChapter = () => {
    const userId = getUserId();
    const url = `/api/novels/${novelId}/chapters/${chapterNum}${userId ? `?userId=${userId}` : ""}`;
    setLoading(true);
    setError("");
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setChapter(data);
      })
      .catch(() => setError("Không thể tải chương"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (novelId && chapterNum) fetchChapter();
  }, [novelId, chapterNum]);

  // Fetch affiliate links khi chapter bị khóa
  useEffect(() => {
    if (!chapter?.isLocked || chapter.isPurchased) return;
    fetch("/api/affiliate-links")
      .then((r) => r.json())
      .then((data) => setAffiliateLinks(data))
      .catch(() => {});
  }, [chapter]);

  useEffect(() => {
    if (!chapter || (chapter.isLocked && !chapter.isPurchased)) return;
    const userId = getUserId();
    if (!userId) return;
    fetch("/api/library/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, novelId, lastChapter: chapter.chapterNumber, status: "READING" }),
    }).catch(() => {});
  }, [chapter]);

  const handleAffiliateClick = async (link: AffiliateLink) => {
    const userId = getUserId();
    if (!userId) { setUnlockError("Bạn cần đăng nhập để mở khóa."); return; }
    setUnlocking(true);
    setUnlockError("");

    // Mở link affiliate trong tab mới
    window.open(link.url, "_blank", "noopener,noreferrer");

    try {
      const res = await fetch(`/api/affiliate-links/${link.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, novelId: chapter?.novelId }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchChapter();
      } else {
        setUnlockError(data.error || "Mở khóa thất bại");
      }
    } catch {
      setUnlockError("Lỗi kết nối");
    } finally {
      setUnlocking(false);
    }
  };

  const contentParagraphs = chapter?.content
    ? chapter.content.split("\n").filter((p) => p.trim() !== "")
    : [];

  return (
    <div className="text-black text-[16px] leading-[24px] min-h-screen bg-site overflow-x-hidden"
      style={{ fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif" }}>
      <div className="flex flex-col items-center w-full">
        <div className="w-full lg:w-[1920px] relative">

          <ReadingHeader
            novelId={novelId}
            chapterNumber={chapter?.chapterNumber ?? parseInt(chapterNum)}
            chapterTitle={chapter?.title ?? ""}
            onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
          />
          <SettingsPopup isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onChange={setSettings} />

          <main className="mt-20 px-4 md:px-10 lg:px-0">
            <div className="ml-auto mr-auto w-full lg:max-w-6xl pt-8 pb-8">

              {loading && (
                <div className="space-y-3 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto" />
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                  ))}
                </div>
              )}

              {!loading && error && <div className="text-center py-20 text-red-400">{error}</div>}

              {/* Paywall — hiện link affiliate để mở khóa */}
              {!loading && chapter && chapter.isLocked && !chapter.isPurchased && (
                <div className="py-8 w-full bg-white rounded-xl overflow-hidden shadow-sm">
                  {affiliateLinks.length > 0 ? (
                    <div className="flex flex-col items-center">
                      {affiliateLinks.map((link) => (
                        <div key={link.id} className="w-full flex flex-col items-center">
                          <div className="px-4 text-center max-w-3xl mx-auto mb-6">
                            <p className="text-[18px] md:text-[22px] leading-relaxed text-black">
                              Mời Quý độc giả <strong>CLICK</strong> vào <strong>liên kết hoặc ảnh</strong> bên dưới<br />
                              <strong>mở ứng dụng {link.title || 'Shopee'}</strong> để tiếp tục đọc toàn bộ chương truyện!
                            </p>
                          </div>
                          


                          <div 
                            onClick={() => handleAffiliateClick(link)}
                            className="w-full bg-[#c9913c] p-6 md:p-12 cursor-pointer relative flex justify-center group"
                          >
                            <div className="bg-[#f2f6fa] border-4 border-gray-500 rounded-lg p-8 md:p-14 shadow-xl flex flex-col items-center justify-center max-w-3xl w-full relative transition-transform duration-300 group-hover:scale-[1.02]">
                              <h3 className="text-[#4b5563] text-xl md:text-2xl font-bold uppercase tracking-[0.2em] mb-4 text-center">
                                ẤN VÀO ĐÂY
                              </h3>
                              <h2 className="text-[#1e3a5f] text-2xl md:text-4xl font-extrabold uppercase text-center leading-tight mb-8">
                                ĐỂ ĐỌC TOÀN BỘ<br className="hidden md:block"/> CHƯƠNG TRUYỆN
                              </h2>
                              <p className="text-[#6b7280] text-sm md:text-base uppercase tracking-wider text-center max-w-md">
                                HÀNH ĐỘNG NÀY CHỈ THỰC HIỆN MỘT LẦN<br className="hidden md:block" /> MONG QUÝ ĐỘC GIẢ ỦNG HỘ
                              </p>

                              {/* Hand Cursor Icon */}
                              <div className="absolute -bottom-10 -right-4 md:bottom-2 md:right-10 animate-bounce drop-shadow-2xl z-10 scale-[1.5]">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="white" stroke="#333" strokeWidth="1" className="rotate-[-15deg]">
                                  <path d="M10.5 3.5c.828 0 1.5.895 1.5 2v4h1a1.5 1.5 0 0 1 1.5 1.5v.5h1a1.5 1.5 0 0 1 1.5 1.5v.5h.5a2 2 0 0 1 2 2v3.704c0 1.341-.56 2.62-1.545 3.535L15.42 24 10 20v-3.5c0-.828-.672-1.5-1.5-1.5s-1.5-.672-1.5-1.5V5.5c0-1.105.672-2 1.5-2z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <div className="px-4 text-center max-w-3xl mx-auto mt-10">
                            <p className="text-[18px] md:text-[22px] text-black">
                              Tịnh Ngôn Cốc và đội ngũ Editor xin chân thành cảm ơn!
                            </p>
                            {unlockError && <p className="text-red-500 font-bold mt-4">{unlockError}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-lg text-muted italic mb-4">Hiện chưa có link affiliate nào để mở khóa.</p>
                      {unlockError && <p className="text-red-500 font-bold">{unlockError}</p>}
                    </div>
                  )}
                </div>
              )}

              {!loading && chapter && (!chapter.isLocked || chapter.isPurchased) && (
                <ChapterContent
                  chapterNumber={chapter.chapterNumber}
                  chapterTitle={chapter.title}
                  content={contentParagraphs}
                  fontSize={settings.fontSize}
                  fontFamily={settings.fontFamily}
                />
              )}
            </div>

            {!loading && chapter && (
              <div className="ml-auto mr-auto w-full lg:max-w-6xl pt-8 pb-8">
                <div className="border-2 bg-white border-pink shadow-2xl p-6 rounded-xl">
                  <ChapterSelector currentChapter={chapter.chapterNumber} nextChapter={chapter.nextChapter} />
                </div>
              </div>
            )}

            {novelId && (chapter?.chapterNumber ?? fallbackChapterNumber) > 0 && (
              <CommentSection novelId={novelId} chapterNumber={chapter?.chapterNumber ?? fallbackChapterNumber} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
