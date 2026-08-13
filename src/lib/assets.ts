import type { ImageMetadata } from "astro";

/**
 * Резолвер картинок из src/assets в хэшированные URL.
 *
 * Зачем: файлы из public/ Astro копирует в сборку КАК ЕСТЬ, с постоянными
 * именами. Длинный кэш на них опасен — заменил картинку под тем же именем, а
 * вернувшийся посетитель ещё месяц видит старую. Всё, что импортировано из
 * src/, Vite переименовывает в `name.<contenthash>.webp` и кладёт в /_astro/:
 * новая версия файла = новый URL, поэтому immutable-кэш становится безопасным
 * и «протухших» картинок больше не бывает.
 *
 * Ключ — путь внутри src/assets («/desktop/ryadom1.webp»), чтобы в projLinks
 * остались читаемые строки, а не десятки импортов.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/**/*.{webp,avif,png,jpg,jpeg}",
  { eager: true },
);

/** Метаданные картинки: .src (хэшированный URL), .width, .height, .format. */
export function asset(path: string): ImageMetadata {
  const mod = files[`/src/assets${path}`];
  if (!mod) {
    // Лучше уронить сборку, чем выкатить в прод битую картинку.
    const known = Object.keys(files)
      .map((k) => k.replace("/src/assets", ""))
      .sort()
      .join("\n  ");
    throw new Error(`Ассет не найден: src/assets${path}\nЕсть только:\n  ${known}`);
  }
  return mod.default;
}
