import { cn } from "@/lib/utils";

interface IntensityMeterProps {
  value: number;
  className?: string;
}

/** 5 barras: las llenas en dorado. */
export function IntensityMeter({ value, className }: IntensityMeterProps) {
  return (
    <span
      role="img"
      aria-label={`Intensidad ${value} de 5`}
      className={cn("inline-flex items-end gap-1", className)}
    >
      {[1, 2, 3, 4, 5].map((level) => (
        <span
          key={level}
          aria-hidden="true"
          className={cn(
            "w-1 rounded-full",
            level <= value ? "bg-gold" : "bg-border"
          )}
          style={{ height: `${6 + level * 3}px` }}
        />
      ))}
    </span>
  );
}
