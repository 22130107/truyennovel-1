"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter, ArrowUpRight, CheckCircle2, XCircle, CreditCard, Wallet, Activity, Loader2, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Transaction {
  id: string;
  username: string;
  email: string;
  amountMoney: number;
  amountXu: number;
  paymentMethod: string;
  paymentRef: string | null;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  createdAt: string;
}

interface Summary {
  todayRevenue: number;
  todaySuccess: number;
  monthCoins: number;
}

const STATUS_LABEL: Record<string, string> = {
  COMPLETED: "Thành công",
  FAILED: "Thất bại",
  PENDING: "Đang xử lý",
  CANCELLED: "Đã huỷ",
};

const STATUS_STYLE: Record<string, string> = {
  COMPLETED: "bg-emerald-500/10 text-emerald-500",
  FAILED: "bg-red-500/10 text-red-500",
  PENDING: "bg-yellow-500/10 text-dura-5",
  CANCELLED: "bg-neutral-500/10 text-black",
};

function formatMoney(amount: number) {
  return amount.toLocaleString("vi-VN") + " VNĐ";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ todayRevenue: 0, todaySuccess: 0, monthCoins: 0 });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  const [chartData, setChartData] = useState<{date: string, rawDate: string, revenue: number}[]>([]);

  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        method,
        status,
        startDate,
        endDate,
        page: String(page),
        limit: String(limit),
      });
      const res = await fetch(`/api/admin/transactions?${params}`);
      const data = await res.json();
      setTransactions(data.transactions ?? []);
      setTotal(data.total ?? 0);
      setChartData(data.chartData ?? []);
      setSummary(data.summary ?? { todayRevenue: 0, todaySuccess: 0, monthCoins: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, method, status, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, method, status, startDate, endDate]);

  const handleSearch = () => {
    setSearch(searchInput);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Lịch sử Nạp Coin</h1>
        <p className="text-black mt-1">Lịch sử giao dịch nạp Coin từ cổng thanh toán tự động.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-dura-3 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-black text-sm font-medium">Doanh thu hôm nay</p>
              <h3 className="text-2xl font-bold text-black mt-2">
                {formatMoney(summary.todayRevenue)}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-dura-3 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-black text-sm font-medium">Giao dịch thành công hôm nay</p>
              <h3 className="text-2xl font-bold text-dura-5 mt-2">
                {summary.todaySuccess.toLocaleString("vi-VN")}{" "}
                <span className="text-sm text-black font-normal">Giao dịch</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-dura-5/10 text-dura-5">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-dura-3 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-black text-sm font-medium">Tổng Coin đã nạp (Tháng)</p>
              <h3 className="text-2xl font-bold text-black mt-2">
                {summary.monthCoins.toLocaleString("vi-VN")}{" "}
                <span className="text-sm text-black font-normal">Coin</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-dura-3 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-black">Biểu đồ doanh thu nạp coin</h2>
            <p className="text-black text-sm">Thống kê doanh thu các giao dịch thành công.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-dura-3 rounded-xl px-3 py-1.5">
              <Calendar className="w-4 h-4 text-black" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm text-black focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <span className="text-black">-</span>
            <div className="flex items-center gap-2 bg-white border border-dura-3 rounded-xl px-3 py-1.5">
              <Calendar className="w-4 h-4 text-black" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm text-black focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="date" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#737373" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${(val / 1000).toLocaleString('vi-VN')}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#262626' }}
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value.toLocaleString('vi-VN')} VNĐ`, 'Doanh thu']}
                  labelStyle={{ color: '#a3a3a3', marginBottom: '4px' }}
                />
                <Bar dataKey="revenue" fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black">
              Không có dữ liệu trong khoảng thời gian này.
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          <input
            type="text"
            placeholder="Mã giao dịch, tên người dùng, email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-white border border-dura-3 text-black rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all"
          />
        </div>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="bg-white border border-dura-3 text-black px-4 py-2.5 rounded-xl focus:outline-none focus:border-dura-5 appearance-none min-w-[150px]"
        >
          <option value="all">Tất cả cổng thanh toán</option>
          <option value="bank">Chuyển khoản</option>
          <option value="momo">Momo</option>
          <option value="zalopay">ZaloPay</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white border border-dura-3 text-black px-4 py-2.5 rounded-xl focus:outline-none focus:border-dura-5 appearance-none min-w-[150px]"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="completed">Thành công</option>
          <option value="failed">Thất bại</option>
          <option value="pending">Đang xử lý</option>
          <option value="cancelled">Đã huỷ</option>
        </select>
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 bg-white border border-dura-3 text-black px-4 py-2.5 rounded-xl hover:bg-site transition-colors"
        >
          <Filter className="w-5 h-5" />
          Lọc
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-dura-3 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-site">
                <th className="p-4 text-black font-medium text-sm">Mã GD</th>
                <th className="p-4 text-black font-medium text-sm">Người dùng</th>
                <th className="p-4 text-black font-medium text-sm">Số tiền nạp</th>
                <th className="p-4 text-black font-medium text-sm">Nhận (Coin)</th>
                <th className="p-4 text-black font-medium text-sm">Cổng thanh toán</th>
                <th className="p-4 text-black font-medium text-sm">Thời gian</th>
                <th className="p-4 text-black font-medium text-sm">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dura-3">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-black">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-black">
                    Không có giao dịch nào.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-site transition-colors">
                    <td className="p-4 font-mono text-xs text-black max-w-[120px] truncate" title={trx.id}>
                      {trx.id.slice(0, 12)}...
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-black">{trx.username}</div>
                      <div className="text-xs text-black">{trx.email}</div>
                    </td>
                    <td className="p-4 font-medium text-black">{formatMoney(trx.amountMoney)}</td>
                    <td className="p-4 font-bold text-dura-5">+{trx.amountXu.toLocaleString("vi-VN")}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-sm text-black">
                        <CreditCard className="w-4 h-4 text-black" />
                        {trx.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-black">{formatDate(trx.createdAt)}</td>
                    <td className="p-4">
                      <span
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-max ${STATUS_STYLE[trx.status] ?? "bg-neutral-500/10 text-black"}`}
                      >
                        {trx.status === "COMPLETED" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {STATUS_LABEL[trx.status] ?? trx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-dura-3 flex justify-between items-center text-sm text-black">
          <div>
            Hiển thị {total === 0 ? 0 : (page - 1) * limit + 1} -{" "}
            {Math.min(page * limit, total)} trong số {total.toLocaleString("vi-VN")} giao dịch
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-dura-3 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1.5 rounded-lg border border-dura-3 transition-colors ${
                    pageNum === page ? "bg-dura-5 text-white" : "hover:bg-slate-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-dura-3 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
