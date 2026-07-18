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
    const newPrice = newIsPaid ? 1 : 0;
    
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
          <Link href="/admin/novels" className="p-2 hover:bg-white rounded-xl transition-colors text-black">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Quản lý Chương</h1>
            <p className="text-black mt-1">
              Truyện: <span className="text-dura-5 font-medium">{novelData?.title || 'Đang tải...'} (ID: {novelId})</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href={`/admin/novels/${novelId}/chapters/new`}
            className="flex items-center gap-2 bg-white border border-dura-3 text-black px-4 py-2.5 rounded-xl font-medium hover:bg-site transition-colors text-sm"
          >
            <Plus className="w-5 h-5" />
            Nhập hàng loạt từ Word
          </Link>
          <Link 
            href={`/admin/novels/${novelId}/chapters/new`}
            className="flex items-center gap-2 bg-dura-5 hover:bg-dura-4 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm chương mới
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          <input 
            type="text" 
            placeholder="Tìm kiếm chương (VD: Chương 1, Trọng sinh...)" 
            className="w-full bg-white border border-dura-3 text-black rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all"
          />
        </div>
        <select className="bg-white border border-dura-3 text-black px-4 py-2.5 rounded-xl focus:outline-none focus:border-dura-5 appearance-none min-w-[150px]">
          <option value="all">Tất cả (Khóa/Mở)</option>
          <option value="free">Đang mở</option>
          <option value="paid">Đã khóa</option>
        </select>
        <button className="flex items-center gap-2 bg-white border border-dura-3 text-black px-4 py-2.5 rounded-xl hover:bg-site transition-colors">
          <Filter className="w-5 h-5" />
          Lọc danh sách
        </button>
      </div>

      {/* Chapters Table */}
      <div className="bg-white border border-dura-3 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-site">
                <th className="p-4 text-black font-medium text-sm w-16">Chương</th>
                <th className="p-4 text-black font-medium text-sm">Tên chương</th>
                <th className="p-4 text-black font-medium text-sm text-center">Khóa chương</th>
                <th className="p-4 text-black font-medium text-sm">Lượt xem</th>
                <th className="p-4 text-black font-medium text-sm">Trạng thái</th>
                <th className="p-4 text-black font-medium text-sm">Ngày đăng</th>
                <th className="p-4 text-black font-medium text-sm text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dura-3">
              {chapters.map((chapter) => (
                <tr key={chapter.id} className="hover:bg-site/50 transition-colors">
                  <td className="p-4 text-black font-medium text-center">{chapter.number}</td>
                  <td className="p-4">
                    <span className="text-black font-medium">{chapter.title}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => togglePaidStatus(chapter)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${chapter.isPaid ? 'bg-dura-5' : 'bg-slate-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${chapter.isPaid ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      {chapter.isPaid ? (
                        <div className="text-dura-5 text-sm min-w-[80px] text-center ml-2 font-medium">Đã khóa</div>
                      ) : (
                        <div className="text-black text-sm min-w-[80px] text-center ml-2">Mở</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-black">{chapter.views.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      chapter.status === 'Published' 
                        ? 'bg-emerald-500/10 text-emerald-600' 
                        : 'bg-slate-200 text-black'
                    }`}>
                      {chapter.status === 'Published' ? 'Đã đăng' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="p-4 text-black text-sm">{chapter.date}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Link
                        href={`/admin/novels/${novelId}/chapters/${chapter.id}/edit`}
                        className="p-1.5 text-black hover:text-dura-5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                        className="p-1.5 text-black hover:text-red-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
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
        <div className="p-4 border-t border-dura-3 flex justify-between items-center text-sm text-black">
          <div>Tổng cộng: {chapters.length} chương</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-dura-3 bg-white hover:bg-site transition-colors disabled:opacity-50">Trước</button>
            <button className="px-3 py-1.5 rounded-lg border border-dura-5 bg-dura-5 text-white transition-colors">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-dura-3 bg-white hover:bg-site transition-colors disabled:opacity-50">Tiếp</button>
          </div>
        </div>
      </div>
    </div>
  );
}
