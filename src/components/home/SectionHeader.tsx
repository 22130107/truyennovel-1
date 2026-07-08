"use client";
import Link from 'next/link';


interface SectionHeaderProps {
  title: string;
  href?: string;
}

export function SectionHeader({ title, href = "/browse" }: SectionHeaderProps) {
  return (
    <div className="items-center flex justify-start mb-[32px] group">
      <h2 className="font-bold mr-[24px] text-[30px] leading-[36px]">{title}</h2>
      <Link href={href} className="block">
        <button title="Xem thêm" className="items-center flex justify-center w-10 h-10 bg-transparent border-2 border-neutral-400 text-black hover:border-pink hover:text-pink transition-all rounded-full group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </Link>
    </div>
  );
}
