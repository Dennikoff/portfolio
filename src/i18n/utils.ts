import { ru } from "./ru";
import { en } from "./en";

export const languages = ["ru", "en"] as const;
export type Lang = (typeof languages)[number];

export const defaultLang: Lang = "ru";
export const languageLabels: Record<Lang, string> = { ru: "RU", en: "EN" };

const dicts = { ru, en } as const;

/** Определяет локаль по пути: /en/... → en, всё остальное → ru (дефолт без префикса). */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split("/")[1];
  return seg === "en" ? "en" : defaultLang;
}

/** Словарь для локали. */
export function useTranslations(lang: Lang) {
  return dicts[lang];
}

/** Путь к этой же странице в другой локали (для переключателя). */
export function localizedPath(lang: Lang): string {
  return lang === defaultLang ? "/" : `/${lang}/`;
}

/**
 * Ссылки на проекты — нелокализованные (url/host общие для RU и EN).
 * Порядок строго совпадает с projMeta в словарях, зипуются по индексу.
 */
export const projLinks = [
  // shots — 3 скрина проекта. d — лендскейп (≥ md), m/mobW/mobH — портретный скрин
  // телефона (< md, если есть). pos — object-position для картинки (по умолчанию top).
  // Порядок раскладки §4.5: shots[0] — большой справа, shots[1]/[2] — стопка слева.
  {
    key: "gadius", url: "https://front.gadius.ru/", host: "front.gadius.ru",
    shots: [
      { d: "/desktop/ryadom1.webp", m: "/mobile/ryadom1.webp", mobW: 1320, mobH: 2682 },
      // ryadom2/3 — верхний скрин прибит к верхнему краю (object-top),
      // нижний — к нижнему (object-bottom).
      { d: "/desktop/ryadom3.webp", m: "/mobile/ryadom3.webp", mobW: 1320, mobH: 2682, pos: "top" },
      { d: "/desktop/ryadom2.webp", m: "/mobile/ryadom2.webp", mobW: 1320, mobH: 2682, pos: "bottom" },
    ],
  },
  {
    key: "hpc", url: "https://hpc-park.ru/", host: "hpc-park.ru",
    shots: [
      { d: "/desktop/hpc-park1.webp", m: "/mobile/hpc-park1.webp", mobW: 1320, mobH: 2544 },
      { d: "/desktop/hpc-park2.webp", m: "/mobile/hpc-park2.webp", mobW: 1320, mobH: 2008 },
      { d: "/desktop/hpc-park3.webp" },
    ],
  },
  {
    key: "hpd", url: "https://hpd-expert.vercel.app/", host: "hpd-expert.vercel.app",
    shots: [
      { d: "/desktop/hpd-expert1.webp", m: "/mobile/hpd-expert1.webp", mobW: 1320, mobH: 2553 },
      { d: "/desktop/hpd-expert2.webp", m: "/mobile/hpd-expert2.webp", mobW: 1320, mobH: 2029 },
      { d: "/desktop/hpd-expert3.webp" },
    ],
  },
  {
    key: "juna", url: "https://juna-horse.ru/?content=comics", host: "juna-horse.ru",
    shots: [
      { d: "/desktop/juna1.webp", m: "/mobile/juna1.webp", mobW: 1320, mobH: 2501 },
      { d: "/desktop/juna2.webp", m: "/mobile/juna2.webp", mobW: 1320, mobH: 1304 },
      { d: "/desktop/juna3.webp" },
    ],
  },
  {
    key: "megalit", url: "https://www.megalit-gr.ru/", host: "megalit-gr.ru",
    shots: [
      { d: "/desktop/megalit.webp", m: "/mobile/megalit1.webp", mobW: 1320, mobH: 2535 },
      { d: "/desktop/megalit2.webp" },
      { d: "/desktop/megalit3.webp" },
    ],
  },
] as const;

/** Контактный email — нелокализованный. */
export const email = "denis.kharke@gmail.com";

/** Telegram для CTA «Обсудить проект» — нелокализованный. */
export const telegram = "https://t.me/dennikoff";

/** Соцсети (§4.7 ТЗ) — нелокализованные. label — mono-аква, handle — светлый. */
export const socials = [
  { label: "GitHub", handle: "Dennikoff", url: "https://github.com/Dennikoff" },
  { label: "Telegram", handle: "@dennikoff", url: "https://t.me/dennikoff" },
  {
    label: "LinkedIn",
    handle: "denis-harke",
    url: "https://www.linkedin.com/in/denis-harke",
  },
] as const;
