import Image from "next/image";
import { InkReveal } from "@/components/fx/InkReveal";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  product: Product;
  sizes: string;
  priority?: boolean;
  /** Escala sutil de la foto al pasar el puntero sobre el `group` padre. */
  zoomOnHover?: boolean;
  /** Entra con el revelado de tinta la primera vez que aparece en pantalla. */
  reveal?: boolean;
  className?: string;
}

/** Foto 4:5. El fondo ocupa el espacio mientras carga: sin saltos de layout. */
export function ProductImage({
  product,
  sizes,
  priority,
  zoomOnHover,
  reveal,
  className,
}: ProductImageProps) {
  const image = (
    <Image
      src={product.image}
      alt={`Decant de ${product.brand} ${product.name}`}
      fill
      sizes={sizes}
      priority={priority}
      className={cn(
        "object-cover transform-gpu",
        zoomOnHover &&
          "transition-transform duration-300 ease-out-strong motion-reduce:transition-none motion-reduce:group-hover:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
      )}
    />
  );

  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden bg-secondary",
        className
      )}
    >
      {reveal ? <InkReveal className="absolute inset-0">{image}</InkReveal> : image}
    </div>
  );
}
