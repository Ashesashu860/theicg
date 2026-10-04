import { SITE_IMAGES } from "@/lib/site-images";
import Link from "next/link";
import { CareersCultureSection } from "@/components/careers-culture-section";
import { CareersRolesSection } from "@/components/careers-roles-section";
import { CareersWhySection } from "@/components/careers-why-section";
import { ContactForm } from "@/components/contact-form";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import type {
  CareerCategoryRecord,
  CareerRoleRecord,
} from "@/lib/careers-data";

type CareersPageProps = {
  roles: CareerRoleRecord[];
  categories: CareerCategoryRecord[];
};

export function CareersPage({ roles, categories }: CareersPageProps) {
  return (
    <>
      <main className="flex flex-grow flex-col">
        <PageHero
          eyebrow="Careers at ICG"
          title="Do work that gets built."
          imageSrc={SITE_IMAGES.careersHero}
          lead="Join engineers, researchers and specialists who carry advice through to delivery on programmes that matter. Grow fast, learn from practitioners, and own real outcomes."
          actions={
            <>
              <Link href="#open-roles" className="btn btn-light">
                View Open Roles
              </Link>
              <Link href="/careers/apply" className="btn btn-outline-light">
                Apply Now
              </Link>
            </>
          }
        />

        <section className="mx-auto w-full max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop md:py-section-lg">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow mb-4 text-on-surface-variant">
                The Mandate
              </p>
              <h2 className="text-headline-lg-mobile md:text-headline-lg">
                High growth. High impact. Elite talent.
              </h2>
            </div>
            <div className="md:col-span-6 md:col-start-7 md:pt-10">
              <p className="mb-6 text-body-lg text-on-surface-variant">
                At ICG, we operate at the intersection of audacious vision and
                rigorous execution. Our culture is deliberately designed for
                those who seek to compress a decade of career growth into a few
                transformative years.
              </p>
              <p className="text-body-lg text-on-surface-variant">
                We reject complacency. Here, meritocracy rules, and the best
                ideas win, regardless of tenure. If you are prepared to be
                challenged, to learn relentlessly, and to leave an indelible
                mark on global industries, you have found your launchpad.
              </p>
            </div>
          </div>
        </section>

        <CareersCultureSection />

        <CareersWhySection />

        <div className="band-alt pt-section-sm md:pt-section-lg">
          <CareersRolesSection roles={roles} categories={categories} />
        </div>

        <CtaBand
          title="Ready to apply?"
          lead="Tell us about yourself and the work you want to do."
          primary={{ href: "/careers/apply", label: "Start Your Application" }}
        />

        <section
          id="connect"
          className="mx-auto w-full max-w-container-max scroll-mt-20 px-margin-mobile py-section-sm md:px-margin-desktop md:py-section-lg"
        >
          <div className="mx-auto max-w-4xl border border-outline-variant bg-surface-container-lowest p-8 md:p-16">
            <div className="mb-12">
              <p className="eyebrow mb-4 text-on-surface-variant">Contact</p>
              <h2 className="mb-3 text-headline-lg-mobile md:text-headline-lg">
                Connect With Us
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                Register your interest to stay informed about upcoming
                opportunities and firm news.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
