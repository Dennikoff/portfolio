import Lenis from "lenis";

declare global {
  interface Window {
    /** Есть только когда плавный скролл включён (нет при prefers-reduced-motion). */
    lenis?: Lenis;
  }
}

// Плавный скролл. Выключен при prefers-reduced-motion (нативный скролл остаётся).
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  // Наружу — чтобы модалка могла остановить прокрутку фона (contact-modal.ts).
  window.lenis = lenis;

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

export {};
