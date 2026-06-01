"use client";
import {
  Info,
  CalendarDays,
  StickyNote,
  Images,
  Music,
  Building2,
  Tag,
  Store,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";

export interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: "info", label: "Info General", icon: Info },
  { id: "funciones", label: "Funciones", icon: CalendarDays },
  { id: "notas", label: "Notas", icon: StickyNote },
  { id: "galeria", label: "Galería", icon: Images },
  { id: "spotify", label: "Spotify", icon: Music },
  { id: "productoras", label: "Productoras", icon: Building2 },
  { id: "sponsors", label: "Sponsors", icon: Tag },
  { id: "merch", label: "Merch", icon: Store },
];

interface Props {
  activeSection: string;
  onSelect: (id: string) => void;
}

export function SectionNav({ activeSection, onSelect }: Props) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    onSelect(id);
  }

  return (
    <>
      {/* Sidebar — visible on lg+ */}
      <nav
        aria-label="Secciones del editor"
        className="hidden lg:flex flex-col gap-1 sticky top-[calc(3.5rem+4rem)] h-fit"
      >
        {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={clsx(
              "flex items-center gap-2.5 w-full px-3 py-2 rounded-input text-sm transition-colors text-left",
              activeSection === id
                ? "bg-brand/10 text-brand font-medium"
                : "hover:bg-base-light dark:hover:bg-base-dark opacity-70 hover:opacity-100"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Horizontal tabs — visible below lg */}
      <nav
        aria-label="Secciones del editor"
        className="lg:hidden flex gap-1 overflow-x-auto pb-1 border-b border-line-light dark:border-line-dark mb-4 scrollbar-hide"
      >
        {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={clsx(
              "flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-input text-sm transition-colors shrink-0",
              activeSection === id
                ? "bg-brand/10 text-brand font-medium"
                : "hover:bg-base-light dark:hover:bg-base-dark opacity-70 hover:opacity-100"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
