"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MousePointer2 } from "lucide-react";
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
                <div className="py-8 w-full max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-sm">
                  {affiliateLinks.length > 0 ? (
                    <div className="flex flex-col items-center">
                      {affiliateLinks.map((link) => (
                        <div key={link.id} className="w-full flex flex-col items-center">
                          <div className="px-4 text-center max-w-3xl mx-auto mb-4 md:mb-6">
                            <p className="text-[16px] md:text-[22px] leading-relaxed text-black">
                              Mời Quý độc giả <strong>CLICK</strong> vào <strong>liên kết hoặc ảnh</strong> bên dưới<br />
                              <strong>mở ứng dụng {link.title || 'Shopee'}</strong> để tiếp tục đọc toàn bộ chương truyện!
                            </p>
                          </div>
                          

                          <div 
                            onClick={() => handleAffiliateClick(link)}
                            className="w-full bg-[#c9913c] p-4 md:p-12 cursor-pointer relative flex justify-center group"
                          >
                            <div className="relative max-w-xl md:max-w-2xl w-full transition-transform duration-300 group-hover:scale-[1.02]">
                              <img src="/click.png" alt="Ấn vào đây để đọc toàn bộ chương truyện" className="w-full h-auto rounded-lg shadow-xl" />

                              {/* Cute Hand Cursor Icon */}
                              <div className="absolute bottom-2 right-4 md:bottom-6 md:right-8 animate-bounce z-10 flex items-center drop-shadow-[0_8px_16px_rgba(255,105,180,0.4)] text-[#ff69b4]">
                                {/* Click Ripple Effect at the tip */}
                                <div className="absolute top-0 left-0 md:top-2 md:left-2 z-[-1] flex items-center justify-center">
                                  <span className="absolute w-8 h-8 md:w-12 md:h-12 border-4 border-pink-400 rounded-full animate-ping opacity-60"></span>
                                </div>
                                
                                <MousePointer2 fill="#ffebf0" className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rotate-[5deg] relative z-10" strokeWidth={1.5} />
                              </div>
                            </div>
                          </div>
                          
                          <div className="px-4 text-center max-w-3xl mx-auto mt-6 md:mt-10">
                            <p className="text-[16px] md:text-[22px] text-black">
                              Cây Tre Đam Mỹ và đội ngũ Editor xin chân thành cảm ơn!
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
