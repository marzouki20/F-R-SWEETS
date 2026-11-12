import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="bg-hero">
      <div className="container-page py-16 text-center md:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mx-auto mt-5 max-w-3xl text-5xl leading-[1.02] md:text-6xl">{title}</h1>
        <div className="gold-rule mx-auto mt-7 w-24" />
        {children && <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{children}</p>}
      </div>
    </section>
  );
}
