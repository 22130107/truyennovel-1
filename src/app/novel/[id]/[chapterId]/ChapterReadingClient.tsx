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
        body: JSON.stringify({ userId, chapterId: chapter?.id }),
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
                <div className="text-center py-12">
                  <div className="inline-flex flex-col items-center gap-4 max-w-lg mx-auto">
                    <div className="w-14 h-14 rounded-full bg-pink/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-pink">
                        <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Chương {chapter.chapterNumber} — Cần mở khóa</h2>
                      {chapter.title && <p className="text-black text-sm">{chapter.title}</p>}
                      <p className="text-muted text-sm mt-2">
                        Click vào một link bên dưới để mở khóa chương này (miễn phí)
                      </p>
                    </div>

                    {/* Danh sách link affiliate */}
                    {affiliateLinks.length > 0 ? (
                      <div className="w-full space-y-3 mt-2">
                        {affiliateLinks.map((link) => (
                          <button
                            key={link.id}
                            onClick={() => handleAffiliateClick(link)}
                            disabled={unlocking}
                            className="w-full flex items-center gap-3 bg-white border-2 border-pink/30 hover:border-pink rounded-xl px-5 py-4 text-left transition-all hover:shadow-lg disabled:opacity-50"
                          >
                            <div className="w-10 h-10 rounded-full bg-pink/10 flex items-center justify-center shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pink">
                                <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-black">{link.title}</div>
                              {link.description && <div className="text-xs text-muted truncate">{link.description}</div>}
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-pink shrink-0">
                              <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                              <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted italic">Hiện chưa có link affiliate nào để mở khóa.</p>
                    )}

                    {unlockError && <p className="text-red-400 text-xs">{unlockError}</p>}
                  </div>
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
