"use client";

import { useState, useEffect } from "react";
import { Save, Banknote, CreditCard, Building2, UserCircle2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const BANK_OPTIONS = [
  { value: "VCB",  label: "Vietcombank" },
  { value: "MB",   label: "MB Bank" },
  { value: "TCB",  label: "Techcombank" },
  { value: "BIDV", label: "BIDV" },
  { value: "VTB",  label: "VietinBank" },
  { value: "TPB",  label: "TPBank" },
  { value: "ACB",  label: "ACB" },
  { value: "VPB",  label: "VPBank" },
  { value: "STB",  label: "Sacombank" },
  { value: "MSB",  label: "MSB" },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    bank_id:       "TPB",
    bank_account:  "",
    bank_name:     "",
    exchange_rate: "1000",
    bonus_percent: "0",
  });

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Load settings từ API
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          bank_id:       data.bank_id       ?? "TPB",
          bank_account:  data.bank_account  ?? "",
          bank_name:     data.bank_name     ?? "",
          exchange_rate: data.exchange_rate ?? "1000",
          bonus_percent: data.bonus_percent ?? "0",
        });
      })
      .catch(() => showToast("error", "Không tải được cài đặt"))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast("success", "Đã lưu cài đặt thành công!");
      } else {
        showToast("error", "Lưu thất bại, thử lại.");
      }
    } catch {
      showToast("error", "Lỗi kết nối.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-[#0a0a0a] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium transition-all
          ${toast.type === "success" ? "bg-green-500/20 border border-green-500/40 text-green-300" : "bg-red-500/20 border border-red-500/40 text-red-300"}`}>
          {toast.type === "success"
            ? <CheckCircle className="w-4 h-4" />
            : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Cài đặt Hệ thống</h1>
        <p className="text-neutral-400 mt-1">Cấu hình tỷ giá quy đổi và thông tin tài khoản nhận tiền nạp.</p>
      </div>

      <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-8">

        {/* Exchange Rate */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
            <Banknote className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Tỷ giá Quy đổi (VNĐ sang Coin)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Tỷ giá mặc định</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={form.exchange_rate}
                  onChange={(e) => setForm({ ...form, exchange_rate: e.target.value })}
                  className={inputClass}
                />
                <span className="text-neutral-400 whitespace-nowrap">VNĐ = 1 Coin</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                VD: 1000 → 20.000đ = 20 coin
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Khuyến mãi nạp thêm (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.bonus_percent}
                onChange={(e) => setForm({ ...form, bonus_percent: e.target.value })}
                className={inputClass}
              />
              <p className="text-xs text-neutral-500 mt-1">
                VD: 10 → nạp 20 coin được thêm 2 coin bonus
              </p>
            </div>
          </div>
        </div>

        {/* Bank Account */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
            <CreditCard className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Thông tin Nhận tiền (Chủ sở hữu)</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Ngân hàng thụ hưởng
                </label>
                <select
                  value={form.bank_id}
                  onChange={(e) => setForm({ ...form, bank_id: e.target.value })}
                  className={inputClass + " appearance-none"}
                >
                  {BANK_OPTIONS.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Số tài khoản
                </label>
                <input
                  type="text"
                  value={form.bank_account}
                  onChange={(e) => setForm({ ...form, bank_account: e.target.value })}
                  placeholder="VD: 08040125109"
                  className={inputClass + " font-mono"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2 flex items-center gap-2">
                <UserCircle2 className="w-4 h-4" />
                Tên chủ tài khoản
              </label>
              <input
                type="text"
                value={form.bank_name}
                onChange={(e) => setForm({ ...form, bank_name: e.target.value.toUpperCase() })}
                placeholder="VD: TRINH HUU HUYNH"
                className={inputClass + " uppercase"}
              />
              <p className="text-xs text-neutral-500 mt-1">Nhập IN HOA, đúng tên trên tài khoản ngân hàng</p>
            </div>

            {/* Preview QR */}
            {form.bank_account && form.bank_name && (
              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
                <p className="text-xs text-neutral-400 mb-3 font-medium uppercase tracking-wider">Xem trước QR mẫu</p>
                <div className="flex items-center gap-4">
                  <img
                    src={`https://img.vietqr.io/image/${form.bank_id}-${form.bank_account}-compact2.png?amount=20000&addInfo=PREVIEW&accountName=${encodeURIComponent(form.bank_name)}`}
                    alt="QR Preview"
                    className="w-28 h-28 rounded-lg bg-white p-1"
                  />
                  <div className="text-sm space-y-1">
                    <p className="text-neutral-400">Ngân hàng: <span className="text-white font-medium">{BANK_OPTIONS.find(b => b.value === form.bank_id)?.label}</span></p>
                    <p className="text-neutral-400">Số TK: <span className="text-white font-mono">{form.bank_account}</span></p>
                    <p className="text-neutral-400">Chủ TK: <span className="text-white">{form.bank_name}</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-black px-6 py-3 rounded-xl font-medium transition-colors"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Đang lưu..." : "Lưu cài đặt"}
          </button>
        </div>
      </div>
    </div>
  );
}
