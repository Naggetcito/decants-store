"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "framer-motion";
import { CartProvider } from "@/components/cart/CartProvider";

const INTERACTION_EVENTS = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;

/**
 * Las features de animación llegan en un chunk aparte y se piden con la primera interacción
 * (o a los 2.5s): no compiten con la foto del hero en la primera carga.
 */
const loadFeatures = () =>
  new Promise<void>((resolve) => {
    const done = () => {
      INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, done));
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(done, 2500);
    INTERACTION_EVENTS.forEach((e) =>
      window.addEventListener(e, done, { once: true, passive: true })
    );
  }).then(() => import("@/lib/motion-features").then((mod) => mod.default));

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <CartProvider>{children}</CartProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
