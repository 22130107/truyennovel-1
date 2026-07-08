"use client";
import React from 'react';

interface ChapterContentProps {
  chapterNumber: number;
  chapterTitle: string;
  content: string[];
  fontSize?: number;
  fontFamily?: string;
}

/**
 * Tách nội dung thành các đoạn văn hợp lý.
 * Xử lý trường hợp dữ liệu cũ bị lưu liền không có \n.
 */
function splitIntoParagraphs(content: string[]): string[] {
  const result: string[] = [];
  for (const raw of content) {
    if (!raw.trim()) continue;

    // Nếu có \n → tách theo \n (bỏ dòng trống)
    if (raw.includes("\n")) {
      const parts = raw.split("\n").map((s) => s.trim()).filter(Boolean);
      result.push(...parts);
    } else if (raw.length > 200) {
      // Dữ liệu cũ bị lưu liền — tách tại dấu câu kết thúc đoạn
      const parts = raw
        .split(/(?<=[.?!。？！])\s+(?=[""\u201c\u201dA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸ])/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length > 1) {
        result.push(...parts);
      } else {
        result.push(raw);
      }
    } else {
      result.push(raw);
    }
  }
  return result;
}

export function ChapterContent({
  chapterNumber,
  chapterTitle,
  content,
  fontSize = 20,
  fontFamily = "Google Sans"
}: ChapterContentProps) {
  const paragraphs = splitIntoParagraphs(content);

  // Chống copy nội dung
  const handlePreventCopy = (e: React.ClipboardEvent | React.MouseEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Chặn Ctrl+C, Ctrl+A, Ctrl+U
    if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 'u')) {
      e.preventDefault();
    }
  };

  return (
    <div
      className="border-2 bg-white border-pink shadow-2xl p-4 md:p-6 rounded-xl select-none overflow-x-hidden"
      onCopy={handlePreventCopy}
      onCut={handlePreventCopy}
      onContextMenu={handlePreventCopy}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="mb-[24px] md:mb-[32px]">
        <h1 className="font-bold text-center mb-[16px] text-[24px] md:text-[30px] leading-tight md:leading-[36px]">
          Chương {chapterNumber}{chapterTitle ? `: ${chapterTitle}` : ""}
        </h1>
        <div className="flex justify-center w-full"></div>
      </div>
      <div className="break-words" style={{ fontSize: `${fontSize}px`, lineHeight: 1.8, fontFamily: `"${fontFamily}", sans-serif` }}>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-justify mb-[1.5em]">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
