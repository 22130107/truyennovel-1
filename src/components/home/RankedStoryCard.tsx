"use client";
import React from 'react';
import Link from 'next/link';


interface RankedStoryCardProps {
  href: string;
  imageUrl: string;
  title: string;
  translator: string;
  date: string;
  chapters: number;
  rank: number;
  clipPathLeft?: boolean;
}

export function RankedStoryCard({
  href,
  imageUrl,
  title,
  translator,
  date,
  chapters,
  rank,
  clipPathLeft = true
}: RankedStoryCardProps) {
  const clipPathStyle = clipPathLeft
    ? "polygon(94.239% 100%, 5.761% 100%, 5.761% 100%, 4.826% 99.95%, 3.94% 99.803%, 3.113% 99.569%, 2.358% 99.256%, 1.687% 98.87%, 1.111% 98.421%, 0.643% 97.915%, 0.294% 97.362%, 0.075% 96.768%, 0px 96.142%, 0px 3.858%, 0px 3.858%, 0.087% 3.185%, 0.338% 2.552%, 0.737% 1.968%, 1.269% 1.442%, 1.92% 0.984%, 2.672% 0.602%, 3.512% 0.306%, 4.423% 0.105%, 5.391% 0.008%, 6.4% 0.024%, 94.879% 6.625%, 94.879% 6.625%, 95.731% 6.732%, 96.532% 6.919%, 97.272% 7.178%, 97.942% 7.503%, 98.533% 7.887%, 99.038% 8.323%, 99.445% 8.805%, 99.747% 9.326%, 99.935% 9.88%, 100% 10.459%, 100% 96.142%, 100% 96.142%, 99.925% 96.768%, 99.706% 97.362%, 99.357% 97.915%, 98.889% 98.421%, 98.313% 98.87%, 97.642% 99.256%, 96.887% 99.569%, 96.06% 99.803%, 95.174% 99.95%, 94.239% 100%)"
    : "polygon(5.761% 100%, 94.239% 100%, 94.239% 100%, 95.174% 99.95%, 96.06% 99.803%, 96.887% 99.569%, 97.642% 99.256%, 98.313% 98.87%, 98.889% 98.421%, 99.357% 97.915%, 99.706% 97.362%, 99.925% 96.768%, 100% 96.142%, 100% 3.858%, 100% 3.858%, 99.913% 3.185%, 99.662% 2.552%, 99.263% 1.968%, 98.731% 1.442%, 98.08% 0.984%, 97.328% 0.602%, 96.488% 0.306%, 95.577% 0.105%, 94.609% 0.008%, 93.6% 0.024%, 5.121% 6.625%, 5.121% 6.625%, 4.269% 6.732%, 3.468% 6.919%, 2.728% 7.178%, 2.058% 7.503%, 1.467% 7.887%, 0.962% 8.323%, 0.555% 8.805%, 0.253% 9.326%, 0.065% 9.88%, 0px 10.459%, 0px 96.142%, 0px 96.142%, 0.075% 96.768%, 0.294% 97.362%, 0.643% 97.915%, 1.111% 98.421%, 1.687% 98.87%, 2.358% 99.256%, 3.113% 99.569%, 3.94% 99.803%, 4.826% 99.95%, 5.761% 100%)";

  return (
    <Link href={href} className="w-full">
      <div className="group flex flex-col w-full">
        <div className="overflow-hidden relative w-full aspect-[2_/_3] shrink-[0]" style={{"clipPath": clipPathStyle}}>
          <img alt={title} src={imageUrl} className="block size-full max-w-full object-cover overflow-clip absolute align-middle left-0 top-0 right-0 bottom-0 text-black/0 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute left-0 top-0 right-0 bottom-0 bg-black/40 opacity-[0]"></div>
        </div>
        <div className="items-start flex bg-black/80 backdrop-blur-md p-2 rounded-b-xl min-h-[100px] text-white">
          <div className="items-center flex justify-center w-12 h-12 mt-[8px] mr-[8px]">
            <span className="bg-clip-text block italic font-extrabold text-black/0 text-[48px] leading-[48px]" style={{"backgroundImage":"linear-gradient(rgb(253, 224, 71), rgb(202, 138, 4))"}}>{rank}</span>
          </div>
          <div className="flex flex-col justify-start gap-[4px] flex-1">
            <p className="flow-root font-bold overflow-hidden line-clamp-2 h-[40px] leading-[20px]">{title}</p>
            <p className="flow-root truncate text-[12px] leading-[16px] text-black">Dịch giả:  {translator}</p>
            <p className="font-semibold text-[rgb(156,_163,_175)] text-[12px] leading-[16px]">{date} - {chapters} ch</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
