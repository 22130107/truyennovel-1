"use client";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface ChapterSelectorProps {
  currentChapter: number;
  nextChapter?: number | null;
}

interface ChapterItem {
  number: number;
  title: string;
  isLocked: boolean;
  isPurchased: boolean;
}

export function ChapterSelector({ currentChapter, nextChapter: nextChapterProp }: ChapterSelectorProps) {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const prevChapter = currentChapter > 1 ? currentChapter - 1 : null;
  const nextChapter = nextChapterProp ?? null;

  const [isOpen, setIsOpen] = useState(false);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch chapters khi mở dropdown lần đầu
  useEffect(() => {
    if (!isOpen || chapters.length > 0) return;
    setLoading(true);
    const userId = (() => {
      try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw).id : null; } catch { return null; }
    })();
    const url = `/api/novels/${id}${userId ? `?userId=${userId}` : ''}`;
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
      .finally(() => setLoading(false));
  }, [isOpen, id, chapters.length]);

  // Scroll đến chương hiện tại khi mở
  useEffect(() => {
    if (isOpen && listRef.current && chapters.length > 0) {
      const activeEl = listRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center' });
      }
    }
  }, [isOpen, chapters]);

  // Đóng khi click ngoài
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
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Link trở về */}
      <div className="flex justify-center">
        <Link
          href={`/novel/${id}`}
          className="text-black hover:text-pink transition-colors flex items-center gap-2 text-xs md:text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.25-4a.75.75 0 010-1.08l4.25-4a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Trở về trang chi tiết truyện
        </Link>
      </div>

      {/* Navigation row */}
      <div className="flex items-center justify-center gap-2">
        {/* Chương trước */}
        {prevChapter ? (
          <Link href={`/novel/${id}/${prevChapter}`}>
            <button className="items-center inline-flex font-medium justify-center h-10 bg-pink text-white text-[13px] md:text-[14px] gap-2 px-3 md:px-4 rounded-md hover:bg-pink/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.25-4a.75.75 0 010-1.08l4.25-4a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
              Chương trước
            </button>
          </Link>
        ) : (
          <div className="w-[120px] h-10" />
        )}

        {/* Dropdown chương */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="items-center border-2 flex justify-between w-40 md:w-48 h-10 bg-white border-pink text-[13px] md:text-[14px] px-3 md:px-4 rounded-md hover:border-pink transition-colors"
          >
            <span className="font-medium text-black">Chương {currentChapter}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-4 h-4 text-black transition-transform ${isOpen ? 'rotate-180' : ''}`}
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white border-2 border-pink rounded-xl shadow-2xl z-50 overflow-hidden">
              {loading ? (
                <div className="py-6 text-center text-sm text-black">Đang tải...</div>
              ) : chapters.length === 0 ? (
                <div className="py-6 text-center text-sm text-black">Không có chương</div>
              ) : (
                <div ref={listRef} className="overflow-y-auto max-h-64 custom-scrollbar">
                  {chapters.map((ch) => {
                    const isActive = ch.number === currentChapter;
                    return (
                      <button
                        key={ch.number}
                        data-active={isActive}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/novel/${id}/${ch.number}`);
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

        {/* Chương sau */}
        {nextChapter ? (
          <Link href={`/novel/${id}/${nextChapter}`}>
            <button className="items-center inline-flex font-medium justify-center h-10 bg-pink text-white text-[13px] md:text-[14px] gap-2 px-3 md:px-4 rounded-md hover:bg-pink/80 transition-colors">
              Chương sau
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>
        ) : (
          <div className="w-[120px] h-10" />
        )}
      </div>
    </div>
  );
}
