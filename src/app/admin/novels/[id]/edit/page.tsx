"use client";

import { Save, ArrowLeft, Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminEditNovelPage() {
  const params = useParams();
  const router = useRouter();
  const novelId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState(["Tiên hiệp", "Kiếm hiệp", "Huyền huyễn", "Đô thị", "Ngôn tình", "Xuyên không", "Dị giới", "Võng du", "Khoa huyễn", "Lịch sử", "Đam Mỹ", "Trọng sinh", "Xuyên nhanh", "Mạt thế", "Hệ thống", "Nữ cường"]);
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const [coverUrl, setCoverUrl] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverFit, setCoverFit] = useState<"cover" | "contain">("cover");
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [posterUrl, setPosterUrl] = useState("");
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [posterFit, setPosterFit] = useState<"cover" | "contain">("cover");
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editor, setEditor] = useState("");
  const [status, setStatus] = useState("ONGOING");
  const [description, setDescription] = useState("");
  const [comboPrice, setComboPrice] = useState<number | "">("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const res = await fetch(`/api/admin/novels/${novelId}`);
        const data = await res.json();
        if (res.ok) {
          setTitle(data.title || "");
          setAuthor(data.author || "");
          setEditor(data.editor || "");
          setStatus(data.status || "ONGOING");
          setDescription(data.description || "");
          setCoverUrl(data.coverUrl || "");
          setPosterUrl(data.posterUrl || "");
          setSelectedCategories(data.categories || []);
          if (data.categories) {
            setAvailableCategories(prev => {
              const newCats = [...prev];
              data.categories.forEach((c: string) => {
                if (!newCats.includes(c)) newCats.push(c);
              });
              return newCats;
            });
          }
          setComboPrice(data.comboPrice ?? "");
        } else {
          alert(data.message || "Không thể tải dữ liệu truyện");
          router.push('/admin/novels');
        }
      } catch (error) {
        console.error("Lỗi khi tải truyện:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNovel();
  }, [novelId, router]);

  const handleFileUpload = async (file: File, setUrl: (url: string) => void, setUploading: (state: boolean) => void) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });
      
      const data = await uploadRes.json();
      
      if (uploadRes.ok && data.secure_url) {
        setUrl(data.secure_url);
      } else {
        alert("Tải ảnh thất bại: " + (data.error || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Lỗi khi tải ảnh lên máy chủ:", error);
      alert("Đã xảy ra lỗi khi tải ảnh lên: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file, setCoverUrl, setUploadingCover);
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file, setPosterUrl, setUploadingPoster);
  };

  const handleSaveNovel = async () => {
    if (!title || !author) {
      alert("Vui lòng nhập Tên truyện và Tác giả!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/novels/${novelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          editor,
          status,
          description,
          coverUrl,
          posterUrl,
          categories: selectedCategories,
          comboPrice: comboPrice === "" ? null : Number(comboPrice),
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Cập nhật truyện thành công!");
        router.push("/admin/novels");
      } else {
        alert(data.message || "Có lỗi xảy ra khi cập nhật truyện.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Đã xảy ra lỗi hệ thống.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-dura-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/novels" className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-black">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Sửa thông tin truyện</h1>
          <p className="text-black mt-1">Cập nhật nội dung cho truyện {title || 'đang chọn'}.</p>
        </div>
      </div>

      <div className="bg-white border border-dura-3 rounded-2xl p-6 md:p-8">
        <div className="space-y-8">
          
          {/* General Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black pb-2 border-b border-dura-3">Thông tin chung</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">Tên truyện <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Nhập tên truyện..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-dura-3 text-black rounded-xl px-4 py-3 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">Tác giả <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Nhập tên tác giả..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-white border border-dura-3 text-black rounded-xl px-4 py-3 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Người dịch
                  <span className="text-black text-xs font-normal ml-2">(không bắt buộc)</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên người dịch..."
                  value={editor}
                  onChange={(e) => setEditor(e.target.value)}
                  className="w-full bg-white border border-dura-3 text-black rounded-xl px-4 py-3 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="block text-sm font-medium text-black">Thể loại <span className="text-black text-xs font-normal ml-1">(Chọn nhiều)</span></label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedCategories.includes(cat) 
                          ? 'bg-dura-5 text-white shadow-md' 
                          : 'bg-slate-200 text-black hover:bg-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  
                  {isAddingCustomCategory ? (
                    <input 
                      type="text"
                      autoFocus
                      placeholder="Nhập thể loại..."
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      onBlur={() => {
                        setIsAddingCustomCategory(false);
                        const val = customCategoryInput.trim();
                        if (val) {
                          if (!availableCategories.includes(val)) setAvailableCategories([...availableCategories, val]);
                          if (!selectedCategories.includes(val)) setSelectedCategories([...selectedCategories, val]);
                        }
                        setCustomCategoryInput("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setIsAddingCustomCategory(false);
                          const val = customCategoryInput.trim();
                          if (val) {
                            if (!availableCategories.includes(val)) setAvailableCategories([...availableCategories, val]);
                            if (!selectedCategories.includes(val)) setSelectedCategories([...selectedCategories, val]);
                          }
                          setCustomCategoryInput("");
                        }
                      }}
                      className="px-3 py-1 rounded-lg text-sm bg-white border border-yellow-400 text-black focus:outline-none w-36"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomCategory(true)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-slate-200 text-black hover:bg-slate-300 border border-dashed border-neutral-600"
                    >
                      + Khác
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">Trạng thái</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white border border-dura-3 text-black rounded-xl px-4 py-3 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all appearance-none"
                >
                  <option value="ONGOING">Đang ra</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="PAUSED">Tạm dừng</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Giá combo cả bộ (xu)
                  <span className="text-black text-xs font-normal ml-2">— để trống = tự động giảm 30%</span>
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="VD: 200"
                  value={comboPrice}
                  onChange={(e) => setComboPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-white border border-dura-3 text-dura-5 font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-black">Tóm tắt / Giới thiệu</label>
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
                        setDescription(parseWordHtmlToText(result.value));
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
                rows={5}
                placeholder="Nhập tóm tắt nội dung truyện..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-dura-3 text-black rounded-xl px-4 py-3 focus:outline-none focus:border-dura-5 focus:ring-1 focus:ring-dura-5/50 transition-all custom-scrollbar"
              ></textarea>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black pb-2 border-b border-dura-3">Hình ảnh (Thumbnail & Poster)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Thumbnail */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-black">Ảnh đại diện (Thumbnail - Dọc)</label>
                <div className="flex gap-4">
                  <div className="w-24 h-36 bg-slate-200 rounded-lg flex items-center justify-center border border-neutral-700 flex-shrink-0 overflow-hidden relative">
                    {coverUrl ? (
                      <img src={coverUrl} alt="Cover" className="w-full h-full" style={{ objectFit: coverFit }} />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-black" />
                    )}
                    {uploadingCover && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {/* Toggle fit button */}
                    {coverUrl && (
                      <button
                        type="button"
                        onClick={() => setCoverFit(f => f === "cover" ? "contain" : "cover")}
                        title={coverFit === "cover" ? "Đang cắt vừa khung — nhấn để hiện toàn ảnh" : "Đang hiện toàn ảnh — nhấn để cắt vừa khung"}
                        className="absolute bottom-1 right-1 bg-black/70 hover:bg-black text-black rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors"
                      >
                        {coverFit === "cover" ? "Cắt" : "Vừa"}
                      </button>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={coverInputRef}
                      onChange={handleImageUpload}
                    />
                    <div 
                      onClick={() => !uploadingCover && coverInputRef.current?.click()}
                      className={`border border-dashed border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center bg-white transition-colors cursor-pointer group ${uploadingCover ? 'opacity-50 cursor-not-allowed' : 'hover:bg-site'}`}
                    >
                      <UploadCloud className={`w-5 h-5 mb-2 ${uploadingCover ? 'text-black' : 'text-black group-hover:text-black'}`} />
                      <p className="text-black text-xs text-center">{uploadingCover ? 'Đang tải lên...' : 'Tải ảnh lên máy chủ (Tối đa 5MB)'}</p>
                    </div>
                    <input 
                      type="text" 
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      placeholder="Hoặc dán URL ảnh trực tiếp..."
                      className="w-full bg-white border border-dura-3 text-black rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-dura-5 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Poster */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-black">Ảnh nền (Poster - Ngang)</label>
                <div className="flex flex-col gap-4">
                  <div className="w-full h-36 bg-slate-200 rounded-lg flex items-center justify-center border border-neutral-700 overflow-hidden relative">
                    {posterUrl ? (
                      <img src={posterUrl} alt="Poster" className="w-full h-full" style={{ objectFit: posterFit }} />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-black" />
                    )}
                    {uploadingPoster && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {/* Toggle fit button */}
                    {posterUrl && (
                      <button
                        type="button"
                        onClick={() => setPosterFit(f => f === "cover" ? "contain" : "cover")}
                        title={posterFit === "cover" ? "Đang cắt vừa khung — nhấn để hiện toàn ảnh" : "Đang hiện toàn ảnh — nhấn để cắt vừa khung"}
                        className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-black rounded px-2 py-1 text-[11px] font-medium transition-colors"
                      >
                        {posterFit === "cover" ? "Cắt" : "Vừa"}
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={posterInputRef}
                      onChange={handlePosterUpload}
                    />
                    <div 
                      onClick={() => !uploadingPoster && posterInputRef.current?.click()}
                      className={`flex-1 border border-dashed border-neutral-700 rounded-xl p-2.5 flex items-center justify-center gap-2 bg-white transition-colors cursor-pointer group ${uploadingPoster ? 'opacity-50 cursor-not-allowed' : 'hover:bg-site'}`}
                    >
                      <UploadCloud className={`w-4 h-4 ${uploadingPoster ? 'text-black' : 'text-black group-hover:text-black'}`} />
                      <p className="text-black text-xs">{uploadingPoster ? 'Đang tải lên...' : 'Tải lên'}</p>
                    </div>
                    <input 
                      type="text" 
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      placeholder="Hoặc dán URL ảnh trực tiếp..."
                      className="flex-[2] bg-white border border-dura-3 text-black rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-dura-5 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="pt-6 border-t border-dura-3 flex justify-end gap-4">
            <Link href="/admin/novels" className="px-6 py-3 rounded-xl border border-dura-3 text-black font-medium hover:bg-slate-200 transition-colors">
              Hủy bỏ
            </Link>
            <button 
              onClick={handleSaveNovel}
              disabled={isSaving}
              className="flex items-center gap-2 bg-dura-5 hover:bg-dura-4 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? "Đang lưu..." : "Cập nhật truyện"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
