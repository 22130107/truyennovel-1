"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Coins,
  Settings,
  LogOut,
  Menu,
  Link2,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/login");
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (user.role !== "ADMIN") {
          router.push("/"); // Redirect normal users
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra quyền truy cập", error);
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-site flex items-center justify-center text-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-dura-5 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-black">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Quản lý Truyện", href: "/admin/novels", icon: BookOpen },
    { name: "Người dùng", href: "/admin/users", icon: Users },
    { name: "Liên kết Affiliate", href: "/admin/affiliate-links", icon: Link2 },
    { name: "Cài đặt", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-site text-black font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-dura-3 fixed top-0 left-0 h-screen z-30">
        <div className="h-16 flex items-center px-6 border-b border-dura-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-dura-5">Cây Tre Đam Mỹ</span>
            <span className="text-xs bg-dura-2 text-dura-5 px-2 py-0.5 rounded-full">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-dura-5 text-white shadow-md shadow-dura-5/20 font-medium"
                    : "text-black hover:bg-site"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-black"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dura-3">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-black hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <header className="md:hidden h-16 flex items-center justify-between px-4 border-b border-dura-3 bg-white">
          <Link href="/admin" className="text-xl font-bold text-dura-5">
            Cây Tre Đam Mỹ Admin
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-site text-black"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <nav className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-dura-3 z-50 px-4 py-4 space-y-2 shadow-lg">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-dura-5 text-white font-medium"
                      : "text-black hover:bg-site"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-black"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}

        <main className="flex-1 bg-site p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
