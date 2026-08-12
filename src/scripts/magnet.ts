// Магнитное притяжение к курсору. Выключено при (hover: none) и prefers-reduced-motion.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const noHover = matchMedia("(hover: none)").matches;

if (!reduce && !noHover) {
  document.querySelectorAll<HTMLElement>("[data-magnet]").forEach((el) => {
    const padding = Number(el.dataset.padding) || 150;
    const strength = Number(el.dataset.strength) || 3;

    window.addEventListener(
      "mousemove",
      (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const within =
          e.clientX > rect.left - padding &&
          e.clientX < rect.right + padding &&
          e.clientY > rect.top - padding &&
          e.clientY < rect.bottom + padding;

        if (within) {
          el.style.transition = "transform .3s ease-out";
          el.style.transform = `translate3d(${(e.clientX - cx) / strength}px, ${
            (e.clientY - cy) / strength
          }px, 0)`;
        } else {
          el.style.transition = "transform .6s ease-in-out";
          el.style.transform = "translate3d(0, 0, 0)";
        }
      },
      { passive: true },
    );
  });
}
