"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, ArrowRightToLine } from 'lucide-react';

interface DetailActionButtonsProps {
  readNowUrl: string;
  readLatestUrl: string;
  novelId: string;
}

export function DetailActionButtons({ readNowUrl, readLatestUrl, novelId }: DetailActionButtonsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!novelId) return;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        fetch(`/api/novels/${novelId}/bookmark?userId=${user.id}`)
          .then(r => r.json())
          .then(data => setIsBookmarked(data.bookmarked))
          .catch(() => {});
        fetch(`/api/novels/${novelId}/like?userId=${user.id}`)
          .then(r => r.json())
          .then(data => setIsLiked(data.liked))
          .catch(() => {});
      } catch (e) {}
    }
  }, [novelId]);

  const toggleBookmark = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Vui lòng đăng nhập để theo dõi truyện!");
      return;
    }
    
    if (loading) return;
    setLoading(true);
    try {
      const user = JSON.parse(userStr);
      const res = await fetch(`/api/novels/${novelId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      setIsBookmarked(data.bookmarked);
    } catch (e) {
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Vui lòng đăng nhập để yêu thích truyện!");
      return;
    }
    
    if (loading) return;
    setLoading(true);
    try {
      const user = JSON.parse(userStr);
      const res = await fetch(`/api/novels/${novelId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      setIsLiked(data.liked);
    } catch (e) {
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col mb-[24px] gap-[16px]">
      <div className="flex w-full gap-[12px]">
        <Link href={readNowUrl} className="flex-1">
          <button className="w-full flex items-center justify-center font-medium bg-pink text-white text-[15px] md:text-[16px] gap-[4px] h-[40px] rounded-full transition-colors" style={{"appearance":"button"}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" />
            </svg>
            <span>Đọc Ngay</span>
          </button>
        </Link>
        
        <Link href={readLatestUrl} className="flex-1">
          <button className="w-full flex items-center justify-center font-medium bg-[#ffebf0] border-2 border-pink text-pink hover:bg-pink hover:text-white transition-colors text-[15px] md:text-[16px] gap-[4px] h-[40px] rounded-full" style={{"appearance":"button"}}>
            <ArrowRightToLine className="w-4 h-4" />
            <span>Tập Mới Nhất</span>
          </button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div>
          <button onClick={toggleLike} className="items-center flex flex-col font-medium justify-center overflow-hidden relative text-center whitespace-nowrap bg-black/0 text-[14px] gap-[6px] leading-[20px] pt-2 px-3 pb-2 rounded-md hover:bg-black/5 transition-colors" style={{"appearance":"button"}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${isLiked ? 'text-red-500' : 'text-black'}`}>
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="block text-center">Yêu thích</span>
          </button>
        </div>
        
        <div>
          <button onClick={toggleBookmark} className="items-center flex flex-col font-medium justify-center overflow-hidden relative text-center whitespace-nowrap bg-black/0 text-[14px] gap-[6px] leading-[20px] pt-2 px-3 pb-2 rounded-md hover:bg-black/5 transition-colors" style={{"appearance":"button"}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${isBookmarked ? 'text-pink' : 'text-black'}`}>
              <path d="M12 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" />
              <path d="M12 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" />
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
            </svg>
            <span className="block text-center">Theo dõi</span>
          </button>
        </div>

        <div>
          <Link href="/donate" className="block">
            <button className="items-center flex flex-col font-medium justify-center overflow-hidden relative text-center whitespace-nowrap bg-black/0 text-[14px] gap-[6px] leading-[20px] pt-2 px-3 pb-2 rounded-md hover:bg-black/5 transition-colors text-yellow-600" style={{"appearance":"button"}}>
              <Coffee className="w-6 h-6" />
              <span className="block text-center text-black">Donate</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
