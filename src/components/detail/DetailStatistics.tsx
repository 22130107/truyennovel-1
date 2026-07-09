"use client";
import React from 'react';

interface DetailStatisticsProps {
  views: number;
  likes: number;
  follows: number;
  lastUpdate: string;
}

export function DetailStatistics({ views, likes, follows, lastUpdate }: DetailStatisticsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 mt-[24px] bg-white gap-4 p-4 rounded-lg border-2 border-pink">
      <div className="flex flex-col items-center justify-center">
        <div className="font-semibold text-center">{views}</div>
        <div className="text-center text-muted text-[13px] sm:text-[14px] leading-[20px]">Lượt xem</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="font-semibold text-center">{likes}</div>
        <div className="text-center text-muted text-[13px] sm:text-[14px] leading-[20px]">Đánh giá</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="font-semibold text-center">{follows}</div>
        <div className="text-center text-muted text-[13px] sm:text-[14px] leading-[20px]">Theo dõi</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="font-semibold text-center">{lastUpdate}</div>
        <div className="text-center text-muted text-[13px] sm:text-[14px] leading-[20px]">Cập nhật cuối</div>
      </div>
    </div>
  );
}
