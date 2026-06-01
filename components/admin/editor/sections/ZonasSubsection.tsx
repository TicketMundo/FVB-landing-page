"use client";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { EventoConfigInput } from "@/lib/schemas";

interface Props {
  funcionIndex: number;
}

export function ZonasSubsection({ funcionIndex }: Props) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EventoConfigInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `funciones.${funcionIndex}.zonas`,
  });

  const funcionErrors = errors.funciones?.[funcionIndex]?.zonas;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium opacity-70">Zonas</h4>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ nombre: "", precioUSD: 0, color: "#E63946" })}
        >
          <Plus className="h-3.5 w-3.5" />
          Zona
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs opacity-40 italic">Sin zonas. Añadir al menos una.</p>
      )}

      {fields.map((field, zIdx) => {
        const zErrors = Array.isArray(funcionErrors)
          ? funcionErrors[zIdx]
          : undefined;

        return (
          <div
            key={field.id}
            className="flex items-start gap-2 p-3 rounded-input bg-base-light dark:bg-base-dark border border-line-light dark:border-line-dark"
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
              <Input
                label="Nombre de zona"
                id={`funciones.${funcionIndex}.zonas.${zIdx}.nombre`}
                placeholder="Ej: General"
                {...register(
                  `funciones.${funcionIndex}.zonas.${zIdx}.nombre`
                )}
                error={zErrors?.nombre?.message}
              />
              <Controller
                control={control}
                name={`funciones.${funcionIndex}.zonas.${zIdx}.precioUSD`}
                render={({ field: f }) => (
                  <Input
                    label="Precio USD"
                    id={`funciones.${funcionIndex}.zonas.${zIdx}.precioUSD`}
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={f.value ?? ""}
                    onChange={(e) =>
                      f.onChange(parseFloat(e.target.value) || 0)
                    }
                    error={zErrors?.precioUSD?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name={`funciones.${funcionIndex}.zonas.${zIdx}.color`}
                render={({ field: f }) => {
                  const value =
                    typeof f.value === "string" && /^#[0-9a-fA-F]{6}$/.test(f.value)
                      ? f.value
                      : "#E63946";
                  return (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Color</label>
                      <div className="flex items-center gap-2 h-10 px-2 rounded-input border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark">
                        <input
                          type="color"
                          aria-label="Color picker"
                          value={value}
                          onChange={(e) => f.onChange(e.target.value)}
                          className="h-6 w-8 cursor-pointer rounded border border-line-light dark:border-line-dark bg-transparent p-0"
                        />
                        <input
                          type="text"
                          aria-label="Color hex"
                          value={f.value ?? ""}
                          onChange={(e) => {
                            const next = e.target.value.startsWith("#")
                              ? e.target.value
                              : `#${e.target.value}`;
                            f.onChange(next);
                          }}
                          onBlur={f.onBlur}
                          maxLength={7}
                          placeholder="#E63946"
                          spellCheck={false}
                          className="w-20 bg-transparent text-sm font-mono outline-none placeholder:opacity-40"
                        />
                      </div>
                      {zErrors?.color?.message && (
                        <span className="text-xs text-brand">
                          {zErrors.color.message}
                        </span>
                      )}
                    </div>
                  );
                }}
              />
            </div>
            <button
              type="button"
              aria-label="Eliminar zona"
              onClick={() => remove(zIdx)}
              className="mt-6 h-8 w-8 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
