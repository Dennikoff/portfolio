// Две ленты скриншотов, горизонтальный сдвиг привязан к позиции скролла (§4.2 ТЗ).
// Слушатель { passive: true }, применение трансформа — в requestAnimationFrame (ticking).
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const section = document.querySelector<HTMLElement>("[data-marquee]");
const rows = document.querySelectorAll<HTMLElement>("[data-marquee-row]");

if (section && rows.length && !reduce) {
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  let ticking = false;

  const update = () => {
    ticking = false;
    const offset =
      (window.scrollY - sectionTop + window.innerHeight) * 0.3;
    rows.forEach((row) => {
      const dir = row.dataset.marqueeDir === "left" ? -1 : 1;
      row.style.transform = `translateX(${dir * (offset - 200)}px)`;
    });
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}
