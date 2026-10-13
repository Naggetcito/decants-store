import { formatPrice, type Product, type Size } from "@/data/products";

/** Número en formato internacional, sin "+" ni espacios (requerido por wa.me). */
export const WHATSAPP_NUMBER = "51982704336";
export const WHATSAPP_DISPLAY = "+51 982 704 336";

export interface OrderLine {
  brand: string;
  name: string;
  size: Size;
  quantity: number;
  unitPrice: number;
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generalMessage(): string {
  return "Hola, quiero información sobre sus decants de perfumes.";
}

export function productInquiryMessage(product: Product, size: Size): string {
  return `Hola, me interesa el decant de ${product.brand} ${product.name} (${size}). ¿Está disponible?`;
}

export function orderTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
}

export function orderMessage(lines: OrderLine[]): string {
  const items = lines
    .map(
      (l) =>
        `• ${l.quantity}× ${l.brand} ${l.name} (${l.size}) — ${formatPrice(l.unitPrice * l.quantity)}`
    )
    .join("\n");

  return [
    "Hola, quiero hacer este pedido de decants:",
    "",
    items,
    "",
    `Total: ${formatPrice(orderTotal(lines))}`,
    "",
    "¿Me confirmas disponibilidad y forma de pago?",
  ].join("\n");
}
