"use client";
import React from 'react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-white pt-4 pr-0 pb-4 pl-0 mt-auto w-full shrink-0 border-t border-neutral-200">
      <div className="ml-auto mr-auto w-full max-w-[1536px] pt-0 pr-4 pb-0 pl-4">
        <div className="grid gap-[32px]" style={{"gridTemplateColumns":"repeat(5, minmax(0px, 1fr))"}}>
          <div className="items-center flex justify-start gap-3" style={{"gridArea":"1 / 1 / 2 / 2"}}>
            <Logo size="lg" />
            <span className="font-extrabold text-xl text-pink tracking-wide whitespace-nowrap">CÂY TRE ĐAM MỸ</span>
          </div>
          <div className="grid gap-[16px]" style={{"gridTemplateColumns":"repeat(4, minmax(0px, 1fr))","gridArea":"1 / 2 / 2 / 6"}}>
            <div className="items-center flex justify-start" style={{"gridArea":"1 / 1 / 2 / 2"}}>
              <ul>
                <li className="list-none text-black">
                  <a href="/support" className="hover:text-pink transition-colors">Trung tâm hỗ trợ</a>
                </li>
              </ul>
            </div>
            <div className="items-center flex justify-start" style={{"gridArea":"1 / 2 / 2 / 3"}}>
              <ul>
                <li className="list-none text-black">
                  <a href="https://www.facebook.com/share/1UFcSHCMsM/" target="_blank" rel="noopener noreferrer" className="hover:text-pink transition-colors">Liên hệ với chúng tôi</a>
                </li>
              </ul>
            </div>
            <div className="items-center flex justify-start" style={{"gridArea":"1 / 3 / 2 / 4"}}>
              <ul>
                <li className="list-none text-black">
                  <a href="/terms" className="hover:text-pink transition-colors">Điều khoản & Điều kiện</a>
                </li>
              </ul>
            </div>
            <div className="items-center flex justify-start" style={{"gridArea":"1 / 4 / 2 / 5"}}>
              <ul>
                <li className="list-none text-black">
                  <a href="/policy" className="hover:text-pink transition-colors">Chính sách dịch vụ</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
