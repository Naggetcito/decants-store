"use client";

import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useInView,
  type Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Filters,
  type GenderFilter,
} from "@/components/shop/Filters";
import { ProductCard } from "@/components/shop/ProductCard";
import { QuickView } from "@/components/shop/QuickView";
import { products as allProducts, type Product } from "@/data/products";
import { matchesQuery } from "@/lib/search";

interface ProductGridProps {
  /** Por defecto, todo el catálogo. */
  items?: Product[];
  /** Muestra filtros y buscador (el catálogo). Sin ellos sirve para Bestsellers y relacionados. */
  filterable?: boolean;
  /** Reemplaza las clases de la lista (por ejemplo, para un carrusel en móvil). */
  listClassName?: string;
  itemClassName?: string;
  /** Entrada escalonada (50ms) solo la primera vez que la lista entra en pantalla. */
  staggerOnView?: boolean;
}

const EASE = [0.23, 1, 0.32, 1] as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: EASE, delay },
  }),
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15, ease: EASE } },
};

export function ProductGrid({
  items = allProducts,
  filterable = true,
  listClassName = "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4",
  itemClassName,
  staggerOnView = false,
}: ProductGridProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const inView = useInView(listRef, { once: true, margin: "-80px" });
  const [gender, setGender] = useState<GenderFilter>("todos");
  const [query, setQuery] = useState("");
  const [quickView, setQuickView] = useState<Product | null>(null);

  const matchingQuery = useMemo(
    () => items.filter((p) => matchesQuery(p, query)),
    [items, query]
  );

  const counts = useMemo<Record<GenderFilter, number>>(
    () => ({
      todos: matchingQuery.length,
      hombre: matchingQuery.filter((p) => p.gender === "hombre").length,
      mujer: matchingQuery.filter((p) => p.gender === "mujer").length,
      unisex: matchingQuery.filter((p) => p.gender === "unisex").length,
    }),
    [matchingQuery]
  );

  const visible = useMemo(
    () =>
      gender === "todos"
        ? matchingQuery
        : matchingQuery.filter((p) => p.gender === gender),
    [matchingQuery, gender]
  );

  const reset = () => {
    setGender("todos");
    setQuery("");
  };

  return (
    <div className="space-y-6">
      {filterable && (
        <>
          <Filters
            gender={gender}
            onGenderChange={setGender}
            query={query}
            onQueryChange={setQuery}
            counts={counts}
          />
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? "perfume" : "perfumes"}
          </p>
        </>
      )}

      {visible.length > 0 ? (
        <ul ref={listRef} className={listClassName}>
          {/* Catálogo: sin entrada; al filtrar, las tarjetas se reacomodan. BestSellers: stagger una vez. */}
          <AnimatePresence mode="popLayout" initial={staggerOnView}>
            {visible.map((product, index) => (
              <m.li
                key={product.id}
                layout={filterable ? "position" : false}
                className={itemClassName}
                variants={itemVariants}
                custom={staggerOnView ? index * 0.05 : 0}
                initial="hidden"
                animate={!staggerOnView || inView ? "show" : "hidden"}
                exit="exit"
                transition={{ layout: { duration: 0.28, ease: EASE } }}
              >
                <ProductCard product={product} onQuickView={setQuickView} />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <p className="font-display text-2xl">
            No encontramos perfumes con esa búsqueda
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Prueba con otra marca o con una nota, como vainilla o lavanda, o
            cambia el filtro.
          </p>
          <Button variant="outline" onClick={reset}>
            Limpiar filtros
          </Button>
        </div>
      )}

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
