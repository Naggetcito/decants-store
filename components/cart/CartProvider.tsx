"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SIZES,
  getPrice,
  getProductBySlug,
  type Product,
  type Size,
} from "@/data/products";
import { orderTotal, type OrderLine } from "@/lib/whatsapp";

const STORAGE_KEY = "decants-store:cart:v1";
export const MAX_QUANTITY = 10;

/** Solo se guarda lo mínimo; el precio siempre se lee de data/products.ts. */
interface StoredLine {
  slug: string;
  size: Size;
  quantity: number;
}

export interface CartLine extends OrderLine {
  slug: string;
}

interface CartContextValue {
  lines: CartLine[];
  /** Total de unidades (suma de cantidades). */
  count: number;
  total: number;
  isOpen: boolean;
  addItem: (product: Product, size: Size, quantity?: number) => void;
  setQuantity: (slug: string, size: Size, quantity: number) => void;
  removeItem: (slug: string, size: Size) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  /** Último decant agregado: lo muestra CartToast como confirmación. */
  toast: CartToastData | null;
  dismissToast: () => void;
}

export interface CartToastData {
  id: number;
  name: string;
  size: Size;
  image: string;
}

const CartContext = createContext<CartContextValue | null>(null);

function clampQuantity(value: number): number {
  return Math.min(MAX_QUANTITY, Math.floor(value));
}

function readStored(): StoredLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];

    const valid: StoredLine[] = [];
    for (const entry of data) {
      if (typeof entry !== "object" || entry === null) continue;
      const { slug, size, quantity } = entry as Record<string, unknown>;
      if (typeof slug !== "string" || !getProductBySlug(slug)) continue;
      if (!SIZES.includes(size as Size)) continue;
      if (typeof quantity !== "number" || !Number.isFinite(quantity)) continue;

      const qty = clampQuantity(quantity);
      if (qty < 1) continue;

      const existing = valid.find((l) => l.slug === slug && l.size === size);
      if (existing) {
        existing.quantity = clampQuantity(existing.quantity + qty);
      } else {
        valid.push({ slug, size: size as Size, quantity: qty });
      }
    }
    return valid;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<CartToastData | null>(null);

  // Se lee localStorage después del primer render para no romper la hidratación.
  useEffect(() => {
    setStored(readStored());
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) setStored(readStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Modo privado o almacenamiento lleno: el carrito sigue funcionando en memoria.
    }
  }, [stored, hydrated]);

  const lines = useMemo<CartLine[]>(
    () =>
      stored.flatMap((l) => {
        const product = getProductBySlug(l.slug);
        if (!product) return [];
        return [
          {
            slug: l.slug,
            brand: product.brand,
            name: product.name,
            size: l.size,
            quantity: l.quantity,
            unitPrice: getPrice(product, l.size),
          },
        ];
      }),
    [stored]
  );

  const count = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );
  const total = useMemo(() => orderTotal(lines), [lines]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (product: Product, size: Size, quantity = 1) => {
      setStored((prev) => {
        const idx = prev.findIndex(
          (l) => l.slug === product.slug && l.size === size
        );
        if (idx === -1) {
          return [
            ...prev,
            { slug: product.slug, size, quantity: clampQuantity(quantity) },
          ];
        }
        return prev.map((l, i) =>
          i === idx
            ? { ...l, quantity: clampQuantity(l.quantity + quantity) }
            : l
        );
      });
      // Confirmación con aviso en vez de abrir el drawer: en móvil no tapa la página.
      setToast({
        id: Date.now(),
        name: product.name,
        size,
        image: product.image,
      });
    },
    []
  );

  const dismissToast = useCallback(() => setToast(null), []);

  const setQuantity = useCallback(
    (slug: string, size: Size, quantity: number) => {
      setStored((prev) =>
        quantity < 1
          ? prev.filter((l) => !(l.slug === slug && l.size === size))
          : prev.map((l) =>
              l.slug === slug && l.size === size
                ? { ...l, quantity: clampQuantity(quantity) }
                : l
            )
      );
    },
    []
  );

  const removeItem = useCallback((slug: string, size: Size) => {
    setStored((prev) =>
      prev.filter((l) => !(l.slug === slug && l.size === size))
    );
  }, []);

  const clear = useCallback(() => setStored([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      total,
      isOpen,
      addItem,
      setQuantity,
      removeItem,
      clear,
      openCart,
      closeCart,
      toast,
      dismissToast,
    }),
    [
      lines,
      count,
      total,
      isOpen,
      addItem,
      setQuantity,
      removeItem,
      clear,
      openCart,
      closeCart,
      toast,
      dismissToast,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return ctx;
}
