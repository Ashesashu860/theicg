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

const insights = [
  {
    category: "Strategy",
    title: "Better Decisions Start With Better Perspectives",
    excerpt:
      "How combining deep knowledge with collaborative thinking helps leaders cut through complexity and choose a clearer path forward.",
    image: "/images/insight-ai.jpg",
    alt: "Digital visualization representing strategic thinking and analysis",
  },
  {
    category: "Growth",
    title: "Turning Challenges Into Practical Opportunity",
    excerpt:
      "Thoughtful consultation that connects expertise with real-world constraints—so ideas become solutions clients can act on.",
    image: "/images/insight-sustain.jpg",
    alt: "Modern infrastructure representing growth and opportunity",
  },
  {
    category: "Leadership",
    title: "Where Knowledge Meets Strategy",
    excerpt:
      "Great minds bring analytical rigor and innovative perspectives together to guide individuals and organizations toward smarter decisions.",
    image: "/images/insight-macro.jpg",
    alt: "Abstract visualization of connected ideas and global perspectives",
  },
];

const capabilities = [
  {
    title: "Strategic Consulting",
    description:
      "Clarifying goals, evaluating options, and shaping strategies grounded in knowledge and analytical thinking.",
    icon: AccountTreeIcon,
    featured: false,
  },
  {
    title: "Expert Consultation",
    description:
      "Bringing experienced perspectives to complex questions so you can move forward with greater confidence.",
    icon: SettingsApplicationsIcon,
    featured: false,
  },
  {
    title: "Practical Solutions",
    description:
      "Translating insight into actionable recommendations tailored to your context, constraints, and ambitions.",
    icon: TransformIcon,
    featured: false,
  },
  {
    title: "Collaborative Guidance",
    description:
      "Connecting expertise with opportunity through partnership—helping great ideas become meaningful outcomes.",
    icon: TrendingUpIcon,
    featured: true,
  },
];

const stats = [
  { value: "50+", label: "Engagements Guided" },
  { value: "90%", label: "Client Satisfaction" },
  { value: "10+", label: "Practice Areas" },
  { value: "100+", label: "Experts in Network" },
];

export function HomePage() {
  return (
    <>
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
            <p
              className="animate-fade-up mb-4 font-sans text-label-md uppercase tracking-widest text-secondary-fixed"
            >
              The Great Minds. The Best Consultations.
            </p>
            <h1 className="animate-fade-up mx-auto mb-6 max-w-4xl font-serif text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-pure-white md:text-display-lg">
              Great Minds. Best Consultations.
            </h1>
            <p
              className="animate-fade-up mx-auto mb-4 max-w-2xl font-sans text-body-lg text-surface-container-highest"
              style={{ animationDelay: "120ms" }}
            >
              Where knowledge meets strategy, and great ideas become meaningful
              solutions.
            </p>
            <p
              className="animate-fade-up mx-auto mb-10 max-w-2xl font-sans text-body-md text-surface-container-high"
              style={{ animationDelay: "160ms" }}
            >
              At ICG – IITans Consulting Group, we believe great decisions are
              powered by great minds. Our team combines knowledge, experience,
              analytical thinking, and innovative perspectives to provide
              thoughtful consultations and practical solutions tailored to your
              needs.
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
                Perspectives on knowledge, strategy, and smarter decisions.
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
                ICG is a consulting group built on the power of knowledge,
                collaboration, and strategic thinking. We connect expertise with
                opportunity to help our clients make smarter decisions and move
                forward with confidence.
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
              Great Minds. Better Perspectives. Smarter Decisions.
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

      <SiteFooter />
    </>
  );
}
