"use client";

import { Save, ArrowLeft, UploadCloud, FileText, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface BatchChapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string;
  fileName: string;
}

export default function AdminAddChapterPage() {
  const params = useParams();
  const router = useRouter();
  const novelId = params.id as string;

  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState<number | "">("");
  const [content, setContent] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastChapterNumber, setLastChapterNumber] = useState(0);

  const [batchChapters, setBatchChapters] = useState<BatchChapter[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isBatchSaving, setIsBatchSaving] = useState(false);
  const [batchResult, setBatchResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const fetchLastChapter = async () => {
      try {
        const res = await fetch(`/api/admin/novels/${novelId}/chapters`);
        const data = await res.json();
        if (res.ok && data.chapters?.length > 0) {
          const maxNum = Math.max(...data.chapters.map((ch: any) => ch.number));
          setLastChapterNumber(maxNum);
        }
      } catch (err) {
        console.error("Failed to fetch last chapter number:", err);
      }
    };
    fetchLastChapter();
  }, [novelId]);

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

  const extractChapterInfo = (fileName: string): { number: number | null; title: string } => {
    const name = fileName.replace(/\.(docx|doc)$/i, '').trim();

    // Pattern: "Chương 1 - Tiêu đề" or "Chương 1 Tiêu đề"
    let match = name.match(/^Chương\s+(\d+)[\s\-–—]*[:\s\-–—]*(.*)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      const rawTitle = match[2]?.trim() || "";
      return { number: num, title: rawTitle };
    }

    // Pattern: "Chapter 1 - Title" or "Chapter 1: Title"
    match = name.match(/^[Cc]hapter\s+(\d+)[\s\-–—:]*\s*(.*)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      const rawTitle = match[2]?.trim() || "";
      return { number: num, title: rawTitle };
    }

    // Pattern: "1 - Tiêu đề" or "1 Tiêu đề"
    match = name.match(/^(\d+)[\s\-–—:.]*\s*(.*)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      const rawTitle = match[2]?.trim() || "";
      return { number: num, title: rawTitle };
    }

    return { number: null, title: "" };
  };

  const handleBatchWordImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsParsing(true);
    setBatchChapters([]);
    setBatchResult(null);

    const mammoth = (await import('mammoth')).default;
    const { parseWordHtmlToText } = await import('@/lib/parseWordContent');

    const parsed: BatchChapter[] = [];

    const sortedFiles = Array.from(files).sort((a, b) => a.name.localeCompare(b.name));

    let nextNumber = lastChapterNumber + 1;

    for (const file of sortedFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const textContent = parseWordHtmlToText(result.value);

        if (!textContent.trim()) continue;

        const info = extractChapterInfo(file.name);

        parsed.push({
          id: crypto.randomUUID?.() || Math.random().toString(36),
          chapterNumber: nextNumber,
          title: info.title,
          content: textContent,
          fileName: file.name,
        });

        nextNumber++;
      } catch (err) {
        console.error(`Lỗi đọc file ${file.name}:`, err);
      }
    }

    if (parsed.length === 0) {
      alert("Không thể đọc nội dung từ các file Word đã chọn.");
    } else {
      setBatchChapters(parsed);
    }

    e.target.value = '';
    setIsParsing(false);
  };

  const updateBatchChapter = (id: string, field: 'chapterNumber' | 'title', value: string | number) => {
    setBatchChapters(prev =>
      prev.map(ch => (ch.id === id ? { ...ch, [field]: value } : ch))
    );
  };

  const removeBatchChapter = (id: string) => {
    setBatchChapters(prev => prev.filter(ch => ch.id !== id));
  };

  const handleBatchSave = async () => {
    if (batchChapters.length === 0) return;

    const invalid = batchChapters.find(ch => ch.chapterNumber <= 0);
    if (invalid) {
      alert(`Chương "${invalid.fileName}" có số chương không hợp lệ. Vui lòng kiểm tra lại.`);
      return;
    }

    setIsBatchSaving(true);
    setBatchResult(null);

    try {
      const res = await fetch(`/api/admin/novels/${novelId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapters: batchChapters.map(ch => ({
            title: ch.title,
            content: ch.content,
            chapterNumber: ch.chapterNumber,
            isLocked: false,
            price: 0,
          }))
        })
      });

      const data = await res.json();
      if (res.ok) {
        setBatchResult({ success: true, message: data.message });
        setBatchChapters([]);
      } else {
        setBatchResult({ success: false, message: data.message || "Có lỗi xảy ra." });
      }
    } catch (error) {
      console.error("Batch save error:", error);
      setBatchResult({ success: false, message: "Đã xảy ra lỗi hệ thống." });
    } finally {
      setIsBatchSaving(false);
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

      {/* Single Chapter Form */}
      <div className="bg-white border border-dura-3 rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-black mb-6">Thêm một chương</h2>
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
                    
                    e.target.value = '';
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

      {/* Batch Import Section */}
      <div className="bg-white border border-dura-3 rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-black">Nhập hàng loạt từ Word</h2>
            <p className="text-sm text-black mt-1">Chọn nhiều file .docx để thêm nhiều chương cùng lúc.</p>
          </div>
          <div>
            <input 
              type="file" 
              multiple
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              className="hidden" 
              id="batch-word-import"
              onChange={handleBatchWordImport}
            />
            <label 
              htmlFor="batch-word-import"
              className="flex items-center gap-2 bg-dura-5 hover:bg-dura-4 text-white px-4 py-2.5 rounded-xl font-medium cursor-pointer transition-colors text-sm"
            >
              <UploadCloud className="w-4 h-4" />
              Chọn nhiều file Word
            </label>
          </div>
        </div>

        {isParsing && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-dura-5 animate-spin" />
            <span className="ml-3 text-black">Đang đọc nội dung file Word...</span>
          </div>
        )}

        {batchResult && (
          <div className={`flex items-center gap-2 p-4 rounded-xl mb-4 ${batchResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {batchResult.success ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm">{batchResult.message}</span>
          </div>
        )}

        {batchChapters.length > 0 && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-dura-3 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-site">
                    <th className="p-3 text-black font-medium text-sm w-12">STT</th>
                    <th className="p-3 text-black font-medium text-sm w-24">Số chương</th>
                    <th className="p-3 text-black font-medium text-sm">Tên chương</th>
                    <th className="p-3 text-black font-medium text-sm">File</th>
                    <th className="p-3 text-black font-medium text-sm w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dura-3">
                  {batchChapters.map((ch, idx) => (
                    <tr key={ch.id} className="hover:bg-site/50 transition-colors">
                      <td className="p-3 text-black text-center text-sm">{idx + 1}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={ch.chapterNumber}
                          onChange={(e) => updateBatchChapter(ch.id, 'chapterNumber', e.target.value === "" ? 0 : Number(e.target.value))}
                          className="w-20 bg-white border border-dura-3 text-black rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-dura-5"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) => updateBatchChapter(ch.id, 'title', e.target.value)}
                          placeholder="Tên chương"
                          className="w-full bg-white border border-dura-3 text-black rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-dura-5"
                        />
                      </td>
                      <td className="p-3 text-black text-sm">{ch.fileName}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeBatchChapter(ch.id)}
                          className="p-1.5 text-black hover:text-red-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setBatchChapters([])}
                className="px-4 py-2 rounded-xl border border-dura-3 text-black font-medium hover:bg-slate-200 transition-colors text-sm"
              >
                Xóa tất cả
              </button>
              <button
                onClick={handleBatchSave}
                disabled={isBatchSaving}
                className="flex items-center gap-2 bg-dura-5 hover:bg-dura-4 text-white px-5 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 text-sm"
              >
                {isBatchSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu tất cả ({batchChapters.length} chương)
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
