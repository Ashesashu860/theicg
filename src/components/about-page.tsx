import Image from "next/image";
import Link from "next/link";
import {
  ArrowForwardIcon,
  LightbulbIcon,
  MemoryIcon,
} from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";

const impactStats = [
  { value: "30K+", label: "Global Reach" },
  { value: "$10B+", label: "Revenue Impact" },
  { value: "100+", label: "Cities Worldwide" },
];

export function AboutPage() {
  return (
    <>
      <main className="bg-off-white pt-24">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <section className="grid grid-cols-1 items-center gap-8 border-b border-outline-variant py-24 md:grid-cols-12 md:py-32">
            <div className="animate-fade-up md:col-span-7">
              <h1 className="mb-6 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-primary md:text-display-lg">
                Great Minds. Best Consultations.
              </h1>
              <p className="max-w-2xl font-sans text-body-lg text-on-surface-variant">
                ICG is a consulting group built on the power of knowledge,
                collaboration, and strategic thinking. We connect expertise with
                opportunity to help our clients make smarter decisions and move
                forward with confidence.
              </p>
            </div>
            <div
              className="animate-fade-up flex justify-end md:col-span-5"
              style={{ animationDelay: "120ms" }}
            >
              <Image
                src="/images/about-mark.jpg"
                alt="ICG logo"
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
                  Where Knowledge Meets Strategy
                </h3>
                <p className="mb-8 font-sans text-body-lg text-on-surface-variant">
                  At ICG – IITans Consulting Group, we believe great decisions
                  are powered by great minds. Our team combines knowledge,
                  experience, analytical thinking, and innovative perspectives
                  to provide thoughtful consultations and practical solutions
                  tailored to your needs.
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="border border-outline-variant bg-surface-container-lowest p-6 transition-colors duration-300 hover:border-primary-container">
                    <LightbulbIcon className="mb-4 text-secondary" />
                    <h4 className="mb-2 font-sans text-label-md uppercase tracking-widest">
                      Strategic Thinking
                    </h4>
                    <p className="font-sans text-body-md text-on-surface-variant">
                      Helping leaders cut through complexity and choose clearer,
                      more confident paths forward.
                    </p>
                  </div>
                  <div className="border border-outline-variant bg-surface-container-lowest p-6 transition-colors duration-300 hover:border-primary-container">
                    <MemoryIcon className="mb-4 text-secondary" />
                    <h4 className="mb-2 font-sans text-label-md uppercase tracking-widest">
                      Collaborative Expertise
                    </h4>
                    <p className="font-sans text-body-md text-on-surface-variant">
                      Bringing great minds together so insight becomes practical
                      solutions you can put to work.
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
                How We Work
              </h2>
              <p className="mb-8 font-sans text-body-lg text-on-surface-variant">
                ICG – IITans Consulting Group brings together great minds to
                deliver expert consultation, strategic guidance, and practical
                solutions. We partner with individuals and organizations to turn
                challenges into opportunities—and ideas into meaningful
                outcomes.
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center font-sans text-label-md uppercase tracking-wider text-primary-container transition-colors hover:text-secondary"
              >
                Explore Careers
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
