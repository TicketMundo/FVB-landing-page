interface Props {
  titulo: string;
  sinopsis: string;
}

export function InfoSection({ titulo, sinopsis }: Props) {
  if (!sinopsis && !titulo) return null;
  return (
    <div className="rounded-card border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-6">
      {titulo && (
        <h2 className="text-xl sm:text-[22px] font-bold mb-3">{titulo}</h2>
      )}
      {sinopsis && (
        <div
          className="prose prose-sm dark:prose-invert prose-p:text-gray-700 dark:prose-p:text-white/70 prose-p:leading-relaxed max-w-none text-[15px] sm:text-base"
          dangerouslySetInnerHTML={{ __html: sinopsis }}
        />
      )}
    </div>
  );
}
