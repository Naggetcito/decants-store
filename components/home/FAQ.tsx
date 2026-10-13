import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { buildWhatsAppUrl, generalMessage } from "@/lib/whatsapp";

// Las respuestas sobre pago y envío son genéricas: ajustarlas cuando haya políticas definidas.
const QUESTIONS = [
  {
    q: "¿Qué es un decant?",
    a: "Es una porción de un perfume original, trasvasada a un frasco pequeño con atomizador. Sirve para probar una fragancia o usarla sin pagar la botella completa.",
  },
  {
    q: "¿Los perfumes son originales?",
    a: "Sí. Los decants se preparan a partir de frascos originales de cada marca.",
  },
  {
    q: "¿Cuántas pulverizaciones trae cada tamaño?",
    a: "Aproximadamente 50 el de 5ml y 100 el de 10ml. Depende del atomizador y de cuánto presiones.",
  },
  {
    q: "¿Cuánto dura el aroma en la piel?",
    a: "Depende de la fragancia, de tu piel y del clima. En el catálogo, cada perfume muestra su intensidad del 1 al 5 como referencia.",
  },
  {
    q: "¿Cómo hago mi pedido?",
    a: "Agrega los decants a tu pedido y envíalo por WhatsApp con un toque. Confirmamos disponibilidad contigo antes de seguir.",
  },
  {
    q: "¿Cómo pago y cómo recibo mi pedido?",
    a: "Una vez confirmado el pedido, coordinamos contigo por WhatsApp la forma de pago y la entrega.",
  },
] as const;

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-titulo"
      className="border-t border-border py-20 md:py-28"
    >
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-titulo" className="text-4xl md:text-5xl">
            Preguntas frecuentes
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            ¿Te quedó otra duda? Escríbenos por WhatsApp y te respondemos.
          </p>
          <a
            href={buildWhatsAppUrl(generalMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-gold underline-offset-4 hover:text-gold-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <WhatsAppIcon className="size-5" />
            Escribir por WhatsApp
          </a>
        </div>

        <Accordion type="single" collapsible className="border-t border-border">
          {QUESTIONS.map((item, index) => (
            <AccordionItem
              key={item.q}
              value={`pregunta-${index}`}
              className="border-border"
            >
              <AccordionTrigger className="gap-6 py-5 font-display text-xl font-medium hover:no-underline md:text-2xl">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="max-w-xl pb-6 text-base leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
