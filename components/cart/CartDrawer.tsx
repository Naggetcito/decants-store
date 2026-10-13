"use client";

import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MAX_QUANTITY, useCart } from "@/components/cart/CartProvider";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { formatPrice } from "@/data/products";
import { buildWhatsAppUrl, orderMessage } from "@/lib/whatsapp";

const stepperButton =
  "grid size-11 place-items-center rounded-full text-muted-foreground focus-visible:outline-offset-[-3px] transition-transform duration-press ease-out-strong hover:bg-secondary hover:text-foreground active:scale-[0.92] disabled:pointer-events-none disabled:opacity-40";

export function CartDrawer() {
  const { lines, total, isOpen, openCart, closeCart, setQuantity, removeItem } =
    useCart();
  const isEmpty = lines.length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="space-y-1 px-6 pb-4 pt-6 text-left">
          <SheetTitle className="font-display text-2xl font-medium">
            Tu pedido
          </SheetTitle>
          <SheetDescription>
            {isEmpty
              ? "Todavía no agregaste decants."
              : "Revisa tus decants y envía el pedido por WhatsApp."}
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 pb-16 text-center">
            <span className="grid size-14 place-items-center rounded-full border border-border text-gold">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1.5">
              <p className="font-display text-xl">Tu pedido está vacío</p>
              <p className="text-sm text-muted-foreground">
                Elige tus decants en el catálogo y envíalos juntos por WhatsApp.
              </p>
            </div>
            <Button asChild onClick={closeCart}>
              <Link href="/#catalogo">Ver catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="relative flex-1 divide-y divide-border overflow-y-auto overscroll-contain border-t border-border px-6">
              {/* Entran y salen por la derecha (el lado del drawer); las demás suben con layout */}
              <AnimatePresence initial={false} mode="popLayout">
              {lines.map((line) => {
                const atOne = line.quantity === 1;
                return (
                  <m.li
                    key={`${line.slug}-${line.size}`}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: 24,
                      transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
                    }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-start gap-4 bg-background py-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        {line.brand}
                      </p>
                      <p className="font-display text-lg leading-snug">
                        {line.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Decant de {line.size}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(line.unitPrice)} c/u
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <p className="text-sm font-medium tabular-nums">
                        {formatPrice(line.unitPrice * line.quantity)}
                      </p>
                      <div className="flex items-center overflow-hidden rounded-full border border-border">
                        <button
                          type="button"
                          className={stepperButton}
                          aria-label={
                            atOne
                              ? `Quitar ${line.name} ${line.size}`
                              : `Quitar una unidad de ${line.name} ${line.size}`
                          }
                          onClick={() =>
                            atOne
                              ? removeItem(line.slug, line.size)
                              : setQuantity(
                                  line.slug,
                                  line.size,
                                  line.quantity - 1
                                )
                          }
                        >
                          {atOne ? (
                            <Trash2 className="size-4" aria-hidden="true" />
                          ) : (
                            <Minus className="size-4" aria-hidden="true" />
                          )}
                        </button>
                        <span
                          className="w-6 text-center text-sm tabular-nums"
                          aria-label={`Cantidad: ${line.quantity}`}
                        >
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className={stepperButton}
                          aria-label={`Agregar una unidad de ${line.name} ${line.size}`}
                          disabled={line.quantity >= MAX_QUANTITY}
                          onClick={() =>
                            setQuantity(line.slug, line.size, line.quantity + 1)
                          }
                        >
                          <Plus className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </m.li>
                );
              })}
              </AnimatePresence>
            </ul>

            <div className="space-y-4 border-t border-border bg-card px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-3xl tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>
              <Button asChild size="lg" className="h-12 w-full gap-2 text-base">
                <a
                  href={buildWhatsAppUrl(orderMessage(lines))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="!size-5" />
                  Pedir por WhatsApp
                </a>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Confirmamos disponibilidad y coordinamos pago y entrega por
                WhatsApp.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
