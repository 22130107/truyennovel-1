"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Filter, Edit, Trash2, Coins, Loader2, Check } from "lucide-react";
import { useParams } from "next/navigation";

export default function AdminChaptersPage() {
  const params = useParams();
  const novelId = params.id as string;
  
  const [chapters, setChapters] = useState<any[]>([]);
  const [novelData, setNovelData] = useState<{title: string, id: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/novels/${novelId}/chapters`);
        const data = await res.json();
        if (res.ok) {
          setNovelData(data.novel);
          setChapters(data.chapters);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch chapters:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [novelId]);

  const togglePaidStatus = async (chapter: any) => {
    const newIsPaid = !chapter.isPaid;
    const newPrice = newIsPaid ? 50 : 0;
    
    // Optimistic UI update
    setChapters(chapters.map(ch => ch.id === chapter.id ? { ...ch, isPaid: newIsPaid, price: newPrice } : ch));

    // API Call
    try {
      await fetch(`/api/admin/novels/${novelId}/chapters/${chapter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLocked: newIsPaid, price: newPrice })
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật thu phí:", err);
    }
  };

  const updatePrice = (chapterId: string, newPrice: number) => {
    setChapters(chapters.map(ch => ch.id === chapterId ? { ...ch, price: newPrice } : ch));
  };

  const savePriceToDB = async (chapter: any) => {
    try {
      const res = await fetch(`/api/admin/novels/${novelId}/chapters/${chapter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLocked: chapter.isPaid, price: chapter.price })
      });
      if (res.ok) {
        alert("Đã lưu giá mới thành công!");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật giá:", err);
    }
  };

  const handleDeleteChapter = async (chapterId: string, chapterTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa chương "${chapterTitle}" không?`)) return;
    try {
      const res = await fetch(`/api/admin/novels/${novelId}/chapters/${chapterId}`, { method: 'DELETE' });
      if (res.ok) {
        setChapters(chapters.filter(ch => ch.id !== chapterId));
      } else {
        alert("Xóa thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi xóa chương:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/novels" className="p-2 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Quản lý Chương</h1>
            <p className="text-neutral-400 mt-1">
              Truyện: <span className="text-yellow-400 font-medium">{novelData?.title || 'Đang tải...'} (ID: {novelId})</span>
            </p>
          </div>
        </div>
        <Link 
          href={`/admin/novels/${novelId}/chapters/new`}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm chương mới
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm chương (VD: Chương 1, Trọng sinh...)" 
            className="w-full bg-[#111] border border-neutral-800 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all"
          />
        </div>
        <select className="bg-[#111] border border-neutral-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-400 appearance-none min-w-[150px]">
          <option value="all">Tất cả thu phí</option>
          <option value="free">Miễn phí</option>
          <option value="paid">Trả phí (Coin)</option>
        </select>
        <button className="flex items-center gap-2 bg-[#111] border border-neutral-800 text-white px-4 py-2.5 rounded-xl hover:bg-neutral-900 transition-colors">
          <Filter className="w-5 h-5" />
          Lọc danh sách
        </button>
      </div>

      {/* Chapters Table */}
      <div className="bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-900/50">
                <th className="p-4 text-neutral-400 font-medium text-sm w-16">Chương</th>
                <th className="p-4 text-neutral-400 font-medium text-sm">Tên chương</th>
                <th className="p-4 text-neutral-400 font-medium text-sm text-center">Thu phí (Coin)</th>
                <th className="p-4 text-neutral-400 font-medium text-sm">Lượt xem</th>
                <th className="p-4 text-neutral-400 font-medium text-sm">Trạng thái</th>
                <th className="p-4 text-neutral-400 font-medium text-sm">Ngày đăng</th>
                <th className="p-4 text-neutral-400 font-medium text-sm text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {chapters.map((chapter) => (
                <tr key={chapter.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="p-4 text-neutral-400 font-medium text-center">{chapter.number}</td>
                  <td className="p-4">
                    <span className="text-white font-medium">{chapter.title}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => togglePaidStatus(chapter)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${chapter.isPaid ? 'bg-yellow-400' : 'bg-neutral-700'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${chapter.isPaid ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      {chapter.isPaid ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-[#0a0a0a] border border-yellow-400/30 px-2 py-1 rounded-md min-w-[80px] focus-within:border-yellow-400 transition-colors">
                            <Coins className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <input 
                              type="number" 
                              value={chapter.price}
                              onChange={(e) => updatePrice(chapter.id, parseInt(e.target.value) || 0)}
                              className="w-12 bg-transparent text-yellow-400 font-bold focus:outline-none text-center text-sm"
                            />
                          </div>
                          <button 
                            onClick={() => savePriceToDB(chapter)}
                            title="Lưu giá"
                            className="p-1.5 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-md transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-neutral-500 text-sm min-w-[80px] text-center ml-2">Miễn phí</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-neutral-300">{chapter.views.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      chapter.status === 'Published' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {chapter.status === 'Published' ? 'Đã đăng' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-400 text-sm">{chapter.date}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Link
                        href={`/admin/novels/${novelId}/chapters/${chapter.id}/edit`}
                        className="p-1.5 text-neutral-400 hover:text-yellow-400 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-neutral-800 flex justify-between items-center text-sm text-neutral-400">
          <div>Tổng cộng: {chapters.length} chương</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-colors disabled:opacity-50">Trước</button>
            <button className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-800 text-white transition-colors">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-colors disabled:opacity-50">Tiếp</button>
          </div>
        </div>
      </div>
    </div>
  );
}
