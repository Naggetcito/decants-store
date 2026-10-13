"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/scroll-velocity";
import { cn } from "@/lib/utils";

type InkState = "idle" | "armed" | "shown" | "done";

/**
 * La foto entra a través de una mancha líquida que crece desde abajo (globals.css: .ink-reveal).
 * Solo se arma lo que está fuera de pantalla al hidratar: sin JS o ya visible, se ve normal.
 */
export function InkReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<InkState>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setState("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-ink={state}
      // Al terminar se quita la máscara: sin capas extra mientras la foto está quieta.
      onAnimationEnd={(e) => {
        if (e.animationName === "ink-settle") setState("done");
      }}
      className={cn("ink-reveal", className)}
    >
      {children}
    </div>
  );
}
