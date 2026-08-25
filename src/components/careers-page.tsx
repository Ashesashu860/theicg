import Image from "next/image";
import Link from "next/link";
import { CareersCultureSection } from "@/components/careers-culture-section";
import { CareersRolesSection } from "@/components/careers-roles-section";
import { CareersWhySection } from "@/components/careers-why-section";
import { ContactForm } from "@/components/contact-form";
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
      <main className="flex min-h-screen flex-grow flex-col bg-surface pt-20">
        <section className="relative flex h-[80vh] min-h-[600px] items-center">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/images/careers-hero.jpg"
              alt="Low-angle view of a modern glass office tower reaching into a clear sky"
              fill
              priority
              className="scale-[1.04] object-cover blur-[2px] saturate-[1.05]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/70 to-transparent" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="max-w-2xl">
              <h1 className="mb-6 font-serif text-headline-lg-mobile font-bold leading-[1.1] tracking-[-0.02em] text-primary md:text-display-lg">
                Join a Rocketship.
              </h1>
              <p className="mb-10 max-w-lg font-sans text-body-lg text-on-surface-variant">
                Accelerate your career with the world&apos;s most ambitious
                strategic architects. We don&apos;t just advise; we build the
                future of global enterprise.
              </p>
              <Link
                href="#open-roles"
                className="hover-accent-bottom inline-block bg-primary px-8 py-4 font-sans text-label-md uppercase tracking-wider text-on-primary shadow-sm"
              >
                <span>View Open Roles</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop md:py-section-lg">
          <div className="grid grid-cols-1 items-start gap-gutter md:grid-cols-12">
            <div className="border-t border-primary pt-4 md:col-span-4 md:col-start-2">
              <h2 className="mb-4 font-sans text-label-md uppercase tracking-wider text-secondary">
                The Mandate
              </h2>
              <p className="font-serif text-headline-lg-mobile leading-tight text-primary md:text-headline-md">
                High growth. High impact. Elite talent.
              </p>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <p className="mb-6 font-sans text-body-lg text-on-surface-variant">
                At ICG, we operate at the intersection of audacious vision and
                rigorous execution. Our culture is deliberately designed for
                those who seek to compress a decade of career growth into a few
                transformative years.
              </p>
              <p className="font-sans text-body-lg text-on-surface-variant">
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

        <CareersRolesSection roles={roles} categories={categories} />

        <section className="bg-primary px-margin-mobile py-section-sm text-center md:px-margin-desktop">
          <h2 className="mb-8 font-serif text-headline-lg-mobile font-bold tracking-[-0.02em] text-on-primary md:text-display-lg">
            Ready for Launch?
          </h2>
          <Link
            href="/careers/apply"
            className="inline-block border-2 border-transparent bg-pure-white px-10 py-5 font-sans text-label-md uppercase tracking-wider text-primary transition-colors hover:border-surface-tint hover:bg-surface-container-lowest"
          >
            Start Your Application
          </Link>
        </section>

        <section
          id="connect"
          className="mx-auto w-full max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop md:py-section-lg"
        >
          <div className="mx-auto max-w-4xl border border-outline-variant bg-pure-white p-8 md:p-16">
            <div className="mb-10 text-center">
              <h2 className="mb-3 font-serif text-headline-md text-primary">
                Connect With Us
              </h2>
              <p className="font-sans text-body-md text-on-surface-variant">
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
