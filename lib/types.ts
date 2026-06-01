export interface Zona {
  nombre: string;
  precioUSD: number;
  color: string;
}

export interface EquipoInfo {
  nombre: string;
  logo: string;
}

export interface InfoAdicional {
  tipo: "equipos" | "texto";
  texto?: string;
  equipo1?: EquipoInfo;
  equipo2?: EquipoInfo;
}

export interface Funcion {
  id: string;
  fecha: string;
  hora: string;
  ciudad: string;
  venue: string;
  imagenMapa: string;
  zonas: Zona[];
  linkCompra?: string;
  linkCompraBS?: string;
  incluyeCargos?: boolean;
  infoAdicional?: InfoAdicional;
}

export interface GaleriaItem {
  tipo: "imagen" | "youtube";
  url: string;
}

export interface Productora {
  nombre: string;
  instagram: string;
  logo: string;
  link?: string;
}

export interface Sponsor {
  nombre: string;
  logo: string;
  link?: string;
}

export interface Merch {
  imagen: string;
  link: string;
}

export interface EventoConfig {
  titulo: string;
  sinopsis: string;
  banner: string;
  bannerMovil?: string;
  spotify?: string;
  ventaInicio?: string;
  logoLink?: string;
  notas?: string[];
  tema?: "dark" | "light";
  tituloFunciones?: string;
  tituloCountdown?: string;
  tituloProductoras?: string;
  funciones: Funcion[];
  galeria?: GaleriaItem[];
  productoras?: Productora[];
  sponsors?: Sponsor[];
  merch?: Merch;
  terminos?: string;
  imagenIntro?: string;
  colorPrincipal?: string;
  colorSecundario?: string;
}

export interface BackupItem {
  key: string;
  name: string;
  lastModified: string;
  size: number;
}

export interface SessionUser {
  user: string;
  nombre: string;
}

export const DEFAULT_EVENTO_CONFIG: EventoConfig = {
  titulo: "",
  sinopsis: "",
  banner: "",
  spotify: "",
  notas: [],
  funciones: [],
  galeria: [],
  productoras: [],
  sponsors: [],
  merch: undefined
};
