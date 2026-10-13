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
    author: "Camila R.",
    rating: 5,
    text: "Quería probar Good Girl antes de pagar la botella completa. Con el decant de 5ml tuve semanas para decidir. Llegó bien cerrado y con la etiqueta clara.",
    productSlug: "carolina-herrera-good-girl",
    size: "5ml",
    example: true,
  },
  {
    id: "r2",
    author: "Diego M.",
    rating: 5,
    text: "Sauvage Elixir es de mis favoritos, pero la botella me queda lejos del presupuesto. El de 10ml me alcanza para varias salidas.",
    productSlug: "dior-sauvage-elixir",
    size: "10ml",
    example: true,
  },
  {
    id: "r3",
    author: "Valeria S.",
    rating: 5,
    text: "Dulce pero no empalaga. Es el decant que más uso para el día a día, y por ese precio no me arriesgo si no me gusta.",
    productSlug: "lattafa-yara-candy",
    size: "5ml",
    example: true,
  },
  {
    id: "r4",
    author: "Andrés T.",
    rating: 4,
    text: "Fresco y limpio, ideal para la oficina. Le doy cuatro estrellas porque esperaba que durara un poco más en mi piel, pero lo volvería a pedir.",
    productSlug: "giorgio-armani-acqua-di-gio-profondo",
    size: "10ml",
    example: true,
  },
  {
    id: "r5",
    author: "Lucía P.",
    rating: 5,
    text: "Pedí por WhatsApp y me ayudaron a elegir el tamaño. Pude probar Paradoxe sin comprometerme con la botella.",
    productSlug: "prada-paradoxe",
    size: "5ml",
    example: true,
  },
  {
    id: "r6",
    author: "Mateo G.",
    rating: 5,
    text: "Imagination en botella es carísimo. Con el decant lo usé en distintos días y confirmé que es el que quiero comprar completo.",
    productSlug: "louis-vuitton-imagination",
    size: "5ml",
    example: true,
  },
];
