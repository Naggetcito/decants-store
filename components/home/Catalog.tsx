import { ProductGrid } from "@/components/shop/ProductGrid";
import { products } from "@/data/products";

export function Catalog() {
  return (
    <section
      id="catalogo"
      aria-labelledby="catalogo-titulo"
      className="border-t border-border py-20 md:py-28"
    >
      <div className="container space-y-10">
        <div className="max-w-xl space-y-4">
          <h2 id="catalogo-titulo" className="text-4xl md:text-5xl">
            Catálogo
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {products.length} fragancias de diseñador. Filtra por género o busca
            por perfume, marca o nota.
          </p>
        </div>
        <ProductGrid />
      </div>
    </section>
  );
}
