import type { Metadata } from "next";
import { cache } from "react";
import { readJson, configKey } from "@/lib/s3-client";
import { DEFAULT_EVENTO_CONFIG, type EventoConfig } from "@/lib/types";
import { sanitizeRichText } from "@/lib/sanitize";
import { BannerSection } from "@/components/landing/BannerSection";
import { CountdownSection } from "@/components/landing/CountdownSection";
import { InfoSection } from "@/components/landing/InfoSection";
import { NotasSection } from "@/components/landing/NotasSection";
import { FuncionesSection } from "@/components/landing/FuncionesSection";
import { GaleriaSection } from "@/components/landing/GaleriaSection";
import { SpotifySection } from "@/components/landing/SpotifySection";
import { SponsorsSection } from "@/components/landing/SponsorsSection";
import { ProductorasSection } from "@/components/landing/ProductorasSection";
import { TerminosSection } from "@/components/landing/TerminosSection";
import { FooterSection } from "@/components/landing/FooterSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const loadEvento = cache(async (): Promise<EventoConfig> => {
  const id = process.env.DEFAULT_EVENTO_ID || "FIBA";
  try {
    const data = await readJson<EventoConfig>(configKey(id));
    return data ?? DEFAULT_EVENTO_CONFIG;
  } catch {
    return DEFAULT_EVENTO_CONFIG;
  }
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export async function generateMetadata(): Promise<Metadata> {
  const evento = await loadEvento();
  const title = evento.titulo || "Ticketmundo";
  const description = evento.sinopsis
    ? stripHtml(evento.sinopsis).slice(0, 160)
    : "Compra tus entradas para los mejores eventos en Venezuela con Ticketmundo.";
  const image = evento.banner || evento.bannerMovil || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function HomePage() {
  const evento = await loadEvento();
  const sinopsis = evento.sinopsis ? sanitizeRichText(evento.sinopsis) : "";

  const isDark = evento.tema !== "light";
  const hasImagenIntro = !!evento.imagenIntro;
  const hasSpotify = !!evento.spotify;
  const hasSponsors = !!(evento.sponsors?.length);
  const hasProductoras = !!(evento.productoras?.length);
  const hasNotas = !!(evento.notas?.length);
  const hasGaleria = !!(evento.galeria?.length);

  const themeScript = `document.documentElement.className="${isDark ? "dark" : ""}"`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evento.titulo,
    description: evento.sinopsis ? stripHtml(evento.sinopsis).slice(0, 500) : undefined,
    image: evento.banner || evento.bannerMovil || undefined,
    organizer: {
      "@type": "Organization",
      name: "Ticketmundo",
      url: "https://ticketmundo.com.ve",
    },
    ...(evento.funciones.length > 0 && {
      startDate: evento.funciones[0].fecha,
      location: {
        "@type": "Place",
        name: evento.funciones[0].venue,
        address: { "@type": "PostalAddress", addressLocality: evento.funciones[0].ciudad },
      },
    }),
  };

  return (
    <>
      {/* Sets <html> class before paint — prevents flash */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D] text-gray-900 dark:text-white">
        <BannerSection
          banner={evento.banner}
          bannerMovil={evento.bannerMovil}
          titulo={evento.titulo}
          logoLink={evento.logoLink}
        />

        <CountdownSection ventaInicio={evento.ventaInicio} colorSecundario={evento.colorSecundario} />

        <main className="py-8 space-y-8">
          {/* Info + Notas — layout depends on imagenIntro presence */}
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {hasImagenIntro ? (
              <div className="flex flex-col gap-6">
                {/* Row 1: sinopsis (3/5) + imagen (2/5) — stacks below 1094px */}
                <div className="grid min-[1094px]:grid-cols-5 gap-6">
                  <div className="min-[1094px]:col-span-3">
                    <InfoSection titulo={evento.titulo} sinopsis={sinopsis} />
                  </div>
                  <div className="min-[1094px]:col-span-2 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={evento.imagenIntro}
                      alt="Intro"
                      className="w-full max-w-full object-cover rounded-card border border-gray-200 dark:border-white/10"
                    />
                  </div>
                </div>
                {/* Row 2: notas full width */}
                {hasNotas && (
                  <NotasSection notas={evento.notas!} />
                )}
              </div>
            ) : (
              /* No imagenIntro: sinopsis 50% | notas 50% — stacks below 1094px */
              <div className="grid min-[1094px]:grid-cols-2 gap-6">
                <InfoSection titulo={evento.titulo} sinopsis={sinopsis} />
                {hasNotas && <NotasSection notas={evento.notas!} />}
              </div>
            )}
          </div>

          {/* Funciones */}
          {evento.funciones.length > 0 && (
            <FuncionesSection funciones={evento.funciones} colorSecundario={evento.colorSecundario} />
          )}

          {/* Galería + Spotify */}
          {(hasGaleria || hasSpotify) && (
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              {hasSpotify && hasGaleria ? (
                <div className="grid lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3">
                    <GaleriaSection galeria={evento.galeria!} />
                  </div>
                  <div className="lg:col-span-2">
                    <SpotifySection spotify={evento.spotify!} />
                  </div>
                </div>
              ) : hasGaleria ? (
                <GaleriaSection galeria={evento.galeria!} />
              ) : (
                <SpotifySection spotify={evento.spotify!} />
              )}
            </div>
          )}

          {/* Sponsors */}
          {hasSponsors && (
            <SponsorsSection sponsors={evento.sponsors!} />
          )}

          {/* Productoras (2/5) + Términos (3/5) */}
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {hasProductoras ? (
              <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                  <ProductorasSection productoras={evento.productoras!} />
                </div>
                <div className="lg:col-span-3">
                  <TerminosSection />
                </div>
              </div>
            ) : (
              <TerminosSection />
            )}
          </div>
        </main>

        <FooterSection />
      </div>
    </div>
    </>
  );
}
