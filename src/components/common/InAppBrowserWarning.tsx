"use client";

import React, { useEffect, useState } from 'react';

export function InAppBrowserWarning() {
  const [show, setShow] = useState(false);
  const [linkRef, setLinkRef] = useState("");

  useEffect(() => {
    const currentUrl = window.location.href;
    const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || "").toLowerCase();
    
    // Detect Facebook (fban/fbav), Zalo, Instagram, Messenger, TikTok, etc.
    const isFB = ua.indexOf("fban") > -1 || ua.indexOf("fbav") > -1;
    const isZalo = ua.indexOf("zalo") > -1;
    const isInsta = ua.indexOf("instagram") > -1;
    const isMessenger = ua.indexOf("messenger") > -1 || ua.indexOf("fb_iab") > -1;
    const isTikTok = ua.indexOf("tiktok") > -1;
    
    if (isFB || isZalo || isInsta || isMessenger || isTikTok || window.location.search.includes("debug=true")) {
      setShow(true);
    }

    const isAndroid = ua.indexOf("android") > -1;
    const isIOS = /ipad|iphone|ipod/.test(ua);

    // Xử lý tạo link ép chuyển app
    if (isAndroid) {
      setLinkRef(`intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`);
    } else if (isIOS) {
      setLinkRef(`googlechromes://${currentUrl.replace(/^https?:\/\//, '')}`);
    } else {
      setLinkRef(currentUrl);
    }
  }, []);

  if (!show) return null;

  const handleFallback = () => {
    const currentUrl = window.location.href;
    setTimeout(() => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(currentUrl).catch(() => {});
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
        } catch (err) {}
      }
    }, 1500); // Đợi 1.5s, nếu không chuyển app được thì copy ngầm
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100000] bg-site w-full px-4 py-3 flex flex-col items-center justify-center border-b border-dura-3 shadow-md">
      <p className="text-black text-sm text-center max-w-2xl leading-relaxed">
        Cây Tre Đam Mỹ sẽ hoạt động tốt nhất khi được mở bằng trình duyệt trên thiết bị của bạn. Hãy nhấn nút bên dưới để tiếp tục.
      </p>
      
      <div className="flex items-center gap-3 mt-3">
        <button 
          type="button"
          onClick={() => setShow(false)}
          className="py-1.5 px-8 rounded-lg border border-dura-5 text-dura-5 text-sm font-medium hover:bg-dura-2 transition-colors"
        >
          Đóng
        </button>
        
        <a 
          href={linkRef}
          target="_blank"
          onClick={handleFallback}
          className="py-1.5 px-8 rounded-lg bg-dura-5 text-white text-sm font-medium hover:bg-dura-4 transition-colors shadow-sm inline-block"
        >
          Mở trình duyệt
        </a>
      </div>
    </div>
  );
}
