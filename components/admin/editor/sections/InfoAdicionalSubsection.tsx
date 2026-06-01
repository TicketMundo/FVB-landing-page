"use client";
import { useFormContext } from "react-hook-form";
import { Trash2, X, Trophy } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { UploadButton } from "@/components/admin/UploadButton";
import { deleteAsset } from "@/lib/delete-asset";
import type { EventoConfigInput } from "@/lib/schemas";

interface Props {
  funcionIndex: number;
  eventoId: string;
}

export function InfoAdicionalSubsection({ funcionIndex, eventoId }: Props) {
  const { watch, setValue, getValues } = useFormContext<EventoConfigInput>();

  const info = watch(`funciones.${funcionIndex}.infoAdicional`);
  const enabled = info !== undefined && info !== null;

  function handleToggle() {
    if (enabled) {
      const current = getValues(`funciones.${funcionIndex}.infoAdicional`);
      if (current?.tipo === "equipos") {
        if (current.equipo1?.logo) deleteAsset(current.equipo1.logo);
        if (current.equipo2?.logo) deleteAsset(current.equipo2.logo);
      }
      setValue(`funciones.${funcionIndex}.infoAdicional`, undefined, { shouldDirty: true });
    } else {
      setValue(
        `funciones.${funcionIndex}.infoAdicional`,
        { tipo: "texto", texto: "" },
        { shouldDirty: true }
      );
    }
  }

  function handleTipoChange(newTipo: "equipos" | "texto") {
    const current = getValues(`funciones.${funcionIndex}.infoAdicional`);
    if (!current) return;
    if (newTipo === "texto") {
      if (current.equipo1?.logo) deleteAsset(current.equipo1.logo);
      if (current.equipo2?.logo) deleteAsset(current.equipo2.logo);
      setValue(
        `funciones.${funcionIndex}.infoAdicional`,
        { tipo: "texto", texto: current.texto ?? "" },
        { shouldDirty: true }
      );
    } else {
      setValue(
        `funciones.${funcionIndex}.infoAdicional`,
        { tipo: "equipos", texto: "", equipo1: { nombre: "", logo: "" }, equipo2: { nombre: "", logo: "" } },
        { shouldDirty: true }
      );
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header + toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 opacity-60" />
          <h4 className="text-sm font-medium opacity-70">Info adicional (deportes)</h4>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            enabled ? "bg-brand" : "bg-gray-300 dark:bg-white/20"
          }`}
          aria-label="Activar info adicional"
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
              enabled ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {enabled && info && (
        <div className="flex flex-col gap-3 pl-2 border-l-2 border-brand/30">
          {/* Tipo selector */}
          <div className="flex rounded-input border border-line-light dark:border-line-dark overflow-hidden w-fit">
            {(["equipos", "texto"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => info.tipo !== t && handleTipoChange(t)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                  info.tipo === t
                    ? "bg-brand text-white"
                    : "hover:bg-base-light dark:hover:bg-base-dark opacity-60"
                }`}
              >
                {t === "equipos" ? "Equipos" : "Texto libre"}
              </button>
            ))}
          </div>

          {/* Equipos */}
          {info.tipo === "equipos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(["equipo1", "equipo2"] as const).map((eq, eIdx) => {
                const logoUrl = watch(`funciones.${funcionIndex}.infoAdicional.${eq}.logo`);
                return (
                  <div key={eq} className="flex flex-col gap-2 p-3 rounded-input bg-base-light dark:bg-base-dark border border-line-light dark:border-line-dark">
                    <span className="text-xs font-semibold opacity-60 uppercase tracking-wide">
                      {eIdx === 0 ? "Equipo local" : "Equipo visitante"}
                    </span>
                    <Input
                      id={`funciones.${funcionIndex}.infoAdicional.${eq}.nombre`}
                      placeholder="Nombre del equipo"
                      value={watch(`funciones.${funcionIndex}.infoAdicional.${eq}.nombre`) ?? ""}
                      onChange={(e) =>
                        setValue(
                          `funciones.${funcionIndex}.infoAdicional.${eq}.nombre`,
                          e.target.value,
                          { shouldDirty: true }
                        )
                      }
                    />
                    {/* Logo row */}
                    <div className="flex items-center gap-2">
                      {logoUrl ? (
                        <div className="relative shrink-0">
                          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={logoUrl}
                              alt="Logo equipo"
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <button
                            type="button"
                            aria-label="Quitar logo"
                            onClick={() => {
                              deleteAsset(logoUrl);
                              setValue(
                                `funciones.${funcionIndex}.infoAdicional.${eq}.logo`,
                                "",
                                { shouldDirty: true }
                              );
                            }}
                            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full border-2 border-dashed border-line-light dark:border-line-dark shrink-0 flex items-center justify-center opacity-40">
                          <Trophy className="h-5 w-5" />
                        </div>
                      )}
                      <UploadButton
                        eventoId={eventoId}
                        onUploaded={(url) => {
                          const old = getValues(
                            `funciones.${funcionIndex}.infoAdicional.${eq}.logo`
                          );
                          setValue(
                            `funciones.${funcionIndex}.infoAdicional.${eq}.logo`,
                            url,
                            { shouldDirty: true }
                          );
                          if (old) deleteAsset(old);
                        }}
                        label="Subir logo"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Texto libre */}
          {info.tipo === "texto" && (
            <Input
              id={`funciones.${funcionIndex}.infoAdicional.texto`}
              placeholder="Ej: Venezuela vs Colombia"
              value={watch(`funciones.${funcionIndex}.infoAdicional.texto`) ?? ""}
              onChange={(e) =>
                setValue(
                  `funciones.${funcionIndex}.infoAdicional.texto`,
                  e.target.value,
                  { shouldDirty: true }
                )
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
