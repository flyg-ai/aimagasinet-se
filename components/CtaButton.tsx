type Variant = 'solid' | 'outline' | 'sm';

const STYLES: Record<Variant, string> = {
  solid:
    'inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-accent-fg transition-colors hover:bg-accent-hover',
  outline:
    'inline-flex items-center justify-center gap-2 rounded-md border border-accent-soft-border bg-accent-soft px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent transition-colors hover:text-accent-hover',
  sm:
    'inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-fg transition-colors hover:bg-accent-hover',
};

export function CtaButton({
  url,
  label,
  variant = 'solid',
  className = '',
}: {
  url: string | null | undefined;
  label: string;
  variant?: Variant;
  className?: string;
}) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`${STYLES[variant]} ${className}`}
    >
      <span>{label}</span>
      <span aria-hidden>→</span>
    </a>
  );
}
