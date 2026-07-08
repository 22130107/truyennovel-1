"use client";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/home/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { HorizontalScroll } from "@/components/home/HorizontalScroll";
import { StoryCard } from "@/components/home/StoryCard";
import { RankedStoryCard } from "@/components/home/RankedStoryCard";
import { Footer } from "@/components/home/Footer";

interface Novel {
  id: string;
  slug?: string;
  title: string;
  author: string;
  coverUrl: string;
  posterUrl: string;
  status: string;
  rating: number;
  chapterCount: number;
  bookmarkCount: number;
  category: string;
}

function useNovels(type: string, limit = 5) {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/novels?type=${type}&limit=${limit}`)
      .then((r) => r.json())
      .then((data) => setNovels(Array.isArray(data) ? data : []))
      .catch(() => setNovels([]))
      .finally(() => setLoading(false));
  }, [type, limit]);

  return { novels, loading };
}

function CardSkeleton() {
  return (
    <div className="w-[45vw] md:w-[339.4px] shrink-0 mr-[12px] md:mr-[20px]">
      <div className="bg-neutral-800 animate-pulse rounded-2xl aspect-[3/4] w-full" />
      <div className="mt-2 space-y-1.5 p-2">
        <div className="bg-neutral-800 animate-pulse h-4 rounded w-3/4" />
        <div className="bg-neutral-800 animate-pulse h-3 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function HomeClient() {
  const { novels: bookmarked, loading: l1 } = useNovels("bookmarked", 8);
  const { novels: topViewed,  loading: l2 } = useNovels("top-viewed", 8);
  const { novels: newest,     loading: l3 } = useNovels("newest", 10);

  return (
    <div
      className="text-black text-[16px] leading-[24px] w-full min-h-screen"
      style={{ fontFamily: 'Figtree, ui-sans-serif, system-ui, sans-serif', margin: "auto" }}
    >
      <div className="bg-site text-black min-h-screen">
        <div className="bg-site min-h-screen">
          <Header />

          <HeroSection />

          {/* Truyện được theo dõi nhiều */}
          <section className="pt-4 pb-4">
            <div className="max-w-[1920px] mx-auto px-4 md:px-16">
              <SectionHeader title="Truyện được theo dõi" />
              <HorizontalScroll>
                {l1
                  ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
                  : bookmarked.map((novel) => (
                      <div key={novel.id} className="h-full relative w-[45vw] md:w-[339.4px] mr-[12px] md:mr-[20px] shrink-0">
                        <StoryCard
                          href={`/novel/${novel.slug || novel.id}`}
                          imageUrl={novel.coverUrl}
                          title={novel.title}
                          author={novel.author}
                          rating={novel.rating}
                          chapters={novel.chapterCount}
                          category={novel.category}
                          status={novel.status}
                          iconUrl=""
                          chapterIconUrl=""
                        />
                      </div>
                    ))}
              </HorizontalScroll>
            </div>
          </section>

          {/* Truyện xem nhiều nhất */}
          <section className="pt-10 md:pt-16 pb-10 md:pb-16">
            <div className="max-w-[1920px] mx-auto px-4 md:px-16">
              <SectionHeader title="Truyện được xem nhiều" />
              <HorizontalScroll>
                {l2
                  ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
                  : topViewed.map((novel, index) => (
                      <div key={novel.id} className="h-full relative w-[45vw] md:w-[339.4px] mr-[12px] md:mr-[20px] shrink-0">
                        <RankedStoryCard
                          href={`/novel/${novel.slug || novel.id}`}
                          imageUrl={novel.coverUrl}
                          title={novel.title}
                          translator={novel.author}
                          date={new Date().toLocaleDateString("vi-VN")}
                          chapters={novel.chapterCount}
                          rank={index + 1}
                          clipPathLeft={index % 2 === 0}
                        />
                      </div>
                    ))}
              </HorizontalScroll>
            </div>
          </section>

          {/* Truyện mới nhất */}
          <section className="pt-10 md:pt-16 pb-10 md:pb-16">
            <div className="max-w-[1920px] mx-auto px-4 md:px-16">
              <SectionHeader title="Truyện mới nhất" />
              {l3 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="bg-neutral-800 animate-pulse rounded-2xl aspect-[3/4]" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
                  {newest.map((novel) => (
                    <StoryCard
                      key={novel.id}
                      href={`/novel/${novel.slug || novel.id}`}
                      imageUrl={novel.coverUrl}
                      title={novel.title}
                      author={novel.author}
                      rating={novel.rating}
                      chapters={novel.chapterCount}
                      category={novel.category}
                      status={novel.status}
                      iconUrl=""
                      chapterIconUrl=""
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
}
