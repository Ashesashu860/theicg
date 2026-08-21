import Image from "next/image";
import Link from "next/link";
import {
  ArrowForwardIcon,
  LightbulbIcon,
  MemoryIcon,
} from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const impactStats = [
  { value: "30K+", label: "Global Reach" },
  { value: "$10B+", label: "Revenue Impact" },
  { value: "100+", label: "Cities Worldwide" },
];

export function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-off-white pt-24">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <section className="grid grid-cols-1 items-center gap-8 border-b border-outline-variant py-24 md:grid-cols-12 md:py-32">
            <div className="animate-fade-up md:col-span-7">
              <h1 className="mb-6 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-primary md:text-display-lg">
                Pioneering the Future of Strategy
              </h1>
              <p className="max-w-2xl font-sans text-body-lg text-on-surface-variant">
                THE ICG bridges the gap between ambition and outcomes. We team
                with organizations globally to deliver transformative impact,
                leading this new era through strategic clarity and applied AI.
              </p>
            </div>
            <div
              className="animate-fade-up flex justify-end md:col-span-5"
              style={{ animationDelay: "120ms" }}
            >
              <Image
                src="/images/about-mark.jpg"
                alt="THE ICG logo"
                width={384}
                height={384}
                className="h-64 w-64 object-cover md:h-96 md:w-96"
                priority
              />
            </div>
          </section>

          <section className="py-24 md:py-32">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="sticky top-32 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                  Our Expertise
                </h2>
              </div>
              <div className="md:col-span-8">
                <h3 className="mb-6 font-serif text-headline-md text-primary-container">
                  Where Strategic Clarity Meets Applied AI
                </h3>
                <p className="mb-8 font-sans text-body-lg text-on-surface-variant">
                  We navigate an era of unprecedented change and disruption. To
                  lead, companies need a partner that can bridge the gap between
                  ambition and outcomes. We bring strategic clarity, rooted in
                  deep domain knowledge, combined with applied AI, shaped by our
                  practitioners, to deliver transformative impact at scale.
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="border border-outline-variant bg-surface-container-lowest p-6 transition-colors duration-300 hover:border-primary-container">
                    <LightbulbIcon className="mb-4 text-secondary" />
                    <h4 className="mb-2 font-sans text-label-md uppercase tracking-widest">
                      Strategic Clarity
                    </h4>
                    <p className="font-sans text-body-md text-on-surface-variant">
                      Ensuring leaders make the right choices in complex
                      environments.
                    </p>
                  </div>
                  <div className="border border-outline-variant bg-surface-container-lowest p-6 transition-colors duration-300 hover:border-primary-container">
                    <MemoryIcon className="mb-4 text-secondary" />
                    <h4 className="mb-2 font-sans text-label-md uppercase tracking-widest">
                      Applied AI
                    </h4>
                    <p className="font-sans text-body-md text-on-surface-variant">
                      Scaling artificial intelligence solutions to create
                      massive competitive advantage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="bg-primary-container px-margin-mobile py-24 text-pure-white md:px-margin-desktop md:py-32">
          <h2 className="mb-16 text-center font-serif text-headline-lg-mobile md:text-headline-lg">
            Our Impact
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {impactStats.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  index === 1
                    ? "border-y border-outline-variant/30 py-8 text-center md:border-x md:border-y-0 md:py-0"
                    : "text-center"
                }
              >
                <div className="mb-2 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-secondary-fixed md:text-display-lg">
                  {stat.value}
                </div>
                <div className="font-sans text-label-md uppercase tracking-wider text-primary-fixed-dim">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <section className="grid grid-cols-1 items-center gap-8 border-b border-outline-variant py-24 md:grid-cols-12 md:py-32">
            <div className="relative order-2 h-64 overflow-hidden bg-surface-variant md:order-1 md:col-span-5 md:col-start-1 md:h-96">
              <div
                className="absolute inset-0 opacity-80 mix-blend-multiply"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, #144622 0%, transparent 40%), radial-gradient(circle at 75% 60%, #98fa7a55 0%, transparent 35%), linear-gradient(135deg, #f1eeea 0%, #c1c9be 100%)",
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#14462222_1px,transparent_1px),linear-gradient(to_bottom,#14462222_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>
            <div className="order-1 md:order-2 md:col-span-6 md:col-start-7">
              <h2 className="mb-6 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                Global Presence
              </h2>
              <p className="mb-8 font-sans text-body-lg text-on-surface-variant">
                With a footprint spanning over 100 cities globally, THE ICG
                brings a truly international perspective to local challenges.
                Our diverse teams collaborate across borders to deliver insights
                and solutions that resonate on a global scale.
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center font-sans text-label-md uppercase tracking-wider text-primary-container transition-colors hover:text-secondary"
              >
                Explore Our Locations
                <ArrowForwardIcon className="ml-2" />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
