"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getScrollVelocity, prefersReducedMotion } from "@/lib/scroll-velocity";
import { cn } from "@/lib/utils";

/**
 * Cinta infinita con inercia: el scroll la empuja (acelera y se inclina en su dirección)
 * y luego vuelve sola a su ritmo. El contenido debe venir duplicado (dos mitades iguales).
 * Sin JS o con movimiento reducido queda la animación CSS (o nada).
 */
export function VelocityTrack({
  children,
  className,
  speed = 38,
}: {
  children: ReactNode;
  className?: string;
  /** px/s en reposo */
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    el.dataset.driven = "";

    let half = el.scrollWidth / 2;
    let x = 0;
    let dir = 1;
    let boost = 0;
    let skew = 0;
    let hover = 0;
    let hovering = false;
    let last = 0;
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      const v = getScrollVelocity();
      if (Math.abs(v) > 0.05) dir = v > 0 ? 1 : -1;
      // El empuje sube rápido y se disipa despacio, como un líquido que sigue moviéndose
      const target = Math.min(Math.abs(v) * 1100, 1400);
      boost += (target - boost) * (1 - Math.exp(-dt * (target > boost ? 12 : 2.2)));
      hover += ((hovering ? 1 : 0) - hover) * (1 - Math.exp(-dt * 6));
      x -= (speed * (1 - hover) + boost) * dir * dt;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      const skewTarget = Math.max(-9, Math.min(9, -v * 5));
      skew += (skewTarget - skew) * (1 - Math.exp(-dt * 8));
      el.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (entry.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      half = el.scrollWidth / 2;
    });
    ro.observe(el);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const enter = () => (hovering = fine);
    const leave = () => (hovering = false);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      delete el.dataset.driven;
      el.style.transform = "";
    };
  }, [speed]);

  return (
    <div ref={ref} className={cn("animate-marquee flex w-max data-[driven]:animate-none", className)}>
      {children}
    </div>
  );
}
