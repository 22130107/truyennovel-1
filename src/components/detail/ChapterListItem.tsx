"use client";
import Link from "next/link";

interface ChapterListItemProps {
  number: number;
  title?: string;
  url: string;
  date: string;
  isLocked?: boolean;
  price?: number;
  isPurchased?: boolean;
  showDivider?: boolean;
}

export function ChapterListItem({
  number,
  title,
  url,
  date,
  isLocked = false,
  price = 0,
  isPurchased = false,
  showDivider = true,
}: ChapterListItemProps) {
  const locked = isLocked && !isPurchased;

  return (
    <div>
      <Link href={url}>
        <div className="items-center flex justify-between p-4 group hover:bg-black/5 transition-colors cursor-pointer">
          <div className="flex-1 min-w-0">
            <h6 className={`font-medium group-hover:text-pink transition-colors truncate ${locked ? "text-black" : ""}`}>
              Chương {number}{title ? `: ${title}` : ""}
            </h6>
            <p className="mt-1 text-muted text-[12px] leading-[16px]">{date}</p>
          </div>

          <div className="flex items-center gap-2 ml-4 shrink-0">
            {isLocked && !isPurchased ? (
              <div className="flex items-center gap-1.5 bg-pink/10 border border-pink/30 text-pink text-[11px] font-bold px-2.5 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z" clipRule="evenodd" />
                </svg>
                Affiliate
              </div>
            ) : isLocked && isPurchased ? (
              <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Đã mua
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-pink">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </Link>
      {showDivider && <div role="none" className="h-px w-full bg-neutral-300" />}
    </div>
  );
}
