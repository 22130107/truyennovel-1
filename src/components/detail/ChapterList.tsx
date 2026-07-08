"use client";
import React, { useState } from "react";
import { ChapterListItem } from "./ChapterListItem";

interface Chapter {
  number: number;
  title?: string;
  url: string;
  date: string;
  isLocked?: boolean;
  price?: number;
  isPurchased?: boolean;
}

interface ChapterListProps {
  chapters: Chapter[];
}

export function ChapterList({ chapters }: ChapterListProps) {
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = sortAsc ? [...chapters] : [...chapters].reverse();

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-[24px] leading-[32px]">
          Danh sách chương
          <span className="ml-2 text-sm font-normal text-black">({chapters.length} chương)</span>
        </h2>
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="flex items-center gap-1.5 text-sm font-medium text-black hover:text-black transition-colors px-3 py-1.5 rounded-lg hover:bg-black/5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
          {sortAsc ? "Cũ nhất" : "Mới nhất"}
        </button>
      </div>

      <div className="overflow-auto max-h-[598.5px] custom-scrollbar">
        <div className="border-2 bg-white border-pink shadow-xl rounded-lg">
          {sorted.length === 0 ? (
            <div className="p-8 text-center text-black text-sm">Chưa có chương nào</div>
          ) : (
            sorted.map((chapter, index) => (
              <ChapterListItem
                key={chapter.number}
                number={chapter.number}
                title={chapter.title}
                url={chapter.url}
                date={chapter.date}
                isLocked={chapter.isLocked}
                price={chapter.price}
                isPurchased={chapter.isPurchased}
                showDivider={index < sorted.length - 1}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
