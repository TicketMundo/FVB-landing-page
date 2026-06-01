"use client";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { EventoConfigInput } from "@/lib/schemas";

/**
 * NotasSection manages a string[] with useWatch + setValue instead of
 * useFieldArray (which requires object arrays). This gives clean TypeScript
 * without casts and correct RHF dirty tracking.
 */
export function NotasSection() {
  const { control, setValue, register } = useFormContext<EventoConfigInput>();
  const notas: string[] = useWatch({ control, name: "notas" }) ?? [];

  const [newNota, setNewNota] = useState("");

  function addNota() {
    const trimmed = newNota.trim();
    if (!trimmed) return;
    setValue("notas", [...notas, trimmed], { shouldDirty: true });
    setNewNota("");
  }

  function removeNota(idx: number) {
    setValue(
      "notas",
      notas.filter((_, i) => i !== idx),
      { shouldDirty: true }
    );
  }

  function moveNota(from: number, to: number) {
    if (to < 0 || to >= notas.length) return;
    const next = [...notas];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setValue("notas", next, { shouldDirty: true });
  }

  return (
    <section id="notas" className="flex flex-col gap-4 scroll-mt-32">
      <h2 className="text-lg font-semibold">Notas</h2>

      {/* Add note input */}
      <Card>
        <div className="flex gap-2">
          <Input
            id="nueva-nota"
            placeholder="Nueva nota..."
            value={newNota}
            onChange={(e) => setNewNota(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNota();
              }
            }}
            className="flex-1"
            aria-label="Nueva nota"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addNota}>
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </Card>

      {notas.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 opacity-40">
          <StickyNote className="h-7 w-7" />
          <p className="text-sm">Sin notas.</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {notas.map((nota, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 p-3 rounded-card border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark"
          >
            {/* Up/Down order controls */}
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                aria-label="Mover arriba"
                disabled={idx === 0}
                onClick={() => moveNota(idx, idx - 1)}
                className="h-5 w-5 inline-flex items-center justify-center rounded hover:bg-base-light dark:hover:bg-base-dark disabled:opacity-30 transition-colors"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Mover abajo"
                disabled={idx === notas.length - 1}
                onClick={() => moveNota(idx, idx + 1)}
                className="h-5 w-5 inline-flex items-center justify-center rounded hover:bg-base-light dark:hover:bg-base-dark disabled:opacity-30 transition-colors"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Bind each string field individually via register */}
            <Input
              id={`notas-${idx}`}
              {...register(`notas.${idx}`)}
              defaultValue={nota}
              className="flex-1"
              placeholder="Nota..."
              aria-label={`Nota ${idx + 1}`}
            />

            <button
              type="button"
              aria-label={`Eliminar nota ${idx + 1}`}
              onClick={() => removeNota(idx)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-input hover:bg-brand/10 text-brand transition-colors shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
