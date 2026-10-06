import { AssignmentIcon, GroupsIcon, PsychologyIcon } from "@/components/icons";
import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";

const pillars = [
  {
    title: "Judgement Earned in Delivery",
    description:
      "Our specialists have carried solutions through design, construction, commissioning and operation, and know which choices hold up once they meet the ground.",
    icon: PsychologyIcon,
  },
  {
    title: "Detail That Survives Scrutiny",
    description:
      "Recommendations are made at the level of specification, sequence and cost, detailed enough to be tendered, audited and defended.",
    icon: AssignmentIcon,
  },
  {
    title: "Knowledge That Transfers",
    description:
      "We work so that a client's own team is stronger at the end of an engagement than at the start, and able to carry the work forward without us.",
    icon: GroupsIcon,
  },
] as const;

export function AboutPage() {
  return (
    <>
      <main>
        <PageHero
          tone="cream"
          eyebrow="About ICG"
          title="The Brightest Minds, in Service of the Nation"
          lead="ICG is a consulting practice built by engineers, researchers and specialists who have already built, deployed and operated real solutions in their fields. We direct that experience at India's public programmes, from policy design through to systems that run on the ground."
          aside={
            <div className="relative ml-auto aspect-[4/5] w-full max-w-md overflow-hidden">
              <Image
                src={SITE_IMAGES.aboutHero}
                alt="Aerial view of a highway running through an Indian city"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          }
        />

        <section className="mx-auto max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop md:py-section-lg">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="md:sticky md:top-32">
                <p className="eyebrow mb-4 text-on-surface-variant">Our role</p>
                <h2 className="text-headline-lg-mobile md:text-headline-lg">
                  Closing the Gap Between Policy and Delivery
                </h2>
              </div>
            </div>
            <div className="md:col-span-7">
              <p className="mb-12 text-body-lg text-on-surface-variant md:text-[20px] md:leading-[1.6]">
                India&apos;s public programmes are rarely short on ambition.
                Funding is committed, timelines are published, and intent is
                clear. What is often missing is the expertise to carry that
                intent through site conditions, procurement and the failure
                modes that only appear at scale. That is the distance ICG exists
                to close.
              </p>
              <ul className="border-t border-outline-variant">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;

                  return (
                    <li
                      key={pillar.title}
                      className="grid grid-cols-[auto_1fr] gap-6 border-b border-outline-variant py-8"
                    >
                      <Icon className="mt-0.5 h-7 w-7 text-primary" />
                      <div>
                        <h3 className="mb-2 text-[20px] text-primary">
                          {pillar.title}
                        </h3>
                        <p className="text-body-md text-on-surface-variant">
                          {pillar.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        <section className="band-alt">
          <div className="mx-auto grid max-w-container-max grid-cols-1 gap-10 px-margin-mobile py-section-compact md:grid-cols-12 md:px-margin-desktop md:py-section-compact-lg">
            <div className="md:col-span-5">
              <p className="eyebrow mb-4 text-on-surface-variant">
                Public sector
              </p>
              <h2 className="text-headline-lg-mobile md:text-headline-lg">
                Working With Government
              </h2>
            </div>
            <p className="text-body-lg text-on-surface-variant md:col-span-6 md:col-start-7 md:text-[20px] md:leading-[1.6]">
              ICG is an Indian firm built around public-sector work. We are
              familiar with how departments scope, procure and govern
              programmes, and with the realities of delivering against public
              timelines, audit requirements and accountability.
            </p>
          </div>
        </section>

        <CtaBand
          title="Work with ICG"
          lead="Tell us about the programme you are delivering and where expert support would make the difference."
          primary={{ href: "/careers#connect", label: "Contact Us" }}
          secondary={{ href: "/capabilities", label: "Our Capabilities" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
