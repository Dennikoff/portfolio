# Промпт: портфолио Denis Kharke на новом (тёмном) дизайне

Стек: **Astro (static) + TypeScript + Tailwind CSS + motion (motion.dev)**. Без React.

Задача: взять наполнение, структуру и логику существующего ТЗ (`Denis Kharke Portfolio v3`) и переложить их на визуальный язык нового референса — тёмный фон, гигантские градиентные заголовки, скролл-марки, магнитный портрет, стекающиеся sticky-карточки, посимвольное проявление текста.

---

## 0. ЧТО ОТКУДА БЕРЁТСЯ

| Из старого ТЗ (наполнение) | Куда ложится в новом дизайне |
|---|---|
| Nav: Работы / Цены / Обо мне + RU\|EN | Navbar героя (4 слота + переключатель языка) |
| Hero: H1, подзаголовок, 2 CTA, портрет | Hero: гигантский градиентный H1, tagline слева внизу, CTA справа, портрет по центру с Magnet |
| Selected work: 5 проектов | Секция Projects: **5** стекающихся sticky-карточек |
| Скриншоты проектов | Дополнительно — плитки Marquee (две ленты по скроллу) |
| Pricing: 3 тарифа с переключателем | Светлая секция «Услуги и цены»: 3 нумерованных пункта 01–03 с ценой (переключатель убираем — все три видны сразу) |
| Process: 5 шагов | Тёмная секция «Процесс»: 5 нумерованных пунктов 01–05 (та же идиома нумерованного списка, инвертированная в тёмное) |
| Skills + Experience | Секция About: градиентный заголовок + абзац с посимвольным проявлением + чип-группы навыков + таймлайн опыта |
| Footer / Contact | Финальная секция: крупный заголовок + mono-email + соцсети |

### Порядок секций

1. Hero (тёмная)
2. Marquee (тёмная)
3. About + Skills/Experience (тёмная)
4. **Услуги и цены (БЕЛАЯ, `rounded-t-[40/50/60px]`)**
5. Projects (тёмная, `rounded-t-[40/50/60px]`, поднята вверх `-mt-10 sm:-mt-12 md:-mt-14`, `z-10` — перекрывает белую секцию)
6. Процесс (тёмная)
7. Контакты / футер (тёмная)

Светлая вставка используется **ровно один раз** — в этом весь приём. Не делать вторую белую секцию.

---

## 1. СТЕК

- `astro` v5, static output, TypeScript strict
- `tailwindcss` v4 через `@tailwindcss/vite`, стили — `@import "tailwindcss"` в `src/styles/global.css`
- `motion` (motion.dev, **vanilla API**): `animate`, `inView`, `scroll`, `stagger`. Framer Motion не нужен — React-островов нет
- Плавный скролл: `lenis`, инициализация в одном клиентском скрипте, **выключать при `prefers-reduced-motion`**
- Вся интерактивность — в `<script>` внутри `.astro` (Astro бандлит их как ES-модули с defer)

```
src/
  layouts/Base.astro
  pages/index.astro          # RU
  pages/en/index.astro       # EN
  i18n/{ru,en}.ts
  i18n/utils.ts
  styles/global.css
  components/
    Nav.astro  Hero.astro  Marquee.astro  About.astro
    Pricing.astro  Projects.astro  Process.astro  Contact.astro
    FadeIn.astro  Magnet.astro  AnimatedText.astro
    ContactButton.astro  GhostButton.astro  NumberedItem.astro
  scripts/
    lenis.ts  fade.ts  magnet.ts  marquee.ts  stack.ts  animated-text.ts
public/
  images/projects/*  images/photo.png
```

---

## 2. ТОКЕНЫ

Палитра старого ТЗ была светлой. Переносим её на тёмную основу: **акценты сохраняем, светлоту инвертируем.** На `#0C0C0C` нельзя использовать `#2E7B7E` и `#B36E00` для текста — они не проходят AA.

### Тёмные секции
```
bg              #0C0C0C
text            #D7E2EA
text-secondary  #93A5A5
heading         linear-gradient(180deg, #646973 0%, #BBCCD7 100%)   /* класс .hero-heading */
accent aqua     #44A1A4     /* mono-лейблы, домены, годы, точки таймлайна */
accent hover    #5BC4C7
action orange   #FF9A00     /* цены, активные состояния, заливки CTA */
card border     2px solid #D7E2EA
divider         rgba(215, 226, 234, 0.15)
selection       bg #BFE3E3 / text #22302F
```

### Светлая секция (Услуги и цены)
Здесь палитра старого ТЗ работает как есть:
```
bg #FFFFFF · text #22302F · secondary #57696A
mono-лейблы #2E7B7E · цена #B36E00 · галочка ✓ #2E8B5F
divider 1px rgba(12,12,12,0.15) · кнопка #FF9A00 с текстом #22302F
```

### Типографика
- Дисплей и текст: **Golos Text**, веса 400/600/700/**900** (кириллица есть — критично; в референсном Kanit её нет)
- Mono-акценты: **JetBrains Mono** 400/500 — домены, цены, годы, лейблы групп, теги
- Гигантские номера `01–05`: Golos Text 900 (можно JetBrains Mono 500 — будет «девелоперский» характер, на выбор)
- `text-wrap: balance` на заголовках, `font-display: swap`, `preconnect` к Google Fonts (лучше — self-host через `@fontsource-variable/golos-text`)

Размеры (флюидные, из нового дизайна):
```
hero h1     text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]
h2 секций   clamp(3rem, 12vw, 160px)
номера      clamp(3rem, 10vw, 140px)
имя пункта  clamp(1rem, 2.2vw, 2.1rem)
описание    clamp(0.85rem, 1.6vw, 1.25rem)
```

### Глобально
- Ресет: `box-sizing: border-box; margin: 0; padding: 0`
- `#0C0C0C` на `html`, `body`, корневой обёртке; обёртка `overflow-x: clip`
- Класс `.hero-heading`: градиент + `-webkit-background-clip: text` + `-webkit-text-fill-color: transparent` + `background-clip: text`
- Радиусы: `999px` пиллы, `rounded-2xl` плитки марки, `rounded-[40px] sm:rounded-[50px] md:rounded-[60px]` карточки проектов и их картинки
- Контейнер `max-width: 1200px`, боковые паддинги `px-5 sm:px-8 md:px-10`. Исключение: hero и марки — во всю ширину

---

## 3. I18N

- RU — дефолт на `/`, EN — отдельный статический роут `/en/` (лучше для SEO, чем рантайм-свап). `<html lang>` меняется вместе с роутом
- Все строки — в двух словарях `src/i18n/ru.ts` и `en.ts` с одинаковыми ключами
- **Копи брать построчно из объектов `ru` / `en` внутри `design-reference/Denis Kharke Portfolio v3.dc.html`** — эти строки финальные, переписывать их нельзя. Ниже дана только схема ключей и те факты, что зафиксированы в ТЗ
- Переключатель в navbar: активный язык — `#FF9A00`, 600; неактивный — `#93A5A5`; разделитель — пайп `rgba(215,226,234,0.25)`. Выбор писать в `localStorage`, при заходе на `/` с сохранённым `en` — редирект на `/en/`
- `hreflang` alternate между роутами

Схема ключей:
```ts
{
  nav: { work, pricing, about, contact },
  hero: { h1, sub, ctaPrimary, ctaSecondary },
  about: { heading, paragraph, skillGroups: [{ label, items[] }] x3,
           experienceIntro, timeline: [{ year, text }] x3 },
  pricing: { heading, sub, items: [{ name, desc, includes[], price, cta }] x3 },
  projects: { heading, items: [{ name, domain, tag, desc, cta }] x5 },
  process: { heading, steps: [{ name, desc }] x5 },
  contact: { heading, email, socials: [{ label, handle, url }] x3 }
}
```

---

## 4. СЕКЦИИ

### 4.1 Hero — `#top`

`h-screen`, flex-колонка, `overflow-x: clip`.

**Navbar:** `justify-between`, `px-6 md:px-10 pt-6 md:pt-8`, высота ~68px. Слева — имя `Denis Kharke` (JetBrains Mono 500, `#D7E2EA`). Справа — ссылки `Работы` / `Цены` / `Обо мне` / `Контакт` (anchor-скролл `#work`, `#pricing`, `#about`, `#contact`) + переключатель RU|EN. Ссылки: `#D7E2EA`, `font-medium uppercase tracking-wider`, `text-sm md:text-lg lg:text-[1.4rem]`, hover `opacity-70` 200ms.

**H1:** `.hero-heading`, `font-black uppercase tracking-tight leading-none whitespace-nowrap w-full`, `mt-6 sm:mt-4 md:-mt-5`, в обёртке `overflow-hidden`.

> **Решение по тексту H1.** В новом дизайне H1 — это одна нерасширяемая строка на 14–17.5vw. Продающий H1 из старого ТЗ (предложение с выделенной второй частью) в этот слот физически не влезает, тем более в кириллице. Поэтому: **в H1 идёт вордмарк `denis kharke`** (латиница, lowercase — одинаково работает в обеих локалях и безопасен для `whitespace-nowrap`), а продающая формулировка из `hero.h1` старого ТЗ переезжает в tagline слева внизу с увеличенным `max-w-[420px]` и `font-size: clamp(0.9rem, 1.6vw, 1.6rem)`, чтобы не потерять вес питча. Старый `hero.sub` (46ch) — либо склеить с ним, либо опустить.

**Нижняя полоса:** `flex justify-between items-end pb-7 sm:pb-8 md:pb-10`
- слева — tagline: `#D7E2EA`, `font-light uppercase tracking-wide leading-snug`
- справа — `ContactButton` («Обсудить проект» → `mailto:`) и рядом `GhostButton` («Смотреть работы» → `#work`), gap 12px, на мобиле — в колонку

**Портрет:** `public/images/photo.png`, обёрнут в `Magnet` (padding 150, strength 3). `absolute left-1/2 -translate-x-1/2 z-10`, `w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]`, `object-cover object-top`, `rounded-xl`. Мобила: `top-1/2 -translate-y-1/2`; `sm+`: `sm:top-auto sm:translate-y-0 sm:bottom-0`. `fetchpriority="high"`, без `loading="lazy"`. Опционально — лёгкий параллакс по скроллу (сдвиг ≤ 40px).

**Появление:** navbar delay 0 / y −20 · H1 delay 0.15 / y 40 · tagline delay 0.35 / y 20 · кнопки delay 0.5 / y 20 · портрет delay 0.6 / y 30. Duration 0.7, ease `cubic-bezier(0.16, 1, 0.3, 1)`.

### 4.2 Marquee

Две ленты скриншотов, горизонтальный сдвиг привязан к позиции скролла. Фон `#0C0C0C`, `pt-24 sm:pt-32 md:pt-40 pb-10`.

- Ряд 1 едет **вправо**: `translateX(offset - 200)`; ряд 2 — **влево**: `translateX(-(offset - 200))`
- `offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3`
- Массив каждой ленты **утроен** для бесшовности
- Плитка: `420 × 270`, `rounded-2xl`, `object-cover`, `loading="lazy"`, `will-change: transform`, `gap-3` между плитками и рядами
- Слушатель `{ passive: true }`, применение трансформа — внутри `requestAnimationFrame`
- **Контент:** нужно минимум 10–12 уникальных плиток. Пяти проектов не хватит, поэтому берём по 2–3 кадра с каждого сайта (главная, внутренняя, деталь интерфейса) — 5–6 плиток на ряд

### 4.3 About — `#about`

`min-h-screen`, `px-5 sm:px-8 md:px-10 py-20`, центрирование по вертикали.

**Заголовок:** `.hero-heading`, `font-black uppercase leading-none tracking-tight`, по центру, `clamp(3rem, 12vw, 160px)`. FadeIn delay 0, y 40.

**Абзац об опыте** — компонент `AnimatedText` (посимвольное проявление от `opacity: 0.2` к `1` по прогрессу скролла, offset `['start 0.8', 'end 0.2']`): `#D7E2EA`, `font-medium text-center leading-relaxed max-w-[560px]`, `clamp(1rem, 2vw, 1.35rem)`. Текст — `about.paragraph` (факты: фронтенд с 2020, фриланс с 2021, enterprise с 2022).

**Ниже — две колонки** (`md:grid-cols-2`, gap 56px, `max-w-5xl`, на `≤820px` в одну колонку):
- Слева: 3 чип-группы. Лейбл группы — JetBrains Mono 500, uppercase, `tracking-widest`, `#44A1A4`, 12px. Чипы — `rounded-full`, `border 1px rgba(215,226,234,0.25)`, текст `#D7E2EA` 14px, `px-3.5 py-1.5`, gap 8px
- Справа: таймлайн опыта, 3 строки. Год — JetBrains Mono 500 `#44A1A4`; описание — `#93A5A5`. Разделители `1px rgba(215,226,234,0.15)`

**Декоративные картинки по углам** (в референсе — четыре 3D-объекта). Своих таких ассетов нет, поэтому:
- **Вариант A (рекомендую):** убрать их совсем — секция и так плотная за счёт двух колонок
- **Вариант B:** четыре абстрактные SVG-фигуры (круг, сетка точек, дуга, скруглённый квадрат) с `stroke: #44A1A4`, `opacity: 0.18`, размытием `blur(0.5px)`, размеры и позиции как в референсе: TL/TR `w-[120px] sm:w-[160px] md:w-[210px]` в `top-[4%] left|right-[1%→4%]`, BL `w-[100px→180px]` в `bottom-[8%] left-[3%→10%]`, BR `w-[130px→220px]` в `bottom-[8%] right-[3%→10%]`. FadeIn: TL delay 0.1 x −80, TR 0.15 x 80, BL 0.25 x −80, BR 0.3 x 80, duration 0.9

Гэпы: заголовок↔абзац `gap-10 sm:gap-14 md:gap-16`; абзац↔колонки `gap-16 sm:gap-20 md:gap-24`.

### 4.4 Услуги и цены — `#pricing` (БЕЛАЯ секция)

`#FFFFFF`, `rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]`, `px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32`.

Заголовок: `#0C0C0C`, `font-black uppercase text-center`, `clamp(3rem, 12vw, 160px)`, `mb-4`. Под ним `pricing.sub`: `#57696A`, по центру, `max-w-[560px]`, `mb-16 sm:mb-20 md:mb-28`.

Три пункта в вертикальном списке, `max-w-5xl`, по центру. Переключателя-табов **нет** — все три раскрыты сразу, это честнее и убирает лишний остров.

Каждый пункт — горизонтальный layout:
- **слева** номер `01`/`02`/`03`: `font-black`, `clamp(3rem, 10vw, 140px)`, `#0C0C0C`
- **справа** сверху вниз:
  - имя услуги: `font-medium uppercase`, `clamp(1rem, 2.2vw, 2.1rem)`, `#22302F`
  - описание: `font-light leading-relaxed max-w-2xl`, `clamp(0.85rem, 1.6vw, 1.25rem)`, `#57696A`
  - чипы «что входит»: `✓` цветом `#2E8B5F` + текст `#57696A` 14px, `border 1px rgba(12,12,12,0.15)`, `rounded-full`, `px-3 py-1.5`
  - строка снизу: цена — JetBrains Mono 500, 30px, `#B36E00`, с префиксом «от» / «from»; справа — CTA `#FF9A00` с текстом `#22302F`, `rounded-full`, hover `#ffab2e`
- разделители между пунктами: `1px solid rgba(12,12,12,0.15)`, `py-8 sm:py-10 md:py-12`
- FadeIn со сдвигом `delay = i * 0.1`

Цены фиксированы: RU `50 000 / 120 000 / 250 000 ₽`, EN `$600 / $1,400 / $2,800`.

### 4.5 Projects — `#work`

`#0C0C0C`, `rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]`, `-mt-10 sm:-mt-12 md:-mt-14`, `z-10`.

Заголовок — как остальные (`.hero-heading`, `clamp(3rem, 12vw, 160px)`).

**5 стекающихся карточек.** Каждая — `position: sticky; top: 6rem (md: 8rem)` внутри контейнера `h-[85vh]`, уменьшается по мере прокрутки поверх неё:
- `targetScale = 1 - (5 - 1 - index) * 0.03` → `0.88 / 0.91 / 0.94 / 0.97 / 1`
- доп. сдвиг карточки: `top: ${index * 28}px`, `transform-origin: top`
- карточка: `rounded-[40px] sm:rounded-[50px] md:rounded-[60px]`, `border: 2px solid #D7E2EA`, фон `#0C0C0C`, `p-4 sm:p-6 md:p-8`

**Верхний ряд карточки:** номер (стиль как в услугах, но цвет `#D7E2EA`) · тег-пилл (JetBrains Mono, uppercase, `#44A1A4`, бордер `1px rgba(68,161,164,0.4)`) · название проекта (`font-medium uppercase`, `clamp(1rem, 2.2vw, 2.1rem)`) · домен (JetBrains Mono, `#44A1A4`) · описание (`#93A5A5`, `max-w-2xl`) · `GhostButton` «Открыть сайт ↗» → живой сайт, `target="_blank" rel="noopener"`.

**Нижний ряд:** две колонки — левая 40% (две картинки друг под другом: высота `clamp(130px, 16vw, 230px)` и `clamp(160px, 22vw, 340px)`), правая 60% (одна высокая). Все картинки — с тем же тяжёлым радиусом, `object-cover`.

Порядок проектов фиксирован:
```
01  Gadius          front.gadius.ru
02  HPC Park        hpc-park.ru
03  Мегалит Групп   megalit-gr.ru
04  Juna Horse      juna-horse.ru
05  HPD Expert      hpd-expert.vercel.app
```
Карусели, стрелок и точек из старого ТЗ **нет** — стекинг заменяет их полностью. Это минус один интерактивный остров.

### 4.6 Процесс

`#0C0C0C`, `px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32`. Заголовок — `.hero-heading`.

5 шагов: `Бриф · Оценка · Разработка · Согласование · Запуск`. Та же идиома нумерованного списка, что в услугах, но в тёмном исполнении: номер `#D7E2EA` (первый — `#FF9A00`, как первая точка таймлайна в старом ТЗ), имя `#D7E2EA` `uppercase`, описание `#93A5A5`, разделители `1px rgba(215,226,234,0.15)`. `max-w-5xl`, FadeIn `delay = i * 0.1`.

### 4.7 Контакты / футер — `#contact`

`#0C0C0C`, верхний бордер `1px rgba(215,226,234,0.15)`, `py-20 sm:py-24`.

- Крупный заголовок `.hero-heading`, `clamp(2.5rem, 9vw, 120px)`
- Email: JetBrains Mono 500, `#FF9A00`, `clamp(1rem, 2.4vw, 1.9rem)`, `mailto:`, hover `underline`
- Соцсети в столбец справа (`md:grid-cols-[1.4fr_1fr]`): `GitHub / Dennikoff`, `Telegram / @dennikoff`, `LinkedIn / denis-harke`. Лейбл — mono `#44A1A4`, хэндл — `#D7E2EA`, hover `#5BC4C7`. `target="_blank" rel="noopener"`
- `ContactButton` крупно по центру или справа внизу
- Строка копирайта: `#93A5A5`, 13px

---

## 5. КОМПОНЕНТЫ

### ContactButton
Pill `rounded-full`, градиентная заливка. Референсный градиент (маджента → фиолет → оранж) конфликтует с аква/оранжевой палитрой, поэтому пересобран под неё, форма и тени сохранены 1:1:
```css
background: linear-gradient(123deg, #0C1F1F 7%, #2E7B7E 37%, #44A1A4 72%, #FF9A00 100%);
box-shadow: 0 4px 4px rgba(46,123,126,.25), 4px 4px 12px #2E7B7E inset;
outline: 2px solid #fff; outline-offset: -3px;
```
Текст белый, `font-medium uppercase tracking-widest`. Размеры `px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4`, `text-xs sm:text-sm md:text-base`. Рендерить как `<a>`. Active `scale(0.98)`.
*(Если захочется оставить оригинальный градиент референса — он в исходной спеке; тогда аква из палитры лучше убрать в пользу маджентового акцента, иначе будет три конкурирующих акцента.)*

### GhostButton
`rounded-full`, `border-2 border-[#D7E2EA]`, текст `#D7E2EA`, `font-medium uppercase tracking-widest`, `px-8 py-3 sm:px-10 sm:py-3.5`, `text-sm sm:text-base`, hover `bg-[#D7E2EA]/10`, hover-бордер `#5BC4C7`.

### FadeIn
```astro
---
interface Props { delay?: number; duration?: number; x?: number; y?: number; class?: string }
const { delay = 0, duration = 0.7, x = 0, y = 30, class: cls } = Astro.props;
---
<div class={cls} data-fade data-delay={delay} data-duration={duration}
     style={`opacity:0; transform: translate(${x}px, ${y}px); will-change: opacity, transform;`}>
  <slot />
</div>
```
```ts
// scripts/fade.ts
import { animate, inView } from "motion";

if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
} else {
  inView("[data-fade]", (el) => {
    const d = (el as HTMLElement).dataset;
    animate(el, { opacity: 1, transform: "translate(0px, 0px)" }, {
      duration: Number(d.duration),
      delay: Number(d.delay),
      ease: [0.16, 1, 0.3, 1],
    });
    return () => {}; // одноразово: не откатывать при уходе из вьюпорта
  }, { margin: "0px 0px -20% 0px" });
}
```

### Magnet
`mousemove` на `window`, позиция курсора относительно центра элемента; если курсор ближе `padding` (150px) к границе — `translate3d(dx/3, dy/3, 0)`. Transition входа `transform .3s ease-out`, выхода `transform .6s ease-in-out`, `will-change: transform`. Выключать при `(hover: none)` и `prefers-reduced-motion`.

### AnimatedText
Каждый символ — `<span data-char>` (пробелы через `white-space: pre-wrap`, не терять).
```ts
import { animate, scroll, stagger } from "motion";
document.querySelectorAll<HTMLElement>("[data-animated-text]").forEach((el) => {
  const chars = el.querySelectorAll("[data-char]");
  scroll(animate(chars, { opacity: [0.2, 1] }, { delay: stagger(1 / chars.length) }),
         { target: el, offset: ["start 0.8", "end 0.2"] });
});
```

### Стекинг карточек
```ts
import { animate, scroll } from "motion";
const items = [...document.querySelectorAll<HTMLElement>("[data-stack-item]")];
items.forEach((wrapper, i) => {
  const card = wrapper.querySelector<HTMLElement>("[data-stack-card]")!;
  const targetScale = 1 - (items.length - 1 - i) * 0.03;
  scroll(animate(card, { scale: [1, targetScale] }),
         { target: wrapper, offset: ["start start", "end start"] });
});
```

**Соответствие, если билдер знает Framer Motion:** `whileInView` + `once` → `inView(el, cb, { margin })` · `useScroll` + `useTransform` → `scroll(animate(...), { target, offset })` · `staggerChildren` → `{ delay: stagger(n) }` · `motion.div` → обычный DOM + `animate()`.

---

## 6. АССЕТЫ

| Слот | Что нужно | Требования |
|---|---|---|
| Портрет героя | `photo.PNG` (есть) | ≥ 1200px по ширине, PNG/WebP, `object-position: top` |
| Карточки проектов | 5 × 3 скриншота | WebP; в левой колонке — горизонтальные, в правой — **вертикальная** (скролл-снимок страницы) |
| Плитки Marquee | 10–12 кадров | соотношение строго ~1.55:1 (420×270); WebP, ≤ 60 КБ каждый |
| Декор About | 4 SVG (или ничего) | вариант B выше |

Скриншоты снимать в одинаковой ширине вьюпорта (1440) и одинаковом масштабе — иначе стек карточек визуально «дышит».

---

## 7. ПЕРФОРМАНС И ДОСТУПНОСТЬ

Планка из старого ТЗ — **Lighthouse 95+ на мобиле**, и она здесь конфликтует с новым дизайном (много картинок + постоянные скролл-вычисления). Сайт сам является аргументом «делаю быстрые сайты», поэтому требования жёсткие:

- Никаких GIF. Марка — WebP или `<video muted loop playsinline preload="metadata">`
- `content-visibility: auto` на лентах марки и на секции проектов
- Все картинки с `width`/`height` или `aspect-ratio`, `loading="lazy"` кроме портрета
- Один общий `rAF`-цикл на все скролл-эффекты, не по одному слушателю на компонент
- `@media (prefers-reduced-motion: reduce)`: выключить Lenis, Magnet, марку, посимвольное проявление; всё сразу в конечном состоянии
- Шрифты: только нужные веса, `unicode-range` для латиницы/кириллицы, self-host предпочтителен
- Семантика: `<nav>/<header>/<section aria-labelledby>/<footer>`, один `h1`, `alt` у скриншотов, `alt=""` у декора, тач-таргеты ≥ 44px
- Контраст: пары токенов выше проходят AA. Не переносить `#2E7B7E` / `#B36E00` на тёмный фон — только `#44A1A4` / `#FF9A00`
- Респонсив: hero и About-колонки в одну колонку ≤ 820px; навбар — компактный ряд; в карточках проектов две колонки складываются в одну; `h-[85vh]` контейнеры на мобиле → `h-auto` + обычный поток (стекинг на маленьком экране выключить)

---

## 8. ЧТО ТРЕБУЕТ ТВОЕГО РЕШЕНИЯ

1. **H1** — вордмарк `denis kharke` в гигантской строке, продающая фраза уезжает в tagline (см. 4.1). Альтернатива: сократить продающий H1 до 2–3 слов.
2. **Градиент кнопки** — пересобранный под аква/оранж или оригинальный маджентовый.
3. **Декор в About** — убрать или SVG-фигуры.
4. **Переключатель цен** — я его убрал (все 3 тарифа сразу). Если нужен — вернётся как единственный интерактивный остров.
5. **Строки копи** — я их не видел: в хендоффе только факты (проекты, домены, цены, шаги, годы). Тексты `hero.h1`, `hero.sub`, описания проектов и услуг нужно вынуть из `ru`/`en` объектов референсного HTML.
