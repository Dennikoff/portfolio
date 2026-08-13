/**
 * Модалка выбора способа связи.
 *
 * Открывается любым [data-contact-open], закрывается крестиком, Esc, кликом по
 * подложке и выбором способа связи. В отличие от cookie-баннера это блокирующий
 * диалог: фокус запирается внутри, фон не скроллится.
 */

const overlay = document.querySelector<HTMLElement>("[data-contact-modal]");
const card = overlay?.querySelector<HTMLElement>(".cm-card");

/** Элемент, с которого открыли — чтобы вернуть фокус после закрытия. */
let trigger: HTMLElement | null = null;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusable(): HTMLElement[] {
  return card ? Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
}

function open(from: HTMLElement | null): void {
  if (!overlay) return;
  trigger = from;
  overlay.hidden = false;
  // Lenis продолжал бы крутить фон под модалкой — глушим его на время.
  window.lenis?.stop();
  document.documentElement.classList.add("cm-open");
  // Первым фокусируем не крестик, а первый способ связи — это главное действие.
  focusable()[1]?.focus();
}

function close(): void {
  if (!overlay || overlay.hidden) return;
  overlay.hidden = true;
  window.lenis?.start();
  document.documentElement.classList.remove("cm-open");
  trigger?.focus();
  trigger = null;
}

document
  .querySelectorAll<HTMLElement>("[data-contact-open]")
  .forEach((el) => el.addEventListener("click", () => open(el)));

overlay
  ?.querySelectorAll<HTMLElement>("[data-contact-close]")
  .forEach((el) => el.addEventListener("click", close));

// Клик по подложке (но не по самой карточке) закрывает.
overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) close();
});

// Выбрал способ связи — модалка больше не нужна. Ссылки при этом работают
// штатно: Telegram уходит в новую вкладку, mailto — в почтовый клиент.
overlay
  ?.querySelectorAll<HTMLAnchorElement>(".cm-option")
  .forEach((a) => a.addEventListener("click", () => close()));

document.addEventListener("keydown", (e) => {
  if (!overlay || overlay.hidden) return;

  if (e.key === "Escape") {
    close();
    return;
  }

  // Запираем Tab внутри диалога.
  if (e.key !== "Tab") return;
  const items = focusable();
  if (!items.length) return;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  const active = document.activeElement;

  if (e.shiftKey && (active === first || !card?.contains(active))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
});

export {};
