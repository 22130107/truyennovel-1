"use client";
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customSize?: string;
}

export function Logo({ className = "", size = 'md', customSize }: LogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-8',
    md: 'w-24 h-12 md:w-32 md:h-16',
    lg: 'w-40 h-20 md:w-48 md:h-24',
    xl: 'w-64 h-32 md:w-80 md:h-40',
    custom: customSize || ''
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* 
        Removed overflow-hidden and hover effects.
        Scale is kept at 1.0 (original) to ensure no clipping, 
        while object-contain handles the fitting.
      */}
      <img 
        src="/logo.png" 
        alt="Truyenhot Logo" 
        className="w-full h-full object-contain drop-shadow-2xl"
      />
    </div>
  );
}
