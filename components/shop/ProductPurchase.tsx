"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartProvider";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { SizeSelector } from "@/components/shop/SizeSelector";
import {
  SIZES,
  formatPrice,
  getPrice,
  type Product,
  type Size,
} from "@/data/products";
import { buildWhatsAppUrl, productInquiryMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;

interface ProductPurchaseProps {
  product: Product;
  /** Se llama justo antes de abrir el carrito (p. ej. para cerrar la vista rápida). */
  onAdded?: () => void;
  /** En la ficha: barra fija abajo en móvil/tablet cuando el bloque sale de pantalla. */
  stickyBar?: boolean;
}

/** El precio cambia con un desplazamiento corto en vez de saltar. */
function Price({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={value}
          initial={{ transform: "translateY(60%)", opacity: 0 }}
          animate={{ transform: "translateY(0%)", opacity: 1 }}
          exit={{ transform: "translateY(-60%)", opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="tabular-nums"
        >
          {formatPrice(value)}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

/** Tamaño, precio, agregar al pedido y consulta por WhatsApp. Lo usan QuickView y la ficha. */
export function ProductPurchase({
  product,
  onAdded,
  stickyBar,
}: ProductPurchaseProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState<Size>("10ml");
  const blockRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    if (!stickyBar || !blockRef.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      // Solo cuando el bloque quedó arriba (ya lo pasaste), no antes de llegar.
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    );
    observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, [stickyBar]);

  const add = () => {
    onAdded?.();
    addItem(product, size);
  };

  return (
    <>
      <div ref={blockRef} className="space-y-4">
        <SizeSelector product={product} value={size} onChange={setSize} />

        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            Decant de {size}
          </span>
          <Price value={getPrice(product, size)} className="font-display text-3xl" />
        </div>

        <Button size="lg" className="h-12 w-full text-base" onClick={add}>
          Agregar al pedido
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 w-full gap-2 border-gold/40 text-gold hover:text-gold"
        >
          <a
            href={buildWhatsAppUrl(productInquiryMessage(product, size))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="!size-5" />
            Preguntar por este perfume
          </a>
        </Button>
      </div>

      {stickyBar && (
        <AnimatePresence>
          {showBar && (
            <m.div
              initial={{ transform: "translateY(100%)" }}
              animate={{ transform: "translateY(0%)" }}
              exit={{ transform: "translateY(100%)" }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden"
            >
              <div className="container flex items-center gap-3">
                <div
                  role="radiogroup"
                  aria-label="Tamaño"
                  className="flex shrink-0 rounded-full border border-input p-1"
                >
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={size === s}
                      onClick={() => setSize(s)}
                      className="relative h-9 rounded-full px-3 text-xs"
                    >
                      {size === s && (
                        <m.span
                          layoutId="barra-tamano"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-gold"
                          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                        />
                      )}
                      <span className={cn("relative", size === s && "text-ink")}>
                        {s}
                      </span>
                    </button>
                  ))}
                </div>
                <Button className="h-11 flex-1 gap-2 text-sm" onClick={add}>
                  Agregar
                  <Price value={getPrice(product, size)} />
                </Button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
