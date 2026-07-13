"use client";

import { Save, ArrowLeft, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminAddChapterPage() {
  const params = useParams();
  const router = useRouter();
  const novelId = params.id as string;

  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState<number | "">("");
  const [content, setContent] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChapter = async () => {
    if (!content || chapterNumber === "") {
      alert("Vui lòng nhập Số chương và Nội dung!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/novels/${novelId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          chapterNumber: Number(chapterNumber),
          isLocked,
          price: isLocked ? 1 : 0
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Thêm chương thành công!");
        router.push(`/admin/novels/${novelId}/chapters`);
      } else {
        alert(data.message || "Có lỗi xảy ra khi thêm chương.");
      }
    } catch (error) {
      console.error("Save chapter error:", error);
      alert("Đã xảy ra lỗi hệ thống.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/novels/${novelId}/chapters`} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-black">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Thêm chương mới</h1>
          <p className="text-black mt-1">Đăng tải nội dung chương mới cho truyện của bạn.</p>
        </div>
      </div>

      <div className="bg-white border border-dura-3 rounded-2xl p-6 md:p-8">
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black">Số chương <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                placeholder="VD: 1, 2, 3..."
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-white border border-dura-3 text-black rounded-xl px-4 py-3 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-black">Tên chương <span className="text-black text-xs">(không bắt buộc)</span></label>
              <input 
                type="text" 
                placeholder="Nhập tên chương..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-dura-3 text-black rounded-xl px-4 py-3 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-black mb-3">Cài đặt khóa chương</label>
              <div className="flex flex-wrap items-center gap-6 bg-white p-4 rounded-xl border border-dura-3">
                <div className="flex items-center gap-3">
                  <span className="text-black text-sm">Khóa chương này?</span>
                  <button 
                    onClick={() => setIsLocked(!isLocked)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isLocked ? 'bg-dura-5' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLocked ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-black">Nội dung chương <span className="text-red-500">*</span></label>
              <div>
                <input 
                  type="file" 
                  accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                  className="hidden" 
                  id="word-import"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    try {
                      const mammoth = (await import('mammoth')).default;
                      const { parseWordHtmlToText } = await import('@/lib/parseWordContent');
                      const arrayBuffer = await file.arrayBuffer();
                      const result = await mammoth.convertToHtml({ arrayBuffer });
                      setContent(parseWordHtmlToText(result.value));
                    } catch (err) {
                      console.error('Lỗi đọc file Word:', err);
                      alert('Không thể đọc nội dung file Word này.');
                    }
                    
                    e.target.value = ''; // Reset input
                  }}
                />
                <label 
                  htmlFor="word-import"
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-black rounded-lg cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Nhập từ file Word
                </label>
              </div>
            </div>
            <textarea 
              rows={20}
              placeholder="Nhập nội dung chương truyện..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white border border-dura-3 text-black rounded-xl px-4 py-4 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all custom-scrollbar leading-relaxed"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-dura-3 flex justify-end gap-4">
            <Link href={`/admin/novels/${novelId}/chapters`} className="px-6 py-3 rounded-xl border border-dura-3 text-black font-medium hover:bg-slate-200 transition-colors">
              Hủy bỏ
            </Link>
            <button 
              onClick={handleSaveChapter}
              disabled={isSaving}
              className="flex items-center gap-2 bg-dura-5 hover:bg-dura-4 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? "Đang lưu..." : "Đăng chương"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
