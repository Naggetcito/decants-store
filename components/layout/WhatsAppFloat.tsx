"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { buildWhatsAppUrl, generalMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function WhatsAppFloat() {
  // En la ficha, móvil y tablet usan la barra de compra fija: el flotante se oculta para no taparla.
  const onProductPage = usePathname().startsWith("/catalogo/");

  return (
    <a
      href={buildWhatsAppUrl(generalMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className={cn(
        "fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 place-items-center rounded-full bg-gold text-ink shadow-[inset_0_1px_0_hsl(var(--gold-light)),0_12px_32px_-8px_hsl(var(--gold)/0.55)] transition-transform duration-press ease-out-strong hover:bg-gold-light active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-6 md:right-6",
        "size-14",
        onProductPage ? "hidden lg:grid" : "grid"
      )}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
