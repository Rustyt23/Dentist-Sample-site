"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { gallery, galleryCategories, type GalleryCategory } from "@/lib/data/content";
import { cn, unsplash } from "@/lib/utils";

type Filter = "All" | GalleryCategory;

const shapeClass = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
} as const;

export function GalleryGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = filter === "All" ? gallery : gallery.filter((g) => g.category === filter);
  const current = openIndex !== null ? items[openIndex] : null;

  const count = items.length;
  const isOpen = openIndex !== null;

  const close = () => setOpenIndex(null);
  const step = (dir: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + dir + count) % count));

  // Swipe left/right to browse photos on touch screens.
  const swipeStart = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (dir) setOpenIndex((i) => (i === null ? i : (i + dir + count) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, count]);

  const filters: Filter[] = ["All", ...galleryCategories];

  return (
    <>
      <div
        role="group"
        aria-label="Filter gallery"
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
      >
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={f === filter}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300",
              f === filter
                ? "bg-navy-900 text-white shadow-soft"
                : "bg-white text-navy-600 ring-1 ring-navy-100 hover:text-navy-900 hover:ring-navy-200",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {items.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={cn(
              "group relative block w-full overflow-hidden rounded-3xl bg-mist-100 text-left",
              shapeClass[img.shape],
            )}
            aria-label={`Open photo: ${img.caption}`}
          >
            <Image
              src={unsplash(img.id, 1000)}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-navy-950/0 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
              <span>
                <span className="block text-xs font-medium tracking-wide text-white/75 uppercase">{img.category}</span>
                <span className="mt-0.5 block font-semibold text-white">{img.caption}</span>
              </span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/90 text-navy-900 opacity-0 transition duration-300 group-hover:opacity-100">
                <Expand className="size-4" aria-hidden />
              </span>
            </div>
          </button>
        ))}
      </div>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          className="animate-fade-up fixed inset-0 z-[70] flex flex-col bg-navy-950/95 backdrop-blur-sm [animation-duration:0.3s]"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 py-4 text-white sm:px-8">
            <p className="text-sm">
              <span className="font-semibold">{current.caption}</span>
              <span className="text-white/50">
                {" "}
                · {(openIndex ?? 0) + 1} / {items.length}
              </span>
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
          </div>
          <div
            className="relative flex-1 touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipeStart.current = null)}
          >
            <Image
              key={current.id}
              src={unsplash(current.id, 2000)}
              alt={current.alt}
              fill
              sizes="100vw"
              className="object-contain p-2 sm:p-8"
            />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute top-1/2 left-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-900 shadow-lift transition hover:bg-white sm:left-8"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute top-1/2 right-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-900 shadow-lift transition hover:bg-white sm:right-8"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          <p className="px-4 py-5 text-center text-sm text-white/60">
            {current.alt}
            <span className="mt-1 block text-xs text-white/40 sm:hidden">Swipe to browse</span>
          </p>
        </div>
      ) : null}
    </>
  );
}
