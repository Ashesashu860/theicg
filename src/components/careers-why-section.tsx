import { HubIcon, LanguageIcon, TrendingUpIcon } from "@/components/icons";

const reasons = [
  {
    title: "Global Trajectory",
    description:
      "Working on projects that shape industries across continents. Your work will have a demonstrable footprint on the global economy.",
    icon: LanguageIcon,
    className: "",
  },
  {
    title: "Elite Network",
    description:
      "Collaborating with the brightest minds in engineering, economics, and strategy. Iron sharpens iron.",
    icon: HubIcon,
    className: "md:mt-8",
  },
  {
    title: "Uncapped Growth",
    description:
      "A strictly meritocratic path to leadership. We promote based on impact and capability, not time served in a seat.",
    icon: TrendingUpIcon,
    className: "md:mt-16",
  },
] as const;

export function CareersWhySection() {
  return (
    <section
      id="why-icg"
      className="mx-auto max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop md:py-section-lg"
      aria-labelledby="why-icg-heading"
    >
      <div className="mb-16 text-center">
        <h2
          id="why-icg-heading"
          className="font-serif text-headline-lg-mobile text-primary md:text-headline-md"
        >
          Why ICG
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {reasons.map((reason) => {
          const Icon = reason.icon;

          return (
            <div
              key={reason.title}
              className={`ghost-border group bg-pure-white p-8 transition-colors duration-300 hover:bg-surface-container-lowest ${reason.className}`}
            >
              <Icon className="mb-6 block h-9 w-9 text-primary" />
              <h3 className="mb-3 font-serif text-headline-lg-mobile text-on-surface md:text-headline-md">
                {reason.title}
              </h3>
              <p className="font-sans text-body-md text-on-surface-variant">
                {reason.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
