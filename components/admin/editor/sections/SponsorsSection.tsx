"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { UploadButton } from "@/components/admin/UploadButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteAsset } from "@/lib/delete-asset";
import type { EventoConfigInput } from "@/lib/schemas";
import { useState } from "react";

interface Props {
  eventoId: string;
}

export function SponsorsSection({ eventoId }: Props) {
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
    name: "sponsors",
  });

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  return (
    <section id="sponsors" className="flex flex-col gap-4 scroll-mt-32">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sponsors</h2>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ nombre: "", logo: "" })}
        >
          <Plus className="h-4 w-4" />
          Sponsor
        </Button>
      </div>

      {fields.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-10 opacity-50">
          <Tag className="h-8 w-8" />
          <p className="text-sm">Sin sponsors.</p>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field, idx) => {
          const logoUrl = watch(`sponsors.${idx}.logo`);
          const sErrors = errors.sponsors?.[idx];

          return (
            <Card key={field.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-60">
                  Sponsor {idx + 1}
                </span>
                <button
                  type="button"
                  aria-label="Eliminar sponsor"
                  onClick={() => setDeleteIndex(idx)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <Input
                label="Nombre"
                id={`sponsors.${idx}.nombre`}
                placeholder="Ej: Pepsi"
                {...register(`sponsors.${idx}.nombre`)}
                error={sErrors?.nombre?.message}
              />

              <Input
                label="Link (opcional)"
                id={`sponsors.${idx}.link`}
                placeholder="https://..."
                {...register(`sponsors.${idx}.link`)}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Logo</label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`sponsors.${idx}.logo`}
                    placeholder="https://..."
                    {...register(`sponsors.${idx}.logo`)}
                    error={sErrors?.logo?.message}
                    className="flex-1"
                  />
                  <UploadButton
                    eventoId={eventoId}
                    onUploaded={(url) => {
                      const old = getValues(`sponsors.${idx}.logo`);
                      setValue(`sponsors.${idx}.logo`, url, { shouldDirty: true });
                      if (old) deleteAsset(old);
                    }}
                  />
                </div>
                {logoUrl && (
                  <ImagePreview
                    url={logoUrl}
                    alt="Logo sponsor preview"
                    aspect="aspect-square"
                    className="max-w-[120px]"
                  />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Eliminar sponsor"
        message="¿Seguro que querés eliminar este sponsor?"
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          if (deleteIndex !== null) {
            const logoUrl = getValues(`sponsors.${deleteIndex}.logo`);
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
