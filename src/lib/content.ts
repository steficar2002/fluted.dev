export const site = {
  name: "fluted",
  email: "hello@fluted.studio",
  bookCallUrl: "https://calendly.com/",
  tagline: "Shopify stores that convert",
  heroEyebrow: "custom shopify builds",
  heroHeadline: "Refract your store.",
  heroSub:
    "We build custom Shopify stores that reveal what actually converts — features, integrations, product pages.",
};

export const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    alt: "Clothing store interior",
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop",
    alt: "Product photography of a watch",
  },
  {
    src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=900&auto=format&fit=crop",
    alt: "Skincare products on display",
  },
  {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop",
    alt: "Red sneaker product shot",
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=900&auto=format&fit=crop",
    alt: "Headphones product shot",
  },
] as const;

export const heroBenefits = [
  "Conversion-first design",
  "Custom features & integrations",
  "Product pages that sell",
  "Fast, measurable launches",
] as const;

export const pillars = [
  {
    title: "Custom features",
    body: "Flows and UI unique to your brand — not theme presets.",
  },
  {
    title: "Integrations",
    body: "CRM, ERP, subscriptions, loyalty — wired cleanly into Shopify.",
  },
  {
    title: "Product pages",
    body: "PDPs designed for clarity, trust, and conversion.",
  },
] as const;

/** Interactive What we do stage — metrics are synthetic demos, not client claims. */
export const whatWeDoStages = [
  {
    id: "features",
    title: "Custom features",
    accent: "coral" as const,
    stake:
      "Theme presets can’t encode your offer logic — custom sections can.",
    body: "We build FOMO timers, bundle builders, and offer engines as first-class Liquid sections — so urgency, value, and choice live in the path to purchase, not as plugins bolted on after.",
    metrics: [
      { value: "+34%", label: "conversion rate", note: "demo" },
      { value: "+2.4×", label: "offer interaction", note: "demo" },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    accent: "yellow" as const,
    stake: "One storefront. Every system that feeds demand and fulfillment.",
    body: "Ads, email, subscriptions, support, and ops — wired into Shopify so the stack reads as product, not patches.",
    integrations: [
      { name: "Meta Ads", slug: "meta", domain: "meta.com" },
      { name: "TikTok", slug: "tiktok", domain: "tiktok.com" },
      { name: "Klaviyo", slug: "klaviyo", domain: "klaviyo.com" },
      { name: "Calendly", slug: "calendly", domain: "calendly.com" },
      { name: "Recharge", slug: "recharge", domain: "rechargepayments.com" },
      { name: "Gorgias", slug: "gorgias", domain: "gorgias.com" },
      { name: "HubSpot", slug: "hubspot", domain: "hubspot.com" },
      { name: "Zapier", slug: "zapier", domain: "zapier.com" },
      { name: "ShipStation", slug: "shipstation", domain: "shipstation.com" },
      { name: "Okendo", slug: "okendo", domain: "okendo.io" },
    ],
    hub: { name: "Shopify", slug: "shopify", domain: "shopify.com" },
  },
  {
    id: "product-pages",
    title: "Product pages",
    accent: "purple" as const,
    stake: "The PDP is the close — we build the persuasion layer into the template.",
    body: "From a bare theme template to a conversion surface: proof, media, variants, and urgency where the decision actually happens.",
  },
] as const;

/** Check our work — placeholder projects; replace covers, URLs, and metrics with real ones. */
export const workProjects = [
  {
    id: "lumen-home",
    name: "Lumen Home",
    focus: "Custom PDP + bundle builder",
    metric: "+38% CVR",
    accent: "coral" as const,
    description:
      "Rebuilt the product experience around bundles and social proof, cutting decision friction on high-ticket SKUs.",
    siteUrl: "https://example.com/lumen-home",
    siteLabel: "Visit store",
    cover:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop",
    coverAlt: "Placeholder cover — modern living room product set",
    placeholder: true,
  },
  {
    id: "northline-apparel",
    name: "Northline Apparel",
    focus: "Headless Shopify + loyalty",
    metric: "2.1× AOV",
    accent: "purple" as const,
    description:
      "Connected loyalty tiers into the cart journey so returning shoppers unlocked value without leaving checkout.",
    siteUrl: "https://example.com/northline",
    siteLabel: "Visit store",
    cover:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    coverAlt: "Placeholder cover — apparel retail interior",
    placeholder: true,
  },
  {
    id: "solace-beauty",
    name: "Solace Beauty",
    focus: "Subscription + quiz funnel",
    metric: "−22% CAC",
    accent: "yellow" as const,
    description:
      "A guided quiz fed personalized kits into a subscription flow that reduced paid acquisition waste.",
    siteUrl: "https://example.com/solace",
    siteLabel: "Visit store",
    cover:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1600&auto=format&fit=crop",
    coverAlt: "Placeholder cover — skincare products on display",
    placeholder: true,
  },
] as const;

/** @deprecated Prefer workProjects — kept for any leftover imports. */
export const caseStudies = workProjects.map((p) => ({
  name: p.name,
  focus: p.focus,
  metric: p.metric,
  accent: p.accent === "yellow" ? ("charcoal" as const) : p.accent,
  detail: p.description,
}));

/** Featured testimonials — one per screen. Prefer `video` when set; else `image`. */
export const featuredTestimonials = [
  {
    id: "maya",
    quote: "They didn’t decorate our store — they rebuilt the path to purchase.",
    body: "We came in with a theme that looked fine and converted poorly. Fluted mapped the funnel, rebuilt the PDP around bundles, and wired social proof where decisions actually stall. The store finally feels like a product we own.",
    rating: 5,
    name: "Maya R.",
    role: "Founder",
    company: "Lumen Home",
    industry: "Home & living",
    focus: "Custom PDP + bundle builder",
    accent: "coral" as const,
    stats: [
      { value: "+38%", label: "conversion rate" },
      { value: "12 wks", label: "to launch" },
    ],
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1400&auto=format&fit=crop",
    imageAlt: "Placeholder portrait — replace with client photo or video",
    video: null as string | null,
    placeholder: true,
  },
  {
    id: "jonas",
    quote: "Every custom feature felt intentional. Conversion followed the clarity.",
    body: "Loyalty used to live in a separate tool nobody opened. They folded tiers into the cart journey and made the custom sections feel native. Average order value moved because the offer was finally obvious.",
    rating: 5,
    name: "Jonas K.",
    role: "CMO",
    company: "Northline Apparel",
    industry: "Fashion",
    focus: "Headless Shopify + loyalty",
    accent: "purple" as const,
    stats: [
      { value: "2.1×", label: "average order value" },
      { value: "−18%", label: "checkout drop-off" },
    ],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1400&auto=format&fit=crop",
    imageAlt: "Placeholder portrait — replace with client photo or video",
    video: null as string | null,
    placeholder: true,
  },
  {
    id: "priya",
    quote: "Fluted made our Shopify stack feel like product, not patches.",
    body: "Quiz, subscription, and Klaviyo were duct-taped together. Fluted rebuilt the path so personalization feeds the subscribe flow without friction. Acquisition spend went further because the post-click experience held up.",
    rating: 5,
    name: "Priya S.",
    role: "Head of Growth",
    company: "Solace Beauty",
    industry: "Beauty",
    focus: "Subscription + quiz funnel",
    accent: "yellow" as const,
    stats: [
      { value: "−22%", label: "acquisition cost" },
      { value: "3.4×", label: "email → purchase" },
    ],
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1400&auto=format&fit=crop",
    imageAlt: "Placeholder portrait — replace with client photo or video",
    video: null as string | null,
    placeholder: true,
  },
] as const;

/** Smaller-client banner — avatar + one-sentence quote (placeholders). */
export const bannerClients = [
  {
    id: "b1",
    name: "Alex M.",
    company: "Field & Form",
    quote: "The custom offer block paid for itself in a week.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "b2",
    name: "Chris T.",
    company: "Orbit Supply",
    quote: "Integrations finally felt like one system.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "b3",
    name: "Samira H.",
    company: "Kin Studio",
    quote: "Our PDP stopped leaking add-to-carts.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "b4",
    name: "Diego L.",
    company: "Harbor Goods",
    quote: "Clear process. Measurable lift.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
] as const;

/** Legacy shape for any leftover imports. */
export const testimonials = featuredTestimonials.map((t) => ({
  quote: t.quote,
  name: t.name,
  role: `${t.role}, ${t.company}`,
}));

export const methodSteps = [
  {
    n: "01",
    title: "Discover",
    body: "We map how shoppers move and name the friction theme presets miss — so every build starts from a real conversion problem.",
    accent: "coral" as const,
    icon: "search" as const,
  },
  {
    n: "02",
    title: "Structure",
    body: "IA, PDP layers, and where custom sections or integrations belong — approved as a map before we write code.",
    accent: "yellow" as const,
    icon: "layout" as const,
  },
  {
    n: "03",
    title: "Build",
    body: "Custom Liquid, offer logic, and integrations wired into the journey — reviewed weekly on staging.",
    accent: "purple" as const,
    icon: "code" as const,
  },
  {
    n: "04",
    title: "Refine",
    body: "Launch with a measurement plan, then iterate the pieces that move conversion — not guesswork after handoff.",
    accent: "coral" as const,
    icon: "chart" as const,
  },
] as const;

/** Fit & positioning FAQ — no invented timelines, prices, or client claims. */
export const faqItems = [
  {
    id: "theme-vs-custom",
    question: "Are you a theme shop or a custom build studio?",
    answer:
      "Custom build. We design and code sections, offer logic, and integrations unique to your brand — not a dressed-up preset theme with apps bolted on.",
    accent: "coral" as const,
  },
  {
    id: "who-for",
    question: "Who is Fluted for?",
    answer:
      "Founders, operators, and ecomm teams who need a Shopify store that converts — and are ready to invest in custom craft instead of another theme tweak.",
    accent: "yellow" as const,
  },
  {
    id: "what-custom-means",
    question: "What does “custom” actually mean on Shopify?",
    answer:
      "Liquid sections, PDP structures, and funnel pieces written for your offer — FOMO, bundles, subscriptions, CRM wires — so the purchase path is product, not plugins.",
    accent: "purple" as const,
  },
  {
    id: "new-or-rebuild",
    question: "Do you only build new stores, or rebuild existing ones?",
    answer:
      "Both. New builds and rebuilds are fair game when the goal is clearer conversion architecture — not a visual refresh that leaves the same friction in place.",
    accent: "coral" as const,
  },
  {
    id: "conversion-vs-design",
    question: "How do you weigh conversion against design?",
    answer:
      "Conversion is the product. Design, CRO, and integrations serve the path to purchase. We refract what actually moves shoppers — we don’t decorate for decoration’s sake.",
    accent: "yellow" as const,
  },
  {
    id: "discovery-call",
    question: "What happens on the discovery call?",
    answer:
      "We talk about your offer, current store (or brief), and whether a custom Fluted build is the right next step. If it isn’t a fit, we’ll say so.",
    accent: "purple" as const,
  },
] as const;

/**
 * Social-proof banner — one image is picked at random on each visit.
 * Client count copy is provisional until real evidence replaces it.
 */
export const socialProofBanner = {
  headline: "Join brands that convert",
  cta: "Book a call",
  href: "#contact",
  images: [
    {
      src: "/hero-image.png",
      alt: "Fluted storefront craft",
    },
    {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      alt: "Shopping bags and fashion",
    },
    {
      src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1600&auto=format&fit=crop",
      alt: "Boutique storefront",
    },
    {
      src: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop",
      alt: "Product unboxing moment",
    },
    {
      src: "https://images.unsplash.com/photo-1555529902-5261145633bf?q=80&w=1600&auto=format&fit=crop",
      alt: "Apparel rack detail",
    },
    {
      src: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1600&auto=format&fit=crop",
      alt: "Skincare still life",
    },
  ],
} as const;
