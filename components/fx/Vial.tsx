"use client";

import { useEffect, useId, useRef } from "react";
import { getScrollVelocity, prefersReducedMotion } from "@/lib/scroll-velocity";
import { cn } from "@/lib/utils";

/**
 * Vial con atomizador. Al entrar en pantalla se llena (el decant) y la superficie del
 * líquido se mece con el scroll: se inclina con la aceleración y vuelve a nivelarse.
 */
export function Vial({
  ml,
  fill = 0.82,
  className,
}: {
  ml: 5 | 10;
  /** Qué tanto del tubo ocupa el líquido (0–1). */
  fill?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const liquidRef = useRef<SVGPathElement>(null);

  // El de 10ml es más alto: la diferencia de tamaño se lee de un vistazo.
  const H = ml === 10 ? 140 : 104;
  const top = 34;
  const bottom = H - 5;
  const left = 11;
  const right = 33;

  useEffect(() => {
    const svg = svgRef.current;
    const path = liquidRef.current;
    if (!svg || !path) return;

    const cx = (left + right) / 2;
    const span = bottom - top;
    const surface = (level: number, tilt: number, amp: number, t: number) => {
      const base = bottom - span * fill * level;
      const pts: string[] = [];
      for (let i = 0; i <= 10; i++) {
        const x = left - 3 + ((right - left + 6) * i) / 10;
        const y = base + Math.tan(tilt) * (x - cx) + Math.sin(x * 0.42 + t * 3.1) * amp;
        pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
      }
      return `M${pts.join(" L")} L${right + 3} ${H} L${left - 3} ${H}Z`;
    };

    if (prefersReducedMotion()) {
      path.setAttribute("d", surface(1, 0, 0.4, 0));
      return;
    }
    path.setAttribute("d", surface(0, 0, 0, 0));

    let level = 0;
    let levelV = 0;
    let filling = false;
    let tilt = 0;
    let tiltV = 0;
    let prevV = 0;
    let t = 0;
    let last = 0;
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      t += dt;

      // Nivel: resorte suave hacia lleno (rebota un poco, como líquido que cae)
      if (filling) {
        levelV += ((1 - level) * 26 - levelV * 5.2) * dt;
        level += levelV * dt;
      }
      // Inclinación: la aceleración del scroll la empuja; un resorte amortiguado la nivela
      const v = getScrollVelocity();
      const accel = (v - prevV) / Math.max(dt, 0.001);
      prevV = v;
      tiltV += (-tilt * 60 - tiltV * 4.2 + Math.max(-22, Math.min(22, accel * 0.35)) + levelV * 0.6) * dt;
      tilt += tiltV * dt;
      tilt = Math.max(-0.42, Math.min(0.42, tilt));

      const amp = 0.45 + Math.min(2.2, Math.abs(tilt) * 7 + Math.abs(levelV) * 0.9);
      path.setAttribute("d", surface(level, tilt, amp, t));
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (entry.isIntersecting) {
          filling = true;
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(svg);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [H, bottom, fill]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 44 ${H}`}
      aria-hidden="true"
      className={cn("block overflow-visible", className)}
      style={{ aspectRatio: `44 / ${H}` }}
    >
      <defs>
        <clipPath id={`tubo-${id}`}>
          <rect x={left} y={top} width={right - left} height={bottom - top} rx="6" />
        </clipPath>
        <linearGradient id={`oro-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8a5e1f" />
          <stop offset="0.35" stopColor="#d9aa5a" />
          <stop offset="0.6" stopColor="#f1cd85" />
          <stop offset="1" stopColor="#7a5218" />
        </linearGradient>
      </defs>

      {/* Líquido */}
      <g clipPath={`url(#tubo-${id})`}>
        <path ref={liquidRef} fill={`url(#oro-${id})`} opacity="0.92" />
        {/* Tubo de succión del atomizador */}
        <line x1="22" x2="22" y1={top - 2} y2={bottom - 4} stroke="#FAF7F2" strokeOpacity="0.18" strokeWidth="1" />
      </g>

      {/* Vidrio */}
      <rect
        x={left - 1.5}
        y={top - 1.5}
        width={right - left + 3}
        height={bottom - top + 3}
        rx="7.5"
        fill="none"
        stroke="#FAF7F2"
        strokeOpacity="0.32"
        strokeWidth="1.2"
      />
      <path d={`M${left + 3} ${top + 6} V${bottom - 10}`} stroke="#FAF7F2" strokeOpacity="0.22" strokeWidth="1.6" strokeLinecap="round" />

      {/* Atomizador */}
      <rect x="13" y="18" width="18" height="14" rx="2" fill="#16130f" stroke="#C9A86A" strokeOpacity="0.55" strokeWidth="1" />
      <rect x="15.5" y="6" width="13" height="12" rx="3" fill="#0f0d0b" stroke="#C9A86A" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="20" y="1" width="4" height="5" rx="1" fill="#C9A86A" fillOpacity="0.7" />
    </svg>
  );
}
