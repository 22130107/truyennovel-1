"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

import { Logo } from '@/components/home/Logo';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  const handleSocialLogin = (provider: "google" | "facebook") => {
    signIn(provider, { callbackUrl: "/" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        alert(`Lỗi: ${result.error}`);
      } else {
        if (remember) {
          localStorage.setItem('rememberedUser', identifier);
        } else {
          localStorage.removeItem('rememberedUser');
        }

        router.replace('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      alert('Đã xảy ra lỗi kết nối đến máy chủ.');
    }
  };

  return (
    <div className="min-h-screen bg-site flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[rgb(192,132,252)]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 hover:scale-105 transition-transform duration-300">
            <Logo size="xl" />
          </Link>
          <h2 className="text-3xl font-bold mt-6 text-black tracking-tight">Chào mừng trở lại!</h2>
          <p className="text-muted mt-2 text-sm">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {/* Login Card */}
        <div className="bg-white backdrop-blur-xl border border-pink/30 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Email hoặc Tên đăng nhập</label>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ví dụ: nguyenvana hoặc email@gmail.com"
                required
                className="w-full bg-white border-2 border-pink rounded-xl px-4 py-3 text-black focus:border-pink focus:ring-1 focus:ring-pink focus:outline-none transition-all"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-black">Mật khẩu</label>
                <a href="#" className="text-sm text-pink hover:text-pink/80 hover:underline transition-colors">Quên mật khẩu?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white border-2 border-pink rounded-xl px-4 py-3 text-black focus:border-pink focus:ring-1 focus:ring-pink focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-white text-pink focus:ring-pink focus:ring-offset-white" 
              />
              <label htmlFor="remember" className="ml-2 text-sm text-muted">Ghi nhớ đăng nhập</label>
            </div>

            <button 
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-pink to-pink text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(233,30,145,0.3)]"
            >
              Đăng Nhập
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-neutral-300 flex-1" />
            <span className="text-xs text-muted">hoặc</span>
            <div className="h-px bg-neutral-300 flex-1" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="w-full flex items-center justify-center gap-3 bg-white text-neutral-900 font-semibold py-3 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.687 32.657 29.239 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.843 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.268 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.654 16.163 19.037 12 24 12c3.059 0 5.843 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.268 4 24 4 16.318 4 9.656 8.064 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.146 0 9.86-1.977 13.409-5.192l-6.191-5.238C29.174 35.091 26.715 36 24 36c-5.218 0-9.655-3.324-11.285-7.962l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.78 2.198-2.26 4.066-4.085 5.571l.003-.002 6.191 5.238C36.98 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              Tiếp tục với Google
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-black text-sm">
          Chưa có tài khoản? <Link href="/register" className="text-pink font-bold hover:text-pink/80 hover:underline transition-colors">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
