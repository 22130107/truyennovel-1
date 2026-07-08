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

interface BulkInfo {
  totalRetail: number;
  totalPrice: number;
  unpurchasedCount: number;
  discount: number;
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

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const [bulkInfo, setBulkInfo] = useState<BulkInfo | null>(null);

  const getUserId = () => {
    try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw).id : null; } catch { return null; }
  };
  const getUserCoins = () => {
    try { const raw = localStorage.getItem("user"); return raw ? (JSON.parse(raw).coins ?? 0) : 0; } catch { return 0; }
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

  // Chặn F12, Ctrl+Shift+I/J/C, Ctrl+U (DevTools & View Source)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return;
      }
      // Ctrl+U (view source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Fetch bulk info khi chương bị khóa
  useEffect(() => {
    if (!chapter?.isLocked || chapter.isPurchased) return;
    const userId = getUserId();
    fetch(`/api/novels/${novelId}/purchase-all${userId ? `?userId=${userId}` : ""}`)
      .then((r) => r.json())
      .then((data) => setBulkInfo(data))
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

  const updateCoins = (newCoins: number) => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        u.coins = newCoins;
        localStorage.setItem("user", JSON.stringify(u));
      }
    } catch {}
  };

  const handlePurchaseSingle = async () => {
    const userId = getUserId();
    if (!userId) { setPurchaseError("Bạn cần đăng nhập để mua chương."); return; }
    setPurchasing(true);
    setPurchaseError("");
    try {
      const res = await fetch(`/api/novels/${novelId}/chapters/${chapterNum}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        updateCoins(data.coinsRemaining);
        setShowModal(false);
        fetchChapter();
      } else if (res.status === 402) {
        setPurchaseError(`Không đủ xu. Cần ${data.required} xu, bạn có ${data.current} xu.`);
      } else {
        setPurchaseError(data.error || "Mua thất bại");
      }
    } catch { setPurchaseError("Lỗi kết nối"); }
    finally { setPurchasing(false); }
  };

  const handlePurchaseAll = async () => {
    const userId = getUserId();
    if (!userId) { setPurchaseError("Bạn cần đăng nhập để mua."); return; }
    setPurchasing(true);
    setPurchaseError("");
    try {
      const res = await fetch(`/api/novels/${novelId}/purchase-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        updateCoins(data.coinsRemaining);
        setShowModal(false);
        fetchChapter();
      } else if (res.status === 402) {
        setPurchaseError(`Không đủ xu. Cần ${data.required} xu, bạn có ${data.current} xu.`);
      } else {
        setPurchaseError(data.error || "Mua thất bại");
      }
    } catch { setPurchaseError("Lỗi kết nối"); }
    finally { setPurchasing(false); }
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

              {/* Paywall — hiện nút mở modal */}
              {!loading && chapter && chapter.isLocked && !chapter.isPurchased && (
                <div className="text-center py-20">
                  <div className="inline-flex flex-col items-center gap-4 max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-yellow-400">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-1">Chương {chapter.chapterNumber} — Trả phí</h2>
                      {chapter.title && <p className="text-black text-sm">{chapter.title}</p>}
                    </div>
                    <button
                      onClick={() => { setPurchaseError(""); setShowModal(true); }}
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-xl transition-colors"
                    >
                      Mở khóa {chapter.price} xu
                    </button>
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
                <div className="border-3 bg-white border-pink shadow-2xl p-6 rounded-xl">
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

      {/* Purchase Modal */}
      {showModal && chapter && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-site/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          {/* Modal */}
          <div className="relative bg-white border-3 border-pink rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-black mb-1">
              Mua chương {chapter.chapterNumber}
            </h2>
            <p className="text-muted text-sm mb-4">
              Bạn sẽ dùng <span className="text-black font-bold">{chapter.price}</span> 🪙 xu để mở chương này.
            </p>

            {/* Bulk offer */}
            {bulkInfo && bulkInfo.unpurchasedCount > 1 && (
              <p className="text-sm mb-4">
                Hoặc ủng hộ{" "}
                <span className="text-black font-bold">{bulkInfo.totalPrice} Xu</span>{" "}
                để đọc trọn bộ{" "}
                <span className="text-red-400 font-medium">
                  (Giảm {bulkInfo.discount}% so với mua lẻ từng chương)
                </span>
              </p>
            )}

            {/* Info list */}
            <ul className="text-sm text-black space-y-2 mb-5 list-disc list-inside">
              <li>Sau khi mua, bạn có thể đọc chương này không giới hạn số lần.</li>
              <li>Bạn chỉ bị trừ Xu khi đọc chương này lần đầu tiên.</li>
              <li>
                Kiểm tra Xu hiện tại tại{" "}
                <Link href="/profile" className="underline font-semibold text-black hover:text-pink" onClick={() => setShowModal(false)}>
                  Trang cá nhân
                </Link>
                . Nạp thêm Xu tại{" "}
                <Link href="/topup" className="underline font-semibold text-black hover:text-pink" onClick={() => setShowModal(false)}>
                  Nạp xu
                </Link>
                .
              </li>
              <li>
                Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ{" "}
                <a href="https://www.facebook.com/share/1UFcSHCMsM/" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-black hover:text-pink">
                  Fanpage
                </a>
                .
              </li>
            </ul>

            {/* Xu hiện có */}
            <div className="flex items-center justify-between text-sm bg-gray-200/60 rounded-lg px-4 py-2.5 mb-4">
              <span className="text-muted">Xu của bạn</span>
              <span className="font-bold text-pink">{getUserCoins()} xu</span>
            </div>

            {purchaseError && (
              <p className="text-red-400 text-xs text-center mb-3">{purchaseError}</p>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 flex-wrap">
              <button
                onClick={() => setShowModal(false)}
                className="text-muted hover:text-black px-4 py-2 text-sm transition-colors"
              >
                Hủy
              </button>

              <button
                onClick={handlePurchaseSingle}
                disabled={purchasing}
                className="bg-neutral-200 hover:bg-white text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {purchasing ? "Đang mua..." : "Mua chương này"}
              </button>

              {bulkInfo && bulkInfo.unpurchasedCount > 1 && (
                <div className="relative">
                  <span className="absolute -top-2.5 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                    -{bulkInfo.discount}%
                  </span>
                  <button
                    onClick={handlePurchaseAll}
                    disabled={purchasing}
                    className="bg-neutral-200 hover:bg-white text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                  >
                    Mua toàn bộ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
