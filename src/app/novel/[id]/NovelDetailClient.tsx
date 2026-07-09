"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { DetailHeroBackground } from "@/components/detail/DetailHeroBackground";
import { DetailSidebar } from "@/components/detail/DetailSidebar";
import { DetailActionButtons } from "@/components/detail/DetailActionButtons";
import { DetailDescription } from "@/components/detail/DetailDescription";
import { DetailStatistics } from "@/components/detail/DetailStatistics";
import { RatingOverview } from "@/components/detail/RatingOverview";
import { RatingForm } from "@/components/detail/RatingForm";
import { ChapterList } from "@/components/detail/ChapterList";
import { HorizontalScroll } from "@/components/home/HorizontalScroll";
import { StoryCard } from "@/components/home/StoryCard";

interface NovelDetail {
  id: string;
  slug?: string;
  title: string;
  description: string;
  coverUrl: string;
  posterUrl: string;
  author: string;
  editor: string | null;
  status: string;
  views: number;
  updatedAt: string;
  avgRating: number;
  totalRatings: number;
  bookmarkCount: number;
  chapterCount: number;
  genres: string[];
  chapters: { id: string; number: number; title: string; isLocked: boolean; isPurchased: boolean; price: number; date: string }[];
  distribution: { label: string; percentage: number }[];
  related: { id: string; slug?: string; title: string; author: string; coverUrl: string; status: string; rating: number; chapterCount: number; category: string }[];
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`} />;
}

export default function NovelDetailClient() {
  const params = useParams();
  const id = params?.id as string;

  const [novel, setNovel] = useState<NovelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState<{ username: string; score: number; comment: string; createdAt: string }[]>([]);

  const fetchReviews = () => {
    if (!id) return;
    fetch(`/api/novels/${id}/rating`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => {});
  };

  const fetchNovel = () => {
    if (!id) return;
    setLoading(true);
    const userId = (() => {
      try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw).id : null; } catch { return null; }
    })();
    fetch(`/api/novels/${id}${userId ? `?userId=${userId}` : ""}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setNovel(data);
      })
      .catch(() => setError("Không thể tải truyện"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNovel();
    fetchReviews();
  }, [id]);

  // Re-fetch chỉ phần rating sau khi user submit
  const refreshRating = () => {
    if (!id) return;
    const userId = (() => {
      try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw).id : null; } catch { return null; }
    })();
    fetch(`/api/novels/${id}${userId ? `?userId=${userId}` : ""}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setNovel((prev) => prev ? {
            ...prev,
            avgRating: data.avgRating,
            totalRatings: data.totalRatings,
            distribution: data.distribution,
          } : prev);
        }
      })
      .catch(() => {});
    fetchReviews();
  };

  const statusLabel =
    novel?.status === "COMPLETED" ? "Hoàn Thành"
    : novel?.status === "PAUSED"  ? "Tạm Dừng"
    : "Đang Ra";

  const descriptionParagraphs = novel?.description
    ? novel.description.split("\n").filter((p) => p.trim() !== "")
    : [];

  return (
    <div
      className="text-black text-[16px] leading-[24px]"
      style={{ fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif", width: "100%", maxWidth: "100vw", margin: "auto" }}
    >
      <div className="bg-site text-black min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-full min-h-screen relative">
            <Header />

            {/* Hero background */}
            {loading ? (
              <div className="w-full h-[300px] bg-gray-200 animate-pulse" />
            ) : (
              <DetailHeroBackground imageUrl={novel?.posterUrl || novel?.coverUrl || ""} />
            )}

            {error ? (
              <div className="flex items-center justify-center py-32 text-red-400 text-lg">{error}</div>
            ) : (
              <div className="ml-auto mr-auto relative mt-[-64px] lg:mt-[-96px] pt-8 px-4 lg:px-8 pb-8 z-10">

                {/* Main grid */}
                <div className="grid mb-12 gap-8 lg:gap-0 grid-cols-1 lg:grid-cols-3">
                  {/* Sidebar */}
                  <div className="lg:col-span-1 lg:order-1">
                    {loading ? (
                      <div className="bg-white rounded-2xl p-6 space-y-4">
                        <Skeleton className="aspect-[3/4] w-full max-w-sm mx-auto" />
                        <Skeleton className="h-8 w-3/4 mx-auto" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-5 w-1/2" />
                      </div>
                    ) : novel ? (
                      <DetailSidebar
                        coverImage={novel.coverUrl}
                        title={novel.title}
                        translator={novel.editor || ""}
                        translatorUrl="#"
                        author={novel.author}
                        status={statusLabel}
                        chapters={novel.chapterCount}
                        genre={novel.genres[0] || "Chưa phân loại"}
                      />
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-2 lg:order-2 bg-white rounded-xl lg:rounded-bl-2xl lg:rounded-br-2xl lg:rounded-tl-[4rem] lg:rounded-tr-2xl shadow-2xl p-6 lg:p-10">
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                      </div>
                    ) : novel ? (
                      <>
                        <DetailActionButtons readNowUrl={`/novel/${novel.slug || id}/1`} novelId={id} />
                        <DetailDescription description={descriptionParagraphs} />
                        <DetailStatistics
                          views={novel.views}
                          likes={novel.totalRatings}
                          follows={novel.bookmarkCount}
                          lastUpdate={new Date(novel.updatedAt).toLocaleDateString("vi-VN")}
                        />
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Rating + Chapters */}
                <div className="grid mb-12 gap-8 lg:gap-8 lg:pr-9 grid-cols-1 lg:grid-cols-3">
                  <div className="lg:col-span-1 lg:order-1">
                    {loading ? (
                      <Skeleton className="h-64 w-full" />
                    ) : novel ? (
                      <>
                        <RatingOverview
                          averageRating={novel.avgRating}
                          totalRatings={novel.totalRatings}
                          distribution={novel.distribution}
                        />
                        <div className="mt-8">
                          <RatingForm novelId={id} onRated={refreshRating} />
                        </div>

                        {/* Danh sách nhận xét */}
                        {reviews.length > 0 && (
                          <div className="space-y-3 max-w-sm ml-auto mr-auto">
                            {reviews.map((review, i) => (
                              <div key={i} className="bg-white border-2 border-pink rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 uppercase">
                                      {review.username?.[0] ?? "?"}
                                    </div>
                                    <span className="text-sm font-medium text-black">{review.username}</span>
                                  </div>
                                  <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map((s) => (
                                      <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                        fill={s <= review.score ? "var(--color-pink)" : "none"}
                                        stroke={s <= review.score ? "var(--color-pink)" : "currentColor"}
                                        strokeWidth="2" className={`w-4 h-4 ${s <= review.score ? "" : "text-black"}`}>
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-black text-sm leading-relaxed">{review.comment}</p>
                                <p className="text-black text-xs mt-2">
                                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>

                  <div className="lg:col-span-2 lg:order-2">
                    {loading ? (
                      <Skeleton className="h-96 w-full" />
                    ) : novel ? (
                      <ChapterList
                        chapters={novel.chapters.map((c) => ({
                          number: c.number,
                          title: c.title,
                          url: `/novel/${novel.slug || id}/${c.number}`,
                          date: c.date,
                          isLocked: c.isLocked,
                          price: c.price,
                          isPurchased: c.isPurchased,
                        }))}
                      />
                    ) : null}
                  </div>
                </div>

                {/* Related novels */}
                {!loading && novel && novel.related.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center mb-8">
                      <h2 className="font-bold text-2xl lg:text-[30px] leading-tight">Truyện liên quan</h2>
                    </div>
                    <HorizontalScroll>
                      {novel.related.map((r) => (
                        <div key={r.id} className="h-full relative w-[280px] lg:w-[339.4px] mr-[20px] shrink-0">
                          <StoryCard
                            href={`/novel/${r.slug || r.id}`}
                            imageUrl={r.coverUrl}
                            title={r.title}
                            author={r.author}
                            rating={r.rating}
                            chapters={r.chapterCount}
                            category={r.category}
                            status={r.status}
                            iconUrl=""
                            chapterIconUrl=""
                          />
                        </div>
                      ))}
                    </HorizontalScroll>
                  </div>
                )}
              </div>
            )}

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
