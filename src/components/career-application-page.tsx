import { CareerApplicationForm } from "@/components/career-application-form";
import { SiteFooter } from "@/components/site-footer";
import type { CareerRoleRecord } from "@/lib/careers-data";

type CareerApplicationPageProps = {
  roles: CareerRoleRecord[];
  initialRoleId?: string;
};

export function CareerApplicationPage({
  roles,
  initialRoleId,
}: CareerApplicationPageProps) {
  return (
    <>
      <main className="flex min-h-screen flex-col bg-off-white pb-section-lg pt-32">
        <section className="mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-4xl border border-outline-variant bg-pure-white p-8 md:p-16">
            <div className="mb-10 text-center">
              <h1 className="mb-3 font-serif text-headline-md text-primary md:text-headline-lg">
                Apply for a Career Role
              </h1>
              <p className="font-sans text-body-md text-on-surface-variant">
                Share your details, resume, and interest in joining ICG. We
                review every application carefully.
              </p>
            </div>
            <CareerApplicationForm
              roles={roles}
              initialRoleId={initialRoleId}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
