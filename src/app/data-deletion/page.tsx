"use client";

import React from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 pt-28 pb-20 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-6">Xoa du lieu nguoi dung</h1>
        <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            De yeu cau xoa du lieu, vui long gui email toi ho tro va cung cap tai
            khoan dang nhap hoac email lien ket.
          </p>
          <p>
            Chung toi se xac minh va xoa du lieu lien quan trong thoi gian hop ly.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
