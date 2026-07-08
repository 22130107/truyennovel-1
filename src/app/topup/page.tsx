"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";

const BASE_PACKAGES = [
  { id: 1, name: "Gói nhỏ",      priceNum: 20000,  popular: false },
  { id: 2, name: "Gói vừa",      priceNum: 50000,  popular: true  },
  { id: 3, name: "Gói lớn",      priceNum: 100000, popular: false },
  { id: 4, name: "Gói siêu lớn", priceNum: 200000, popular: false },
];

function calcPackages(exchangeRate: number, bonusPercent: number) {
  return BASE_PACKAGES.map((pkg) => {
    const baseCoins  = Math.floor(pkg.priceNum / exchangeRate);
    const bonusCoins = Math.floor(baseCoins * bonusPercent / 100);
    return {
      ...pkg,
      coins: baseCoins + bonusCoins,
      bonus: bonusCoins,
      price: pkg.priceNum.toLocaleString("vi-VN") + "đ",
    };
  });
}

type PaymentStatus = "idle" | "loading" | "pending" | "completed" | "failed" | "cancelled";

interface PaymentInfo {
  transactionId: string;
  paymentRef: string;
  amount: number;
  coins: number;
  qrUrl: string;
  bankId: string;
  accountNumber: string;
  accountName: string;
  expiredAt: string;
}

type TopupPackage = ReturnType<typeof calcPackages>[0];

export default function TopupPage() {
  // Lấy userId từ localStorage (được lưu khi đăng nhập)
  const [userId, setUserId] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState<number>(0);

  // Packages tính theo settings DB
  const [packages, setPackages] = useState<TopupPackage[]>(() => calcPackages(1000, 0));

  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<TopupPackage | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); // giây còn lại
  const [errorMsg, setErrorMsg] = useState<string>("");

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Đọc user từ localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setUserId(u.id ?? null);
        setUserCoins(u.coins ?? 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch settings từ DB để tính giá đúng
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const rate   = parseInt(data.exchange_rate ?? "1000", 10) || 1000;
        const bonus  = parseInt(data.bonus_percent ?? "0",    10) || 0;
        setPackages(calcPackages(rate, bonus));
      })
      .catch(() => { /* fallback về mặc định */ });
  }, []);

  // Dọn dẹp interval khi unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Polling kiểm tra trạng thái giao dịch
  const startPolling = useCallback((transactionId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${transactionId}`);
        const data = await res.json();

        if (data.status === "COMPLETED") {
          clearInterval(pollingRef.current!);
          clearInterval(countdownRef.current!);
          setStatus("completed");
          // Cập nhật coins trong localStorage
          try {
            const raw = localStorage.getItem("user");
            if (raw) {
              const u = JSON.parse(raw);
              u.coins = (u.coins ?? 0) + data.amountXu;
              localStorage.setItem("user", JSON.stringify(u));
              setUserCoins(u.coins);
            }
          } catch { /* ignore */ }
        } else if (data.status === "FAILED" || data.status === "CANCELLED") {
          clearInterval(pollingRef.current!);
          clearInterval(countdownRef.current!);
          setStatus(data.status === "FAILED" ? "failed" : "cancelled");
        }
      } catch {
        // Bỏ qua lỗi mạng tạm thời, tiếp tục polling
      }
    }, 5000); // kiểm tra mỗi 5 giây
  }, []);

  // Đếm ngược thời gian hết hạn
  const startCountdown = useCallback((expiredAt: string) => {
    if (countdownRef.current) clearInterval(countdownRef.current);

    const update = () => {
      const remaining = Math.max(0, Math.floor((new Date(expiredAt).getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(countdownRef.current!);
        // Nếu vẫn đang pending thì chuyển sang cancelled
        setStatus((prev) => (prev === "pending" ? "cancelled" : prev));
      }
    };

    update();
    countdownRef.current = setInterval(update, 1000);
  }, []);

  const handleSelectPackage = async (pkg: TopupPackage) => {
    if (!userId) {
      setErrorMsg("login_required");
      return;
    }

    setErrorMsg("");
    setSelectedPkg(pkg);
    setStatus("loading");
    setPaymentInfo(null);

    // Dừng polling/countdown cũ nếu có
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("failed");
        setErrorMsg(data.error || "Không thể tạo đơn thanh toán.");
        return;
      }

      setPaymentInfo(data);
      setStatus("pending");
      startPolling(data.transactionId);
      startCountdown(data.expiredAt);
    } catch {
      setStatus("failed");
      setErrorMsg("Lỗi kết nối. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setStatus("idle");
    setPaymentInfo(null);
    setSelectedPkg(null);
    setErrorMsg("");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-site text-black">
      <Header />

      <main className="pt-24 pb-16 px-4 md:px-8 max-w-[1920px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-pink">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-2xl font-bold">Nạp xu</h1>
            </div>
            <p className="text-muted text-sm ml-9">Dùng xu để mở khóa chương và ủng hộ tác giả</p>
          </div>

          <div className="flex items-center gap-2 bg-pink/10 px-4 py-2 rounded-full border border-pink/20">
            <div className="w-2 h-2 rounded-full bg-pink animate-pulse"></div>
            <span className="text-black text-sm">
              Số xu hiện có:{" "}
              <span className="text-pink font-bold">{userCoins} xu</span>
            </span>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2 flex-wrap">
            {errorMsg === "login_required" ? (
              <>
                Bạn cần{" "}
                <Link href="/login" className="underline font-bold text-red-300 hover:text-white transition-colors">
                  đăng nhập
                </Link>
                {" "}trước khi nạp xu.
              </>
            ) : (
              errorMsg
            )}
          </div>
        )}

        {/* QR Payment Modal */}
        {(status === "pending" || status === "completed" || status === "failed" || status === "cancelled") && paymentInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-site/80 backdrop-blur-sm px-4">
            <div className="bg-white border-2 border-pink rounded-2xl p-6 w-full max-w-md shadow-2xl">

              {/* PENDING: hiển thị QR */}
              {status === "pending" && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Quét mã QR để thanh toán</h2>
                    <button onClick={handleCancel} className="text-black hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* QR Image */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-3 rounded-xl">
                      <Image
                        src={paymentInfo.qrUrl}
                        alt="VietQR"
                        width={220}
                        height={220}
                        className="rounded-lg"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Thông tin chuyển khoản */}
                  <div className="bg-gray-200/60 rounded-xl p-4 space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted">Ngân hàng</span>
                      <span className="font-semibold">{paymentInfo.bankId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Số tài khoản</span>
                      <span className="font-semibold font-mono">{paymentInfo.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Chủ tài khoản</span>
                      <span className="font-semibold">{paymentInfo.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Số tiền</span>
                      <span className="font-bold text-pink">
                        {paymentInfo.amount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-muted">Nội dung CK</span>
                      <span className="font-bold text-green-400 font-mono text-right">
                        {paymentInfo.paymentRef}
                      </span>
                    </div>
                  </div>

                  {/* Cảnh báo nội dung */}
                  <div className="bg-pink/10 border border-pink/20 rounded-lg px-3 py-2 text-xs text-pink mb-4">
                    ⚠️ Nhập <strong>đúng nội dung chuyển khoản</strong> để hệ thống tự động xác nhận.
                  </div>

                  {/* Đếm ngược */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Hết hạn sau</span>
                    <span className={`font-mono font-bold text-lg ${timeLeft < 60 ? "text-red-400" : "text-white"}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>

                  {/* Đang chờ xác nhận */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-black">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    Đang chờ xác nhận thanh toán...
                  </div>
                </>
              )}

              {/* COMPLETED */}
              {status === "completed" && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-green-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-green-400 mb-2">Thanh toán thành công!</h2>
                  <p className="text-black text-sm mb-1">
                    Bạn đã nhận được <span className="text-pink font-bold">{paymentInfo.coins} xu</span>
                  </p>
                  <p className="text-muted text-xs mb-6">Xu đã được cộng vào tài khoản của bạn.</p>
                  <button
                    onClick={handleCancel}
                    className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-xl transition-all"
                  >
                    Đóng
                  </button>
                </div>
              )}

              {/* FAILED */}
              {status === "failed" && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-red-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-red-400 mb-2">Thanh toán thất bại</h2>
                  <p className="text-muted text-sm mb-6">Số tiền không khớp hoặc có lỗi xảy ra.</p>
                  <button onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-black font-bold px-6 py-2.5 rounded-xl transition-all">
                    Thử lại
                  </button>
                </div>
              )}

              {/* CANCELLED */}
              {status === "cancelled" && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-black">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-black mb-2">Đơn đã hết hạn</h2>
                  <p className="text-muted text-sm mb-6">Vui lòng tạo đơn mới để tiếp tục.</p>
                  <button onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-black font-bold px-6 py-2.5 rounded-xl transition-all">
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white border rounded-2xl p-6 transition-all hover:translate-y-[-4px] shadow-xl ${
                pkg.popular ? "border-2 border-pink ring-1 ring-pink" : "border-2 border-pink"
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4 bg-pink text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  Phổ biến
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-pink">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-black">{pkg.name}</h3>
              </div>

              <div className="mb-6">
                <p className="text-black text-xs mb-1">
                  Nhận <span className="text-pink font-bold">{pkg.coins} xu</span>
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black">{pkg.price}</span>
                </div>
                {pkg.bonus > 0 ? (
                  <div className="mt-3 inline-block bg-green-500/10 text-green-400 text-[11px] font-bold px-3 py-1 rounded-full border border-green-500/20">
                    +{pkg.bonus} xu khuyến mãi
                  </div>
                ) : (
                  <div className="mt-3 text-3xl opacity-0">0</div>
                )}
              </div>

              <button
                onClick={() => handleSelectPackage(pkg)}
                disabled={status === "loading"}
                className="w-full bg-[rgb(208,203,203)] hover:bg-white text-neutral-900 font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" && selectedPkg?.id === pkg.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Đang tạo...
                  </span>
                ) : (
                  "Nạp ngay"
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Hướng dẫn thanh toán */}
        <div className="bg-white border-2 border-pink rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-xl font-bold mb-4">Hướng dẫn nạp xu qua chuyển khoản</h2>
          <ol className="space-y-4 text-sm text-black">
            <li className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-pink/20 text-pink flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">1</span>
              <span>
                <Link href="/login" className="font-bold text-pink underline hover:text-pink/80 transition-colors">Đăng nhập</Link>
                {" "}tài khoản của bạn (nếu chưa có,{" "}
                <Link href="/register" className="font-bold text-pink underline hover:text-pink/80 transition-colors">đăng ký tại đây</Link>)
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-pink/20 text-pink flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">2</span>
              <span>
                Vào trang{" "}
                <Link href="/topup" className="font-bold text-pink underline hover:text-pink/80 transition-colors">Nạp xu</Link>
                , chọn gói bạn muốn và nhấn <strong>"Nạp ngay"</strong>
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-pink/20 text-pink flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">3</span>
              Quét mã QR bằng app ngân hàng hoặc chuyển khoản thủ công theo thông tin hiển thị
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-pink/20 text-pink flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">4</span>
              <span>Nhập <strong className="text-pink">đúng nội dung chuyển khoản</strong> (mã hiển thị trên màn hình) — hệ thống tự động xác nhận trong vài giây</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-pink/20 text-pink flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">5</span>
              Xu được cộng ngay vào tài khoản sau khi giao dịch được xác nhận
            </li>
          </ol>
        </div>

        {/* Missions Section */}
        <div className="bg-white border-2 border-pink rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold mb-6">Nhiệm vụ nhận xu</h2>
          <p className="text-muted text-sm mb-8 italic">Bạn sẽ nhận được xu khi thực hiện các nhiệm vụ sau</p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center shrink-0 text-xs font-bold border border-black/10">1</div>
              <p className="text-black text-sm leading-relaxed pt-1.5">
                Theo dõi Fanpage Facebook
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center shrink-0 text-xs font-bold border border-black/10">2</div>
              <p className="text-black text-sm leading-relaxed pt-1.5">Chụp màn hình đã follow</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center shrink-0 text-xs font-bold border border-black/10">3</div>
              <p className="text-black text-sm leading-relaxed pt-1.5">
                Gửi ảnh kèm theo gmail (đăng ký tài khoản tại web) về Fanpage Facebook
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-pink/30 space-y-4">
              <p className="text-muted text-xs font-bold uppercase tracking-wider">Lưu ý:</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink"></div>
                  Hoàn thành nhiệm vụ, mỗi lượt follow bạn sẽ nhận được{" "}
                  <span className="text-pink font-bold ml-1">5 xu</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink"></div>
                  Mỗi email chỉ nhận được tối đa{" "}
                  <span className="text-pink font-bold mx-1">10 xu</span> cho nhiệm vụ này
                </li>
                <li className="flex items-center gap-3 text-sm text-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink"></div>
                  Vì số lượng người đọc đang quá tải, mà admin phải duyệt thủ công, bạn vui lòng đợi trong vòng 24h
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
