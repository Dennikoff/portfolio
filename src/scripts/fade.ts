import { animate, inView } from "motion";

// reduced-motion → сразу конечное состояние, без анимации.
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
} else {
  inView(
    "[data-fade]",
    (el) => {
      const d = (el as HTMLElement).dataset;
      animate(
        el,
        { opacity: 1, transform: "translate(0px, 0px)" },
        {
          duration: Number(d.duration),
          delay: Number(d.delay),
          ease: [0.16, 1, 0.3, 1],
        },
      );
      return () => {}; // одноразово: не откатывать при уходе из вьюпорта
    },
    { margin: "0px 0px -20% 0px" },
  );
}
