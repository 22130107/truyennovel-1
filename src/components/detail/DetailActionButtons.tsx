"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DetailActionButtonsProps {
  readNowUrl: string;
  novelId: string;
}

export function DetailActionButtons({ readNowUrl, novelId }: DetailActionButtonsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
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
      } catch (e) {}
    }
  }, [novelId]);

  const toggleBookmark = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Vui lòng đăng nhập để lưu truyện!");
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

  return (
    <div className="items-center flex flex-wrap justify-start mb-[24px] gap-[12px]">
      <Link href={readNowUrl} className="block">
        <button className="items-center flex font-medium justify-center overflow-hidden relative text-center whitespace-nowrap w-full h-12 bg-pink text-white text-[20px] gap-[8px] leading-[28px] pt-2 pr-4 pb-2 pl-4 rounded-4xl" style={{"appearance":"button"}}>
          <span className="block overflow-hidden pointer-events-none absolute text-center left-0 top-0 right-0 bottom-0 rounded-md"></span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-2">
            <path d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" />
          </svg>
          <span className="block text-center ml-[8px]">Đọc Ngay</span>
        </button>
      </Link>
      <div className="flex">
        <div>
          <div>
            <button onClick={toggleBookmark} className="items-center flex flex-col font-medium justify-center overflow-hidden relative text-center whitespace-nowrap bg-black/0 text-[14px] gap-[8px] leading-[20px] pt-2 pr-4 pb-2 pl-4 rounded-md hover:bg-black/5 transition-colors" style={{"appearance":"button"}}>
              <span className="block overflow-hidden pointer-events-none absolute text-center left-0 top-0 right-0 bottom-0 rounded-md"></span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isBookmarked ? 'text-red-500' : 'text-black'}`}>
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              <span className="block text-center">Yêu thích</span>
            </button>
          </div>
        </div>
        <div>
          <div>
            <button onClick={toggleBookmark} className="items-center flex flex-col font-medium justify-center overflow-hidden relative text-center whitespace-nowrap bg-black/0 text-[14px] gap-[8px] leading-[20px] pt-2 pr-4 pb-2 pl-4 rounded-md hover:bg-black/5 transition-colors" style={{"appearance":"button"}}>
              <span className="block overflow-hidden pointer-events-none absolute text-center left-0 top-0 right-0 bottom-0 rounded-md"></span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isBookmarked ? 'text-pink' : 'text-black'}`}>
                <path d="M12 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" />
                <path d="M12 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" />
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
              </svg>
              <span className="block text-center">Theo dõi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
