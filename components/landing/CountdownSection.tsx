"use client";
import { useState, useEffect } from "react";

interface Props {
  ventaInicio?: string;
  colorSecundario?: string;
  tituloCountdown?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function CountdownSection({ ventaInicio, colorSecundario, tituloCountdown }: Props) {
  const target = ventaInicio ? new Date(ventaInicio) : null;
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!target) return;
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ventaInicio]);

  if (!ventaInicio) return null;
  if (mounted && timeLeft === null) return null;

  const units = timeLeft
    ? [
        { value: timeLeft.days, label: "Días" },
        { value: timeLeft.hours, label: "Horas" },
        { value: timeLeft.minutes, label: "Minutos" },
        { value: timeLeft.seconds, label: "Segundos" },
      ]
    : [
        { value: 0, label: "Días" },
        { value: 0, label: "Horas" },
        { value: 0, label: "Minutos" },
        { value: 0, label: "Segundos" },
      ];

  return (
    <section className="bg-gray-100 dark:bg-[#141414] py-8 px-4 border-b border-gray-100 dark:border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        <p
          style={colorSecundario ? { color: colorSecundario } : undefined}
          className={`text-xl sm:text-[22px] font-bold tracking-wide${!colorSecundario ? " text-gray-700 dark:text-white/80" : ""}`}
        >
          {tituloCountdown?.trim() || "La venta inicia en..."}
        </p>
        <div className="flex items-start gap-2 sm:gap-4">
          {units.map(({ value, label }, i) => (
            <div key={label} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-brand rounded-md w-16 sm:w-20 py-3 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-bold tabular-nums leading-none text-white">
                    {String(value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[13px] sm:text-sm text-gray-500 dark:text-white/50 uppercase tracking-widest">
                  {label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span className="text-2xl sm:text-3xl font-bold text-gray-400 dark:text-white/30 mb-6 select-none">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
