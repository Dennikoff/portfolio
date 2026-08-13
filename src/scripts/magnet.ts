// Магнитное притяжение к курсору. Выключено при (hover: none) и prefers-reduced-motion.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const noHover = matchMedia("(hover: none)").matches;

if (!reduce && !noHover) {
  document.querySelectorAll<HTMLElement>("[data-magnet]").forEach((el) => {
    const padding = Number(el.dataset.padding) || 150;
    const strength = Number(el.dataset.strength) || 3;
    const max = Number(el.dataset.max) || Infinity;
    // Зона активации: если задан data-area — трекаем, пока курсор в этой зоне
    // (напр. вся секция hero), иначе — по старинке, в рамке padding вокруг элемента.
    const areaSel = el.dataset.area;
    const area = areaSel
      ? (el.closest<HTMLElement>(areaSel) ??
        document.querySelector<HTMLElement>(areaSel))
      : null;

    const clamp = (v: number) => Math.max(-max, Math.min(max, v));

    window.addEventListener(
      "mousemove",
      (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let within: boolean;
        if (area) {
          const a = area.getBoundingClientRect();
          within =
            e.clientX >= a.left &&
            e.clientX <= a.right &&
            e.clientY >= a.top &&
            e.clientY <= a.bottom;
        } else {
          within =
            e.clientX > rect.left - padding &&
            e.clientX < rect.right + padding &&
            e.clientY > rect.top - padding &&
            e.clientY < rect.bottom + padding;
        }

        if (within) {
          el.style.transition = "transform .3s ease-out";
          el.style.transform = `translate3d(${clamp(
            (e.clientX - cx) / strength,
          )}px, ${clamp((e.clientY - cy) / strength)}px, 0)`;
        } else {
          el.style.transition = "transform .6s ease-in-out";
          el.style.transform = "translate3d(0, 0, 0)";
        }
      },
      { passive: true },
    );
  });
}
