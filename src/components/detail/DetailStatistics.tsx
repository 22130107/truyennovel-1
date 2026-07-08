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
    <div className="grid mt-[24px] bg-white gap-[16px] p-4 rounded-lg border-3 border-pink" style={{"gridTemplateColumns":"repeat(auto-fit, minmax(100px, 1fr))"}}>
      <div className="text-center" style={{"gridArea":"1 / 1 / 2 / 2"}}>
        <div className="font-semibold text-center">{views}</div>
        <div className="text-center text-muted text-[14px] leading-[20px]">Lượt xem</div>
      </div>
      <div className="text-center" style={{"gridArea":"1 / 2 / 2 / 3"}}>
        <div className="font-semibold text-center">{likes}</div>
        <div className="text-center text-muted text-[14px] leading-[20px]">Đánh giá</div>
      </div>
      <div className="text-center" style={{"gridArea":"1 / 3 / 2 / 4"}}>
        <div className="font-semibold text-center">{follows}</div>
        <div className="text-center text-muted text-[14px] leading-[20px]">Theo dõi</div>
      </div>
      <div className="text-center" style={{"gridArea":"1 / 4 / 2 / 5"}}>
        <div className="font-semibold text-center">{lastUpdate}</div>
        <div className="text-center text-muted text-[14px] leading-[20px]">Lần cập nhật cuối</div>
      </div>
    </div>
  );
}
