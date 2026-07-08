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
              <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                {price} xu
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
