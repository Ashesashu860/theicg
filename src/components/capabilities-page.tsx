import { CapabilityCard } from "@/components/capability-card";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import type { CapabilityRecord } from "@/lib/capabilities-data";
import { SITE_IMAGES } from "@/lib/site-images";

type CapabilitiesPageProps = {
  capabilities: CapabilityRecord[];
};

export function CapabilitiesPage({ capabilities }: CapabilitiesPageProps) {
  return (
    <>
      <main className="flex-grow">
        <PageHero
          imageSrc={SITE_IMAGES.capabilitiesHero}
          eyebrow="Expertise"
          title="Our Capabilities"
          lead="Bridging strategic clarity with technical excellence across critical infrastructure and digital domains."
        />

        <section className="mx-auto max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop">
          {capabilities.length === 0 ? (
            <p className="text-body-lg text-on-surface-variant">
              Capabilities will appear here once they are published.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((capability) => (
                <CapabilityCard key={capability.id} capability={capability} />
              ))}
            </div>
          )}
        </section>

        <CtaBand
          title="Not sure where your challenge fits?"
          lead="Describe the problem and we will bring together the specialists it needs."
          primary={{ href: "/careers#connect", label: "Contact Us" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
