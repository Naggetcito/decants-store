"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartProvider";
import { IntensityMeter } from "@/components/shop/IntensityMeter";
import { ProductImage } from "@/components/shop/ProductImage";
import { SizeSelector } from "@/components/shop/SizeSelector";
import { GENDER_LABELS, type Product, type Size } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

/** Pensada primero para 2 columnas a 360px (~150px de ancho); crece desde sm. */
export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState<Size>("10ml");

  const scentSummary = [
    ...product.notes.salida.slice(0, 2),
    ...product.notes.corazon.slice(0, 1),
    ...product.notes.fondo.slice(0, 1),
  ].join(", ");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card hover:border-gold/40">
      <div className="relative">
        <ProductImage
          product={product}
          zoomOnHover
          reveal
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
        />
        {product.bestseller && (
          <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-[11px] text-gold backdrop-blur-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
            Más vendido
          </span>
        )}
        {onQuickView && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-2 right-2 z-10 size-11 rounded-full border-border/60 bg-ink/70 backdrop-blur-sm hover:bg-ink sm:bottom-auto sm:right-3 sm:top-3"
            onClick={() => onQuickView(product)}
            aria-label={`Vista rápida de ${product.brand} ${product.name}`}
          >
            <Eye aria-hidden="true" />
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="truncate text-xs text-muted-foreground sm:text-sm">
          {product.brand}
        </p>
        <h3 className="mt-0.5 text-base leading-snug sm:mt-1 sm:text-xl lg:text-2xl lg:leading-tight">
          <Link
            href={`/catalogo/${product.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
          {GENDER_LABELS[product.gender]}
        </p>

        {/* min-h = 2 líneas: la fila de abajo queda alineada entre tarjetas */}
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-foreground/80 sm:mt-4 sm:min-h-[2.85rem] sm:text-sm sm:leading-relaxed">
          {scentSummary}
        </p>

        <div className="relative z-10 mt-auto space-y-2.5 pt-3 sm:space-y-3 sm:pt-5">
          <div className="flex items-end justify-between gap-2">
            <span className="text-[11px] text-muted-foreground sm:text-xs">
              Intensidad
            </span>
            <IntensityMeter value={product.intensidad} />
          </div>
          <SizeSelector
            product={product}
            value={size}
            onChange={setSize}
            className="gap-1.5 sm:gap-2"
          />
          <Button
            className="h-11 w-full px-2 text-sm"
            onClick={() => addItem(product, size)}
          >
            Agregar
            <span className="sr-only sm:not-sr-only"> al pedido</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
