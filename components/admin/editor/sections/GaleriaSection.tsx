"use client";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2, Images, Youtube, ImageIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { UploadButton } from "@/components/admin/UploadButton";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteAsset } from "@/lib/delete-asset";
import clsx from "clsx";
import type { EventoConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

/** Extract YouTube video ID from common URL formats */
function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  // youtube.com/embed/ID
  const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  return null;
}

function YoutubeThumbnail({ url }: { url: string }) {
  const id = extractYoutubeId(url);
  if (!id) {
    return (
      <div className="aspect-video rounded-input border border-line-light dark:border-line-dark bg-base-light dark:bg-base-dark flex items-center justify-center opacity-40">
        <Youtube className="h-8 w-8" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
      alt="YouTube thumbnail"
      className="aspect-video w-full rounded-input object-cover border border-line-light dark:border-line-dark"
      loading="lazy"
    />
  );
}

export function GaleriaSection({ eventoId }: Props) {
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
    name: "galeria",
  });

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  return (
    <section id="galeria" className="flex flex-col gap-4 scroll-mt-32">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Galería</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ tipo: "imagen", url: "" })}
          >
            <ImageIcon className="h-4 w-4" />
            Imagen
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ tipo: "youtube", url: "" })}
          >
            <Youtube className="h-4 w-4" />
            YouTube
          </Button>
        </div>
      </div>

      {fields.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-10 opacity-50">
          <Images className="h-8 w-8" />
          <p className="text-sm">Sin elementos en la galería.</p>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field, idx) => {
          const tipo = watch(`galeria.${idx}.tipo`);
          const url = watch(`galeria.${idx}.url`);
          const gErrors = errors.galeria?.[idx];

          return (
            <Card key={field.id} className="flex flex-col gap-3">
              {/* Type toggle */}
              <div className="flex items-center justify-between gap-2">
                <Controller
                  control={control}
                  name={`galeria.${idx}.tipo`}
                  render={({ field: f }) => (
                    <div className="flex rounded-input border border-line-light dark:border-line-dark overflow-hidden">
                      {(["imagen", "youtube"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => f.onChange(t)}
                          className={clsx(
                            "flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors",
                            f.value === t
                              ? "bg-brand text-white"
                              : "hover:bg-base-light dark:hover:bg-base-dark opacity-60"
                          )}
                        >
                          {t === "imagen" ? (
                            <ImageIcon className="h-3 w-3" />
                          ) : (
                            <Youtube className="h-3 w-3" />
                          )}
                          {t === "imagen" ? "Imagen" : "YouTube"}
                        </button>
                      ))}
                    </div>
                  )}
                />
                <button
                  type="button"
                  aria-label="Eliminar item"
                  onClick={() => setDeleteIndex(idx)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* URL input */}
              {tipo === "imagen" ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id={`galeria.${idx}.url`}
                      placeholder="https://..."
                      {...register(`galeria.${idx}.url`)}
                      error={gErrors?.url?.message}
                      className="flex-1"
                    />
                    <UploadButton
                      eventoId={eventoId}
                      onUploaded={(u) => {
                        const old = getValues(`galeria.${idx}.url`);
                        setValue(`galeria.${idx}.url`, u, { shouldDirty: true });
                        if (old) deleteAsset(old);
                      }}
                    />
                  </div>
                  <ImagePreview url={url} alt={`Galería ${idx + 1}`} />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Input
                    id={`galeria.${idx}.url`}
                    placeholder="https://youtu.be/..."
                    {...register(`galeria.${idx}.url`)}
                    error={gErrors?.url?.message}
                  />
                  <YoutubeThumbnail url={url ?? ""} />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Eliminar item"
        message="¿Seguro que querés eliminar este elemento de la galería?"
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          if (deleteIndex !== null) {
            const tipo = getValues(`galeria.${deleteIndex}.tipo`);
            const url = getValues(`galeria.${deleteIndex}.url`);
            if (tipo === "imagen" && url) deleteAsset(url);
            remove(deleteIndex);
          }
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
      />
    </section>
  );
}
