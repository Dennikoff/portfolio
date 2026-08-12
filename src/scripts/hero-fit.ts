// Подгоняет вордмарк H1 точно под ширину контейнера (одна строка, без переполнения).
// Учитывает реальные метрики шрифта. Обрабатывает ВСЕ слои [data-fit-text]
// (серый + полупрозрачный дубль), чтобы они получали одинаковый размер и совпадали пиксель-в-пиксель.
const REF = 200; // референсный размер для замера, px
const SAFETY = 0.99;

function fit() {
  document.querySelectorAll<HTMLElement>("[data-fit-text]").forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;
    const cs = getComputedStyle(parent);
    const available =
      parent.clientWidth -
      parseFloat(cs.paddingLeft) -
      parseFloat(cs.paddingRight);

    el.style.fontSize = `${REF}px`;
    const textWidth = el.scrollWidth;
    if (textWidth > 0) {
      el.style.fontSize = `${((REF * available) / textWidth) * SAFETY}px`;
    }
  });
}

fit();
window.addEventListener("resize", fit, { passive: true });
// Перемерить после подгрузки шрифта (метрики Golos Black отличаются от фолбэка).
document.fonts?.ready.then(fit);
