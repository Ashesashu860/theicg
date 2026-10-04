import {
  AccountTreeIcon,
  AssignmentIcon,
  BusinessCenterIcon,
  GavelIcon,
  GroupsIcon,
  SettingsApplicationsIcon,
} from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { icgPrinciples, type IcgPrincipleId } from "@/lib/icg-principles";

const principleIcons: Record<IcgPrincipleId, typeof AssignmentIcon> = {
  evidence: AssignmentIcon,
  adoption: BusinessCenterIcon,
  ambiguity: AccountTreeIcon,
  execution: SettingsApplicationsIcon,
  accountable: GavelIcon,
  practice: GroupsIcon,
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {icgPrinciples.map((principle) => {
            const Icon = principleIcons[principle.id];
            return (
              <article
                key={principle.id}
                className="card-hover flex flex-col border border-outline-variant bg-surface-container-lowest p-8 md:p-10"
              >
                <div className="mb-10 flex items-center justify-between">
                  <Icon className="block h-7 w-7 text-primary" />
                  <span className="text-label-md text-on-surface-variant">
                    {principle.number}
                  </span>
                </div>
                <h3 className="mb-3 text-headline-md text-primary">
                  {principle.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {principle.short}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
