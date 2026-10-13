import Link from "next/link";
import { Star } from "lucide-react";
import { getProductBySlug } from "@/data/products";
import { reviews } from "@/data/reviews";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      aria-label={`${rating} de 5 estrellas`}
      className="inline-flex gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={cn(
            "size-4",
            n <= rating ? "fill-gold text-gold" : "text-border"
          )}
        />
      ))}
    </span>
  );
}

export function Reviews() {
  const hasExamples = reviews.some((r) => r.example);

  return (
    <section
      id="resenas"
      aria-labelledby="resenas-titulo"
      className="border-t border-border bg-card py-20 md:py-28"
    >
      <div className="container space-y-10">
        <div className="max-w-xl space-y-4">
          <h2 id="resenas-titulo" className="text-4xl md:text-5xl">
            Lo que dicen quienes los prueban
          </h2>
          {hasExamples && (
            <p
              role="note"
              className="rounded-md border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-gold-light"
            >
              Estas reseñas son de ejemplo, no son de clientes reales.
              Reemplázalas en <code>data/reviews.ts</code> antes de publicar.
            </p>
          )}
        </div>

        <ul className="columns-1 gap-4 md:columns-2 lg:columns-3 [&>li]:mb-4">
          {reviews.map((review) => {
            const product = getProductBySlug(review.productSlug);
            return (
              <li key={review.id} className="break-inside-avoid">
                <figure className="space-y-4 rounded-lg border border-border bg-background p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Stars rating={review.rating} />
                    {review.example && (
                      <span className="rounded-full border border-gold/40 px-2.5 py-0.5 text-xs text-gold">
                        Reseña de ejemplo
                      </span>
                    )}
                  </div>
                  <blockquote className="font-display text-lg leading-relaxed">
                    {review.text}
                  </blockquote>
                  <figcaption className="text-sm">
                    <span className="text-foreground">{review.author}</span>
                    {product && (
                      <span className="block text-muted-foreground">
                        Compró{" "}
                        <Link
                          href={`/catalogo/${product.slug}`}
                          className="underline-offset-4 hover:text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {product.brand} {product.name}
                        </Link>
                        , {review.size}
                      </span>
                    )}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
