import {
  AccountTreeIcon,
  GavelIcon,
  LightbulbIcon,
  PsychologyIcon,
  RocketLaunchIcon,
} from "@/components/icons";

const principles = [
  {
    title: "Insight to Light",
    description:
      "We don't just gather data; we illuminate truths. By transforming complex information into clear, actionable intelligence, we guide our clients through their most challenging terrains with unshakeable confidence.",
    icon: LightbulbIcon,
    span: "md:col-span-8",
    dark: false,
    large: true,
  },
  {
    title: "Inspired Impact",
    description:
      "Our solutions are designed not just for immediate gains, but to create lasting ripples of positive change across industries and communities.",
    icon: RocketLaunchIcon,
    span: "md:col-span-4",
    dark: false,
    large: false,
  },
  {
    title: "Conquer Complexity",
    description:
      "We thrive in ambiguity. Our structural thinking dismantles the convoluted, delivering elegant simplicity and strategic clarity.",
    icon: AccountTreeIcon,
    span: "md:col-span-4",
    dark: true,
    large: false,
  },
] as const;

const pairedPrinciples = [
  {
    title: "Lead with Integrity",
    description:
      "Uncompromising ethical standards form the bedrock of every recommendation and action we take.",
    icon: GavelIcon,
  },
  {
    title: "Grow by Growing Others",
    description:
      "We elevate our clients and our teams simultaneously, fostering a culture of continuous intellectual and professional development.",
    icon: PsychologyIcon,
  },
] as const;

type IcgPrinciplesSectionProps = {
  className?: string;
};

export function IcgPrinciplesSection({
  className = "mx-auto mb-32 max-w-container-max px-margin-mobile md:px-margin-desktop",
}: IcgPrinciplesSectionProps) {
  return (
    <section
      id="icg-principles"
      className={className}
      aria-labelledby="icg-principles-heading"
    >
      <div className="mb-16">
        <h2
          id="icg-principles-heading"
          className="mb-4 font-serif text-headline-lg-mobile text-primary md:text-headline-lg"
        >
          The ICG Principles
        </h2>
        <div className="h-1 w-16 bg-primary-container" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {principles.map((principle) => {
          const Icon = principle.icon;
          return (
            <div
              key={principle.title}
              className={`${principle.span} border p-10 transition-colors ${
                principle.dark
                  ? "border-transparent bg-primary-container text-pure-white"
                  : "group flex min-h-[300px] flex-col justify-between border-outline-variant/50 bg-pure-white hover:border-primary-container"
              }`}
            >
              <div>
                <Icon
                  className={`mb-6 block ${
                    principle.dark
                      ? "text-secondary-fixed"
                      : "text-primary-container"
                  } ${principle.large ? "h-10 w-10" : "h-8 w-8"}`}
                />
                <h3
                  className={`mb-3 font-serif ${
                    principle.large
                      ? "text-headline-md text-primary"
                      : principle.dark
                        ? "text-2xl text-pure-white"
                        : "text-2xl text-primary"
                  }`}
                >
                  {principle.title}
                </h3>
                <p
                  className={`font-sans text-body-md ${
                    principle.dark
                      ? "text-pure-white/80"
                      : "max-w-lg text-on-surface-variant"
                  }`}
                >
                  {principle.description}
                </p>
              </div>
            </div>
          );
        })}

        <div className="grid grid-cols-1 gap-6 md:col-span-8 md:grid-cols-2">
          {pairedPrinciples.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.title}
                className="border border-outline-variant/50 bg-pure-white p-8 transition-colors hover:border-primary-container"
              >
                <Icon className="mb-4 block h-8 w-8 text-primary-container" />
                <h3 className="mb-2 font-serif text-xl text-primary">
                  {principle.title}
                </h3>
                <p className="font-sans text-body-md text-on-surface-variant">
                  {principle.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
