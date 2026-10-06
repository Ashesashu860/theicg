import { SectionHeading } from "@/components/section-heading";
import { TeamMemberCard } from "@/components/team-member-card";
import type { PublicTeamMember } from "@/lib/teams-data";

type OurTeamSectionProps = {
  members: PublicTeamMember[];
  /** Section band style, so pages can keep white/grey alternating. */
  band?: "band" | "band-alt";
};

export function OurTeamSection({ members, band = "band-alt" }: OurTeamSectionProps) {
  return (
    <section
      id="our-team"
      className={`${band} py-section-sm md:py-section-lg`}
      aria-labelledby="our-team-heading"
    >
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <SectionHeading
          id="our-team-heading"
          eyebrow="The People"
          title="Our Team"
          lead="Great minds who bring knowledge, experience, and clarity to every engagement."
        />

        {members.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            Team members will appear here once they are added.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {members.map((member) => (
              <li key={member.id}>
                <TeamMemberCard member={member} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
