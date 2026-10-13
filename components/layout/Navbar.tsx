"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/components/cart/CartProvider";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { NAV_LINKS } from "@/components/layout/nav-links";
import { buildWhatsAppUrl, generalMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const iconButton =
  "relative grid size-11 place-items-center rounded-full text-foreground transition-transform duration-press ease-out-strong hover:bg-secondary active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function Navbar() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sin listener de scroll: un sentinel en el tope avisa cuando sale de pantalla.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting)
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Sección visible en el Home: el enlace correspondiente queda marcado.
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    if (pathname !== "/") {
      setActiveId(null);
      return;
    }
    const sections = NAV_LINKS.map((l) =>
      document.getElementById(l.href.split("#")[1])
    ).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
    <div
      ref={sentinelRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 h-2 w-px"
    />
    <header className="sticky top-0 z-40 w-full">
      {/* El blur vive siempre en su capa; solo se anima la opacidad. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 border-b border-border bg-background/80 backdrop-blur-md transition-opacity duration-200 ease-out-strong",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Saltar al contenido
      </a>

      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-xl tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Decants Store
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.href.split("#")[1];
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative py-2 text-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <m.span
                        layoutId="nav-activo"
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-0.5 h-px bg-gold"
                        transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            asChild
            variant="outline"
            className="h-11 gap-2 rounded-full border-gold/40 px-3 text-gold hover:text-gold sm:px-4"
          >
            <a
              href={buildWhatsAppUrl(generalMessage())}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribir por WhatsApp"
            >
              <WhatsAppIcon className="!size-5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </Button>

          <button
            id="boton-pedido"
            type="button"
            className={iconButton}
            onClick={openCart}
            aria-label={
              count > 0
                ? `Abrir pedido, ${count} ${count === 1 ? "decant" : "decants"}`
                : "Abrir pedido"
            }
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            {/* Aparece/desaparece con spring; cada cambio de cantidad vuelve a "saltar" desde 0.9 */}
            <AnimatePresence>
              {count > 0 && (
                <m.span
                  key="badge"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
                  className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-medium leading-none text-ink tabular-nums"
                  aria-hidden="true"
                >
                  <m.span
                    key={count}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
                  >
                    {count}
                  </m.span>
                </m.span>
              )}
            </AnimatePresence>
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className={cn(iconButton, "lg:hidden")}
                aria-label="Abrir menú"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-4/5 max-w-xs flex-col p-0">
              <SheetHeader className="px-6 pb-2 pt-6 text-left">
                <SheetTitle className="font-display text-xl font-medium">
                  Decants Store
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Navegación principal
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Menú móvil" className="flex-1 px-3 pt-4">
                <ul>
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <SheetClose asChild>
                        <Link
                          href={link.href}
                          className="block rounded-md px-3 py-3.5 font-display text-2xl hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <Button asChild size="lg" className="h-12 w-full gap-2 text-base">
                  <a
                    href={buildWhatsAppUrl(generalMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="!size-5" />
                    Escribir por WhatsApp
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
