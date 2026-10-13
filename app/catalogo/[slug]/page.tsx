import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { IntensityMeter } from "@/components/shop/IntensityMeter";
import { NotesPyramid } from "@/components/shop/NotesPyramid";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductImage } from "@/components/shop/ProductImage";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import {
  GENDER_LABELS,
  getProductBySlug,
  products,
} from "@/data/products";

interface PageProps {
  params: { slug: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  const title = `${product.brand} ${product.name}, decant de 5ml y 10ml`;
  const description = `Prueba ${product.brand} ${product.name} sin comprar la botella completa. Notas de salida: ${product.notes.salida.join(", ")}. Pide tu decant por WhatsApp.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: product.image, width: 1200, height: 1490 }],
    },
  };
}

export default function ProductPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  // Primero los del mismo género y luego los más vendidos, hasta completar 3.
  const related = products
    .filter((p) => p.slug !== product.slug)
    .sort(
      (a, b) =>
        Number(b.gender === product.gender) -
          Number(a.gender === product.gender) ||
        Number(b.bestseller) - Number(a.bestseller)
    )
    .slice(0, 3);

  return (
    <main id="contenido" className="container py-8 md:py-14">
      <Link
        href="/#catalogo"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver al catálogo
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <ProductImage
          product={product}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="rounded-lg lg:sticky lg:top-24 lg:self-start"
        />

        <div className="space-y-12 lg:pt-6">
          <header className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              {product.bestseller && (
                <span className="text-xs text-gold">Más vendido</span>
              )}
            </div>
            <h1 className="text-balance text-5xl leading-[1.05] md:text-6xl">
              {product.name}
            </h1>
            <p className="text-muted-foreground">
              {GENDER_LABELS[product.gender]}, en decants de 5ml y 10ml
            </p>
          </header>

          <section aria-labelledby="comprar">
            <h2 id="comprar" className="sr-only">
              Comprar
            </h2>
            <ProductPurchase product={product} stickyBar />
          </section>

          <section aria-labelledby="notas" className="space-y-6">
            <div className="flex items-end justify-between gap-3">
              <h2 id="notas" className="text-3xl">
                Notas
              </h2>
              <div className="flex items-end gap-3">
                <span className="text-sm text-muted-foreground">
                  Intensidad
                </span>
                <IntensityMeter value={product.intensidad} />
              </div>
            </div>
            <NotesPyramid notes={product.notes} />
          </section>

          <section aria-labelledby="ideal-para" className="space-y-4">
            <h2 id="ideal-para" className="text-3xl">
              Ideal para
            </h2>
            <ul className="flex flex-wrap gap-2">
              {product.ocasion.map((ocasion) => (
                <li
                  key={ocasion}
                  className="rounded-full border border-border px-4 py-1.5 text-sm"
                >
                  {ocasion}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section
        aria-labelledby="relacionados"
        className="mt-20 border-t border-border pt-12"
      >
        <h2 id="relacionados" className="text-3xl md:text-4xl">
          Otros perfumes que te pueden gustar
        </h2>
        <div className="mt-8">
          <ProductGrid items={related} filterable={false} />
        </div>
      </section>
    </main>
  );
}
