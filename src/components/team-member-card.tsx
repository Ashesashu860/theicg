import Image from "next/image";
import { TeamMemberBio } from "@/components/team-member-bio";
import { canDisplayImageUrl } from "@/lib/image-url";
import type { PublicTeamMember } from "@/lib/teams-data";

type TeamMemberCardProps = {
  member: PublicTeamMember;
};

function memberInitial(name: string): string {
  const trimmed = name.trim();
  return trimmed ? trimmed[0]!.toUpperCase() : "T";
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <article className="flex h-full flex-col gap-5 border border-outline-variant bg-surface-container-lowest p-6 md:p-8">
      <div className="flex items-center gap-4 md:gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-navy md:h-24 md:w-24">
          {canDisplayImageUrl(member.imageUrl) ? (
            <Image
              src={member.imageUrl}
              alt={member.fullName}
              fill
              className="object-cover grayscale-[20%]"
              sizes="(max-width: 768px) 80px, 96px"
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center text-headline-md text-cream"
              aria-hidden="true"
            >
              {memberInitial(member.fullName)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-[20px] leading-tight text-primary md:text-[22px]">
            {member.fullName}
          </h3>
          {member.designation ? (
            <p className="mt-2 text-[15px] font-medium leading-snug text-on-surface">
              {member.designation}
            </p>
          ) : null}
          {member.department ? (
            <p className="mt-0.5 text-label-md uppercase text-on-surface-variant">
              {member.department}
            </p>
          ) : null}
        </div>
      </div>
      {member.bio.trim() ? <TeamMemberBio bio={member.bio} /> : null}
    </article>
  );
}
