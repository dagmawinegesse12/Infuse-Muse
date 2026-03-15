type Props = { eyebrow?: string; title: string; description?: string; };

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="max-w-2xl space-y-3">
      {eyebrow ? <p className="text-sm uppercase tracking-[0.2em] text-[#c79f3d]">{eyebrow}</p> : null}
      <h2 className="font-serif text-3xl text-emerald-950 sm:text-4xl">{title}</h2>
      {description ? <p className="text-base leading-7 text-emerald-950/65">{description}</p> : null}
    </div>
  );
}
