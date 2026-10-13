import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { buildWhatsAppUrl, generalMessage } from "@/lib/whatsapp";

export function FinalCTA() {
  return (
    <section
      aria-labelledby="cta-final-titulo"
      className="border-t border-border bg-card py-20 md:py-28"
    >
      <div className="container grid grid-cols-1 items-end gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <h2
            id="cta-final-titulo"
            className="text-balance text-4xl leading-[1.1] md:text-6xl"
          >
            Tu próxima fragancia empieza con 5ml
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Elige tu perfume, arma tu pedido y envíalo por WhatsApp.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch">
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="#catalogo">Ver catálogo</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 gap-2 border-gold/40 px-6 text-base text-gold hover:text-gold"
          >
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
      </div>
    </section>
  );
}
