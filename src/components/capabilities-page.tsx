import { CapabilityCard } from "@/components/capability-card";
import { SiteFooter } from "@/components/site-footer";
import type { CapabilityRecord } from "@/lib/capabilities-data";

type CapabilitiesPageProps = {
  capabilities: CapabilityRecord[];
};

export function CapabilitiesPage({ capabilities }: CapabilitiesPageProps) {
  return (
    <>
      <main className="mx-auto w-full max-w-container-max flex-grow bg-off-white px-margin-mobile pb-24 pt-32 md:px-margin-desktop">
        <section className="mb-10 max-w-4xl md:mb-12">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-12 bg-primary" />
            <span className="font-sans text-label-md uppercase tracking-wider text-primary">
              Expertise
            </span>
          </div>
          <h1 className="mb-6 font-serif text-headline-lg-mobile font-bold tracking-[-0.02em] text-primary md:text-display-lg">
            Our Capabilities
          </h1>
          <p className="max-w-2xl border-l-2 border-primary-container py-2 pl-6 font-sans text-body-lg text-on-surface-variant">
            Bridging Strategic Clarity with Technical Excellence across critical
            infrastructure and digital domains.
          </p>
        </section>

        {capabilities.length === 0 ? (
          <p className="font-sans text-body-lg text-on-surface-variant">
            Capabilities will appear here once they are published.
          </p>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-gutter lg:grid-cols-3 lg:pb-8">
            {capabilities.map((capability, index) => (
              <CapabilityCard
                key={capability.id}
                capability={capability}
                offset={index % 3 === 1}
              />
            ))}
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
