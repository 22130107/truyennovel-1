"use client";
import React from "react";

interface DetailDescriptionProps {
  description: string[];
}

export function DetailDescription({ description }: DetailDescriptionProps) {
  return (
    <div>
      <h2 className="font-semibold mb-4 text-[24px] leading-[32px]">Mô tả</h2>
      <div>
        {description.map((paragraph, index) => (
          <p
            key={index}
            className="text-justify mb-4 text-muted leading-[26px]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
