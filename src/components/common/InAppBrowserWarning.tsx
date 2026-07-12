"use client";

import React, { useEffect, useState } from 'react';

export function InAppBrowserWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || "").toLowerCase();
    
    // Detect Facebook (fban/fbav), Zalo, Instagram, Messenger, TikTok, etc.
    const isFB = ua.indexOf("fban") > -1 || ua.indexOf("fbav") > -1;
    const isZalo = ua.indexOf("zalo") > -1;
    const isInsta = ua.indexOf("instagram") > -1;
    const isMessenger = ua.indexOf("messenger") > -1 || ua.indexOf("fb_iab") > -1;
    const isTikTok = ua.indexOf("tiktok") > -1;
    
    if (isFB || isZalo || isInsta || isMessenger || isTikTok) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const handleOpenBrowser = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentUrl = window.location.href;
    const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || "").toLowerCase();
    
    const isAndroid = ua.indexOf("android") > -1;
    const isIOS = /ipad|iphone|ipod/.test(ua);

    if (isAndroid) {
      // Android: Dùng Intent để ép mở Google Chrome
      const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = intentUrl;
    } else if (isIOS) {
      // iOS: Thử ép mở bằng Google Chrome nếu máy có cài
      const chromeUrl = `googlechrome://${currentUrl.replace(/^https?:\/\//, '')}`;
      window.location.href = chromeUrl;
    }
    
    // Luôn có một Fallback (dự phòng) chạy sau 0.8 giây
    // Nếu điện thoại không hỗ trợ nhảy tab (vd: iPhone không cài Chrome), nó sẽ tự động copy link
    setTimeout(() => {
      const fallbackAlert = () => alert("Vui lòng nhấn vào biểu tượng 3 chấm (...) ở góc màn hình và chọn 'Mở bằng trình duyệt' (Open in Browser) để đọc truyện.");
      
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(currentUrl).then(() => {
          alert("Hệ thống đã sao chép đường dẫn! Vui lòng mở trình duyệt (Safari/Chrome) ở ngoài màn hình chính và dán link vào để đọc truyện bình thường.");
        }).catch(fallbackAlert);
      } else {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = currentUrl;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert("Hệ thống đã sao chép đường dẫn! Vui lòng mở trình duyệt (Safari/Chrome) ở ngoài màn hình chính và dán link vào để đọc truyện bình thường.");
        } catch (err) {
          fallbackAlert();
        }
      }
    }, 800);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100000] bg-slate-900 w-full px-4 py-3 flex flex-col items-center justify-center border-b border-white/10 shadow-2xl">
      <p className="text-slate-200 text-sm text-center max-w-2xl leading-relaxed">
        Truyện Hot sẽ hoạt động tốt nhất khi được mở bằng trình duyệt trên thiết bị của bạn. Hãy nhấn nút bên dưới để tiếp tục.
      </p>
      
      <div className="flex items-center gap-3 mt-3">
        <button 
          type="button"
          onClick={() => setShow(false)}
          className="py-1.5 px-8 rounded-lg border border-white/20 text-slate-200 text-sm font-medium hover:bg-white/5 transition-colors"
        >
          Đóng
        </button>
        
        <button 
          type="button"
          onClick={handleOpenBrowser}
          className="py-1.5 px-8 rounded-lg bg-pink-400 text-white text-sm font-medium hover:bg-pink-500 transition-colors shadow-sm"
        >
          Mở trình duyệt
        </button>
      </div>
    </div>
  );
}
