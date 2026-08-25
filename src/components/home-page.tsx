import Image from "next/image";
import Link from "next/link";
import { CapabilityCard } from "@/components/capability-card";
import { ArrowForwardIcon, ChevronRightIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import type { CapabilityRecord } from "@/lib/capabilities-data";

type HomePageProps = {
  capabilities: CapabilityRecord[];
};

export function HomePage({ capabilities }: HomePageProps) {
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
            <p className="animate-fade-up mb-4 font-sans text-label-md uppercase tracking-widest text-secondary-fixed">
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
              At ICG – IITians Consulting Group, we believe great decisions are
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
          id="capabilities"
          className="relative z-20 -mt-16 mx-auto max-w-container-max border border-outline-variant/30 bg-off-white py-24"
        >
          <div className="mb-12 flex items-end justify-between gap-6 px-margin-mobile md:px-margin-desktop">
            <div>
              <h2 className="mb-2 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                Our Capabilities
              </h2>
              <p className="font-sans text-body-md text-on-surface-variant">
                Bridging strategic clarity with technical excellence across
                critical domains.
              </p>
            </div>
            <div className="hidden shrink-0 flex-col items-end gap-3 md:flex">
              <Link
                href="/capabilities"
                className="inline-flex items-center gap-2 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:text-primary-container"
              >
                View All Capabilities <ArrowForwardIcon />
              </Link>
              {capabilities.length > 1 ? (
                <p
                  className="inline-flex items-center gap-1 font-sans text-label-md uppercase tracking-widest text-on-surface-variant"
                  aria-hidden="true"
                >
                  Scroll
                  <ChevronRightIcon className="animate-scroll-hint" />
                </p>
              ) : null}
            </div>
          </div>

          {capabilities.length === 0 ? (
            <p className="px-margin-mobile font-sans text-body-md text-on-surface-variant md:px-margin-desktop">
              Capabilities will appear here once they are published.
            </p>
          ) : (
            <div className="relative">
              <div
                className="capabilities-scroll-mask snap-x snap-mandatory overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                tabIndex={0}
                aria-label="Capabilities. Scroll horizontally to see more."
              >
                <div className="flex w-max gap-6 px-margin-mobile md:px-margin-desktop">
                  {capabilities.map((capability) => (
                    <div
                      key={capability.id}
                      className="w-[min(340px,78vw)] shrink-0 snap-start"
                    >
                      <CapabilityCard capability={capability} />
                    </div>
                  ))}
                </div>
              </div>

              {capabilities.length > 1 ? (
                <p
                  className="pointer-events-none absolute bottom-4 right-4 z-10 inline-flex items-center gap-1 bg-off-white/90 px-3 py-1.5 font-sans text-label-md uppercase tracking-widest text-on-surface-variant md:hidden"
                  aria-hidden="true"
                >
                  Scroll
                  <ChevronRightIcon className="animate-scroll-hint" />
                </p>
              ) : null}
            </div>
          )}

          <div className="mt-8 px-margin-mobile md:hidden md:px-margin-desktop">
            <Link
              href="/capabilities"
              className="inline-flex items-center gap-2 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:text-primary-container"
            >
              View All Capabilities <ArrowForwardIcon />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
