import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Quantité",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const btn = cn(
    "flex items-center justify-center rounded-full text-plum transition-colors hover:bg-lavender-soft disabled:opacity-40",
    size === "sm" ? "h-8 w-8" : "h-10 w-10",
  );
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Diminuer la quantité">
        <Minus className="h-4 w-4" />
      </button>
      <span className={cn("min-w-8 text-center font-ui font-medium text-plum", size === "sm" ? "text-sm" : "")} aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Augmenter la quantité">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
