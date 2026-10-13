"use client";

import { useId, type CSSProperties } from "react";
import {
  SIZES,
  formatPrice,
  getPrice,
  type Product,
  type Size,
} from "@/data/products";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  product: Product;
  value: Size;
  onChange: (size: Size) => void;
  className?: string;
}

// Nivel del líquido según el volumen: el de 10ml se ve casi lleno, el de 5ml a la mitad.
const LEVEL: Record<Size, number> = { "5ml": 0.5, "10ml": 0.84 };

/**
 * Radios nativos (teclado y lectores de pantalla sin código extra). La opción elegida
 * se llena de líquido hasta su nivel; al cambiar, una se vacía y la otra se llena.
 */
export function SizeSelector({
  product,
  value,
  onChange,
  className,
}: SizeSelectorProps) {
  const name = useId();

  return (
    <fieldset className={cn("grid grid-cols-2 gap-2", className)}>
      <legend className="sr-only">
        Tamaño del decant de {product.brand} {product.name}
      </legend>
      {SIZES.map((size) => {
        const checked = value === size;
        return (
          <label
            key={size}
            className={cn(
              "relative isolate block min-h-11 cursor-pointer overflow-hidden whitespace-nowrap rounded-md border px-1.5 py-2 text-center transition-colors duration-200 sm:px-3 sm:py-2.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
              checked ? "border-gold/70" : "border-input hover:border-gold/50"
            )}
          >
            <input
              type="radio"
              name={name}
              value={size}
              checked={checked}
              onChange={() => onChange(size)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              data-filled={checked || undefined}
              className="size-liquid liquid-surface"
              style={{ "--level": LEVEL[size] } as CSSProperties}
            />
            <span className="block text-xs text-muted-foreground">{size}</span>
            <span className="block text-sm font-medium tabular-nums">
              {formatPrice(getPrice(product, size))}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
