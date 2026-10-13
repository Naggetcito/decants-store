import type { Product } from "@/data/products";

/** Minúsculas y sin tildes, para que "limon" encuentre "Limón". */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Todas las palabras de la búsqueda deben aparecer en marca, nombre, notas u ocasiones. */
export function matchesQuery(product: Product, query: string): boolean {
  const tokens = normalizeText(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const haystack = normalizeText(
    [
      product.brand,
      product.name,
      ...product.notes.salida,
      ...product.notes.corazon,
      ...product.notes.fondo,
      ...product.ocasion,
    ].join(" ")
  );
  return tokens.every((token) => haystack.includes(token));
}
