import { TextReveal } from "./Reveal";

export default function SectionHeading({
  index,
  slug,
  title,
  sub,
}: {
  index: string;
  slug: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <p className="mb-4 font-mono text-xs tracking-widest text-faint">
        <span className="text-accent">{index}</span> — ~/{slug}
      </p>
      <TextReveal
        text={title}
        className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
      />
      {sub && <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}
