# CLAUDE.md — Denis Kharke Portfolio (тёмный дизайн)

Полное ТЗ: [исходники/prompt-kharke-portfolio-dark.md](исходники/prompt-kharke-portfolio-dark.md). Поэтапный план: [PLAN.md](PLAN.md). Этот файл — рабочая память: стек, конвенции, токены, источники контента.

**Раскладка репозитория:** `исходники/` — входные материалы (ТЗ, референс, портрет), их не редактируем. Всё остальное в корне (`src/`, `public/`, конфиги) — то, что мы разрабатываем.

## Стек

- **Astro v5**, `output: 'static'`, TypeScript strict. Без React — интерактивность в `<script>` внутри `.astro` (Astro бандлит как ES-модули с defer).
- **Tailwind CSS v4** через `@tailwindcss/vite`, стили — `@import "tailwindcss"` в `src/styles/global.css`.
- **motion** (motion.dev, vanilla API): `animate`, `inView`, `scroll`, `stagger`. НЕ Framer Motion.
- **lenis** — плавный скролл, один клиентский скрипт, выключать при `prefers-reduced-motion`.
- Шрифты self-host: **Golos Text** (400/600/700/900, кириллица критична) + **JetBrains Mono** (400/500).

## Команды

<!-- Заполнить после Фазы 0 -->
- `npm run dev` — дев-сервер
- `npm run build` — прод-сборка (static)
- `npm run preview` — предпросмотр сборки

## Структура

```
src/
  layouts/Base.astro
  pages/index.astro          # RU (дефолт)
  pages/en/index.astro       # EN (отдельный статический роут)
  i18n/{ru,en}.ts  i18n/utils.ts
  styles/global.css
  components/
    Nav Hero Marquee About Pricing Projects Process Contact  (.astro)
    FadeIn Magnet AnimatedText ContactButton GhostButton NumberedItem  (.astro)
  scripts/
    lenis.ts fade.ts magnet.ts marquee.ts stack.ts animated-text.ts
public/images/projects/*  public/images/photo.png
```

### Порядок секций (важна геометрия перекрытия)

1. Hero (тёмная) → 2. Marquee (тёмная) → 3. About (тёмная) → **4. Услуги и цены (БЕЛАЯ, `rounded-t-[40/50/60px]`)** → 5. Projects (тёмная, `rounded-t-[…]`, `-mt-10 sm:-mt-12 md:-mt-14`, `z-10` — перекрывает белую) → 6. Процесс (тёмная) → 7. Контакты/футер (тёмная).

Белая вставка ровно одна — в этом весь приём. Второй белой секции не делать.

## Дизайн-токены (кратко; полностью — §2 ТЗ)

**Тёмные секции:** bg `#0C0C0C` · text `#D7E2EA` · secondary `#93A5A5` · heading-градиент `linear-gradient(180deg,#646973,#BBCCD7)` (класс `.hero-heading` + `background-clip:text`) · аква `#44A1A4` (hover `#5BC4C7`) · оранж `#FF9A00` · card border `2px solid #D7E2EA` · divider `rgba(215,226,234,.15)`.

**Белая секция:** bg `#FFFFFF` · text `#22302F` · secondary `#57696A` · mono `#2E7B7E` · цена `#B36E00` · галочка `#2E8B5F`.

⚠️ На тёмном фоне НЕ использовать `#2E7B7E` / `#B36E00` (не проходят AA) — только `#44A1A4` / `#FF9A00`.

## Ключевые решения (§8 ТЗ)

1. **H1** — вордмарк `denis kharke` (латиница, lowercase, `whitespace-nowrap`, 14–17.5vw). Продающая фраза из `hero.h1` уезжает в tagline слева внизу.
2. **Градиент кнопки** — пересобранный под аква/оранж (см. §5 ContactButton).
3. **Декор About** — Вариант A: убрать совсем (рекомендация ТЗ).
4. **Переключатель цен** — убран, все 3 тарифа раскрыты сразу.

## Источники контента и ассетов

- **✅ Копи (RU+EN) — финальная, полная.** Объекты `ru` (строки 226–264) и `en` (187–225) в `исходники/design-reference/Denis Kharke Portfolio v3.dc.html`: hero (`heroTitle1/2`, `heroSub`), `services` (с ценами и `includes`), `projMeta` (name/tag/desc), `steps`, `skillGroups`, `timeline`, `pricingTitle/Sub`, `contactTitle`. Переносим в `i18n/{ru,en}.ts` построчно, тексты не переписываем.
  - H1 по решению ТЗ = вордмарк `denis kharke`; `heroTitle1+heroTitle2` («Фронтенд для лендингов, сайтов и веб-приложений.») уезжает в tagline.
  - Соцсети в ru/en нет — берём из §4.7 ТЗ: GitHub/Dennikoff, Telegram/@dennikoff, LinkedIn/denis-harke.
- **✅ Портрет** — `исходники/assets/photo.PNG` (2.4 МБ). При интеграции переложить в `public/images/photo.png`, ужать до WebP ≥1200px.
- **⚠️ Скриншоты проектов (5×3) и плитки marquee (10–12) — нет.** В референсе они тоже плейсхолдеры (`shot: 'скриншот: …'`). До получения — плейсхолдеры с корректными `width/height`/`aspect-ratio` (нужно в Фазе 5, не блокирует 0–4).

## Перформанс/доступность (планка: Lighthouse mobile 95+)

Один общий `rAF` на все скролл-эффекты. `content-visibility:auto` на marquee и projects. Все картинки с размерами + `loading="lazy"` (кроме портрета: `fetchpriority="high"`). `prefers-reduced-motion` → выключить Lenis/Magnet/marquee/AnimatedText, всё в конечном состоянии. Семантика (`nav/header/section aria-labelledby/footer`, один `h1`, `alt`), тач-таргеты ≥44px.

---

## Поэтапный план

Полный план и статус фаз — в отдельном файле [PLAN.md](PLAN.md). Кратко: 0) каркас → 1) i18n → 2) статический layout → 3) базовое появление → 4) продвинутая интерактивность → 5) ассеты + перф/a11y. Статический layout стабилизируем ДО сложных анимаций. Статусы фаз (⬜/🟡/✅) обновляем в PLAN.md.
