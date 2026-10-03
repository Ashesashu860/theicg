import {
  AccountTreeIcon,
  AssignmentIcon,
  BusinessCenterIcon,
  GavelIcon,
  GroupsIcon,
} from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import {
  homepagePrinciples,
  type HomepagePrincipleId,
} from "@/lib/icg-principles";

const homepageLayout: Record<
  HomepagePrincipleId,
  { icon: typeof AssignmentIcon; featured: boolean }
> = {
  evidence: { icon: AssignmentIcon, featured: true },
  adoption: { icon: BusinessCenterIcon, featured: false },
  ambiguity: { icon: AccountTreeIcon, featured: false },
  accountable: { icon: GavelIcon, featured: false },
  practice: { icon: GroupsIcon, featured: false },
};

type IcgPrinciplesSectionProps = {
  className?: string;
};

export function IcgPrinciplesSection({
  className = "py-section-sm md:py-section-lg",
}: IcgPrinciplesSectionProps) {
  return (
    <section
      id="icg-principles"
      className={className}
      aria-labelledby="icg-principles-heading"
    >
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <SectionHeading
          id="icg-principles-heading"
          eyebrow="How we work"
          title="The ICG Principles"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {homepagePrinciples.map((principle) => {
            const { icon: Icon, featured } = homepageLayout[principle.id];
            return (
              <article
                key={principle.id}
                className={`flex min-h-[260px] flex-col justify-between border p-8 md:p-10 ${
                  featured
                    ? "border-navy bg-grid-navy text-cream md:col-span-2"
                    : "card-hover border-outline-variant bg-surface-container-lowest"
                }`}
              >
                <div className="mb-10 flex items-center justify-between">
                  <Icon
                    className={`block h-7 w-7 ${
                      featured ? "text-secondary-fixed" : "text-primary"
                    }`}
                  />
                  <span
                    className={`text-label-md ${
                      featured
                        ? "text-on-primary-container"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {principle.number}
                  </span>
                </div>
                <div>
                  <h3
                    className={`mb-3 ${
                      featured
                        ? "text-headline-lg-mobile text-cream md:text-[36px]"
                        : "text-headline-md text-primary"
                    }`}
                  >
                    {principle.title}
                  </h3>
                  <p
                    className={`max-w-xl text-body-md ${
                      featured
                        ? "text-on-primary-container md:text-body-lg"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {principle.short}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
