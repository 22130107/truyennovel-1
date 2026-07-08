"use client";
import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';

const STEPS: { step: number; content: React.ReactNode }[] = [
  {
    step: 1,
    content: (
      <>
        <Link href="/login" className="text-black font-bold border-b-[3px] border-pink hover:text-pink transition-colors">
          Đăng nhập
        </Link>
        {" "}tài khoản. (Chưa có?{" "}
        <Link href="/register" className="text-black font-bold border-b-[3px] border-pink hover:text-pink transition-colors">
          Đăng ký tại đây
        </Link>)
      </>
    ),
  },
  {
    step: 2,
    content: <>Nhấn vào <span className="text-black font-bold border-b-[3px] border-pink">biểu tượng User</span> góc phải header.</>,
  },
  {
    step: 3,
    content: (
      <>
        Chọn{" "}
        <Link href="/topup" className="text-black font-bold border-b-[3px] border-pink hover:text-pink transition-colors">
          Nạp xu
        </Link>.
      </>
    ),
  },
  {
    step: 4,
    content: <>Chọn <span className="text-black font-bold border-b-[3px] border-pink">gói nạp</span> phù hợp.</>,
  },
  {
    step: 5,
    content: <>Hệ thống hiển thị <span className="text-black font-bold border-b-[3px] border-pink">mã QR</span>.</>,
  },
  {
    step: 6,
    content: <>Quét QR và <span className="text-black font-bold border-b-[3px] border-pink">thanh toán</span>.</>,
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-site text-black">
      <Header />

      <main className="pt-32 pb-20 px-4 md:px-0">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink to-pink">
              Hướng Dẫn Nạp Xu
            </h1>
            <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
              Để sử dụng đầy đủ các tính năng nâng cao trên website như mở khóa chương truyện VIP,
              đọc sớm nội dung mới hoặc ủng hộ tác giả, người dùng cần thực hiện nạp{" "}
              <span className="text-pink font-bold">Xu</span> vào tài khoản cá nhân.
            </p>
          </div>

          {/* Steps Section */}
          <div className="bg-white border-3 border-pink rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink/5 blur-3xl -mr-20 -mt-20 rounded-full" />

            <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
              <span className="w-8 h-8 bg-pink text-white rounded-lg flex items-center justify-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
              </span>
              Quy trình nạp xu
            </h2>

            <div className="grid gap-8 relative">
              {STEPS.map((item) => (
                <div key={item.step} className="flex items-start gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-pink font-bold group-hover:bg-pink group-hover:text-white transition-all duration-300">
                    {item.step}
                  </div>
                  <div className="pt-2">
                    <p className="text-gray-300 text-lg">{item.content}</p>
                  </div>
                </div>
              ))}

              {/* Connecting line */}
              <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-pink/50 via-pink/20 to-transparent -z-10" />
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-muted text-sm italic">
              Vui lòng kiểm tra kỹ thông tin trước khi thanh toán.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
