"use client";
import { useFormContext } from "react-hook-form";
import { Store, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { UploadButton } from "@/components/admin/UploadButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { deleteAsset } from "@/lib/delete-asset";
import type { EventoConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

export function MerchSection({ eventoId }: Props) {
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<EventoConfigInput>();

  const merch = watch("merch");
  const [enabled, setEnabled] = useState(merch !== undefined && merch !== null);

  // Sync enabled state when form resets
  useEffect(() => {
    setEnabled(merch !== undefined && merch !== null);
  }, [merch]);

  function handleToggle(checked: boolean) {
    setEnabled(checked);
    if (checked) {
      // Initialize with empty merch if not set
      const current = getValues("merch");
      if (!current) {
        setValue("merch", { imagen: "", link: "" }, { shouldDirty: true });
      }
    } else {
      setValue("merch", undefined, { shouldDirty: true });
    }
  }

  const imagenUrl = watch("merch.imagen");
  const merchErrors = errors.merch;

  return (
    <section id="merch" className="flex flex-col gap-4 scroll-mt-32">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Merch</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              onChange={(e) => handleToggle(e.target.checked)}
            />
            <div className="w-10 h-5 bg-line-light dark:bg-line-dark rounded-full peer-checked:bg-brand transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
          </div>
          <span className="text-sm opacity-70">
            {enabled ? "Activo" : "Inactivo"}
          </span>
        </label>
      </div>

      {!enabled ? (
        <Card className="flex flex-col items-center gap-2 py-10 opacity-50">
          <Store className="h-8 w-8" />
          <p className="text-sm">Merch desactivado.</p>
        </Card>
      ) : (
        <Card className="flex flex-col gap-4">
          {/* Imagen */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Imagen del merch</label>
            <div className="flex items-center gap-2">
              <Input
                id="merch-imagen"
                placeholder="https://..."
                {...register("merch.imagen")}
                error={merchErrors?.imagen?.message}
                className="flex-1"
              />
              <UploadButton
                eventoId={eventoId}
                onUploaded={(url) => {
                  const old = getValues("merch.imagen");
                  setValue("merch.imagen", url, { shouldDirty: true });
                  if (old) deleteAsset(old);
                }}
              />
            </div>
            {imagenUrl && (
              <ImagePreview
                url={imagenUrl}
                alt="Merch preview"
                aspect="aspect-video"
                className="mt-1"
              />
            )}
          </div>

          {/* Link */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="merch-link"
              className="text-sm font-medium flex items-center gap-1.5"
            >
              <LinkIcon className="h-3.5 w-3.5 opacity-60" />
              Link de la tienda
            </label>
            <Input
              id="merch-link"
              placeholder="https://tienda.ejemplo.com"
              type="url"
              {...register("merch.link")}
              error={merchErrors?.link?.message}
            />
          </div>
        </Card>
      )}
    </section>
  );
}
