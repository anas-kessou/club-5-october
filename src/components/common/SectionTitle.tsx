interface SectionTitleProps {
  overline?: string
  title: string
  subtitle?: string
}

export function SectionTitle({ overline, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-8 max-w-3xl">
      {overline ? <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-primary">{overline}</p> : null}
      <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-muted-foreground">{subtitle}</p> : null}
    </div>
  )
}
