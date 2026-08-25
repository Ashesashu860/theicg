import Image from "next/image";
import Link from "next/link";
import { CareersRolesSection } from "@/components/careers-roles-section";
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
      <main className="flex min-h-screen flex-col bg-off-white pb-section-lg pt-32">
        <section className="mx-auto mb-section-lg max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="animate-fade-up md:col-span-7 md:pr-12">
              <h1 className="mb-6 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-primary md:text-display-lg">
                Beyond Is Where We Begin
              </h1>
              <p className="mb-8 max-w-2xl font-sans text-body-lg text-on-surface-variant">
                At ICG – IITians Consulting Group, you&apos;ll join great minds
                delivering expert consultation, strategic guidance, and
                practical solutions. We invest in your growth, wellbeing, and
                future—empowering you to thrive and help clients make smarter
                decisions with confidence.
              </p>
              <Link
                href="#roles"
                className="hover-btn-primary inline-block bg-primary-container px-8 py-4 font-sans text-label-md uppercase tracking-wider text-pure-white transition-all duration-300"
              >
                Explore Openings
              </Link>
            </div>
            <div
              className="animate-fade-up relative mt-10 h-[500px] md:col-span-5 md:mt-0"
              style={{ animationDelay: "120ms" }}
            >
              <Image
                src="/images/careers-hero.jpg"
                alt="Corporate leaders in a modern glass boardroom overlooking the city"
                fill
                className="border border-outline-variant object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
        </section>

        <CareersRolesSection roles={roles} categories={categories} />

        <section
          id="connect"
          className="mx-auto mb-section-sm max-w-container-max px-margin-mobile md:px-margin-desktop"
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
