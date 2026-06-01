interface Props {
  banner?: string;
  bannerMovil?: string;
  titulo: string;
  logoLink?: string;
}

export function BannerSection({ banner, bannerMovil, titulo, logoLink }: Props) {
  if (!banner && !bannerMovil) return null;

  const hasBoth = !!(banner && bannerMovil);

  return (
    <section className="relative w-full min-h-[400px] bg-gray-100 dark:bg-[#141414]">
      <a
        href={logoLink || "https://ticketmundo.com.ve/"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ticketmundo"
        className="absolute top-3 left-3 z-10 bg-white/50 backdrop-blur-sm rounded-lg px-2 py-1.5 hover:bg-white/70 transition-colors"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ticketmundo-by-yummy.svg"
          alt="Ticketmundo by Yummy"
          width={200}
          height={32}
          className="w-[200px]"
        />
      </a>

      {/* Desktop banner — hidden below 840px when mobile banner exists */}
      {banner && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={banner}
          alt={titulo}
          fetchPriority="high"
          loading="eager"
          className={`w-full h-auto block ${hasBoth ? "hidden min-[840px]:block" : ""}`}
        />
      )}

      {/* Mobile banner — hidden at 840px+ when desktop banner exists */}
      {bannerMovil && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bannerMovil}
          alt={titulo}
          fetchPriority="high"
          loading="eager"
          className={`w-full h-auto block ${hasBoth ? "min-[840px]:hidden" : ""}`}
        />
      )}
    </section>
  );
}
