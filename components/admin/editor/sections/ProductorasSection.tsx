"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Building2, AtSign, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { UploadButton } from "@/components/admin/UploadButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteAsset } from "@/lib/delete-asset";
import type { EventoConfigInput } from "@/lib/schemas";
import { useState } from "react";

interface Props {
  eventoId: string;
}

export function ProductorasSection({ eventoId }: Props) {
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
    name: "productoras",
  });

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  return (
    <section id="productoras" className="flex flex-col gap-4 scroll-mt-32">
      <h2 className="text-lg font-semibold">Productoras</h2>
      <Input
        label='Título de sección (deja vacío para usar "Organiza")'
        id="tituloProductoras"
        placeholder="Ej: Organiza, Producción, Presentado por..."
        {...register("tituloProductoras")}
      />
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ nombre: "", instagram: "", logo: "", link: "" })}
        >
          <Plus className="h-4 w-4" />
          Productora
        </Button>
      </div>

      {fields.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-10 opacity-50">
          <Building2 className="h-8 w-8" />
          <p className="text-sm">Sin productoras.</p>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {fields.map((field, idx) => {
          const logoUrl = watch(`productoras.${idx}.logo`);
          const pErrors = errors.productoras?.[idx];

          return (
            <Card key={field.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-60">
                  Productora {idx + 1}
                </span>
                <button
                  type="button"
                  aria-label="Eliminar productora"
                  onClick={() => setDeleteIndex(idx)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Nombre"
                  id={`productoras.${idx}.nombre`}
                  placeholder="Ej: YummyLive"
                  {...register(`productoras.${idx}.nombre`)}
                  error={pErrors?.nombre?.message}
                />
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`productoras.${idx}.instagram`}
                    className="text-sm font-medium flex items-center gap-1"
                  >
                    <AtSign className="h-3.5 w-3.5 opacity-60" />
                    Instagram
                  </label>
                  <Input
                    id={`productoras.${idx}.instagram`}
                    placeholder="yummylive"
                    {...register(`productoras.${idx}.instagram`)}
                    error={pErrors?.instagram?.message}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor={`productoras.${idx}.link`}
                  className="text-sm font-medium flex items-center gap-1"
                >
                  <Link2 className="h-3.5 w-3.5 opacity-60" />
                  Link (opcional)
                </label>
                <Input
                  id={`productoras.${idx}.link`}
                  placeholder="https://..."
                  {...register(`productoras.${idx}.link`)}
                  error={pErrors?.link?.message}
                />
                <span className="text-xs opacity-50">
                  Si se agrega, la productora será clickeable en la landing.
                </span>
              </div>

              {/* Logo */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Logo</label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`productoras.${idx}.logo`}
                    placeholder="https://..."
                    {...register(`productoras.${idx}.logo`)}
                    error={pErrors?.logo?.message}
                    className="flex-1"
                  />
                  <UploadButton
                    eventoId={eventoId}
                    onUploaded={(url) => {
                      const old = getValues(`productoras.${idx}.logo`);
                      setValue(`productoras.${idx}.logo`, url, { shouldDirty: true });
                      if (old) deleteAsset(old);
                    }}
                  />
                </div>
                {logoUrl && (
                  <div className="relative w-20 h-20">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoUrl}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label="Quitar logo"
                      onClick={() => {
                        deleteAsset(logoUrl);
                        setValue(`productoras.${idx}.logo`, "", { shouldDirty: true });
                      }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Eliminar productora"
        message="¿Seguro que querés eliminar esta productora?"
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          if (deleteIndex !== null) {
            const logoUrl = getValues(`productoras.${deleteIndex}.logo`);
            if (logoUrl) deleteAsset(logoUrl);
            remove(deleteIndex);
          }
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
      />
    </section>
  );
}
