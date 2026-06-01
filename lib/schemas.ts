import { z } from "zod";

export const zonaSchema = z.object({
  nombre: z.string().min(1),
  precioUSD: z.number().nonnegative(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color hex inválido (formato #RRGGBB)")
    .default("#E63946")
});

export const equipoInfoSchema = z.object({
  nombre: z.string().default(""),
  logo: z.string().default(""),
});

export const infoAdicionalSchema = z.object({
  tipo: z.enum(["equipos", "texto"]),
  texto: z.string().optional().default(""),
  equipo1: equipoInfoSchema.optional(),
  equipo2: equipoInfoSchema.optional(),
});

export const funcionSchema = z.object({
  id: z.string().min(1),
  fecha: z.string().min(1),
  hora: z.string().min(1),
  ciudad: z.string().min(1),
  venue: z.string().min(1),
  imagenMapa: z.string().default(""),
  zonas: z.array(zonaSchema).default([]),
  linkCompra: z.string().optional().default(""),
  linkCompraBS: z.string().optional().default(""),
  incluyeCargos: z.boolean().optional().default(true),
  infoAdicional: infoAdicionalSchema.optional(),
});

export const galeriaItemSchema = z.object({
  tipo: z.enum(["imagen", "youtube"]),
  url: z.string().min(1)
});

export const productoraSchema = z.object({
  nombre: z.string().min(1),
  instagram: z.string().default(""),
  logo: z.string().default(""),
  link: z.string().optional().default("")
});

export const sponsorSchema = z.object({
  nombre: z.string().min(1),
  logo: z.string().default(""),
  link: z.string().optional().default(""),
});

export const merchSchema = z.object({
  imagen: z.string().default(""),
  link: z.string().default("")
});

export const eventoConfigSchema = z.object({
  titulo: z.string().default(""),
  sinopsis: z.string().default(""),
  banner: z.string().default(""),
  bannerMovil: z.string().optional().default(""),
  spotify: z.string().optional().default(""),
  ventaInicio: z.string().optional().default(""),
  tituloCountdown: z.string().optional().default(""),
  logoLink: z.string().optional().default("/"),
  notas: z.array(z.string()).optional().default([]),
  tema: z.enum(["dark", "light"]).optional().default("dark"),
  tituloFunciones: z.string().optional().default(""),
  funciones: z.array(funcionSchema).default([]),
  galeria: z.array(galeriaItemSchema).optional().default([]),
  tituloProductoras: z.string().optional().default(""),
  productoras: z.array(productoraSchema).optional().default([]),
  sponsors: z.array(sponsorSchema).optional().default([]),
  merch: merchSchema.optional(),
  terminos: z.string().optional().default(""),
  imagenIntro: z.string().optional().default(""),
  colorPrincipal: z.string().optional().default("#E63946"),
  colorSecundario: z.string().optional().default("#1A1A1A")
});

export const loginSchema = z.object({
  user: z.string().trim().min(3, "Mínimo 3 caracteres"),
  password: z.string().min(6, "Mínimo 6 caracteres")
});

export type EventoConfigInput = z.infer<typeof eventoConfigSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
