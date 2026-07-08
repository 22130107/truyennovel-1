"use client";
import React from "react";

interface RatingDistribution {
  label: string;
  percentage: number;
}

interface Review {
  username: string;
  score: number;
  comment: string;
  createdAt: string;
}

interface RatingOverviewProps {
  averageRating: number;
  totalRatings: number;
  distribution: RatingDistribution[];
}

function StarRow({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={s <= score ? "#E91E91" : "none"}
          stroke={s <= score ? "#E91E91" : "currentColor"}
          strokeWidth="2"
          className={`w-4 h-4 ${s <= score ? "" : "text-black"}`}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function RatingOverview({ averageRating, totalRatings, distribution }: RatingOverviewProps) {
  return (
    <div className="ml-auto mr-auto mb-[48px] max-w-sm">
      <div className="items-center flex h-9 mb-[24px]">
        <h2 className="font-semibold text-[24px] leading-[32px]">Đánh giá và nhận xét</h2>
      </div>

      {/* Tổng quan */}
      <div className="border-3 mb-[16px] bg-white border-pink shadow-2xl p-6 rounded-lg">
        <div className="items-center flex mb-[24px]">
          <div className="items-center flex flex-col">
            <span className="block font-bold text-pink text-[48px] leading-[48px]">{averageRating.toFixed(1)}</span>
            <span className="block text-muted text-[14px] leading-[20px]">{totalRatings} đánh giá</span>
          </div>
          <div className="flex flex-col justify-center ml-[16px]">
            <div className="flex mb-[4px]">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={index < Math.floor(averageRating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`w-6 h-6 ${index < Math.floor(averageRating) ? "text-pink" : "text-black"}`}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-[8px]">
          {distribution.map((item, index) => (
            <div key={index} className={`items-center flex ${index > 0 ? "mt-[8px]" : ""}`}>
              <span className="block w-20 text-[14px] leading-[20px]">{item.label}</span>
              <div className="grow overflow-hidden relative h-2 ml-[8px] bg-gray-200 basis-[0%] rounded-[624.9375rem]">
                <div className="absolute h-2 left-0 top-0 bg-pink rounded-[624.9375rem]" style={{ width: `${item.percentage}%` }} />
              </div>
              <span className="block text-right w-10 ml-[8px] text-muted text-[14px] leading-[20px]">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách nhận xét đã chuyển sang NovelDetailClient */}
    </div>
  );
}
