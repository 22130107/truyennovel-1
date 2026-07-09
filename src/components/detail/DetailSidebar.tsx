"use client";
import React from 'react';

interface DetailSidebarProps {
  coverImage: string;
  title: string;
  translator: string;
  translatorUrl: string;
  author: string;
  status: string;
  chapters: number;
  genre: string;
}

export function DetailSidebar({
  coverImage,
  title,
  translator,
  translatorUrl,
  author,
  status,
  chapters,
  genre
}: DetailSidebarProps) {
  return (
    <div className="bg-white rounded-bl-2xl rounded-br-2xl rounded-tl-2xl rounded-tr-[4rem] shadow-2xl pt-10 pr-4 pb-4 pl-4">
      <div className="sticky top-24">
        <img
          alt={title}
          src={coverImage}
          className="block ml-auto mr-auto overflow-clip align-middle w-full aspect-[auto_300_/_400] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0.1)_0px_10px_15px_-3px,_rgba(0,0,0,0.1)_0px_4px_6px_-4px] text-black/0 max-w-sm rounded-lg"
        />
        <div className="mt-[24px]">
          <h1 className="font-bold text-center mb-[40px] text-[24px] md:text-[28px] leading-[32px]">{title}</h1>

          {/* Người dịch — chỉ hiện khi có */}
          {translator && (
            <p className="mt-[16px] text-[15px] md:text-[16px] leading-[24px] flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[rgb(192,_132,_252)]">
                <path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" />
              </svg>
              Editor:{" "}
              <span className="font-semibold text-[rgb(192,_132,_252)]">{translator}</span>
            </p>
          )}

          {/* Tác giả */}
          <p className="mt-[16px] text-[15px] md:text-[16px] leading-[24px] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[rgb(59,_130,_246)]">
              <path d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.25 2.25 0 01-3.511-.285 2.25 2.25 0 01.284-3.513l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 014.484-4.884 4.5 4.5 0 014.131 4.714z" />
            </svg>
            Tác giả: <span className="font-semibold text-[rgb(59,_130,_246)]">{author}</span>
          </p>

          {/* Trạng thái */}
          <div className="mt-[16px] text-[15px] md:text-[16px] leading-[24px] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[rgb(74,_222,_128)]">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.74-5.24z" clipRule="evenodd" />
            </svg>
            Trạng thái:{" "}
            <div className="items-center border inline-flex font-semibold bg-pink/10 border-pink/30 text-pink text-[14px] leading-[20px] pt-[2px] pr-[10px] pb-[2px] pl-[10px] rounded-[624.9375rem]">
              {status}
            </div>
          </div>

          {/* Số chương */}
          <p className="mt-[16px] text-[15px] md:text-[16px] leading-[24px] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[rgb(99,_102,_241)]">
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c1.995 0 3.823.707 5.25 1.886a.75.75 0 001-.707V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
            </svg>
            Số chương: <span className="font-semibold text-[rgb(99,_102,_241)]">{chapters}</span>
          </p>

          {/* Thể loại */}
          <div className="flex mt-[16px]">
            <div className="items-center flex flex-wrap overflow-hidden mb-[24px] text-[15px] md:text-[16px] gap-[8px] leading-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[rgb(107,_114,_128)]">
                <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39.92 3.31 0l4.318-4.317c.92-.92.92-2.39 0-3.31l-9.581-9.58a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" clipRule="evenodd" />
              </svg>
              Thể loại
              <div className="items-center border flex font-semibold bg-gray-200 border-pink text-[14px] leading-[20px] pt-[2px] pr-[10px] pb-[2px] pl-[10px] rounded-[624.9375rem]">
                {genre}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
