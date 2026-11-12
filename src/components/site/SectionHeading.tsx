import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "", className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-4xl leading-[1.05] md:text-5xl">{title}</h2>
      <div className={cn("gold-rule mt-6 w-24", align === "center" ? "mx-auto" : "")} />
      {children && <p className="mt-6 text-[1.02rem] leading-relaxed text-muted-foreground">{children}</p>}
    </div>
  );
}
