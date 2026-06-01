import { TriangleAlert } from "lucide-react";

interface Props {
  notas: string[];
}

export function NotasSection({ notas }: Props) {
  if (!notas || notas.length === 0) return null;
  return (
    <div className="rounded-card border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-6">
      <div className="flex items-center gap-2 mb-4">
        <TriangleAlert className="h-4 w-4 text-yellow-400 shrink-0" />
        <h2 className="text-xl sm:text-[22px] font-bold">Importante</h2>
      </div>
      <ul className="flex flex-col gap-3">
        {notas.map((nota, i) => (
          <li key={i} className="flex items-start gap-2 text-[15px] sm:text-base text-gray-700 dark:text-white/70 leading-relaxed">
            <span className="mt-2 h-1 w-1 rounded-full bg-gray-500 dark:bg-white/40 shrink-0" />
            {nota}
          </li>
        ))}
      </ul>
    </div>
  );
}
