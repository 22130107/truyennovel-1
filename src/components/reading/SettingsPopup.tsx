"use client";
import React, { useRef, useEffect } from "react";

export interface ReadingSettings {
  fontSize: number;
  fontFamily: string;
}

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReadingSettings;
  onChange: (s: ReadingSettings) => void;
}

export function SettingsPopup({ isOpen, onClose, settings, onChange }: SettingsPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="fixed top-16 right-4 md:right-8 w-72 bg-white border-3 border-pink shadow-2xl rounded-xl z-[60]"
    >
      <div className="p-5 space-y-4">
        <h3 className="text-base font-bold text-black">Cài đặt đọc</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-black">Cỡ chữ</label>
            <span className="text-sm font-bold text-pink">{settings.fontSize}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="32"
            step="1"
            value={settings.fontSize}
            onChange={(e) => onChange({ ...settings, fontSize: parseInt(e.target.value) })}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-pink bg-pink/20"
          />
          <div className="flex justify-between text-[11px] text-black">
            <span>14px</span>
            <span>32px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
