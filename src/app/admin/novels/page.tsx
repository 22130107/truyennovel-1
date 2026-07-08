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
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Quản lý Truyện</h1>
          <p className="text-neutral-400 mt-1">Quản lý toàn bộ danh sách truyện trên hệ thống.</p>
        </div>
        <Link href="/admin/novels/new" className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2.5 rounded-xl font-medium transition-colors w-full md:w-auto">
          <Plus className="w-5 h-5" />
          Thêm truyện mới
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tên truyện, tác giả..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-neutral-800 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#111] border border-neutral-800 text-white px-4 py-2.5 rounded-xl hover:bg-neutral-900 transition-colors">
          <Filter className="w-5 h-5" />
          Lọc danh sách
        </button>
      </div>

      {/* Novels Table */}
      <div className="bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 flex justify-center items-center text-neutral-400">
              Đang tải dữ liệu...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/50">
                  <th className="p-4 text-neutral-400 font-medium text-sm">Tên truyện</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm">Tác giả</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm">Số chương</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm">Lượt xem</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm">Trạng thái</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm">Loại</th>
                  <th className="p-4 text-neutral-400 font-medium text-sm text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredNovels.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-500">
                      Không tìm thấy truyện nào.
                    </td>
                  </tr>
                ) : (
                  filteredNovels.map((novel) => (
                    <tr key={novel.id} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {novel.coverUrl ? (
                            <img src={novel.coverUrl} alt={novel.title} className="w-10 h-14 object-cover rounded-md flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-14 bg-neutral-800 rounded-md flex-shrink-0 flex items-center justify-center text-xs text-gray-500">No Img</div>
                          )}
                          <span className="text-white font-medium line-clamp-2">{novel.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-400">{novel.author}</td>
                      <td className="p-4 text-neutral-300">{novel.chapterCount || 0}</td>
                      <td className="p-4 text-neutral-300">{novel.views?.toLocaleString() || 0}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          novel.status === 'ONGOING' 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : novel.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-neutral-500/10 text-neutral-500'
                        }`}>
                          {novel.status === 'ONGOING' ? 'Đang ra' : novel.status === 'COMPLETED' ? 'Hoàn thành' : 'Tạm ngưng'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          novel.maxPrice > 0 
                            ? 'bg-yellow-500/10 text-yellow-500' 
                            : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {novel.maxPrice > 0 ? 'Trả phí' : 'Miễn phí'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Link href={`/admin/novels/${novel.id}/chapters`} className="p-1.5 text-neutral-400 hover:text-blue-400 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors" title="Quản lý chương">
                            <List className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/novels/${novel.id}/edit`} className="p-1.5 text-neutral-400 hover:text-yellow-400 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors" title="Sửa truyện">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteNovel(novel.id, novel.title)}
                            className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors" 
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
        <div className="p-4 border-t border-neutral-800 flex justify-between items-center text-sm text-neutral-400">
          <div>Hiển thị {filteredNovels.length} truyện</div>
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
