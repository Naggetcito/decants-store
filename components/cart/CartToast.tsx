"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartProvider";

const EASE = [0.23, 1, 0.32, 1] as const;
const VISIBLE_MS = 3200;

/**
 * Confirmación al agregar. Entra desde abajo y sale hacia abajo (150ms).
 * En móvil queda sobre el botón flotante de WhatsApp para no taparlo.
 */
export function CartToast() {
  const { toast, dismissToast, openCart, isOpen } = useCart();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(dismissToast, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  useEffect(() => {
    if (isOpen) dismissToast();
  }, [isOpen, dismissToast]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:bottom-8 md:justify-end md:pr-28"
    >
      <AnimatePresence mode="popLayout">
        {toast && (
          <m.div
            key={toast.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24, transition: { duration: 0.15, ease: EASE } }}
            transition={{ duration: 0.25, ease: EASE }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border border-gold/30 bg-popover/95 p-2 pr-2 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.8)] backdrop-blur-md"
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-secondary">
              <Image
                src={toast.image}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-xs text-gold">
                <Check aria-hidden="true" className="size-3.5" />
                Agregado al pedido
              </p>
              <p className="truncate text-sm">
                {toast.name}, {toast.size}
              </p>
            </div>
            <Button
              variant="outline"
              className="h-11 shrink-0 px-3 text-sm"
              onClick={() => {
                // El aviso se desmonta: al cerrar el pedido, el foco vuelve al carrito del navbar.
                document
                  .getElementById("boton-pedido")
                  ?.focus({ preventScroll: true });
                dismissToast();
                openCart();
              }}
            >
              Ver pedido
            </Button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
