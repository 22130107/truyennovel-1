"use client";
import React from "react";

interface HorizontalScrollProps {
  children: React.ReactNode;
}

export function HorizontalScroll({ children }: HorizontalScrollProps) {
  return (
    <div className="relative w-full">
      <div className="overflow-x-auto no-scrollbar w-full">
        <div className="flex flex-nowrap">
          {children}
        </div>
      </div>
    </div>
  );
}
