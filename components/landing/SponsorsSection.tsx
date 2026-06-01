"use client";
import Marquee from "react-fast-marquee";
import type { Sponsor } from "@/lib/types";

interface Props {
  sponsors: Sponsor[];
}

export function SponsorsSection({ sponsors }: Props) {
  const visible = sponsors.filter((s) => s.logo);
  if (!visible.length) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-[22px] font-bold mb-4">Patrocinantes</h2>
      <div className="rounded-card border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#1A1A1A]">
        <Marquee
          pauseOnHover
          speed={45}
          gradient={false}
          className="py-5"
        >
          {visible.map((s, i) => {
            const logo = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.logo}
                alt={s.nombre}
                className="h-[80px] max-w-[160px] sm:h-[100px] sm:max-w-[200px] w-auto object-contain"
                loading="lazy"
              />
            );
            return (
              <div key={i} className="flex items-center justify-center mx-6 sm:mx-10">
                {s.link ? (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.nombre}
                    className="flex items-center justify-center px-5 py-3 rounded-input bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-200/60 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-colors"
                  >
                    {logo}
                  </a>
                ) : (
                  <div className="flex items-center justify-center px-5 py-3 rounded-input bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-200/60 dark:border-white/10">
                    {logo}
                  </div>
                )}
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
}
