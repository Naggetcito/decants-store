export type Gender = "hombre" | "mujer" | "unisex";
export type Size = "5ml" | "10ml";
export type Ocasion =
  | "Diario"
  | "Oficina"
  | "Casual"
  | "Citas"
  | "Noche"
  | "Fiestas"
  | "Eventos"
  | "Verano"
  | "Invierno";

export interface Product {
  id: string;
  slug: string;
  /** Foto 4:5 en /public/images/products/<slug>.jpg */
  image: string;
  name: string;
  brand: string;
  gender: Gender;
  price5ml: number;
  price10ml: number;
  notes: {
    salida: string[];
    corazon: string[];
    fondo: string[];
  };
  /** 1 (suave) a 5 (muy intenso) */
  intensidad: 1 | 2 | 3 | 4 | 5;
  ocasion: Ocasion[];
  bestseller: boolean;
}

export const SIZES: Size[] = ["5ml", "10ml"];

export const GENDER_LABELS: Record<Gender, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
  unisex: "Unisex",
};

// TODO: los precios son PLACEHOLDER. Cambiar por los reales.
export const CURRENCY = "S/";

export const products: Product[] = [
  {
    id: "1",
    slug: "paco-rabanne-one-million-elixir",
    image: "/images/products/paco-rabanne-one-million-elixir.jpg",
    name: "One Million Elixir",
    brand: "Paco Rabanne",
    gender: "hombre",
    price5ml: 16,
    price10ml: 29,
    notes: {
      salida: ["Davana", "Manzana"],
      corazon: ["Rosa damascena", "Osmanthus", "Cedro"],
      fondo: ["Vainilla absoluta", "Haba tonka", "Pachulí"],
    },
    intensidad: 4,
    ocasion: ["Noche", "Citas", "Fiestas"],
    bestseller: false,
  },
  {
    id: "2",
    slug: "jean-paul-gaultier-le-male-elixir",
    image: "/images/products/jean-paul-gaultier-le-male-elixir.jpg",
    name: "Le Male Elixir",
    brand: "Jean Paul Gaultier",
    gender: "hombre",
    price5ml: 18,
    price10ml: 32,
    notes: {
      salida: ["Lavanda", "Menta"],
      corazon: ["Vainilla", "Benjuí"],
      fondo: ["Miel", "Haba tonka", "Tabaco"],
    },
    intensidad: 5,
    ocasion: ["Noche", "Citas", "Invierno"],
    bestseller: true,
  },
  {
    id: "3",
    slug: "dior-sauvage-elixir",
    image: "/images/products/dior-sauvage-elixir.jpg",
    name: "Sauvage Elixir",
    brand: "Dior",
    gender: "hombre",
    price5ml: 22,
    price10ml: 40,
    notes: {
      salida: ["Pomelo", "Canela", "Nuez moscada", "Cardamomo"],
      corazon: ["Lavanda"],
      fondo: ["Ámbar", "Regaliz", "Vetiver", "Pachulí", "Sándalo"],
    },
    intensidad: 5,
    ocasion: ["Noche", "Citas", "Eventos"],
    bestseller: true,
  },
  {
    id: "4",
    slug: "louis-vuitton-imagination",
    image: "/images/products/louis-vuitton-imagination.jpg",
    name: "Imagination",
    brand: "Louis Vuitton",
    gender: "unisex",
    price5ml: 28,
    price10ml: 50,
    notes: {
      salida: ["Bergamota de Calabria", "Naranja siciliana", "Cidra siciliana"],
      corazon: ["Neroli de Túnez", "Jengibre", "Canela de Ceilán"],
      fondo: ["Ambroxan", "Té negro chino", "Olíbano", "Madera de guayaco"],
    },
    intensidad: 3,
    ocasion: ["Diario", "Oficina", "Verano"],
    bestseller: false,
  },
  {
    id: "5",
    slug: "carolina-herrera-212-men",
    image: "/images/products/carolina-herrera-212-men.jpg",
    name: "212 Men",
    brand: "Carolina Herrera",
    gender: "hombre",
    price5ml: 12,
    price10ml: 22,
    notes: {
      salida: ["Notas verdes", "Pomelo", "Bergamota", "Lavanda"],
      corazon: ["Jengibre", "Violeta", "Gardenia", "Salvia"],
      fondo: ["Almizcle", "Sándalo", "Vetiver", "Incienso"],
    },
    intensidad: 3,
    ocasion: ["Diario", "Oficina", "Casual"],
    bestseller: false,
  },
  {
    id: "6",
    slug: "carolina-herrera-good-girl",
    image: "/images/products/carolina-herrera-good-girl.jpg",
    name: "Good Girl",
    brand: "Carolina Herrera",
    gender: "mujer",
    price5ml: 14,
    price10ml: 26,
    notes: {
      salida: ["Almendra", "Café", "Bergamota", "Limón"],
      corazon: ["Tuberosa", "Jazmín sambac", "Flor de azahar", "Iris"],
      fondo: ["Haba tonka", "Cacao", "Vainilla", "Praliné", "Sándalo"],
    },
    intensidad: 4,
    ocasion: ["Noche", "Citas", "Fiestas"],
    bestseller: true,
  },
  {
    id: "7",
    slug: "prada-paradoxe",
    image: "/images/products/prada-paradoxe.jpg",
    name: "Paradoxe",
    brand: "Prada",
    gender: "mujer",
    price5ml: 16,
    price10ml: 29,
    notes: {
      salida: ["Bergamota de Calabria", "Mandarina", "Pera"],
      corazon: ["Neroli", "Flor de naranjo de Túnez", "Jazmín sambac"],
      fondo: ["Vainilla de Madagascar", "Benjuí", "Ámbar", "Almizcle blanco"],
    },
    intensidad: 3,
    ocasion: ["Diario", "Citas", "Eventos"],
    bestseller: false,
  },
  {
    id: "8",
    slug: "lattafa-yara-candy",
    image: "/images/products/lattafa-yara-candy.jpg",
    name: "Yara Candy",
    brand: "Lattafa",
    gender: "mujer",
    price5ml: 8,
    price10ml: 14,
    notes: {
      salida: ["Mandarina verde", "Grosella negra"],
      corazon: ["Caramelo de fresa", "Gardenia"],
      fondo: ["Sándalo", "Sirope de vainilla", "Almizcle", "Ámbar"],
    },
    intensidad: 3,
    ocasion: ["Diario", "Casual", "Citas"],
    bestseller: true,
  },
  {
    id: "9",
    slug: "ariana-grande-cloud-pink",
    image: "/images/products/ariana-grande-cloud-pink.jpg",
    name: "Cloud Pink",
    brand: "Ariana Grande",
    gender: "mujer",
    price5ml: 9,
    price10ml: 16,
    notes: {
      salida: ["Piña rosa", "Fruta del dragón", "Frutos rojos"],
      corazon: ["Orquídea de vainilla", "Agua de coco", "Ambrette rosado"],
      fondo: ["Musgo de cristal", "Maderas ámbar", "Almizcle", "Praliné"],
    },
    intensidad: 3,
    ocasion: ["Casual", "Verano", "Diario"],
    bestseller: false,
  },
  {
    id: "10",
    slug: "giorgio-armani-acqua-di-gio-profondo",
    image: "/images/products/giorgio-armani-acqua-di-gio-profondo.jpg",
    name: "Acqua di Giò Profondo",
    brand: "Giorgio Armani",
    gender: "hombre",
    price5ml: 15,
    price10ml: 27,
    notes: {
      salida: ["Notas marinas", "Aquozone", "Bergamota", "Mandarina verde"],
      corazon: ["Romero", "Lavanda", "Ciprés", "Lentisco"],
      fondo: ["Notas minerales", "Almizcle", "Pachulí", "Ámbar"],
    },
    intensidad: 3,
    ocasion: ["Diario", "Oficina", "Verano"],
    bestseller: false,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.bestseller);
}

export function getPrice(product: Product, size: Size): number {
  return size === "5ml" ? product.price5ml : product.price10ml;
}

export function formatPrice(amount: number): string {
  return `${CURRENCY} ${amount}`;
}
