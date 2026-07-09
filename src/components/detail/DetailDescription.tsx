"use client";
import React from "react";

interface DetailDescriptionProps {
  description: string[];
}

export function DetailDescription({ description }: DetailDescriptionProps) {
  return (
    <div>
      <h2 className="font-semibold mb-4 text-[20px] leading-[28px]">Mô tả</h2>
      <div>
        {description.map((paragraph, index) => (
          <p
            key={index}
            className="text-justify mb-4 text-[15px] text-muted leading-[24px]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
