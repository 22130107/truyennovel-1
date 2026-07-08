"use client";
import React, { useEffect, useState, useRef } from "react";

interface CommentUser {
  id: string;
  username: string;
  avatarUrl: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: CommentUser;
}

interface CommentSectionProps {
  novelId: string;
  chapterNumber: number;
}

function getUser(): { id: string; username: string; avatarUrl?: string } | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

export function CommentSection({ novelId, chapterNumber }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentUser = typeof window !== "undefined" ? getUser() : null;

  useEffect(() => {
    if (!novelId || !chapterNumber) return;
    setLoading(true);
    fetch(`/api/novels/${novelId}/chapters/${chapterNumber}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [novelId, chapterNumber]);

  const handleSubmit = async () => {
    const user = getUser();
    if (!user) { setError("Bạn cần đăng nhập để bình luận"); return; }
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/novels/${novelId}/chapters/${chapterNumber}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, content: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Lỗi gửi bình luận"); return; }
      setComments((prev) => [data, ...prev]);
      setText("");
    } catch {
      setError("Lỗi kết nối");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    const user = getUser();
    if (!user) return;
    await fetch(`/api/novels/${novelId}/chapters/${chapterNumber}/comments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, commentId }),
    });
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div className="ml-auto mr-auto w-full max-w-6xl px-4 md:px-10 pt-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        <h2 className="font-semibold text-[20px] leading-[28px]">
          Bình luận
          {!loading && <span className="ml-2 text-sm font-normal text-black">({comments.length})</span>}
        </h2>
      </div>

      {/* Input */}
      <div className="mb-6">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="shrink-0 w-9 h-9 rounded-full bg-neutral-700 overflow-hidden flex items-center justify-center">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-black">
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            )}
          </div>

          <div className="flex-1">
            <textarea
              ref={textareaRef}
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(); }}
              placeholder={currentUser ? "Viết bình luận của bạn... (Ctrl+Enter để gửi)" : "Đăng nhập để bình luận"}
              disabled={!currentUser || submitting}
              className="w-full bg-white border-2 border-pink text-black text-[14px] leading-[20px] px-3 py-2.5 rounded-xl resize-none focus:outline-none focus:border-pink transition-colors disabled:opacity-50 placeholder:text-black"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmit}
                disabled={!currentUser || !text.trim() || submitting}
                className="flex items-center gap-2 bg-pink hover:bg-pink/80 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-bold px-4 py-2 rounded-lg transition-all"
              >
                {submitting ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                  </svg>
                )}
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-neutral-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-neutral-800 rounded w-24" />
                <div className="h-4 bg-neutral-800 rounded w-full" />
                <div className="h-4 bg-neutral-800 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-black py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              {/* Avatar */}
              <div className="shrink-0 w-9 h-9 rounded-full bg-neutral-700 overflow-hidden flex items-center justify-center">
                {comment.user.avatarUrl ? (
                  <img src={comment.user.avatarUrl} alt={comment.user.username} className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-black">
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[14px] text-black">{comment.user.username}</span>
                  <span className="text-black text-[12px]">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-black text-[14px] leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
              </div>

              {/* Xóa (chỉ hiện với chủ comment) */}
              {currentUser?.id === comment.user.id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-black hover:text-red-400 shrink-0 self-start mt-0.5"
                  title="Xóa bình luận"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
