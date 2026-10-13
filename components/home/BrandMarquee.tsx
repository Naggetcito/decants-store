import { VelocityTrack } from "@/components/fx/VelocityTrack";
import { products } from "@/data/products";

const NAMES = products.map((p) => p.name);

function Row({ duplicate }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center gap-8 pr-8 md:gap-14 md:pr-14"
    >
      {NAMES.map((name) => (
        <li key={name} className="flex items-center gap-8 md:gap-14">
          <span className="whitespace-nowrap font-display text-3xl italic text-cream/80 md:text-5xl">
            {name}
          </span>
          <svg
            viewBox="0 0 10 10"
            aria-hidden="true"
            className="size-2 shrink-0 fill-gold md:size-2.5"
          >
            <path d="M5 0 10 5 5 10 0 5Z" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/**
 * Cinta infinita con los 10 perfumes. La segunda copia es solo visual (aria-hidden).
 * Avanza sola y el scroll la empuja con inercia; se frena con hover (solo con puntero) y se
 * detiene con movimiento reducido.
 */
export function BrandMarquee() {
  return (
    <section
      aria-label="Perfumes disponibles"
      className="mask-fade-x overflow-hidden border-b border-border py-8 md:py-12"
    >
      <VelocityTrack>
        <Row />
        <Row duplicate />
      </VelocityTrack>
    </section>
  );
}
