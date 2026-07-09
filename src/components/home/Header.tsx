"use client";
import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import { Logo } from './Logo';

export function Header() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const user = session?.user as any;

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isGenresOpen, setIsGenresOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [genres, setGenres] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const timeout = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/novels/search?q=${encodeURIComponent(searchQuery.trim())}&limit=5`)
        .then(r => r.json())
        .then(data => {
          setSearchResults(data.novels?.slice(0, 5) || []);
          setShowDropdown(true);
        })
        .catch(() => {})
        .finally(() => setIsSearching(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    // Fetch genres từ DB
    fetch("/api/genres")
      .then((r) => r.json())
      .then((data: { name: string }[]) => setGenres(data.map((g) => g.name)))
      .catch(() => setGenres([]));

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <>
      <header className={`fixed left-0 top-0 right-0 transition-all duration-300 z-[999] py-1 ${
        isScrolled ? 'bg-site/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="w-full px-4 md:px-8">
          <div className="items-center flex justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-black/10 text-black hover:bg-black/20 transition-all active:scale-90"
                aria-label="Open Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              <Link href="/" className="items-center flex transition-opacity">
                <Logo size="custom" customSize="w-24 h-12 md:w-32 md:h-16" />
              </Link>
            </div>
            
            <div className="hidden md:flex items-center flex-wrap mr-auto ml-[16px] gap-[8px]">
              {/* Genres Dropdown */}
              <div className="relative group">
                <button className="flex items-center text-center bg-transparent text-black pt-2 pr-4 pb-2 pl-4 rounded-md hover:bg-black/5 transition-colors font-medium">
                  Thể Loại
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-1 group-hover:rotate-180 transition-transform">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-[60]">
                  <div className="bg-white border-2 border-pink rounded-xl shadow-2xl p-6 w-[700px]">
                    <div className="grid grid-cols-4 gap-x-8 gap-y-3">
                      {genres.map((genre) => (
                        <Link key={genre} 
                          href={`/category/${genre}`} 
                          className="text-black hover:text-pink transition-colors text-sm py-1"
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://www.facebook.com/share/1UFcSHCMsM/"
                target="_blank"
                rel="noopener noreferrer"
                className="items-center flex text-black pt-2 pr-4 pb-2 pl-4 rounded-md hover:bg-black/5 transition-colors font-medium"
              >
                Fanpage
              </a>
            </div>

            <div className="items-center flex gap-2">
              <div className="hidden lg:block grow relative text-black">
                <div className="relative" ref={searchRef}>
                  <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) window.location.href = `/browse?q=${encodeURIComponent(searchQuery.trim())}`; else window.location.href = '/browse'; }}>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                    onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
                    placeholder="Tìm kiếm ..." 
                    className="border flex overflow-clip w-48 xl:w-72 h-10 bg-white border-neutral-400 text-[14px] leading-[20px] pt-2 pr-12 pb-2 pl-5 rounded-md focus:border-pink focus:outline-none transition-colors" 
                  />
                  <button type="submit" className="items-center flex font-medium justify-center overflow-hidden absolute text-center whitespace-nowrap h-8 top-[50%] right-1 bg-pink hover:bg-pink/80 text-white text-[14px] gap-[8px] leading-[20px] pt-0 pr-2 pb-0 pl-2 translate-y-[-50%] rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </button>
                  </form>

                  {/* Dropdown Kết quả */}
                  {showDropdown && searchQuery.trim() && (
                    <div className="absolute top-full mt-2 w-full xl:w-[350px] right-0 bg-white border-2 border-pink rounded-lg shadow-2xl overflow-hidden z-[9999]">
                      {isSearching ? (
                        <div className="p-4 text-center text-black text-sm">Đang tìm kiếm...</div>
                      ) : searchResults.length > 0 ? (
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                          {searchResults.map((novel) => (
                            <Link 
                              key={novel.id} 
                              href={`/novel/${novel.slug || novel.id}`}
                              onClick={() => { setShowDropdown(false); setSearchQuery(""); }}
                              className="flex gap-3 p-3 hover:bg-black/5 transition-colors border-b border-pink/30 last:border-0"
                            >
                              <img src={novel.coverUrl || '/placeholder.png'} alt={novel.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                              <div className="flex-1 overflow-hidden">
                                <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">{novel.title}</h4>
                                <p className="text-xs text-black mt-1 truncate">{novel.author}</p>
                                <div className="text-[10px] text-black mt-1">{novel.chapterCount} chương</div>
                              </div>
                            </Link>
                          ))}
                          <Link 
                            href={`/browse?q=${encodeURIComponent(searchQuery.trim())}`}
                            onClick={() => setShowDropdown(false)}
                            className="block text-center p-3 text-sm font-medium text-pink hover:bg-black/5 transition-colors border-t border-pink/30"
                          >
                            Xem tất cả kết quả
                          </Link>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-black text-sm">Không tìm thấy truyện nào.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile Search Icon */}
              <button className="lg:hidden text-black p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              
              <Link href="/library" className="hidden md:block">
                <button className="items-center flex font-medium justify-center overflow-hidden relative text-center whitespace-nowrap h-10 bg-transparent text-black text-[14px] px-4 rounded-md hover:bg-black/5 transition-colors">
                  Thư viện
                </button>
              </Link>
              
              {isLoggedIn ? (
                <div className="relative group">
                  <button
                    onClick={() => setIsUserMenuOpen((open) => !open)}
                    aria-expanded={isUserMenuOpen}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-black/5 transition-colors"
                  >
                    <img 
                      src="/logo.png" 
                      className="w-10 h-10 rounded-full border-[2px] border-pink" 
                      alt="User" 
                    />
                  </button>
                  <div
                    className={`absolute right-0 top-full pt-2 opacity-0 invisible translate-y-2 transition-all duration-300 z-[9999] md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0 ${
                      isUserMenuOpen ? "opacity-100 visible translate-y-0" : ""
                    }`}
                  >
                    <div className="bg-white border-2 border-pink rounded-lg shadow-2xl w-64 overflow-hidden">
                      {/* User Info Section */}
                      <div className="p-4 border-b-[2px] border-pink">
                        <div className="font-bold text-black text-lg">{user ? (user.name || user.username) : 'Người dùng'}</div>
                        <div className="text-black text-xs truncate">{user ? user.email : ''}</div>
                      </div>
                      
                      {/* Menu Links */}
                      <div className="p-2">
                        <Link
                          href="/library"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-4 px-3 py-2.5 text-black hover:text-black hover:bg-black/5 rounded-md transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                          <span className="text-sm">Thư viện của tôi</span>
                        </Link>
                        
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-4 px-3 py-2.5 text-black hover:text-black hover:bg-black/5 rounded-md transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          <span className="text-sm">Trang cá nhân</span>
                        </Link>
                        
                      </div>
                      
                      {/* Logout */}
                      <div className="p-2 border-t-[2px] border-pink">
                        <button
                          onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}
                          className="flex items-center gap-4 w-full px-3 py-2.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                          </svg>
                          <span className="text-sm font-bold">Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <button className="items-center inline-flex font-bold justify-center h-10 bg-pink text-white text-sm px-6 rounded-lg hover:bg-pink/80 transition-colors">
                    Đăng nhập
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-[10000] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div 
          className="absolute inset-0 bg-site/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div 
          className={`absolute inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b-[2px] border-pink flex justify-between items-center bg-white">
              <Logo size="md" />
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 text-black hover:text-black hover:bg-black/10 transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
              <div className="space-y-3">
                <h3 className="text-black uppercase text-xs font-bold tracking-widest">Menu</h3>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-medium text-gray-800 py-2">Trang chủ</Link>
                <Link href="/library" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-medium text-gray-800 py-2">Thư viện</Link>
                {isLoggedIn && (
                  <>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-medium text-gray-800 py-2">Trang cá nhân</Link>
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} 
                      className="block text-lg font-bold text-red-500 py-2 w-full text-left"
                    >
                      Đăng xuất
                    </button>
                  </>
                )}
                {!isLoggedIn && (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-pink py-2">Đăng nhập / Đăng ký</Link>
                )}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setIsGenresOpen(!isGenresOpen)}
                  className="flex items-center justify-between w-full text-black uppercase text-xs font-bold tracking-widest hover:text-gray-700 transition-colors"
                >
                  <span>Thể loại</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className={`w-4 h-4 transition-transform duration-300 ${isGenresOpen ? 'rotate-180' : ''}`}
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className={`grid grid-cols-2 gap-2 overflow-hidden transition-all duration-300 ${isGenresOpen ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
                  {genres.map((genre) => (
                    <Link key={genre} 
                      href={`/category/${genre}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm text-black hover:text-pink transition-colors py-2 px-2 rounded-md hover:bg-black/5"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t-[2px] border-pink bg-white">
              <a
                href="https://www.facebook.com/share/1UFcSHCMsM/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-black hover:text-[#1877F2] font-medium p-2 transition-colors rounded-md hover:bg-black/5"
              >
                <svg className="w-5 h-5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Fanpage
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
