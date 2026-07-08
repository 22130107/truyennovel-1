"use client";

import React from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 pt-28 pb-20 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-6">Chinh sach quyen rieng tu</h1>
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            Trang nay mo ta cach Truyenhot thu thap, su dung va bao ve thong tin
            nguoi dung.
          </p>
          <p>
            Chung toi co the thu thap thong tin co ban nhu email, ten hien thi va
            anh dai dien khi ban dang nhap bang tai khoan xa hoi.
          </p>
          <p>
            Du lieu duoc su dung de tao tai khoan, hien thi ho so va cai thien
            trai nghiem doc truyen. Chung toi khong ban du lieu ca nhan.
          </p>
          <p>
            Neu ban co cau hoi ve quyen rieng tu, vui long lien he qua email ho
            tro.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
