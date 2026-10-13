import { ProductGrid } from "@/components/shop/ProductGrid";
import { getBestsellers } from "@/data/products";

export function BestSellers() {
  const items = getBestsellers();
  if (items.length === 0) return null;

  return (
    <section
      id="mas-pedidos"
      aria-labelledby="mas-pedidos-titulo"
      className="border-t border-border bg-card py-20 md:py-28"
    >
      <div className="container space-y-10">
        <div className="max-w-xl space-y-4">
          <h2 id="mas-pedidos-titulo" className="text-4xl md:text-5xl">
            Los más pedidos
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Si no sabes por dónde empezar, estas son las fragancias que más se
            piden.
          </p>
        </div>

        {/* Móvil: carrusel con snap (asoma la siguiente tarjeta). Desde md: grilla. */}
        <ProductGrid
          items={items}
          filterable={false}
          staggerOnView
          listClassName="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
          itemClassName="w-[68%] shrink-0 snap-center sm:w-[44%] md:w-auto"
        />
      </div>
    </section>
  );
}
