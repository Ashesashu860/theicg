import Image from "next/image";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { icgPrinciples } from "@/lib/icg-principles";

const standards = [
  "Client confidentiality",
  "Disclosure of conflicts of interest",
  "Intellectual honesty in every recommendation",
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
              <h1 className="mb-6 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-primary md:text-display-lg">
                Our Purpose
              </h1>
              <p className="font-sans text-body-lg text-on-surface-variant">
                To partner with government so that national priorities are
                served by practising expertise, advice that can be built,
                operated and sustained long after an engagement ends.
              </p>
            </div>
          </div>
        </section>

        <section
          id="icg-principles"
          className="mx-auto mb-32 max-w-container-max px-margin-mobile md:px-margin-desktop"
          aria-labelledby="purpose-principles-heading"
        >
          <div className="mb-16">
            <h2
              id="purpose-principles-heading"
              className="mb-4 font-serif text-headline-lg-mobile text-primary md:text-headline-lg"
            >
              The ICG Principles
            </h2>
            <div className="h-1 w-16 bg-primary-container" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {icgPrinciples.map((principle) => (
              <article
                key={principle.id}
                className="border border-outline-variant/50 bg-pure-white p-8 transition-colors hover:border-primary-container md:p-10"
              >
                <p className="mb-4 font-sans text-label-md uppercase tracking-wider text-primary-container">
                  {principle.number}
                </p>
                <h3 className="mb-3 font-serif text-2xl text-primary">
                  {principle.title}
                </h3>
                <p className="font-sans text-body-md text-on-surface-variant">
                  {principle.full}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-32 border-y border-outline-variant/30 bg-surface-container-low py-32">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="mb-6 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                  Ethics and Commitment
                </h2>
              </div>
              <div className="border border-outline-variant/50 bg-pure-white p-12 md:col-span-8">
                <p className="mb-8 font-sans text-body-lg text-on-surface">
                  Three standards are non-negotiable at ICG: client
                  confidentiality, disclosure of conflicts of interest, and
                  intellectual honesty in every recommendation, regardless of
                  convenience.
                </p>
                <ul className="space-y-4">
                  {standards.map((item, index) => (
                    <li
                      key={item}
                      className={`flex items-center gap-3 ${index < standards.length - 1
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
        </section>

        <section className="bg-primary py-32 text-center text-pure-white">
          <div className="mx-auto max-w-3xl px-margin-mobile">
            <h2 className="mb-8 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-display-lg">
              Standards, Not Slogans
            </h2>
            <p className="mb-12 font-sans text-body-lg text-pure-white/80">
              We look for individuals who would rather verify one figure
              thoroughly than publish ten without scrutiny. If that describes
              your standard of work, we would like to hear from you.
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
