import { TeamMemberCard } from "@/components/team-member-card";
import type { PublicTeamMember } from "@/lib/teams-data";

type OurTeamSectionProps = {
  members: PublicTeamMember[];
};

export function OurTeamSection({ members }: OurTeamSectionProps) {
  return (
    <section
      id="our-team"
      className="border-t border-outline-variant bg-pure-white py-12 md:py-16"
      aria-labelledby="our-team-heading"
    >
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-8 max-w-2xl md:mb-10">
          <p className="mb-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
            The People
          </p>
          <h2
            id="our-team-heading"
            className="mb-2 font-serif text-headline-lg-mobile text-primary md:text-headline-lg"
          >
            Our Team
          </h2>
          <p className="font-sans text-body-lg text-on-surface-variant">
            Great minds who bring knowledge, experience, and clarity to every
            engagement.
          </p>
        </div>

        {members.length === 0 ? (
          <p className="font-sans text-body-md text-on-surface-variant">
            Team members will appear here once they are added.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
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
