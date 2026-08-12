import { animate, scroll, stagger } from "motion";

// Посимвольное проявление от opacity 0.2 к 1 по прогрессу скролла (§5 ТЗ).
// При reduced-motion — сразу конечное состояние.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll<HTMLElement>("[data-animated-text]").forEach((el) => {
  const chars = el.querySelectorAll<HTMLElement>("[data-char]");
  if (reduce) {
    chars.forEach((c) => (c.style.opacity = "1"));
    return;
  }
  scroll(
    animate(chars, { opacity: [0.2, 1] }, { delay: stagger(1 / chars.length) }),
    { target: el, offset: ["start 0.8", "end 0.2"] },
  );
});
