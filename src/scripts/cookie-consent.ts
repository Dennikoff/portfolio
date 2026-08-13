/**
 * Cookie-consent — opt-in шлюз для аналитики.
 *
 * Принцип: до согласия НИ ОДИН сторонний скрипт не исполняется. Сниппеты лежат
 * в разметке как <script type="text/plain" data-consent="analytics"> — браузер
 * считает это текстом, а не кодом. При согласии тег пересобирается в настоящий
 * <script> и только тогда выполняется. Отклонил — так и остаётся текстом:
 * ни одного запроса к mc.yandex.ru, ни одной cookie.
 *
 * Отзыв уже выданного согласия: выполненный скрипт из страницы не выгрузить,
 * поэтому чистим cookie/сторэдж Метрики и перезагружаем страницу.
 */

type Consent = { v: number; ts: string; analytics: boolean };

interface DkConsentApi {
  /** Текущее решение или null, если его нет (не спрашивали / истекло / версия старая). */
  get(): Consent | null;
  accept(): void;
  reject(): void;
  /** Открыть баннер заново — «изменить решение» из футера. */
  open(): void;
}

declare global {
  interface Window {
    dkConsent?: DkConsentApi;
  }
}

const KEY = "dk.consent";
/** Версия политики. Поднять → у всех спросим заново. */
const VERSION = 1;
/** Согласие не вечно: через год спрашиваем снова. */
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
/** Префикс cookie и ключей сторэджа Яндекс.Метрики. */
const YM_PREFIX = "_ym";

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<Consent>;
    if (c.v !== VERSION || typeof c.analytics !== "boolean") return null;
    const age = Date.now() - Date.parse(String(c.ts));
    if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_MS) return null;
    return { v: VERSION, ts: String(c.ts), analytics: c.analytics };
  } catch {
    // Приватный режим или повреждённая запись — считаем, что решения нет.
    return null;
  }
}

function write(analytics: boolean): void {
  try {
    const value: Consent = { v: VERSION, ts: new Date().toISOString(), analytics };
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Сторэдж недоступен — решение продержится до конца сессии, это допустимо.
  }
}

/** Пересобирает отложенные сниппеты в исполняемые <script>. Идемпотентно. */
let activated = false;
function activateAnalytics(): void {
  if (activated) return;
  activated = true;
  const tpls = document.querySelectorAll<HTMLScriptElement>(
    'script[type="text/plain"][data-consent="analytics"]',
  );
  tpls.forEach((tpl) => {
    const s = document.createElement("script");
    for (const { name, value } of Array.from(tpl.attributes)) {
      if (name === "type" || name === "data-consent") continue;
      s.setAttribute(name, value);
    }
    s.text = tpl.textContent ?? "";
    tpl.replaceWith(s);
  });
}

/** Удаляет cookie и записи сторэджа Метрики. Они first-party, поэтому доступны из JS. */
function purgeAnalytics(): void {
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0]?.trim();
    if (!name || !name.startsWith(YM_PREFIX)) continue;
    // Пробуем все реалистичные комбинации path/domain — какая-то из них попадёт.
    for (const path of ["/", location.pathname]) {
      document.cookie = `${name}=; path=${path}; ${expire}`;
      document.cookie = `${name}=; path=${path}; domain=${location.hostname}; ${expire}`;
      document.cookie = `${name}=; path=${path}; domain=.${location.hostname}; ${expire}`;
    }
  }
  for (const store of [localStorage, sessionStorage]) {
    try {
      Object.keys(store)
        .filter((k) => k.startsWith(YM_PREFIX))
        .forEach((k) => store.removeItem(k));
    } catch {
      // Сторэдж недоступен — чистить нечего.
    }
  }
}

const banner = document.querySelector<HTMLElement>("[data-cookie-banner]");
const acceptBtn = banner?.querySelector<HTMLButtonElement>("[data-consent-accept]");
/** Элемент, с которого открыли баннер — чтобы вернуть ему фокус. */
let lastTrigger: HTMLElement | null = null;

function showBanner(focus = false): void {
  if (!banner) return;
  banner.hidden = false;
  if (focus) acceptBtn?.focus();
}

function hideBanner(): void {
  if (banner) banner.hidden = true;
  lastTrigger?.focus();
  lastTrigger = null;
}

/** Подписи в футере: показываем текущее состояние согласия. */
function syncFooter(analytics: boolean): void {
  document.querySelectorAll<HTMLElement>("[data-consent-state]").forEach((el) => {
    const on = el.dataset.labelOn ?? "";
    const off = el.dataset.labelOff ?? "";
    el.textContent = analytics ? on : off;
  });
}

function set(analytics: boolean): void {
  const prev = read();
  write(analytics);
  hideBanner();
  syncFooter(analytics);
  document.dispatchEvent(new CustomEvent("dk:consent", { detail: { analytics } }));

  if (analytics) {
    activateAnalytics();
    return;
  }
  // Отзыв ранее выданного согласия: чистим следы и перезагружаемся, потому что
  // уже исполненный счётчик иначе продолжит отправлять события.
  if (prev?.analytics) {
    purgeAnalytics();
    location.reload();
  }
}

const api: DkConsentApi = {
  get: read,
  accept: () => set(true),
  reject: () => set(false),
  open: () => showBanner(true),
};
window.dkConsent = api;

// ─── Проводка ───────────────────────────────────────────────────────────────
acceptBtn?.addEventListener("click", () => api.accept());
// Отказ — и крестик, и кнопка «Отклонить», поэтому querySelectorAll: с
// querySelector один из двух контролов остался бы без обработчика.
// Согласием считается только явное нажатие «Принять».
banner
  ?.querySelectorAll<HTMLButtonElement>("[data-consent-dismiss]")
  .forEach((el) => el.addEventListener("click", () => api.reject()));

document.querySelectorAll<HTMLElement>("[data-consent-open]").forEach((el) =>
  el.addEventListener("click", () => {
    lastTrigger = el;
    api.open();
  }),
);
document
  .querySelectorAll<HTMLElement>("[data-consent-reject]")
  .forEach((el) => el.addEventListener("click", () => api.reject()));

// Esc закрывает баннер как отказ — это безопасный дефолт, согласие не выдаётся.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && banner && !banner.hidden) api.reject();
});

// ─── Старт ──────────────────────────────────────────────────────────────────
const consent = read();
if (consent?.analytics) activateAnalytics();
if (!consent) showBanner();
syncFooter(consent?.analytics ?? false);

export {};
