import { StepsProgress } from "@/components/home/StepsProgress";

const STEPS = [
  {
    title: "Elige tu fragancia",
    text: "Explora el catálogo y decide entre 5ml para probar o 10ml para usarlo más tiempo.",
  },
  {
    title: "Envía tu pedido por WhatsApp",
    text: "Armas tu pedido en la tienda y lo mandas con un toque. Confirmamos disponibilidad contigo.",
  },
  {
    title: "Recibe tu decant",
    text: "Coordinamos pago y entrega. Te llega en un frasco con atomizador, listo para usar.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      className="py-20 md:py-28"
    >
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <h2 id="como-funciona-titulo" className="text-4xl md:text-5xl">
            ¿Qué es un decant?
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            Es una porción de un perfume original, trasvasada a un frasco
            pequeño con atomizador. Pruebas la fragancia por una fracción del
            precio de la botella.
          </p>
        </div>

        <StepsProgress steps={STEPS} />
      </div>
    </section>
  );
}
