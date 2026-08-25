import Image from "next/image";
import Link from "next/link";
import { ArrowForwardIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import type { CapabilityRecord } from "@/lib/capabilities-data";

type CapabilitiesPageProps = {
  capabilities: CapabilityRecord[];
};

function isLocalImagePath(src: string): boolean {
  return Boolean(src) && src.startsWith("/");
}

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
              <Link
                key={capability.id}
                href={`/capabilities/${capability.slug}`}
                className={`group relative flex h-full flex-col overflow-hidden border border-outline-variant/30 bg-pure-white transition-all duration-500 hover:border-primary-container/50 hover:shadow-sm ${
                  index % 3 === 1 ? "lg:translate-y-8" : ""
                }`}
              >
                {isLocalImagePath(capability.imageUrl) ? (
                  <div className="relative aspect-[1.49] overflow-hidden bg-surface-container">
                    <Image
                      src={capability.imageUrl}
                      alt={capability.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                ) : null}
                <div className="relative z-10 flex flex-grow flex-col bg-pure-white p-6 md:p-8">
                  <h2 className="mb-4 font-serif text-headline-md text-primary transition-colors group-hover:text-primary-container">
                    {capability.name}
                  </h2>
                  <p className="mb-8 flex-grow font-sans text-body-md text-on-surface-variant">
                    {capability.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 font-sans text-label-md uppercase tracking-wider text-primary transition-colors group-hover:text-primary-container">
                    Explore Category
                    <ArrowForwardIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-primary-container transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            ))}
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
