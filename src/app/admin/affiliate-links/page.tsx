"use client";
import { useState, useEffect } from "react";
import { Plus, Link2, ExternalLink, ToggleLeft, ToggleRight, Trash2, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface AffiliateLink {
  id: string;
  url: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminAffiliateLinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [form, setForm] = useState({ url: "" });

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/admin/affiliate-links");
      const data = await res.json();
      setLinks(data);
    } catch {
      showToast("error", "Không tải được danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleCreate = async () => {
    if (!form.url) {
      showToast("error", "Vui lòng nhập URL");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/affiliate-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast("success", "Đã thêm link affiliate");
        setForm({ url: "" });
        setShowForm(false);
        fetchLinks();
      } else {
        showToast("error", "Thêm thất bại");
      }
    } catch {
      showToast("error", "Lỗi kết nối");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (link: AffiliateLink) => {
    try {
      await fetch(`/api/admin/affiliate-links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !link.isActive }),
      });
      setLinks(links.map(l => l.id === link.id ? { ...l, isActive: !l.isActive } : l));
    } catch {
      showToast("error", "Cập nhật thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa link affiliate này?")) return;
    try {
      const res = await fetch(`/api/admin/affiliate-links/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLinks(links.filter(l => l.id !== id));
        showToast("success", "Đã xóa");
      }
    } catch {
      showToast("error", "Xóa thất bại");
    }
  };

  const inputClass = "w-full bg-[#0a0a0a] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all";

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-yellow-400 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium transition-all ${
          toast.type === "success" ? "bg-green-500/20 border border-green-500/40 text-green-300" : "bg-red-500/20 border border-red-500/40 text-red-300"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Liên kết Affiliate</h1>
          <p className="text-neutral-400 mt-1">Quản lý các link affiliate để người dùng click mở khóa chương</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2.5 rounded-xl font-medium transition-colors w-full md:w-auto"
        >
          <Plus className="w-5 h-5" />
          Thêm link
        </button>
      </div>

      {showForm && (
        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Thêm link affiliate mới</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">URL Affiliate</label>
              <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." className={inputClass} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-white px-4 py-2 text-sm">Hủy</button>
            <button onClick={handleCreate} disabled={saving} className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-black px-6 py-2 rounded-xl font-medium transition-colors">
              {saving ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-900/50">
                <th className="p-4 text-neutral-400 font-medium text-sm">Tiêu đề</th>
                <th className="p-4 text-neutral-400 font-medium text-sm">URL</th>
                <th className="p-4 text-neutral-400 font-medium text-sm text-center">Kích hoạt</th>
                <th className="p-4 text-neutral-400 font-medium text-sm text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {links.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-neutral-500">Chưa có link affiliate nào</td></tr>
              ) : (
                links.map(link => (
                  <tr key={link.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="p-4"><span className="text-white font-medium">{link.title}</span></td>
                    <td className="p-4">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline text-sm flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {link.url.substring(0, 40)}...
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleActive(link)} className="mx-auto">
                        {link.isActive ? <ToggleRight className="w-6 h-6 text-green-400" /> : <ToggleLeft className="w-6 h-6 text-neutral-500" />}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(link.id)} className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
