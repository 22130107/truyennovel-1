"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';

interface Purchase {
  id: string;
  pricePaid: number;
  purchasedAt: string;
  chapterNumber: number | null;
  chapterTitle: string | null;
  novelId: string;
  novelSlug?: string;
  novelTitle: string;
  isCombo: boolean;
  comboCount: number;
}

interface Transaction {
  id: string;
  amountXu: number;
  amountMoney: number;
  paymentMethod: string;
  paymentRef: string | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setUser(parsed);
          if (parsed?.id) {
            setLoadingTransactions(true);
            fetch(`/api/user/transactions?userId=${parsed.id}`)
              .then((r) => r.json())
              .then((data) => setTransactions(Array.isArray(data) ? data : []))
              .catch(() => setTransactions([]))
              .finally(() => setLoadingTransactions(false));
          }
        } catch (e) {
          console.error('Lỗi phân tích thông tin người dùng', e);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  return (
    <div className="min-h-screen bg-site text-black flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4 md:px-8 max-w-[1920px] mx-auto w-full">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <h1 className="text-2xl font-bold">Trang cá nhân</h1>
          </div>
          <p className="text-muted text-sm ml-9">Quản lý thông tin cá nhân của bạn</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Thông tin tài khoản */}
          <div className="bg-white border-2 border-pink rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <h2 className="font-bold text-black">Thông tin tài khoản</h2>
            </div>
            <p className="text-xs text-muted mb-6">Thông tin cơ bản của người dùng</p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <div className="flex gap-2 text-sm">
                  <span className="text-black">Tên người dùng:</span>
                  <span className="font-medium">{user ? (user.name || user.username) : 'Chưa đăng nhập'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <div className="flex gap-2 text-sm">
                  <span className="text-black">Email:</span>
                  <span className="font-medium text-gray-700">{user ? user.email : 'Chưa đăng nhập'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <div className="flex gap-2 text-sm">
                  <span className="text-black">Ngày tham gia:</span>
                  <span className="font-medium">
                    {user && user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm mt-6">
                <span className="text-black">Vai trò:</span>
                <span className="bg-black/5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-black">
                  {user ? user.role : 'USER'}
                </span>
              </div>
            </div>
          </div>
        </div>





        {/* Footer Navigation */}
        <div className="flex items-center gap-4 flex-wrap">
          {user?.role === 'ADMIN' && (
            <Link href="/admin">
              <button className="bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 text-red-400 px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
                Trang Quản Trị
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </button>
            </Link>
          )}
          <Link href="/" className="text-muted hover:text-black transition-colors text-sm font-medium ml-2">
            Trang chủ
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
