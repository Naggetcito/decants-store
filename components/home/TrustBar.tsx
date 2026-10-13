// Textos genéricos a propósito: no prometen zonas de envío ni métodos de pago concretos.
const ITEMS = [
  {
    title: "Originales",
    text: "Fragancias de las marcas originales, decantadas con cuidado.",
  },
  {
    title: "Envío",
    text: "Coordinamos la entrega contigo por WhatsApp.",
  },
  {
    title: "Pago",
    text: "Confirmas tu pedido y acordamos el pago por WhatsApp.",
  },
] as const;

export function TrustBar() {
  return (
    <section aria-label="Garantías de la tienda" className="border-y border-border">
      <ul className="container grid grid-cols-1 md:grid-cols-3">
        {ITEMS.map(({ title, text }) => (
          <li
            key={title}
            className="flex items-baseline gap-4 border-b border-border py-6 last:border-b-0 md:block md:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0 md:first:pl-0"
          >
            <p className="w-28 shrink-0 font-display text-2xl italic text-gold md:w-auto md:text-3xl">
              {title}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground md:mt-3 md:max-w-[28ch]">
              {text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
