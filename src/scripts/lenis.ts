import Lenis from "lenis";

// Плавный скролл. Выключен при prefers-reduced-motion (нативный скролл остаётся).
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}
