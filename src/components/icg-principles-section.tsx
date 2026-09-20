import {
  AccountTreeIcon,
  AssignmentIcon,
  BusinessCenterIcon,
  GavelIcon,
  GroupsIcon,
} from "@/components/icons";
import {
  homepagePrinciples,
  type HomepagePrincipleId,
} from "@/lib/icg-principles";

const homepageLayout: Record<
  HomepagePrincipleId,
  {
    icon: typeof AssignmentIcon;
    span?: string;
    dark: boolean;
    large: boolean;
    paired: boolean;
  }
> = {
  evidence: {
    icon: AssignmentIcon,
    span: "md:col-span-8",
    dark: false,
    large: true,
    paired: false,
  },
  adoption: {
    icon: BusinessCenterIcon,
    span: "md:col-span-4",
    dark: false,
    large: false,
    paired: false,
  },
  ambiguity: {
    icon: AccountTreeIcon,
    span: "md:col-span-4",
    dark: true,
    large: false,
    paired: false,
  },
  accountable: {
    icon: GavelIcon,
    dark: false,
    large: false,
    paired: true,
  },
  practice: {
    icon: GroupsIcon,
    dark: false,
    large: false,
    paired: true,
  },
};

type IcgPrinciplesSectionProps = {
  className?: string;
};

export function IcgPrinciplesSection({
  className = "mx-auto mb-32 max-w-container-max px-margin-mobile md:px-margin-desktop",
}: IcgPrinciplesSectionProps) {
  const featured = homepagePrinciples.filter(
    (principle) => !homepageLayout[principle.id].paired,
  );
  const paired = homepagePrinciples.filter(
    (principle) => homepageLayout[principle.id].paired,
  );

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
        {featured.map((principle) => {
          const layout = homepageLayout[principle.id];
          const Icon = layout.icon;
          return (
            <div
              key={principle.id}
              className={`${layout.span} border p-10 transition-colors ${
                layout.dark
                  ? "border-transparent bg-primary-container text-pure-white"
                  : "group flex min-h-[300px] flex-col justify-between border-outline-variant/50 bg-pure-white hover:border-primary-container"
              }`}
            >
              <div>
                <Icon
                  className={`mb-6 block ${
                    layout.dark
                      ? "text-secondary-fixed"
                      : "text-primary-container"
                  } ${layout.large ? "h-10 w-10" : "h-8 w-8"}`}
                />
                <h3
                  className={`mb-3 font-serif ${
                    layout.large
                      ? "text-headline-md text-primary"
                      : layout.dark
                        ? "text-2xl text-pure-white"
                        : "text-2xl text-primary"
                  }`}
                >
                  {principle.title}
                </h3>
                <p
                  className={`font-sans text-body-md ${
                    layout.dark
                      ? "text-pure-white/80"
                      : "max-w-lg text-on-surface-variant"
                  }`}
                >
                  {principle.short}
                </p>
              </div>
            </div>
          );
        })}

        <div className="grid grid-cols-1 gap-6 md:col-span-8 md:grid-cols-2">
          {paired.map((principle) => {
            const Icon = homepageLayout[principle.id].icon;
            return (
              <div
                key={principle.id}
                className="border border-outline-variant/50 bg-pure-white p-8 transition-colors hover:border-primary-container"
              >
                <Icon className="mb-4 block h-8 w-8 text-primary-container" />
                <h3 className="mb-2 font-serif text-xl text-primary">
                  {principle.title}
                </h3>
                <p className="font-sans text-body-md text-on-surface-variant">
                  {principle.short}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
