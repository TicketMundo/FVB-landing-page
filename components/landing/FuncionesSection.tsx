"use client";
import { useState, useEffect } from "react";
import type { Funcion } from "@/lib/types";

interface Props {
  funciones: Funcion[];
  colorSecundario?: string;
  tituloFunciones?: string;
  ventaInicio?: string;
}

function formatHora(hora: string): string {
  if (!hora) return "";
  // Already in 12h format — pass through
  const m12 = hora.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)/i);
  if (m12) return `${m12[1]}:${m12[2]} ${m12[3].toUpperCase()}`;
  // 24h → 12h
  const m24 = hora.match(/^(\d{1,2}):(\d{2})/);
  if (m24) {
    let h = parseInt(m24[1], 10);
    const min = m24[2];
    const period = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h}:${min} ${period}`;
  }
  return hora;
}

function formatDate(fecha: string, hora: string): string {
  const parts: string[] = [];
  if (fecha) {
    try {
      const d = new Date(fecha + "T00:00:00");
      parts.push(
        d.toLocaleDateString("es-VE", { day: "2-digit", month: "2-digit", year: "numeric" })
      );
    } catch {
      parts.push(fecha);
    }
  }
  const h = formatHora(hora);
  if (h) parts.push(h);
  return parts.join(", ");
}

function TeamLogo({ src, nombre }: { src?: string; nombre?: string }) {
  if (src) {
    return (
      <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-200 dark:border-white/15 shrink-0 bg-gray-100 dark:bg-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={nombre ?? "equipo"} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }
  const initials = (nombre ?? "?").slice(0, 2).toUpperCase();
  return (
    <div className="h-9 w-9 rounded-full shrink-0 bg-gray-200 dark:bg-white/10 flex items-center justify-center text-[11px] font-bold text-gray-600 dark:text-white/60">
      {initials}
    </div>
  );
}

export function FuncionesSection({ funciones, colorSecundario, tituloFunciones, ventaInicio }: Props) {
  const [moneda, setMoneda] = useState<"USD" | "VEF">("VEF");
  const [openId, setOpenId] = useState<string | null>(null);
  const [saleLocked, setSaleLocked] = useState(() =>
    ventaInicio ? Date.now() < new Date(ventaInicio).getTime() : false
  );

  useEffect(() => {
    if (!ventaInicio) return;
    const target = new Date(ventaInicio).getTime();
    if (Date.now() >= target) return;
    const id = setInterval(() => {
      if (Date.now() >= target) {
        setSaleLocked(false);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [ventaInicio]);

  if (!funciones.length) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-[22px] font-bold">{tituloFunciones?.trim() || "Funciones"}</h2>
        <div className="flex items-center text-[13px] sm:text-sm overflow-hidden rounded-md border border-gray-200 dark:border-white/10">
          <button
            onClick={() => setMoneda("USD")}
            className={`px-3 py-1.5 font-medium transition-colors ${
              moneda === "USD"
                ? "bg-brand text-white"
                : "bg-white dark:bg-[#1A1A1A] text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Pagar en USD
          </button>
          <button
            onClick={() => setMoneda("VEF")}
            className={`px-3 py-1.5 font-medium transition-colors ${
              moneda === "VEF"
                ? "bg-brand text-white"
                : "bg-white dark:bg-[#1A1A1A] text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Pagar en VEF
          </button>
        </div>
      </div>

      {/* Individual cards per funcion */}
      <div className="flex flex-col gap-3">
        {funciones.map((f) => {
          const isOpen = openId === f.id;
          const hasDetails = !!(f.imagenMapa || f.zonas.length);
          const info = f.infoAdicional;

          return (
            <div
              key={f.id}
              className="rounded-card overflow-hidden border border-gray-200 dark:border-white/10"
            >
              {/* Sports matchup row */}
              {info?.tipo === "equipos" && (info.equipo1 || info.equipo2) && (
                <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 dark:bg-[#161616] border-b border-gray-100 dark:border-white/5">
                  <TeamLogo src={info.equipo1?.logo} nombre={info.equipo1?.nombre} />
                  {info.equipo1?.nombre && (
                    <span className="text-[13px] sm:text-sm font-semibold truncate max-w-[80px] sm:max-w-none">
                      {info.equipo1.nombre}
                    </span>
                  )}
                  <span className="text-[11px] sm:text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider shrink-0 px-1">
                    VS
                  </span>
                  {info.equipo2?.nombre && (
                    <span className="text-[13px] sm:text-sm font-semibold truncate max-w-[80px] sm:max-w-none">
                      {info.equipo2.nombre}
                    </span>
                  )}
                  <TeamLogo src={info.equipo2?.logo} nombre={info.equipo2?.nombre} />
                </div>
              )}
              {info?.tipo === "texto" && info.texto && (
                <div className="px-5 py-2.5 bg-gray-50 dark:bg-[#161616] border-b border-gray-100 dark:border-white/5">
                  <span className="text-[13px] sm:text-sm font-medium text-gray-600 dark:text-white/60">
                    {info.texto}
                  </span>
                </div>
              )}

              {/* Main row */}
              <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#1A1A1A]">
                <div className="w-32 sm:w-40 font-bold text-base sm:text-lg shrink-0">{f.ciudad}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-base sm:text-lg font-semibold truncate">{f.venue}</div>
                  <div className="text-sm sm:text-lg text-gray-500 dark:text-white/50">{formatDate(f.fecha, f.hora)}</div>
                </div>
                <div className="shrink-0">
                  {(() => {
                    const link = moneda === "USD" ? f.linkCompra : f.linkCompraBS;
                    const disabled = saleLocked || !link;
                    return disabled ? (
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-input bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/30 text-[13px] sm:text-sm font-bold uppercase tracking-wider cursor-not-allowed select-none">
                        Tickets
                      </span>
                    ) : (
                      <a
                        href={link!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-input bg-brand text-white text-[13px] sm:text-sm font-bold hover:bg-brand-hover transition-colors uppercase tracking-wider"
                      >
                        Tickets
                      </a>
                    );
                  })()}
                </div>
              </div>

              {/* Toggle link */}
              {hasDetails && (
                <div className="px-5 py-2 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-white/5">
                  <button
                    onClick={() => setOpenId(isOpen ? null : f.id)}
                    style={colorSecundario ? { color: colorSecundario } : undefined}
                    className={`text-[13px] sm:text-sm hover:underline ${!colorSecundario ? "text-brand" : ""}`}
                  >
                    {isOpen ? "Ocultar mapa y precios" : "Ver mapa y precios"}
                  </button>
                </div>
              )}

              {/* Expanded: map + zones */}
              {isOpen && (
                <div className="flex flex-col lg:flex-row gap-6 px-5 py-5 bg-gray-50 dark:bg-[#161616] border-t border-gray-100 dark:border-white/5">
                  {f.imagenMapa && (
                    <div className={f.zonas.length > 0 ? "lg:flex-[3] flex items-center justify-center" : "w-full flex items-center justify-center"}>
                      <img
                        src={f.imagenMapa}
                        alt="Mapa del recinto"
                        className="max-w-full mx-auto rounded-input"
                      />
                    </div>
                  )}
                  {f.zonas.length > 0 && (
                    <div className={f.imagenMapa ? "lg:flex-[2] min-w-0" : "w-full"}>
                      <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
                        {f.zonas.map((z) => (
                          <div
                            key={z.nombre}
                            className="flex items-center justify-between py-3"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="h-3 w-3 rounded-full shrink-0 border border-gray-300 dark:border-white/20"
                                style={{ backgroundColor: z.color }}
                              />
                              <span className="text-[13px] sm:text-sm font-medium">{z.nombre}</span>
                            </div>
                            <span className="text-[13px] sm:text-sm font-semibold tabular-nums">
                              ${z.precioUSD.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[13px] sm:text-sm text-gray-400 dark:text-white/30 mt-3">
                        {f.incluyeCargos !== false
                          ? "Los precios incluyen cargos por servicio."
                          : "Los precios NO incluyen cargos por servicio."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
