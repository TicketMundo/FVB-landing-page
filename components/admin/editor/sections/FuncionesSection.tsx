"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, CalendarDays, Link } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { UploadButton } from "@/components/admin/UploadButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { ZonasSubsection } from "./ZonasSubsection";
import { InfoAdicionalSubsection } from "./InfoAdicionalSubsection";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteAsset } from "@/lib/delete-asset";
import type { EventoConfigInput } from "@/lib/schemas";
import { useState } from "react";

interface Props {
  eventoId: string;
}

function generateId(): string {
  return crypto.randomUUID().slice(0, 8);
}

export function FuncionesSection({ eventoId }: Props) {
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<EventoConfigInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "funciones",
  });

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  function addFuncion() {
    append({
      id: generateId(),
      fecha: "",
      hora: "",
      ciudad: "",
      venue: "",
      imagenMapa: "",
      zonas: [],
      linkCompra: "",
      linkCompraBS: "",
      incluyeCargos: true,
    });
  }

  return (
    <section id="funciones" className="flex flex-col gap-4 scroll-mt-32">
      <h2 className="text-lg font-semibold">Funciones</h2>
      <Input
        label='Título de sección (deja vacío para usar "Funciones")'
        id="tituloFunciones"
        placeholder="Ej: Partidos, Shows, Fechas..."
        {...register("tituloFunciones")}
      />
      <div className="flex items-center justify-between">
        <Button type="button" variant="secondary" size="sm" onClick={addFuncion}>
          <Plus className="h-4 w-4" />
          Agregar función
        </Button>
      </div>

      {fields.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-10 opacity-50">
          <CalendarDays className="h-8 w-8" />
          <p className="text-sm">Sin funciones. Agrega la primera.</p>
        </Card>
      )}

      {fields.map((field, idx) => {
        const mapUrl = watch(`funciones.${idx}.imagenMapa`);
        const fErrors = errors.funciones?.[idx];

        return (
          <Card key={field.id} className="flex flex-col gap-4">
            {/* Header row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium opacity-60 font-mono">
                  id: {field.id}
                </span>
              </div>
              <button
                type="button"
                aria-label="Eliminar función"
                onClick={() => setDeleteIndex(idx)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Main fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Fecha"
                id={`funciones.${idx}.fecha`}
                type="date"
                {...register(`funciones.${idx}.fecha`)}
                error={fErrors?.fecha?.message}
              />
              <Input
                label="Hora"
                id={`funciones.${idx}.hora`}
                type="time"
                {...register(`funciones.${idx}.hora`)}
                error={fErrors?.hora?.message}
              />
              <Input
                label="Ciudad"
                id={`funciones.${idx}.ciudad`}
                placeholder="Ej: Buenos Aires"
                {...register(`funciones.${idx}.ciudad`)}
                error={fErrors?.ciudad?.message}
              />
              <Input
                label="Venue"
                id={`funciones.${idx}.venue`}
                placeholder="Ej: Luna Park"
                {...register(`funciones.${idx}.venue`)}
                error={fErrors?.venue?.message}
              />
            </div>

            {/* Purchase links + service charge toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor={`funciones.${idx}.linkCompra`} className="text-sm font-medium flex items-center gap-1.5">
                  <Link className="h-4 w-4 opacity-60" />
                  Link de compra USD
                </label>
                <Input
                  id={`funciones.${idx}.linkCompra`}
                  placeholder="https://ticketmundo.com/..."
                  {...register(`funciones.${idx}.linkCompra`)}
                  error={fErrors?.linkCompra?.message}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`funciones.${idx}.linkCompraBS`} className="text-sm font-medium flex items-center gap-1.5">
                  <Link className="h-4 w-4 opacity-60" />
                  Link de compra BS
                </label>
                <Input
                  id={`funciones.${idx}.linkCompraBS`}
                  placeholder="https://ticketmundo.com/..."
                  {...register(`funciones.${idx}.linkCompraBS`)}
                  error={(fErrors as Record<string, {message?: string}>)?.linkCompraBS?.message}
                />
              </div>
            </div>

            {/* Service charge toggle */}
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                {...register(`funciones.${idx}.incluyeCargos`)}
                className="h-4 w-4 rounded accent-brand cursor-pointer"
              />
              <span className="text-sm">Incluye cargos por servicio</span>
            </label>

            {/* Mapa */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Imagen del mapa</label>
              <div className="flex items-center gap-2">
                <Input
                  id={`funciones.${idx}.imagenMapa`}
                  placeholder="https://..."
                  {...register(`funciones.${idx}.imagenMapa`)}
                  error={fErrors?.imagenMapa?.message}
                  className="flex-1"
                />
                <UploadButton
                  eventoId={eventoId}
                  onUploaded={(url) => {
                    const old = getValues(`funciones.${idx}.imagenMapa`);
                    setValue(`funciones.${idx}.imagenMapa`, url, { shouldDirty: true });
                    if (old) deleteAsset(old);
                  }}
                  label="Subir"
                />
                {mapUrl && (
                  <button
                    type="button"
                    aria-label="Quitar imagen del mapa"
                    onClick={() => {
                      deleteAsset(mapUrl);
                      setValue(`funciones.${idx}.imagenMapa`, "", { shouldDirty: true });
                    }}
                    className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-input border border-line-light dark:border-line-dark hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              {mapUrl && (
                <ImagePreview
                  url={mapUrl}
                  alt="Mapa preview"
                  aspect="aspect-video"
                  className="mt-1"
                />
              )}
            </div>

            {/* Zonas nested */}
            <div className="border-t border-line-light dark:border-line-dark pt-3">
              <ZonasSubsection funcionIndex={idx} />
            </div>

            {/* Info adicional (deportes) */}
            <div className="border-t border-line-light dark:border-line-dark pt-3">
              <InfoAdicionalSubsection funcionIndex={idx} eventoId={eventoId} />
            </div>
          </Card>
        );
      })}

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Eliminar función"
        message="¿Seguro que querés eliminar esta función? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          if (deleteIndex !== null) {
            const mapUrl = getValues(`funciones.${deleteIndex}.imagenMapa`);
            if (mapUrl) deleteAsset(mapUrl);
            const info = getValues(`funciones.${deleteIndex}.infoAdicional`);
            if (info?.tipo === "equipos") {
              if (info.equipo1?.logo) deleteAsset(info.equipo1.logo);
              if (info.equipo2?.logo) deleteAsset(info.equipo2.logo);
            }
            remove(deleteIndex);
          }
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
      />
    </section>
  );
}
