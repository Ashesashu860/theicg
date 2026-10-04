import { SITE_IMAGES } from "@/lib/site-images";
import { CtaBand } from "@/components/cta-band";
import { CheckIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
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
      <main>
        <PageHero
          eyebrow="Why we exist"
          title="Our Purpose"
          imageSrc={SITE_IMAGES.purposeHero}
          lead="To partner with government so that national priorities are served by practising expertise, advice that can be built, operated and sustained long after an engagement ends."
        />

        <section
          id="icg-principles"
          className="mx-auto max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop md:py-section-lg"
          aria-labelledby="purpose-principles-heading"
        >
          <SectionHeading
            id="purpose-principles-heading"
            eyebrow="How we work"
            title="The ICG Principles"
          />
          <div className="grid grid-cols-1 border-l border-t border-outline-variant md:grid-cols-2">
            {icgPrinciples.map((principle) => (
              <article
                key={principle.id}
                className="border-b border-r border-outline-variant bg-surface-container-lowest p-8 md:p-10"
              >
                <p className="mb-8 text-label-md text-on-surface-variant">
                  {principle.number}
                </p>
                <h3 className="mb-3 text-headline-md text-primary">
                  {principle.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {principle.full}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="band-alt py-section-sm md:py-section-lg">
          <div className="mx-auto grid max-w-container-max grid-cols-1 gap-12 px-margin-mobile md:grid-cols-12 md:px-margin-desktop">
            <div className="md:col-span-5">
              <p className="eyebrow mb-4 text-on-surface-variant">Standards</p>
              <h2 className="text-headline-lg-mobile md:text-headline-lg">
                Ethics and Commitment
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="mb-10 text-body-lg text-on-surface md:text-[20px] md:leading-[1.6]">
                Three standards are non-negotiable at ICG: client
                confidentiality, disclosure of conflicts of interest, and
                intellectual honesty in every recommendation, regardless of
                convenience.
              </p>
              <ul className="border-t border-outline-variant">
                {standards.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 border-b border-outline-variant py-5"
                  >
                    <CheckIcon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-body-lg text-on-surface">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <CtaBand
          title="Standards, Not Slogans"
          lead="We look for individuals who would rather verify one figure thoroughly than publish ten without scrutiny. If that describes your standard of work, we would like to hear from you."
          primary={{ href: "/careers", label: "Explore Careers" }}
          secondary={{ href: "/careers#connect", label: "Contact Us" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
