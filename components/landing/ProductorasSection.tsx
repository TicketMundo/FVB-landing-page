import Image from "next/image";
import { Instagram } from "lucide-react";
import type { Productora } from "@/lib/types";

interface Props {
  productoras: Productora[];
}

export function ProductorasSection({ productoras }: Props) {
  if (!productoras.length) return null;

  return (
    <div className="rounded-card border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-6 h-full">
      <h2 className="text-xl sm:text-[22px] font-bold mb-6">Produce</h2>
      <div className="flex flex-col gap-6">
        {productoras.map((p, i) => {
          const igHandle = p.instagram?.replace("@", "");
          const Wrapper = p.link ? "a" : "div";
          const wrapperProps = p.link
            ? { href: p.link, target: "_blank", rel: "noopener noreferrer" }
            : {};

          return (
            <Wrapper
              key={i}
              {...(wrapperProps as Record<string, string>)}
              className={`flex items-center gap-5 ${p.link ? "group cursor-pointer" : ""}`}
            >
              {/* Circular logo */}
              {p.logo ? (
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-200 dark:bg-[#111] border-2 border-gray-200 dark:border-white/10 shrink-0">
                  <Image
                    src={p.logo}
                    alt={p.nombre}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-[#111] border-2 border-gray-200 dark:border-white/10 shrink-0 flex items-center justify-center text-xl font-bold text-gray-400 dark:text-white/30">
                  {p.nombre.slice(0, 1).toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div className="flex flex-col gap-1 min-w-0">
                <span
                  className={`text-[15px] sm:text-base font-bold leading-tight ${
                    p.link ? "group-hover:text-brand transition-colors" : ""
                  }`}
                >
                  {p.nombre}
                </span>
                {igHandle && (
                  <span className="flex items-center gap-1 text-[13px] sm:text-sm text-gray-500 dark:text-white/50">
                    <Instagram className="h-3.5 w-3.5 shrink-0" />
                    @{igHandle}
                  </span>
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
