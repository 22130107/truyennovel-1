"use client";
import React, { useEffect, useState } from "react";

interface RatingFormProps {
  novelId: string;
  onRated?: () => void;
}

export function RatingForm({ novelId, onRated }: RatingFormProps) {
  const [selected, setSelected]   = useState<number>(0); // điểm đã chọn
  const [hovered, setHovered]     = useState<number>(0); // điểm đang hover
  const [comment, setComment]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]     = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [existing, setExisting]   = useState<number | null>(null); // rating cũ của user

  // Lấy rating cũ nếu đã đăng nhập
  useEffect(() => {
    if (!novelId) return;
    try {
      const raw = localStorage.getItem("user");
      const userId = raw ? JSON.parse(raw).id : null;
      if (!userId) return;
      fetch(`/api/novels/${novelId}/rating?userId=${userId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.score) {
            setSelected(data.score);
            setExisting(data.score);
          }
          if (data.comment) setComment(data.comment);
        })
        .catch(() => {});
    } catch {}
  }, [novelId]);

  const handleSubmit = async () => {
    if (selected === 0) {
      setMessage({ type: "error", text: "Vui lòng chọn số sao trước khi gửi." });
      return;
    }

    let userId: string | null = null;
    try {
      const raw = localStorage.getItem("user");
      userId = raw ? JSON.parse(raw).id : null;
    } catch {}

    if (!userId) {
      setMessage({ type: "error", text: "Bạn cần đăng nhập để đánh giá." });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/novels/${novelId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, score: selected, comment }),
      });
      if (res.ok) {
        setExisting(selected);
        setMessage({ type: "success", text: "Đánh giá của bạn đã được ghi nhận!" });
        onRated?.(); // báo cho parent re-fetch
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Gửi đánh giá thất bại." });
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối, vui lòng thử lại." });
    } finally {
      setSubmitting(false);
    }
  };

  const displayScore = hovered || selected;

  return (
    <div className="ml-auto mr-auto mb-[48px] max-w-sm">
      <div className="items-center flex h-9 mb-[24px]">
        <h2 className="font-semibold text-[24px] leading-[32px]">Đánh giá của bạn</h2>
      </div>
      <div className="border-3 bg-white border-pink shadow-2xl p-6 rounded-lg">

        {/* Stars */}
        <label className="block font-medium mb-[8px] text-[14px] leading-[20px]">Đánh giá</label>
        <div className="flex mb-[4px] gap-[4px]">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={star <= displayScore ? "#E91E91" : "none"}
              stroke={star <= displayScore ? "#E91E91" : "currentColor"}
              strokeWidth="2"
              className="w-7 h-7 cursor-pointer transition-all text-black hover:scale-110"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <p className="text-xs text-black mb-[16px] h-4">
          {displayScore > 0 && ["", "Rất tệ", "Tệ", "Trung bình", "Tốt", "Xuất sắc"][displayScore]}
        </p>

        {/* Comment */}
        <label className="block font-medium mb-[4px] text-[14px] leading-[20px]">Nhận xét</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ cảm nhận của bạn..."
          className="flex overflow-auto resize-none whitespace-pre-wrap w-full bg-gray-100 text-gray-800 text-[14px] leading-[20px] min-h-20 pt-2 pr-3 pb-2 pl-3 rounded-md border-3 border-pink focus:border-pink focus:outline-none transition-colors mb-4"
        />

        {/* Message */}
        {message && (
          <p className={`text-xs mb-3 ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {message.text}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || selected === 0}
          className="w-full bg-pink hover:bg-pink/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
        >
          {submitting ? "Đang gửi..." : existing ? "Cập nhật đánh giá" : "Gửi đánh giá"}
        </button>
      </div>
    </div>
  );
}
