"use client";

import { useEffect, useRef } from "react";
import { getScrollVelocity, prefersReducedMotion } from "@/lib/scroll-velocity";
import { cn } from "@/lib/utils";

/**
 * Oro líquido: gotas (metaballs) que se funden y se separan como un fluido viscoso.
 * Canvas 2D a media resolución, sin WebGL. Caen al cargar, derivan despacio, se
 * estiran con el scroll y siguen al dedo o al cursor. Se pausa fuera de pantalla.
 */

interface Drop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** Radio en reposo, en múltiplos de R. */
  size: number;
  /** Ancla relativa al centro del cúmulo, en múltiplos de R. */
  hx: number;
  hy: number;
  /** Deriva: amplitud (en R) y frecuencia (Hz). */
  ax: number;
  ay: number;
  fx: number;
  fy: number;
  phase: number;
  /** Momento (s) en que la gota cae en la intro. */
  born: number;
}

// Gotas suspendidas: una masa principal, medianas que se funden con ella y satélites que se desprenden.
// Las anclas están lo bastante separadas para que la deriva las una y las suelte (cuellos que se estiran).
const LAYOUT: Omit<Drop, "x" | "y" | "vx" | "vy" | "r">[] = [
  { size: 1, hx: 0, hy: 0, ax: 0.16, ay: 0.2, fx: 0.07, fy: 0.09, phase: 0, born: 0 },
  { size: 0.62, hx: -1.3, hy: 0.62, ax: 0.42, ay: 0.26, fx: 0.11, fy: 0.08, phase: 1.7, born: 0.14 },
  { size: 0.54, hx: 1.25, hy: -0.7, ax: 0.36, ay: 0.4, fx: 0.09, fy: 0.12, phase: 3.1, born: 0.26 },
  { size: 0.42, hx: 0.55, hy: 1.35, ax: 0.5, ay: 0.3, fx: 0.13, fy: 0.1, phase: 4.4, born: 0.36 },
  { size: 0.32, hx: -0.85, hy: -1.25, ax: 0.4, ay: 0.46, fx: 0.08, fy: 0.14, phase: 2.3, born: 0.46 },
  { size: 0.26, hx: 1.95, hy: 0.75, ax: 0.55, ay: 0.4, fx: 0.15, fy: 0.07, phase: 5.2, born: 0.56 },
  { size: 0.19, hx: -2.1, hy: -0.25, ax: 0.6, ay: 0.5, fx: 0.06, fy: 0.13, phase: 0.8, born: 0.66 },
  { size: 0.13, hx: 1.4, hy: 1.95, ax: 0.55, ay: 0.6, fx: 0.12, fy: 0.16, phase: 3.8, born: 0.74 },
];

// Kernel compacto (1 - d²/S²)²: soporte finito, así cada píxel solo mira las gotas cercanas.
const SUPPORT = 1.49; // S = r · SUPPORT deja el contorno de una gota sola en d = r
const THRESHOLD = 0.3;

// Rampa del metal fundido: sombra tostada → oro saturado → brillo
const RAMP = [
  [26, 13, 2],
  [104, 62, 14],
  [196, 140, 52],
  [240, 196, 110],
  [255, 236, 180],
];
const SHINE = [255, 250, 236];
const RIM = [255, 196, 110];

// Luz principal arriba-izquierda y un contraluz cálido abajo-derecha
const L = [-0.4, -0.6, 0.693];
const H1 = [-0.218, -0.327, 0.92];
const H2 = [0.334, 0.278, 0.901];

export function LiquidGold({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const host = canvas.closest("section") ?? canvas.parentElement ?? canvas;
    const reduced = prefersReducedMotion();

    let cssW = 0;
    let cssH = 0;
    let scale = 0.5;
    let budget = 70000;
    let W = 0;
    let H = 0;
    let image: ImageData | null = null;
    let buf = new Uint32Array(0);
    let R = 0;
    let cx = 0;
    let cy = 0;
    let dirty = [0, 0, 0, 0];

    const drops: Drop[] = LAYOUT.map((d) => ({ ...d, x: 0, y: 0, vx: 0, vy: 0, r: 0 }));
    const cursor = { x: 0, y: 0, vx: 0, vy: 0, r: 0, tx: 0, ty: 0, active: false };

    // Buffers por gota (internos, en píxeles del canvas)
    const MAX = drops.length + 1;
    const px = new Float32Array(MAX);
    const py = new Float32Array(MAX);
    const s2 = new Float32Array(MAX);
    const inv = new Float32Array(MAX);

    function home(d: Drop, t: number) {
      const w = Math.PI * 2;
      return [
        cx + (d.hx + Math.sin(t * d.fx * w + d.phase) * d.ax) * R,
        cy + (d.hy + Math.cos(t * d.fy * w + d.phase * 1.3) * d.ay) * R,
      ];
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      if (!cssW || !cssH) return;
      const portrait = cssW / cssH < 0.85;
      // Móvil: gotas arriba a la izquierda, lejos del texto. Desktop: sobre la foto, hacia el texto.
      cx = cssW * (portrait ? 0.38 : 0.34);
      cy = cssH * (portrait ? 0.18 : 0.46);
      R = Math.min(cssW, cssH) * (portrait ? 0.165 : 0.12);
      // Presupuesto de píxeles internos: nítido en móvil sin castigar la CPU
      scale = Math.min(0.5, Math.sqrt(budget / (cssW * cssH)));
      W = Math.max(1, Math.round(cssW * scale));
      H = Math.max(1, Math.round(cssH * scale));
      canvas!.width = W;
      canvas!.height = H;
      image = ctx!.createImageData(W, H);
      buf = new Uint32Array(image.data.buffer);
      dirty = [0, 0, W, H];
    }

    function place(t: number) {
      for (const d of drops) {
        const [x, y] = home(d, t);
        d.x = x;
        d.y = y;
        d.r = d.size * R;
      }
    }

    function step(dt: number, t: number) {
      const sv = Math.max(-3, Math.min(3, getScrollVelocity()));
      const K = 9;
      const C = 2.1;
      const reach = R * 2.8;

      for (const d of drops) {
        if (t < d.born) continue;
        if (d.r === 0) {
          // Nace arriba del lienzo y cae hacia su ancla: el resorte le da el rebote del líquido.
          const [hx] = home(d, t);
          d.x = cx + (hx - cx) * 0.35;
          d.y = -d.size * R * 2;
          d.vy = R * 2.2;
          d.r = d.size * R * 0.6;
        }
        const [tx, ty] = home(d, t);
        let ax = (tx - d.x) * K - d.vx * C;
        let ay = (ty - d.y) * K - d.vy * C;
        // El líquido se queda atrás cuando la página corre: se estira en la dirección del scroll
        ay += sv * R * 5;
        if (cursor.r > 1) {
          const dx = cursor.x - d.x;
          const dy = cursor.y - d.y;
          const dist = Math.hypot(dx, dy);
          if (dist < reach) {
            const pull = (1 - dist / reach) * 14;
            ax += dx * pull;
            ay += dy * pull;
          }
        }
        d.vx += ax * dt;
        d.vy += ay * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.r += (d.size * R - d.r) * (1 - Math.exp(-dt * 5));
      }

      // La gota del dedo/cursor: crece al tocar, sigue con retraso y se disuelve al soltar
      const target = cursor.active ? R * 0.42 : 0;
      cursor.r += (target - cursor.r) * (1 - Math.exp(-dt * (cursor.active ? 7 : 4)));
      const kc = 70;
      const cc = 2 * Math.sqrt(kc) * 0.62;
      cursor.vx += ((cursor.tx - cursor.x) * kc - cursor.vx * cc) * dt;
      cursor.vy += ((cursor.ty - cursor.y) * kc - cursor.vy * cc) * dt;
      cursor.x += cursor.vx * dt;
      cursor.y += cursor.vy * dt;
    }

    function render() {
      if (!image) return;
      let n = 0;
      let x0 = W;
      let y0 = H;
      let x1 = 0;
      let y1 = 0;
      const add = (x: number, y: number, r: number) => {
        if (r < 0.5) return;
        const S = r * SUPPORT * scale;
        px[n] = x * scale;
        py[n] = y * scale;
        s2[n] = S * S;
        inv[n] = 1 / (S * S);
        n++;
        x0 = Math.min(x0, x * scale - S);
        y0 = Math.min(y0, y * scale - S);
        x1 = Math.max(x1, x * scale + S);
        y1 = Math.max(y1, y * scale + S);
      };
      for (const d of drops) add(d.x, d.y, d.r);
      add(cursor.x, cursor.y, cursor.r);

      x0 = Math.max(0, Math.floor(x0));
      y0 = Math.max(0, Math.floor(y0));
      x1 = Math.min(W, Math.ceil(x1));
      y1 = Math.min(H, Math.ceil(y1));

      // Limpia lo pintado el frame anterior
      for (let y = dirty[1]; y < dirty[3]; y++) buf.fill(0, y * W + dirty[0], y * W + dirty[2]);

      const K = R * scale * 0.9; // escala de la altura: calibrada para que una gota sola sea una media esfera
      const lo = THRESHOLD * 0.55; // margen para el antialias por distancia al contorno

      for (let y = y0; y < y1; y++) {
        const row = y * W;
        for (let x = x0; x < x1; x++) {
          let f = 0;
          let gx = 0;
          let gy = 0;
          for (let k = 0; k < n; k++) {
            const dx = x - px[k];
            const dy = y - py[k];
            const d2 = dx * dx + dy * dy;
            if (d2 >= s2[k]) continue;
            const w = 1 - d2 * inv[k];
            f += w * w;
            const c = 4 * w * inv[k];
            gx += c * dx;
            gy += c * dy;
          }
          if (f <= lo) continue;

          // Antialias: distancia en píxeles al contorno ≈ (f − umbral) / |∇f|
          const gl = Math.sqrt(gx * gx + gy * gy) + 1e-6;
          const dist = (f - THRESHOLD) / gl;
          if (dist <= -0.9) continue;
          const alpha = dist >= 0.9 ? 1 : (dist + 0.9) / 1.8;

          // Altura √e: borde vertical y cima plana, como una gota. Donde se suman gotas la
          // cima se aplana más (tensión superficial): sin picos en las uniones.
          const e = Math.max(f - THRESHOLD, 0.004);
          const slope = K / (2 * Math.sqrt(e) * (1 + 2.2 * e));
          let nx = gx * slope;
          let ny = gy * slope;
          const nl = 1 / Math.sqrt(nx * nx + ny * ny + 1);
          nx *= nl;
          ny *= nl;
          const nz = nl;

          // Metal: el color sale de lo que refleja. ry < 0 mira arriba (caja de luz),
          // una banda oscura en el horizonte y un rebote cálido abajo.
          const ry = 2 * nz * ny;
          const top = Math.min(1, Math.max(0, (-ry - 0.2) / 0.45));
          const floor = Math.min(1, Math.max(0, (ry - 0.4) / 0.4));
          const diff = nx * L[0] + ny * L[1] + nz * L[2];
          let env =
            0.36 +
            0.68 * top * top * (3 - 2 * top) -
            0.2 * Math.max(0, 1 - Math.abs(ry - 0.18) / 0.26) +
            0.22 * floor * floor * (3 - 2 * floor) +
            diff * 0.1;
          env = env < 0 ? 0 : env > 0.999 ? 0.999 : env;

          let s = Math.max(0, nx * H1[0] + ny * H1[1] + nz * H1[2]);
          s *= s; s *= s; s *= s; s *= s; s *= s; s *= s; // ^64: brillo puntual
          let sb = Math.max(0, nx * H2[0] + ny * H2[1] + nz * H2[2]);
          sb *= sb; sb *= sb; sb *= sb; sb *= sb; // ^16
          const spec = Math.min(1, s * 1.2 + sb * 0.3);
          // Contraluz cálido en el borde inferior derecho (Fresnel)
          const fres = 1 - nz;
          const rim = Math.min(1, fres * fres * Math.max(0, ny * 0.8 + nx * 0.5) * 1.2);

          const seg = Math.floor(env * 4);
          const t = env * 4 - seg;
          const A = RAMP[seg];
          const B = RAMP[seg + 1];
          let r = A[0] + (B[0] - A[0]) * t;
          let g = A[1] + (B[1] - A[1]) * t;
          let b = A[2] + (B[2] - A[2]) * t;
          r += (RIM[0] - r) * rim;
          g += (RIM[1] - g) * rim;
          b += (RIM[2] - b) * rim;
          r += (SHINE[0] - r) * spec;
          g += (SHINE[1] - g) * spec;
          b += (SHINE[2] - b) * spec;

          buf[row + x] =
            ((alpha * 255) << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255);
        }
      }

      const ux0 = Math.min(dirty[0], x0);
      const uy0 = Math.min(dirty[1], y0);
      const ux1 = Math.max(dirty[2], x1);
      const uy1 = Math.max(dirty[3], y1);
      if (ux1 > ux0 && uy1 > uy0) ctx!.putImageData(image, 0, 0, ux0, uy0, ux1 - ux0, uy1 - uy0);
      dirty = x1 > x0 && y1 > y0 ? [x0, y0, x1, y1] : [0, 0, 0, 0];
    }

    // --- Bucle: solo corre visible y con la pestaña activa ---
    let raf = 0;
    let last = 0;
    let clock = 0;
    let visible = false;
    let started = false;
    let slow = 0;

    const frame = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000 || 1 / 60);
      last = now;
      clock += dt;
      const t0 = performance.now();
      step(dt, clock);
      render();
      // Si el teléfono no da abasto, baja la resolución interna una sola vez
      if (performance.now() - t0 > 9 && ++slow > 20 && budget > 38000) {
        budget = 38000;
        resize();
      }
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      const run = started && visible && !document.hidden && !reduced;
      if (run && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) {
        place(0);
        render();
      }
    });
    ro.observe(canvas);

    // --- Dedo y cursor ---
    const toLocal = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      cursor.tx = clientX - rect.left;
      cursor.ty = clientY - rect.top;
      if (cursor.r < 1) {
        cursor.x = cursor.tx;
        cursor.y = cursor.ty;
        cursor.vx = cursor.vy = 0;
      }
      cursor.active =
        cursor.tx >= 0 && cursor.ty >= 0 && cursor.tx <= rect.width && cursor.ty <= rect.height;
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "mouse") toLocal(e.clientX, e.clientY);
    };
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) toLocal(touch.clientX, touch.clientY);
    };
    const release = () => {
      cursor.active = false;
    };

    if (!reduced) {
      host.addEventListener("pointermove", onPointer as EventListener, { passive: true });
      host.addEventListener("pointerleave", release, { passive: true });
      host.addEventListener("touchstart", onTouch as EventListener, { passive: true });
      host.addEventListener("touchmove", onTouch as EventListener, { passive: true });
      host.addEventListener("touchend", release, { passive: true });
      host.addEventListener("touchcancel", release, { passive: true });
    }
    document.addEventListener("visibilitychange", sync);

    // Arranca después de la carga: la foto del hero (LCP) no compite con el cálculo.
    let timer = 0;
    const begin = () => {
      timer = window.setTimeout(() => {
        started = true;
        if (reduced) {
          place(0);
          render();
        }
        sync();
      }, 250);
    };
    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("load", begin);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onPointer as EventListener);
      host.removeEventListener("pointerleave", release);
      host.removeEventListener("touchstart", onTouch as EventListener);
      host.removeEventListener("touchmove", onTouch as EventListener);
      host.removeEventListener("touchend", release);
      host.removeEventListener("touchcancel", release);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
    />
  );
}
