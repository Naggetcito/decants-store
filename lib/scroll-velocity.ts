/**
 * Velocidad de scroll compartida (px/ms, suavizada) para los efectos líquidos:
 * un solo listener pasivo, sin rAF propio. Cada efecto la lee en su propio frame.
 */
let velocity = 0;
let lastY = 0;
let lastT = 0;
let listening = false;

function onScroll() {
  const now = performance.now();
  const y = window.scrollY;
  const dt = Math.max(1, now - lastT);
  velocity = velocity * 0.55 + ((y - lastY) / dt) * 0.45;
  lastY = y;
  lastT = now;
}

export function getScrollVelocity(): number {
  if (!listening) {
    listening = true;
    lastY = window.scrollY;
    lastT = performance.now();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  // Sin eventos recientes, la velocidad decae a cero (el dedo ya soltó).
  const idle = performance.now() - lastT;
  return idle > 80 ? velocity * Math.exp(-(idle - 80) / 140) : velocity;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
