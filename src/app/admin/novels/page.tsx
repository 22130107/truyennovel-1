"use client";

import { Plus, Search, Filter, Edit, Trash2, List } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminNovelsPage() {
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await fetch('/api/admin/novels');
        const data = await res.json();
        if (res.ok) {
          setNovels(data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách truyện:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  const handleDeleteNovel = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa truyện "${title}" không? Hành động này không thể hoàn tác và sẽ xóa toàn bộ chương của truyện.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/novels/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("Xóa truyện thành công!");
        setNovels(novels.filter(n => n.id !== id));
      } else {
        alert(data.message || "Xóa truyện thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa truyện:", error);
      alert("Đã xảy ra lỗi hệ thống.");
    }
  };

  const filteredNovels = novels.filter((novel) => {
    return (novel.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
           (novel.author?.toLowerCase() || "").includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Quản lý Truyện</h1>
          <p className="text-black mt-1">Quản lý toàn bộ danh sách truyện trên hệ thống.</p>
        </div>
        <Link href="/admin/novels/new" className="flex items-center justify-center gap-2 bg-dura-5 hover:bg-dura-4 text-white px-4 py-2.5 rounded-xl font-medium transition-colors w-full md:w-auto">
          <Plus className="w-5 h-5" />
          Thêm truyện mới
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tên truyện, tác giả..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-dura-3 text-black rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-dura-3 text-black px-4 py-2.5 rounded-xl hover:bg-site transition-colors">
          <Filter className="w-5 h-5" />
          Lọc danh sách
        </button>
      </div>

      {/* Novels Table */}
      <div className="bg-white border border-dura-3 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 flex justify-center items-center text-black">
              Đang tải dữ liệu...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-site">
                  <th className="p-4 text-black font-medium text-sm">Tên truyện</th>
                  <th className="p-4 text-black font-medium text-sm">Tác giả</th>
                  <th className="p-4 text-black font-medium text-sm">Số chương</th>
                  <th className="p-4 text-black font-medium text-sm">Lượt xem</th>
                  <th className="p-4 text-black font-medium text-sm">Trạng thái</th>
                  <th className="p-4 text-black font-medium text-sm">Loại</th>
                  <th className="p-4 text-black font-medium text-sm text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dura-3">
                {filteredNovels.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-black">
                      Không tìm thấy truyện nào.
                    </td>
                  </tr>
                ) : (
                  filteredNovels.map((novel) => (
                    <tr key={novel.id} className="hover:bg-site/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {novel.coverUrl ? (
                            <img src={novel.coverUrl} alt={novel.title} className="w-10 h-14 object-cover rounded-md flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-14 bg-slate-200 rounded-md flex-shrink-0 flex items-center justify-center text-xs text-black">No Img</div>
                          )}
                          <span className="text-black font-medium line-clamp-2">{novel.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-black">{novel.author}</td>
                      <td className="p-4 text-black">{novel.chapterCount || 0}</td>
                      <td className="p-4 text-black">{novel.views?.toLocaleString() || 0}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          novel.status === 'ONGOING' 
                            ? 'bg-blue-500/10 text-blue-600' 
                            : novel.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-slate-200 text-black'
                        }`}>
                          {novel.status === 'ONGOING' ? 'Đang ra' : novel.status === 'COMPLETED' ? 'Hoàn thành' : 'Tạm ngưng'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          novel.maxPrice > 0 
                            ? 'bg-dura-5/10 text-dura-5' 
                            : 'bg-slate-200 text-black'
                        }`}>
                          {novel.maxPrice > 0 ? 'Có khóa' : 'Miễn phí'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Link href={`/admin/novels/${novel.id}/chapters`} className="p-1.5 text-black hover:text-blue-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" title="Quản lý chương">
                            <List className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/novels/${novel.id}/edit`} className="p-1.5 text-black hover:text-dura-5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" title="Sửa truyện">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteNovel(novel.id, novel.title)}
                            className="p-1.5 text-black hover:text-red-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" 
                            title="Xóa truyện"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-dura-3 flex justify-between items-center text-sm text-black">
          <div>Hiển thị {filteredNovels.length} truyện</div>
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
