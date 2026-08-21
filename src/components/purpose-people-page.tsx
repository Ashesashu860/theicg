import Image from "next/image";
import Link from "next/link";
import {
  AccountTreeIcon,
  CheckIcon,
  FormatQuoteIcon,
  GavelIcon,
  LightbulbIcon,
  PsychologyIcon,
  RocketLaunchIcon,
} from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";

const principles = [
  {
    title: "Insight to Light",
    description:
      "We don't just gather data; we illuminate truths. By transforming complex information into clear, actionable intelligence, we guide our clients through their most challenging terrains with unshakeable confidence.",
    icon: LightbulbIcon,
    span: "md:col-span-8",
    dark: false,
    large: true,
  },
  {
    title: "Inspired Impact",
    description:
      "Our solutions are designed not just for immediate gains, but to create lasting ripples of positive change across industries and communities.",
    icon: RocketLaunchIcon,
    span: "md:col-span-4",
    dark: false,
    large: false,
  },
  {
    title: "Conquer Complexity",
    description:
      "We thrive in ambiguity. Our structural thinking dismantles the convoluted, delivering elegant simplicity and strategic clarity.",
    icon: AccountTreeIcon,
    span: "md:col-span-4",
    dark: true,
    large: false,
  },
] as const;

const pairedPrinciples = [
  {
    title: "Lead with Integrity",
    description:
      "Uncompromising ethical standards form the bedrock of every recommendation and action we take.",
    icon: GavelIcon,
  },
  {
    title: "Grow by Growing Others",
    description:
      "We elevate our clients and our teams simultaneously, fostering a culture of continuous intellectual and professional development.",
    icon: PsychologyIcon,
  },
] as const;

const standards = [
  "Absolute Client Confidentiality",
  "Rigorous Conflict of Interest Protocols",
  "Intellectual Honesty in Advisory",
];

export function PurposePeoplePage() {
  return (
    <>
      <main className="bg-off-white pt-[100px]">
        <section className="relative mb-32 flex min-h-[70vh] items-center">
          <div className="absolute inset-0 z-0 h-full w-full">
            <Image
              src="/images/purpose-people-hero.jpg"
              alt="Modern glass office building and plaza"
              fill
              className="object-cover opacity-90"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-off-white/90 via-off-white/70 to-transparent" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="max-w-2xl">
              <p className="mb-4 font-sans text-label-md uppercase tracking-wider text-primary-container">
                About Us
              </p>
              <h1 className="mb-6 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-primary md:text-display-lg">
                Our Purpose
                <br />
                and People
              </h1>
              <p className="font-sans text-body-lg text-on-surface-variant">
                Leading with empathy and expertise. We believe that true
                transformation is driven not just by insight, but by the people
                who illuminate the path forward.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mb-32 max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mb-16">
            <h2 className="mb-4 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
              The ICG Principles
            </h2>
            <div className="h-1 w-16 bg-primary-container" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <div
                  key={principle.title}
                  className={`${principle.span} border p-10 transition-colors ${
                    principle.dark
                      ? "border-transparent bg-primary-container text-pure-white"
                      : "group flex min-h-[300px] flex-col justify-between border-outline-variant/50 bg-pure-white hover:border-primary-container"
                  }`}
                >
                  <div>
                    <Icon
                      className={`mb-6 block ${
                        principle.dark
                          ? "text-secondary-fixed"
                          : "text-primary-container"
                      } ${principle.large ? "h-10 w-10" : "h-8 w-8"}`}
                    />
                    <h3
                      className={`mb-3 font-serif ${
                        principle.large
                          ? "text-headline-md text-primary"
                          : principle.dark
                            ? "text-2xl text-pure-white"
                            : "text-2xl text-primary"
                      }`}
                    >
                      {principle.title}
                    </h3>
                    <p
                      className={`font-sans text-body-md ${
                        principle.dark
                          ? "text-pure-white/80"
                          : "max-w-lg text-on-surface-variant"
                      }`}
                    >
                      {principle.description}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="grid grid-cols-1 gap-6 md:col-span-8 md:grid-cols-2">
              {pairedPrinciples.map((principle) => {
                const Icon = principle.icon;
                return (
                  <div
                    key={principle.title}
                    className="border border-outline-variant/50 bg-pure-white p-8 transition-colors hover:border-primary-container"
                  >
                    <Icon className="mb-4 block h-8 w-8 text-primary-container" />
                    <h3 className="mb-2 font-serif text-xl text-primary">
                      {principle.title}
                    </h3>
                    <p className="font-sans text-body-md text-on-surface-variant">
                      {principle.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mb-32 border-y border-outline-variant/30 bg-surface-container-low py-32">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="mb-6 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                  Unwavering Standards
                </h2>
                <p className="font-sans text-label-md uppercase tracking-wider text-on-surface-variant">
                  Ethics &amp; Commitment
                </p>
              </div>
              <div className="relative border border-outline-variant/50 bg-pure-white p-12 md:col-span-8">
                <FormatQuoteIcon className="absolute left-8 top-8 text-surface-variant/50" />
                <div className="relative z-10 pt-4">
                  <p className="mb-8 font-sans text-body-lg italic text-on-surface">
                    &ldquo;The true measure of our firm is not simply in the
                    financial value we create, but in the integrity with which we
                    operate. We hold ourselves to a standard that transcends
                    compliance, aiming always for the highest ethical
                    ground.&rdquo;
                  </p>
                  <ul className="space-y-4">
                    {standards.map((item, index) => (
                      <li
                        key={item}
                        className={`flex items-center gap-3 ${
                          index < standards.length - 1
                            ? "border-b border-outline-variant/30 pb-3"
                            : "pb-2"
                        }`}
                      >
                        <CheckIcon className="shrink-0 text-secondary-fixed-dim" />
                        <span className="font-sans text-body-md text-on-surface">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary py-32 text-center text-pure-white">
          <div className="mx-auto max-w-3xl px-margin-mobile">
            <h2 className="mb-8 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-display-lg">
              Beyond is where we begin.
            </h2>
            <p className="mb-12 font-sans text-body-lg text-pure-white/80">
              Join a collective of intellectual pioneers. We are always seeking
              brilliant minds to help shape the future of global enterprise.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/careers"
                className="bg-pure-white px-8 py-4 font-sans text-label-md uppercase tracking-wide text-primary transition-colors hover:bg-secondary-fixed"
              >
                Explore Careers
              </Link>
              <Link
                href="/careers#connect"
                className="border border-pure-white/30 px-8 py-4 font-sans text-label-md uppercase tracking-wide transition-colors hover:bg-pure-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
