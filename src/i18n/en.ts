import type { Dict } from "./ru";
 
// EN — тексты из объекта `en` референса. Тип Dict гарантирует те же ключи, что и в ru.
export const en: Dict = {
  name: "Denis Kharke",
  nav: { work: "Work", pricing: "Pricing", about: "About", contact: "Contact" },

  heroTitle1: "Frontend for landings,",
  heroTitle2: "sites, and web apps.",
  heroSub:
    "I am Denis, a frontend developer with 4+ years of enterprise experience. I turn designs into fast, reliable interfaces for small businesses and startups.",

  ctaStart: "Start a project",
  ctaWork: "View work",
  workTitle: "Selected work",
  openSite: "Open site",

  pricingTitle: "Services and pricing",
  pricingSub:
    "Fixed starting prices. Final estimate after a short brief, usually within one day.",

  processTitle: "How we work",
  skillsTitle: "Stack",
  expTitle: "Experience",
  expBody:
    "In frontend since 2020. I have shipped a service-ordering platform, corporate sites, and landings, and I handle the full path from Figma to production.",

  contactTitle: "Have a project? Write me.",

  contactModal: {
    title: "How would you like to reach me?",
    sub: "I usually reply within a day.",
    tgLabel: "Telegram",
    tgHint: "Message me on Telegram",
    mailLabel: "Email",
    mailHint: "Send an email",
    close: "Close",
  },

  footer: {
    privacy: "Privacy policy",
    cookieSettings: "Cookie settings",
    cookieReject: "Reject cookies",
    analyticsOn: "Analytics enabled",
    analyticsOff: "Analytics disabled",
    moreNav: "Secondary navigation",
  },

  cookies: {
    title: "We use cookies",
    body: "Analytics cookies help us understand how the site is used. They are not loaded without your consent.",
    more: "Read more in the privacy policy",
    accept: "Accept",
    dismiss: "Reject",
    label: "Cookie consent",
  },

  projMeta: [
    {
      name: "Ryadom",
      tag: "Enterprise app",
      desc: "Enterprise platform for ordering services: complex forms, roles, and order flows",
      shot: "screenshot: front.gadius.ru",
    },
    {
      name: "HPC Park",
      tag: "Corporate site",
      desc: "Website for a GPU rental company: hardware catalog and request flow",
      shot: "screenshot: hpc-park.ru",
    },
    {
      name: "HPD Expert",
      tag: "Landing",
      desc: "Landing page for a medical course: program, speakers, and sign-up",
      shot: "screenshot: hpd-expert.vercel.app",
    },
    {
      name: "Juna Horse",
      tag: "Content site",
      desc: "Equestrian club site with prices, news, and a comics section",
      shot: "screenshot: juna-horse.ru",
    },
    {
      name: "Megalit Group",
      tag: "Corporate site",
      desc: "Site for a law firm: practice areas, team, and consultation requests",
      shot: "screenshot: megalit-gr.ru",
    },
  ],

  services: [
    {
      name: "Landing page",
      desc: "One page that sells a product, course, or service.",
      price: "from $700",
      includes: [
        "Design-to-code or design from scratch",
        "Mobile and tablet responsive",
        "Contact form to email or Telegram",
        "Launch in 1-2 weeks",
      ],
    },
    {
      name: "Business website",
      desc: "Multi-page site for your company: services, prices, news, contact forms.",
      price: "from $1,400",
      includes: [
        "Up to 10 pages",
        "Content management without a developer",
        "Basic SEO and fast loading",
        "One month of support after launch",
      ],
    },
    {
      name: "Web app frontend",
      desc: "Interface for your product on React or Vue.",
      price: "from $2,800",
      includes: [
        "Dashboards and complex forms",
        "Integration with your API",
        "TypeScript codebase",
        "Handoff with documentation",
      ],
    },
  ],

  steps: [
    { name: "Brief", desc: "You describe the task, I ask questions and clarify scope." },
    { name: "Estimate", desc: "Fixed price and timeline, usually within one day." },
    {
      name: "Build",
      desc: "I share progress on a live link so you see the site grow.",
    },
    { name: "Approval", desc: "You review the result, I apply final corrections." },
    { name: "Launch", desc: "Deploy, domain setup, and fixes after release." },
  ],

  skillGroups: [
    { label: "LANGUAGES", items: ["TypeScript", "JavaScript", "HTML", "CSS"] },
    { label: "FRAMEWORKS", items: ["React", "Vue", "Nuxt", "Astro"] },
    {
      label: "ALSO",
      items: ["Figma to code", "Responsive layout", "REST API integration"],
    },
  ],
};
