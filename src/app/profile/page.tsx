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
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setUser(parsed);
          // Fetch lịch sử mua sau khi có userId
          if (parsed?.id) {
            setLoadingPurchases(true);
            fetch(`/api/user/purchases?userId=${parsed.id}`)
              .then((r) => r.json())
              .then((data) => setPurchases(Array.isArray(data) ? data : []))
              .catch(() => setPurchases([]))
              .finally(() => setLoadingPurchases(false));

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
        setPurchases([]);
      }
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  return (
    <div className="min-h-screen bg-site text-black">
      <Header />
      
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-[1920px] mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <h1 className="text-2xl font-bold">Trang cá nhân</h1>
          </div>
          <p className="text-muted text-sm ml-9">Quản lý thông tin và ví xu của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Ví xu */}
          <div className="bg-white border-3 border-pink rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-pink">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="font-bold text-black">Ví xu</h2>
            </div>
            <p className="text-xs text-muted mb-4">Số xu hiện có trong tài khoản</p>
            <div className="text-3xl font-black text-pink mb-6 italic">{user ? user.coins : 0} xu</div>
            <Link href="/topup">
              <button className="w-full bg-[rgb(208,203,203)] hover:bg-white text-neutral-900 font-bold py-2.5 rounded-lg transition-colors text-sm">
                Nạp thêm xu
              </button>
            </Link>
          </div>

          {/* Thông tin tài khoản */}
          <div className="lg:col-span-2 bg-white border-3 border-pink rounded-xl p-6 shadow-lg">
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

        {/* Lịch sử mua chương */}
        <div className="bg-white border-3 border-pink rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-pink">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="font-bold text-black">Lịch sử mua chương</h2>
          </div>
          <p className="text-xs text-muted mb-4">Các chương truyện bạn đã mở khóa</p>

          {loadingPurchases ? (
            <div className="py-8 text-center text-muted text-sm">Đang tải...</div>
          ) : purchases.length === 0 ? (
            <div className="py-8 text-center text-black text-sm">Chưa có lịch sử mua chương nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-[3px] border-pink">
                    <th className="text-left py-2 px-3 text-black font-medium">Truyện</th>
                    <th className="text-left py-2 px-3 text-black font-medium">Chương</th>
                    <th className="text-center py-2 px-3 text-black font-medium">Xu đã dùng</th>
                    <th className="text-right py-2 px-3 text-black font-medium">Ngày mua</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink">
                  {purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-black/5 transition-colors">
                      <td className="py-3 px-3">
                        <Link href={`/novel/${p.novelSlug || p.novelId}`} className="text-black hover:text-pink transition-colors font-medium line-clamp-1">
                          {p.novelTitle}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        {p.isCombo ? (
                          <span className="inline-flex items-center gap-1.5 text-pink font-medium">
                            <span className="bg-pink/10 border border-pink/30 text-pink text-[10px] font-bold px-1.5 py-0.5 rounded">COMBO</span>
                            {p.comboCount} chương
                          </span>
                        ) : (
                          <Link href={`/novel/${p.novelSlug || p.novelId}/${p.chapterNumber}`} className="text-black hover:text-pink transition-colors">
                            Chương {p.chapterNumber}{p.chapterTitle ? `: ${p.chapterTitle}` : ""}
                          </Link>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-pink font-bold">{p.pricePaid} xu</span>
                      </td>
                      <td className="py-3 px-3 text-right text-muted text-xs">
                        {new Date(p.purchasedAt).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lịch sử nạp tiền */}
        <div className="bg-white border-3 border-pink rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="font-bold text-black">Lịch sử nạp tiền</h2>
          </div>
          <p className="text-xs text-muted mb-4">Lịch sử các giao dịch nạp xu của bạn</p>

          {loadingTransactions ? (
            <div className="py-8 text-center text-muted text-sm">Đang tải...</div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center text-black text-sm">Chưa có giao dịch nạp tiền nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-[3px] border-pink">
                    <th className="text-left py-2 px-3 text-black font-medium">Mã giao dịch</th>
                    <th className="text-left py-2 px-3 text-black font-medium">Số tiền</th>
                    <th className="text-center py-2 px-3 text-black font-medium">Số xu nhận</th>
                    <th className="text-center py-2 px-3 text-black font-medium">Trạng thái</th>
                    <th className="text-right py-2 px-3 text-black font-medium">Ngày nạp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-black/5 transition-colors">
                      <td className="py-3 px-3">
                        <span className="text-xs font-mono text-black">{t.id.slice(0, 8)}...</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-black font-medium">{t.amountMoney.toLocaleString('vi-VN')}đ</span>
                        <div className="text-[10px] text-muted">{t.paymentMethod}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-pink font-bold">+{t.amountXu} xu</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          t.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                          t.status === 'PENDING' ? 'bg-pink/10 text-pink' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {t.status === 'COMPLETED' ? 'Thành công' :
                           t.status === 'PENDING' ? 'Chờ duyệt' : 'Thất bại'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-muted text-xs">
                        {new Date(t.createdAt).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
          <Link href="/topup">
            <button className="bg-black/5 border-3 border-pink hover:bg-black/10 text-black px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
              Nạp xu 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </Link>
          <Link href="/" className="text-muted hover:text-black transition-colors text-sm font-medium ml-2">
            Trang chủ
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
