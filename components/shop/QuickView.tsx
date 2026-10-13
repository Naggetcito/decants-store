"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IntensityMeter } from "@/components/shop/IntensityMeter";
import { NotesPyramid } from "@/components/shop/NotesPyramid";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import { GENDER_LABELS, type Product } from "@/data/products";

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

/**
 * Móvil: foto 4:5 arriba con alto acotado (no aplasta la info) e info con scroll propio.
 * Desktop: dos columnas, foto a la izquierda.
 */
export function QuickView({ product, onClose }: QuickViewProps) {
  // Se conserva el último perfume para que el contenido no desaparezca durante el fundido de salida.
  const lastProduct = useRef<Product | null>(product);
  if (product) lastProduct.current = product;
  const shown = product ?? lastProduct.current;
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        ref={contentRef}
        // Foco en el diálogo (el lector anuncia el título) y no en el primer control.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          contentRef.current?.focus();
        }}
        className="flex max-h-[90dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg md:grid md:h-[min(90dvh,40rem)] md:max-w-4xl md:grid-cols-2"
      >
        {shown && (
          <div className="relative h-[36dvh] shrink-0 overflow-hidden bg-secondary md:h-full">
            {/* Misma foto desenfocada detrás: el 4:5 no deja bandas vacías en móvil */}
            <Image
              src={shown.image}
              alt=""
              aria-hidden="true"
              fill
              sizes="64px"
              className="scale-110 object-cover opacity-40 blur-2xl md:hidden"
            />
            <div className="relative mx-auto aspect-[4/5] h-full md:absolute md:inset-0 md:aspect-auto">
              <Image
                src={shown.image}
                alt={`Decant de ${shown.brand} ${shown.name}`}
                fill
                sizes="(min-width: 768px) 28rem, 60vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {shown && (
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-5 sm:p-6 md:p-8">
            <DialogHeader className="space-y-1 pr-12 text-left">
              <p className="text-sm text-muted-foreground">{shown.brand}</p>
              <DialogTitle className="font-display text-3xl font-medium leading-tight">
                {shown.name}
              </DialogTitle>
              <DialogDescription>
                {GENDER_LABELS[shown.gender]}. Ideal para{" "}
                {shown.ocasion.join(", ").toLowerCase()}.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-end justify-between gap-3">
              <span className="text-sm text-muted-foreground">Intensidad</span>
              <IntensityMeter value={shown.intensidad} />
            </div>

            <NotesPyramid notes={shown.notes} />

            <ProductPurchase key={shown.slug} product={shown} onAdded={onClose} />

            <Link
              href={`/catalogo/${shown.slug}`}
              onClick={onClose}
              className="flex min-h-11 items-center justify-center text-sm text-muted-foreground underline-offset-4 hover:text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Ver ficha completa
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
