"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GaleriaItem } from "@/lib/types";

interface Props {
  galeria: GaleriaItem[];
}

function getYtId(url: string): string | null {
  return url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]{11})/)?.[1] ?? null;
}

export function GaleriaSection({ galeria }: Props) {
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  if (!galeria.length) return null;

  const prev = () => setCurrent((c) => (c - 1 + galeria.length) % galeria.length);
  const next = () => setCurrent((c) => (c + 1) % galeria.length);
  const markLoaded = (i: number) =>
    setLoadedImages((prev) => { const s = new Set(prev); s.add(i); return s; });

  return (
    <div>
      <h2 className="text-xl sm:text-[22px] font-bold mb-4">Galería</h2>

      {/* Carousel — all slides mounted so YouTube iframes don't reload on navigation */}
      <div className="relative aspect-video rounded-card overflow-hidden bg-gray-200 dark:bg-black select-none">
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            width: `${galeria.length * 100}%`,
            transform: `translateX(-${current * (100 / galeria.length)}%)`,
          }}
        >
          {galeria.map((item, i) => (
            <div
              key={i}
              className="relative h-full flex-none"
              style={{ width: `${100 / galeria.length}%` }}
            >
              {item.tipo === "youtube" ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${getYtId(item.url)}`}
                  title={`Video ${i + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : (
                <>
                  {!loadedImages.has(i) && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-white/5 animate-pulse" />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={`Galería ${i + 1}`}
                    onLoad={() => markLoaded(i)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      loadedImages.has(i) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        {galeria.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/10 dark:bg-black/50 hover:bg-black/20 dark:hover:bg-black/70 rounded-full p-1.5 transition-colors z-10"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/10 dark:bg-black/50 hover:bg-black/20 dark:hover:bg-black/70 rounded-full p-1.5 transition-colors z-10"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5 text-gray-900 dark:text-white" />
            </button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
              {galeria.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current
                      ? "w-4 bg-brand"
                      : "w-1.5 bg-gray-400 dark:bg-white/40 hover:bg-gray-600 dark:hover:bg-white/60"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
