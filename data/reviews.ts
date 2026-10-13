import type { Size } from "@/data/products";

export interface Review {
  id: string;
  author: string;
  /** Calificación de 1 a 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Perfume que compró (slug de data/products.ts). */
  productSlug: string;
  size: Size;
  /**
   * true = reseña de ejemplo (no es de un cliente real).
   * Al reemplazarla por una opinión real, poner false: la etiqueta
   * "Reseña de ejemplo" y el aviso de la sección desaparecen solos.
   */
  example: boolean;
}

// TODO: reemplazar por reseñas reales de clientes y poner example: false.
export const reviews: Review[] = [
  {
    id: "r1",
    author: "Caleb T.",
    rating: 5,
    text: "Quería probar One Million Elixir, agradezco mucho su atencion y rapidez!",
    productSlug: "One Million Elixir",
    size: "10ml",
    example: false,
  },
];
