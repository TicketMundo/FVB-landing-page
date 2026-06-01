"use client";
import { useFormContext, Controller } from "react-hook-form";
import { Timer, Link2, Palette, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { UploadButton } from "@/components/admin/UploadButton";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { deleteAsset } from "@/lib/delete-asset";
import type { EventoConfigInput } from "@/lib/schemas";

interface Props {
  eventoId: string;
}

function isValidHttpUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidHex(v: string | undefined): v is string {
  return typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v);
}

function ColorPickerField({
  label,
  name,
  defaultColor,
}: {
  label: string;
  name: "colorPrincipal" | "colorSecundario";
  defaultColor: string;
}) {
  const { control } = useFormContext<EventoConfigInput>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: f }) => {
        const value = isValidHex(f.value) ? f.value : defaultColor;
        return (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex items-center gap-2 h-10 px-2 rounded-input border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark">
              <input
                type="color"
                aria-label={label}
                value={value}
                onChange={(e) => f.onChange(e.target.value)}
                className="h-6 w-8 cursor-pointer rounded border border-line-light dark:border-line-dark bg-transparent p-0"
              />
              <input
                type="text"
                aria-label={`${label} hex`}
                value={f.value ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  const next = raw.startsWith("#") ? raw : `#${raw}`;
                  f.onChange(next);
                }}
                onBlur={f.onBlur}
                maxLength={7}
                placeholder={defaultColor}
                spellCheck={false}
                className="w-20 bg-transparent text-sm font-mono outline-none placeholder:opacity-40"
              />
            </div>
          </div>
        );
      }}
    />
  );
}

function ButtonPreview({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium opacity-60">Preview de botones</span>
      <div className="grid grid-cols-2 gap-3">
        {/* Dark */}
        <div className="flex flex-col gap-2 rounded-input p-4 bg-[#0D0D0D] border border-white/10">
          <span className="text-[10px] text-white/40 uppercase tracking-widest">Dark</span>
          <button
            type="button"
            style={{ backgroundColor: primary }}
            className="w-full py-2 rounded-input text-sm font-bold text-white"
          >
            Comprar tickets
          </button>
          <button
            type="button"
            style={{ backgroundColor: secondary }}
            className="w-full py-2 rounded-input text-sm font-semibold text-white"
          >
            Ver más
          </button>
        </div>
        {/* Light */}
        <div className="flex flex-col gap-2 rounded-input p-4 bg-gray-50 border border-black/10">
          <span className="text-[10px] text-black/40 uppercase tracking-widest">Light</span>
          <button
            type="button"
            style={{ backgroundColor: primary }}
            className="w-full py-2 rounded-input text-sm font-bold text-white"
          >
            Comprar tickets
          </button>
          <button
            type="button"
            style={{ backgroundColor: secondary }}
            className="w-full py-2 rounded-input text-sm font-semibold text-white"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}

export function InfoSection({ eventoId }: Props) {
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<EventoConfigInput>();

  const bannerUrl = watch("banner");
  const bannerMovilUrl = watch("bannerMovil");
  const imagenIntroUrl = watch("imagenIntro");
  const colorPrincipal = watch("colorPrincipal");
  const colorSecundario = watch("colorSecundario");

  const showBannerPreview = bannerUrl ? isValidHttpUrl(bannerUrl) : false;
  const showBannerMovilPreview = bannerMovilUrl ? isValidHttpUrl(bannerMovilUrl) : false;
  const showIntroPreview = imagenIntroUrl ? isValidHttpUrl(imagenIntroUrl) : false;
  const primary = isValidHex(colorPrincipal) ? colorPrincipal : "#E63946";
  const secondary = isValidHex(colorSecundario) ? colorSecundario : "#1A1A1A";

  return (
    <section id="info" className="flex flex-col gap-4 scroll-mt-32">
      <h2 className="text-lg font-semibold">Info General</h2>

      {/* Color pickers */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <Palette className="h-4 w-4 opacity-60" />
          Colores del evento
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorPickerField label="Color principal" name="colorPrincipal" defaultColor="#E63946" />
          <ColorPickerField label="Color secundario" name="colorSecundario" defaultColor="#1A1A1A" />
        </div>

        {/* Theme toggle */}
        <Controller
          name="tema"
          render={({ field: f }) => {
            const isDark = f.value !== "light";
            return (
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Tema de la landing</span>
                  <span className="text-xs opacity-50">Modo de color de la página pública</span>
                </div>
                <div className="flex rounded-input border border-line-light dark:border-line-dark overflow-hidden">
                  <button
                    type="button"
                    onClick={() => f.onChange("dark")}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${isDark ? "bg-brand text-white" : "opacity-60 hover:opacity-100"}`}
                  >
                    Oscuro
                  </button>
                  <button
                    type="button"
                    onClick={() => f.onChange("light")}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${!isDark ? "bg-brand text-white" : "opacity-60 hover:opacity-100"}`}
                  >
                    Claro
                  </button>
                </div>
              </div>
            );
          }}
        />

        <ButtonPreview primary={primary} secondary={secondary} />
      </Card>

      {/* Main info */}
      <Card className="flex flex-col gap-4">
        <Input
          label="Título del evento"
          id="titulo"
          placeholder="Ej: Corina Smith — Tour 2026"
          {...register("titulo")}
          error={errors.titulo?.message}
        />

        {/* Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Banner desktop */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Banner desktop</label>
            <div className="flex items-center gap-2">
              <Input
                id="banner"
                placeholder="https://..."
                {...register("banner")}
                error={errors.banner?.message}
                className="flex-1"
              />
              <UploadButton
                eventoId={eventoId}
                onUploaded={(url) => {
                  const old = getValues("banner");
                  setValue("banner", url, { shouldDirty: true });
                  if (old) deleteAsset(old);
                }}
                label="Subir"
              />
            </div>
            {showBannerPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bannerUrl}
                alt="Banner desktop preview"
                className="rounded-input border border-line-light dark:border-line-dark object-cover mt-1 w-full h-auto"
                loading="lazy"
              />
            )}
          </div>

          {/* Banner móvil */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Banner móvil</label>
            <div className="flex items-center gap-2">
              <Input
                id="bannerMovil"
                placeholder="https://..."
                {...register("bannerMovil")}
                className="flex-1"
              />
              <UploadButton
                eventoId={eventoId}
                onUploaded={(url) => {
                  const old = getValues("bannerMovil");
                  setValue("bannerMovil", url, { shouldDirty: true });
                  if (old) deleteAsset(old);
                }}
                label="Subir"
              />
            </div>
            {showBannerMovilPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bannerMovilUrl}
                alt="Banner móvil preview"
                className="rounded-input border border-line-light dark:border-line-dark object-cover mt-1 w-full h-auto"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* Imagen de intro */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Imagen de intro
            <span className="ml-2 text-xs font-normal opacity-40">(condicional)</span>
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="imagenIntro"
              placeholder="https://..."
              {...register("imagenIntro")}
              error={errors.imagenIntro?.message}
              className="flex-1"
            />
            <UploadButton
              eventoId={eventoId}
              onUploaded={(url) => {
                const old = getValues("imagenIntro");
                setValue("imagenIntro", url, { shouldDirty: true });
                if (old) deleteAsset(old);
              }}
              label="Subir"
            />
            {imagenIntroUrl && (
              <button
                type="button"
                aria-label="Quitar imagen de intro"
                onClick={() => {
                  deleteAsset(imagenIntroUrl);
                  setValue("imagenIntro", "", { shouldDirty: true });
                }}
                className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-input border border-line-light dark:border-line-dark hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {showIntroPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagenIntroUrl}
              alt="Imagen de intro preview"
              className="rounded-input border border-line-light dark:border-line-dark object-cover mt-1"
              style={{ maxWidth: 400, width: "100%", height: "auto" }}
              loading="lazy"
            />
          )}
        </div>

        {/* Sinopsis */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Sinopsis</label>
          <Controller
            name="sinopsis"
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Descripción del evento..."
                maxLength={2000}
              />
            )}
          />
          {errors.sinopsis?.message && (
            <span className="text-xs text-brand">{errors.sinopsis.message}</span>
          )}
        </div>

        {/* Venta inicio */}
        <div className="flex flex-col gap-1">
          <label htmlFor="ventaInicio" className="text-sm font-medium flex items-center gap-1.5">
            <Timer className="h-4 w-4 opacity-60" />
            Salida a la venta (opcional)
          </label>
          <Input
            id="ventaInicio"
            type="datetime-local"
            {...register("ventaInicio")}
            error={errors.ventaInicio?.message}
          />
          <span className="text-xs opacity-50">
            Mientras no llegue esta fecha, la landing mostrará un contador y los botones estarán deshabilitados.
          </span>
        </div>

        <Input
          label='Texto del contador (deja vacío para usar el default)'
          id="tituloCountdown"
          placeholder="Ej: La venta inicia en..."
          {...register("tituloCountdown")}
        />

        {/* Link logo header */}
        <div className="flex flex-col gap-1">
          <label htmlFor="logoLink" className="text-sm font-medium flex items-center gap-1.5">
            <Link2 className="h-4 w-4 opacity-60" />
            Link logo header
          </label>
          <Input
            id="logoLink"
            placeholder="/"
            {...register("logoLink")}
            error={errors.logoLink?.message}
          />
          <span className="text-xs opacity-50">
            URL a donde redirige el logo en el header de la landing. Default: /
          </span>
        </div>
      </Card>
    </section>
  );
}
