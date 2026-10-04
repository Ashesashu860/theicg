import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { CapabilityCard } from "@/components/capability-card";
import { FeatureSplit } from "@/components/feature-split";
import { CareersWhySection } from "@/components/careers-why-section";
import { CtaBand } from "@/components/cta-band";
import { ArrowForwardIcon, ChevronRightIcon } from "@/components/icons";
import { IcgPrinciplesSection } from "@/components/icg-principles-section";
import { OurTeamSection } from "@/components/our-team-section";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import type { BlogRecord } from "@/lib/blogs-data";
import type { CapabilityRecord } from "@/lib/capabilities-data";
import { SITE_IMAGES } from "@/lib/site-images";
import type { PublicTeamMember } from "@/lib/teams-data";

type HomePageProps = {
  capabilities: CapabilityRecord[];
  members: PublicTeamMember[];
  recentBlogs?: BlogRecord[];
};

export function HomePage({ capabilities, members, recentBlogs = [] }: HomePageProps) {
  return (
    <>
      <main>
        <PageHero
          size="large"
          eyebrow="ICG – IITians Consulting Group"
          title="Great Minds. Best Consultations."
          imageSrc={SITE_IMAGES.homeHero}
          lead={
            <>
              <p className="text-cream">
                Where knowledge meets strategy, and great ideas become
                meaningful solutions.
              </p>
              <p className="mt-4 text-body-md md:text-body-lg">
                We believe great decisions are powered by great minds. Our team
                combines knowledge, experience, analytical thinking, and
                innovative perspectives to provide thoughtful consultations and
                practical solutions tailored to your needs.
              </p>
            </>
          }
          actions={
            <>
              <Link href="#capabilities" className="btn btn-light">
                Explore Our Approach
              </Link>
              <Link href="/careers#connect" className="btn btn-outline-light">
                Contact Us
              </Link>
            </>
          }
        />

        <section
          id="capabilities"
          className="band scroll-mt-20 py-section-sm md:py-section-lg"
          aria-labelledby="home-capabilities-heading"
        >
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <SectionHeading
              id="home-capabilities-heading"
              eyebrow="What we do"
              title="Our Capabilities"
              lead="Bridging strategic clarity with technical excellence across critical domains."
              action={
                <Link
                  href="/capabilities"
                  className="hidden items-center gap-2 text-[14px] font-semibold text-primary underline-offset-4 hover:underline md:inline-flex"
                >
                  View all capabilities <ArrowForwardIcon className="h-4 w-4" />
                </Link>
              }
            />
          </div>

          {capabilities.length === 0 ? (
            <p className="mx-auto max-w-container-max px-margin-mobile text-body-md text-on-surface-variant md:px-margin-desktop">
              Capabilities will appear here once they are published.
            </p>
          ) : (
            <div className="relative mx-auto max-w-container-max">
              <div
                className="capabilities-scroll-mask snap-x snap-mandatory overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                tabIndex={0}
                aria-label="Capabilities. Scroll horizontally to see more."
              >
                <div className="flex w-max gap-6 px-margin-mobile md:px-margin-desktop">
                  {capabilities.map((capability) => (
                    <div
                      key={capability.id}
                      className="w-[min(340px,80vw)] shrink-0 snap-start"
                    >
                      <CapabilityCard capability={capability} />
                    </div>
                  ))}
                </div>
              </div>
              {capabilities.length > 1 ? (
                <p
                  className="mt-6 inline-flex items-center gap-1 px-margin-mobile text-label-md uppercase text-on-surface-variant md:px-margin-desktop"
                  aria-hidden="true"
                >
                  Scroll
                  <ChevronRightIcon className="animate-scroll-hint h-4 w-4" />
                </p>
              ) : null}
            </div>
          )}

          <div className="mx-auto mt-8 max-w-container-max px-margin-mobile md:hidden">
            <Link href="/capabilities" className="btn btn-outline w-full">
              View all capabilities
            </Link>
          </div>
        </section>

        <FeatureSplit
          imageSrc={SITE_IMAGES.homeFeature}
          imageAlt="Water released through the spillway of a dam"
          eyebrow="Who we are"
          title="Practitioners first, consultants second."
          link={{ href: "/about", label: "About ICG" }}
        >
          <p>
            ICG is a consulting practice built by engineers, researchers and
            specialists who have already built, deployed and operated real
            solutions in their fields.
          </p>
          <p>
            We direct that experience at India&apos;s public programmes, from
            policy design through to systems that run on the ground.
          </p>
        </FeatureSplit>

        <CareersWhySection className="band" />

        <IcgPrinciplesSection className="band-alt py-section-sm md:py-section-lg" />

        {recentBlogs.length > 0 ? (
          <section
            className="band py-section-sm md:py-section-lg"
            aria-labelledby="home-insights-heading"
          >
            <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
              <SectionHeading
                id="home-insights-heading"
                eyebrow="Insights"
                title="Latest thinking"
                lead="Case studies and analysis from the ICG team."
                action={
                  <Link
                    href="/blogs"
                    className="hidden items-center gap-2 text-[14px] font-semibold text-primary underline-offset-4 hover:underline md:inline-flex"
                  >
                    All insights <ArrowForwardIcon className="h-4 w-4" />
                  </Link>
                }
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {recentBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <OurTeamSection
          members={members}
          band={recentBlogs.length > 0 ? "band-alt" : "band"}
        />

        <CtaBand
          title="Bring us your hardest problem."
          lead="Tell us what you are working on. We will put the right specialists in the room."
          primary={{ href: "/careers#connect", label: "Contact Us" }}
          secondary={{ href: "/about", label: "About ICG" }}
        />
      </main>

      <SiteFooter />
    </>
  );
}
