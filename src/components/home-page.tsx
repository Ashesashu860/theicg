import Image from "next/image";
import Link from "next/link";
import {
  AccountTreeIcon,
  ArrowForwardIcon,
  ArrowOutwardIcon,
  SettingsApplicationsIcon,
  TransformIcon,
  TrendingUpIcon,
} from "./icons";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const insights = [
  {
    category: "Technology",
    title: "The AI Imperative: Redefining Competitive Advantage",
    excerpt:
      "How early adopters are moving beyond pilots to enterprise-wide generative AI deployment, creating unassailable moats.",
    image: "/images/insight-ai.jpg",
    alt: "Digital visualization representing artificial intelligence in enterprise business",
  },
  {
    category: "Sustainability",
    title: "Net-Zero Economics: Value Creation in the Transition",
    excerpt:
      "Decarbonization is no longer just compliance; it is the most significant commercial opportunity of the decade.",
    image: "/images/insight-sustain.jpg",
    alt: "Sustainable modern infrastructure with glass, steel, and greenery",
  },
  {
    category: "Macroeconomics",
    title: "Navigating the New Geopolitical Reality",
    excerpt:
      "Supply chain resilience and strategic decoupling strategies for global enterprises in an era of persistent volatility.",
    image: "/images/insight-macro.jpg",
    alt: "Abstract macroeconomic data visualization with global connections",
  },
];

const capabilities = [
  {
    title: "Corporate Strategy",
    description:
      "Defining winning aspirations and reallocating capital to build sustainable competitive advantage.",
    icon: AccountTreeIcon,
    featured: false,
  },
  {
    title: "Operations & Supply Chain",
    description:
      "Optimizing global networks for resilience, cost-efficiency, and responsiveness.",
    icon: SettingsApplicationsIcon,
    featured: false,
  },
  {
    title: "Digital Transformation",
    description:
      "Architecting scalable digital cores and embedding analytics to drive core business value.",
    icon: TransformIcon,
    featured: false,
  },
  {
    title: "Growth & Innovation",
    description:
      "Identifying adjacent markets and building new disruptive business models.",
    icon: TrendingUpIcon,
    featured: true,
  },
];

const stats = [
  { value: "50+", label: "Global Offices" },
  { value: "90%", label: "Fortune 100 Clients" },
  { value: "$2T+", label: "Client Value Created" },
  { value: "10k", label: "Industry Experts" },
];

export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <section className="relative flex h-[80vh] min-h-[600px] items-center justify-center overflow-hidden bg-inverse-surface">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero.jpg"
              alt=""
              fill
              priority
              className="animate-hero-zoom object-cover opacity-60 mix-blend-overlay"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-hero" />
          </div>
          <div className="relative z-10 mx-auto mt-20 max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
            <h1 className="animate-fade-up mx-auto mb-6 max-w-4xl font-serif text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-pure-white md:text-display-lg">
              Pioneering the Future of Strategy
            </h1>
            <p
              className="animate-fade-up mx-auto mb-10 max-w-2xl font-sans text-body-lg text-surface-container-highest"
              style={{ animationDelay: "120ms" }}
            >
              We partner with visionary leaders to navigate complexity, unlock
              exponential value, and shape the global economy of tomorrow.
            </p>
            <div
              className="animate-fade-up flex justify-center"
              style={{ animationDelay: "220ms" }}
            >
              <Link
                href="#capabilities"
                className="bg-pure-white px-8 py-4 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:bg-surface-variant"
              >
                Explore Our Approach
              </Link>
            </div>
          </div>
        </section>

        <section
          id="insights"
          className="relative z-20 -mt-16 border border-outline-variant/30 bg-off-white py-24 mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop"
        >
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-2 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                Featured Insights
              </h2>
              <p className="font-sans text-body-md text-on-surface-variant">
                Executive perspectives shaping global industries.
              </p>
            </div>
            <Link
              href="#insights"
              className="hidden items-center gap-2 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:text-primary-container md:inline-flex"
            >
              View All Insights <ArrowForwardIcon />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
            {insights.map((insight) => (
              <Link
                key={insight.title}
                href="#"
                className="group block border border-outline-variant bg-pure-white transition-all duration-300 hover:border-primary-container"
              >
                <div className="h-48 overflow-hidden">
                  <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={insight.image}
                      alt={insight.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <span className="mb-3 block font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                    {insight.category}
                  </span>
                  <h3 className="mb-4 font-serif text-headline-md text-primary transition-colors group-hover:text-primary-container">
                    {insight.title}
                  </h3>
                  <p className="mb-6 line-clamp-3 font-sans text-body-md text-on-surface-variant">
                    {insight.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t border-outline-variant/50 pt-4">
                    <span className="font-sans text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
                      Read Article
                    </span>
                    <ArrowOutwardIcon className="text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="capabilities"
          className="mx-auto max-w-container-max bg-surface px-margin-mobile py-24 md:px-margin-desktop"
        >
          <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="md:col-span-5 md:pr-8">
              <h2 className="mb-6 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                Our Capabilities
              </h2>
              <p className="mb-8 font-sans text-body-lg text-on-surface-variant">
                We bring unparalleled functional expertise to solve the most
                critical challenges facing modern enterprise leaders.
              </p>
              <Link
                href="#capabilities"
                className="inline-flex items-center gap-2 border border-primary px-6 py-3 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-pure-white"
              >
                View All Services
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-7 md:mt-0">
              {capabilities.map((capability) => {
                const Icon = capability.icon;
                return (
                  <div
                    key={capability.title}
                    className={
                      capability.featured
                        ? "border border-outline-variant/50 bg-primary-container p-8 text-pure-white transition-colors hover:border-primary"
                        : "border border-outline-variant/50 bg-pure-white p-8 transition-colors hover:border-primary"
                    }
                  >
                    <Icon
                      className={
                        capability.featured
                          ? "mb-4 text-secondary-fixed"
                          : "mb-4 text-primary"
                      }
                    />
                    <h3
                      className={
                        capability.featured
                          ? "mb-3 font-serif text-xl font-semibold text-pure-white"
                          : "mb-3 font-serif text-xl font-semibold text-primary"
                      }
                    >
                      {capability.title}
                    </h3>
                    <p
                      className={
                        capability.featured
                          ? "font-sans text-body-md text-surface-container-highest"
                          : "font-sans text-body-md text-on-surface-variant"
                      }
                    >
                      {capability.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="industries"
          className="bg-primary py-24 text-pure-white"
        >
          <div className="mx-auto max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
            <h2 className="mb-16 font-serif text-headline-lg-mobile md:text-headline-lg">
              Global Impact. Local Expertise.
            </h2>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="mb-2 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-secondary-fixed md:text-display-lg">
                    {stat.value}
                  </div>
                  <div className="font-sans text-label-md uppercase tracking-widest text-surface-container-highest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="home" />
    </>
  );
}
