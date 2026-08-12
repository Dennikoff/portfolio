import { animate, scroll } from "motion";

// Стекинг карточек проектов (§5 ТЗ): каждая уменьшается по мере прокрутки поверх неё.
// На мобиле и при reduced-motion выключено — карточки остаются в обычном потоке.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = matchMedia("(max-width: 767px)").matches;

if (!reduce && !mobile) {
  const items = [...document.querySelectorAll<HTMLElement>("[data-stack-item]")];
  items.forEach((wrapper, i) => {
    const card = wrapper.querySelector<HTMLElement>("[data-stack-card]");
    if (!card) return;
    const targetScale = 1 - (items.length - 1 - i) * 0.03;
    scroll(animate(card, { scale: [1, targetScale] }), {
      target: wrapper,
      offset: ["start start", "end start"],
    });
  });
}
