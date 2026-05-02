export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-10">
      <h1 className="text-3xl font-bold tracking-tight text-emerald-950 dark:text-zinc-50">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-teal-900/75 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </header>
  );
}
