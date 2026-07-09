"use client";

import React, { useEffect, useState } from 'react';

export function InAppBrowserWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    // Detect Facebook (FBAN/FBAV), Zalo, Instagram, Messenger, TikTok, etc.
    const isFB = ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1;
    const isZalo = ua.indexOf("Zalo") > -1;
    const isInsta = ua.indexOf("Instagram") > -1;
    const isMessenger = ua.indexOf("Messenger") > -1;
    const isTikTok = ua.indexOf("TikTok") > -1;
    
    if (isFB || isZalo || isInsta || isMessenger || isTikTok) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const handleOpenBrowser = () => {
    const currentUrl = window.location.href;
    
    // Tạo thẻ a target _blank để lách luật một số trình duyệt nhúng
    const a = document.createElement('a');
    a.href = currentUrl;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Fallback: Copy link và thông báo để đảm bảo an toàn tuyệt đối
    setTimeout(() => {
      const fallbackAlert = () => alert("Vui lòng nhấn vào biểu tượng 3 chấm (...) ở góc màn hình và chọn 'Mở bằng trình duyệt' (Open in Browser) để đọc truyện.");
      
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(currentUrl).then(() => {
          alert("Hệ thống đã tự động sao chép đường dẫn web! Vui lòng thoát ra, mở Safari hoặc Chrome và dán link để đọc truyện bình thường.");
        }).catch(fallbackAlert);
      } else {
        // Fallback cho HTTP (không có SSL)
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
          alert("Hệ thống đã tự động sao chép đường dẫn web! Vui lòng thoát ra, mở Safari hoặc Chrome và dán link để đọc truyện bình thường.");
        } catch (e) {
          fallbackAlert();
        }
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1e2334] rounded-[20px] p-6 w-full max-w-sm text-center shadow-2xl flex flex-col gap-6 border border-white/10">
        <p className="text-white text-[15px] leading-relaxed font-medium mt-2">
          Đam Mỹ sẽ hoạt động tốt nhất khi được mở bằng trình duyệt trên thiết bị của bạn. Hãy nhấn nút bên dưới để tiếp tục.
        </p>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button 
            onClick={() => setShow(false)}
            className="py-3 px-4 rounded-xl border border-[#3a4154] text-white font-medium hover:bg-white/5 transition-colors"
          >
            Đóng
          </button>
          
          <button 
            onClick={handleOpenBrowser}
            className="py-3 px-4 rounded-xl bg-[#ff90aa] text-white font-semibold hover:bg-[#ff7a98] transition-colors shadow-lg shadow-[#ff90aa]/20"
          >
            Mở trình duyệt
          </button>
        </div>
      </div>
    </div>
  );
}
