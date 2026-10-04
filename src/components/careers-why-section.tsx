import { EditorialList } from "@/components/editorial-list";
import { CheckCircleIcon, HubIcon, TrendingUpIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

const reasons = [
  {
    title: "Six Domains, One Standard",
    description:
      "From geotechnical surveys to water and sanitation, every engagement is held to the same standard of evidence and delivery.",
    icon: CheckCircleIcon,
  },
  {
    title: "Elite Network",
    description:
      "Collaborating with the brightest minds in engineering, economics, and strategy. Iron sharpens iron.",
    icon: HubIcon,
  },
  {
    title: "Uncapped Growth",
    description:
      "A strictly meritocratic path to leadership. We promote based on impact and capability, not time served in a seat.",
    icon: TrendingUpIcon,
  },
] as const;

type CareersWhySectionProps = {
  className?: string;
  /** `editorial` (numbered, no boxes) is used on Home; `cards` keeps the boxed layout. */
  layout?: "cards" | "editorial";
};

export function CareersWhySection({
  className = "band",
  layout = "cards",
}: CareersWhySectionProps) {
  return (
    <div className={className}>
      <section
        id="why-icg"
        className="mx-auto w-full max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop md:py-section-lg"
        aria-labelledby="why-icg-heading"
      >
        <SectionHeading
          id="why-icg-heading"
          eyebrow="What sets us apart"
          title="Why ICG"
          className={layout === "editorial" ? "mb-14 md:mb-20" : undefined}
        />
        {layout === "editorial" ? (
          <EditorialList
            items={reasons.map((reason, index) => ({
              key: reason.title,
              number: String(index + 1).padStart(2, "0"),
              title: reason.title,
              text: reason.description,
            }))}
          />
        ) : (
          <div className="grid grid-cols-1 border-l border-t border-outline-variant md:grid-cols-3">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;

              return (
                <div
                  key={reason.title}
                  className="border-b border-r border-outline-variant bg-surface-container-lowest p-8 md:p-10"
                >
                  <div className="mb-10 flex items-center justify-between">
                    <Icon className="block h-7 w-7 text-primary" />
                    <span className="text-label-md text-on-surface-variant">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mb-3 text-headline-md text-primary">
                    {reason.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    {reason.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
