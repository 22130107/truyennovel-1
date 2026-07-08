"use client";
import React from 'react';
import Link from 'next/link';


interface StoryCardProps {
  href: string;
  imageUrl: string;
  title: string;
  author: string;
  rating: number;
  chapters: number;
  category: string;
  status?: string;
  iconUrl: string;
  chapterIconUrl: string;
}

export function StoryCard({
  href,
  imageUrl,
  title,
  author,
  rating,
  chapters,
  category,
  status = "Hoàn thành",
  iconUrl,
  chapterIconUrl
}: StoryCardProps) {
  return (
    <Link href={href}>
      <div className="group border-2 overflow-hidden bg-white border-pink shadow-2xl rounded-2xl h-full flex flex-col">
        <div className="overflow-hidden relative">
          <div className="relative w-full aspect-[3_/_4]">
            <img
              alt={title}
              src={imageUrl}
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="absolute left-0 top-0 right-0 bottom-0 bg-black/40 opacity-[0]"></div>
          <div className="items-center flex absolute top-3 right-3 backdrop-blur-sm bg-white/90 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0)_0px_0px_0px_0px,_rgba(0,0,0,0.1)_0px_1px_3px_0px,_rgba(0,0,0,0.1)_0px_1px_2px_-1px] text-[14px] gap-[4px] leading-[20px] pt-1 pr-2 pb-1 pl-2 rounded-[624.9375rem]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-pink">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
            <span className="block font-medium">{rating.toFixed(1)}</span>
          </div>
          <div className="flex absolute left-3 top-3 gap-[8px]">
            <div className={`items-center border flex font-semibold backdrop-blur-md border-white/10 text-white text-[12px] leading-[16px] pt-[2px] pr-[10px] pb-[2px] pl-[10px] rounded-[624.9375rem] ${
              status === 'Hoàn thành' ? 'bg-green-600/80' : 
              status === 'Đang ra' ? 'bg-yellow-600/80' : 
              status === 'Tạm dừng' ? 'bg-red-600/80' : 'bg-neutral-900/80'
            }`}>{status}</div>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold overflow-hidden line-clamp-2 text-black h-[40px] leading-[20px] mb-1">{title}</h3>
            <p className="flow-root overflow-hidden text-black/70 text-[12px] font-medium leading-[16px] truncate">{author}</p>
          </div>
          <div className="flex justify-between mt-[4px] text-black text-[12px] leading-[16px]">
            <span className="block flex items-center gap-1 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              {chapters} chương
            </span>
            <span className="block bg-black text-white pt-1 pr-2 pb-1 pl-2 rounded-[624.9375rem] text-[10px] font-bold">{category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
