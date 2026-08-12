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
  { key: "gadius", url: "https://front.gadius.ru/", host: "front.gadius.ru" },
  { key: "hpc", url: "https://hpc-park.ru/", host: "hpc-park.ru" },
  { key: "megalit", url: "https://www.megalit-gr.ru/", host: "megalit-gr.ru" },
  { key: "juna", url: "https://juna-horse.ru/?content=comics", host: "juna-horse.ru" },
  { key: "hpd", url: "https://hpd-expert.vercel.app/", host: "hpd-expert.vercel.app" },
] as const;

/** Контактный email — нелокализованный. */
export const email = "denis.kharke@gmail.com";

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
