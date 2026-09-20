import {
  AssignmentIcon,
  GroupsIcon,
  PsychologyIcon,
} from "@/components/icons";
import { IcgLogo } from "@/components/icg-logo";
import { OurTeamSection } from "@/components/our-team-section";
import { SiteFooter } from "@/components/site-footer";
import type { PublicTeamMember } from "@/lib/teams-data";

type AboutPageProps = {
  members: PublicTeamMember[];
};

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

export function AboutPage({ members }: AboutPageProps) {
  return (
    <>
      <main className="bg-off-white pt-24">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <section className="grid grid-cols-1 items-center gap-8 border-b border-outline-variant py-24 md:grid-cols-12 md:py-32">
            <div className="animate-fade-up md:col-span-7">
              <h1 className="mb-6 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-primary md:text-display-lg">
                The Brightest Minds, in Service of the Nation
              </h1>
              <p className="max-w-2xl font-sans text-body-lg text-on-surface-variant">
                ICG is a consulting practice built by engineers, researchers and
                specialists who have already built, deployed and operated real
                solutions in their fields. We direct that experience at
                India&apos;s public programmes, from policy design through to
                systems that run on the ground.
              </p>
            </div>
            <div
              className="animate-fade-up flex justify-end md:col-span-5"
              style={{ animationDelay: "120ms" }}
            >
              <div className="flex h-64 w-64 items-center justify-center bg-primary-container text-on-primary md:h-96 md:w-96">
                <IcgLogo variant="full" className="h-48 w-48 md:h-72 md:w-72" />
              </div>
            </div>
          </section>

          <section className="py-24 md:py-32">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="sticky top-32 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                  Closing the Gap Between Policy and Delivery
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="mb-8 font-sans text-body-lg text-on-surface-variant">
                  India&apos;s public programmes are rarely short on ambition.
                  Funding is committed, timelines are published, and intent is
                  clear. What is often missing is the expertise to carry that
                  intent through site conditions, procurement and the failure
                  modes that only appear at scale. That is the distance ICG
                  exists to close.
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pillars.map((pillar) => {
                    const Icon = pillar.icon;

                    return (
                      <div
                        key={pillar.title}
                        className="border border-outline-variant bg-surface-container-lowest p-6 transition-colors duration-300 hover:border-primary-container"
                      >
                        <Icon className="mb-4 h-8 w-8 text-secondary" />
                        <h3 className="mb-2 font-sans text-label-md uppercase tracking-widest">
                          {pillar.title}
                        </h3>
                        <p className="font-sans text-body-md text-on-surface-variant">
                          {pillar.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 items-center gap-8 border-b border-outline-variant py-24 md:grid-cols-12 md:py-32">
            <div className="relative order-2 h-64 overflow-hidden bg-surface-variant md:order-1 md:col-span-5 md:col-start-1 md:h-96">
              <div
                className="absolute inset-0 opacity-80 mix-blend-multiply"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, #144aa4 0%, transparent 40%), radial-gradient(circle at 75% 60%, #94a3b855 0%, transparent 35%), linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%)",
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#144aa422_1px,transparent_1px),linear-gradient(to_bottom,#144aa422_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>
            <div className="order-1 md:order-2 md:col-span-6 md:col-start-7">
              <h2 className="mb-6 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                Working With Government
              </h2>
              <p className="font-sans text-body-lg text-on-surface-variant">
                ICG is an Indian firm built around public-sector work. We are
                familiar with how departments scope, procure and govern
                programmes, and with the realities of delivering against public
                timelines, audit requirements and accountability.
              </p>
            </div>
          </section>
        </div>

        <OurTeamSection members={members} />
      </main>
      <SiteFooter />
    </>
  );
}
