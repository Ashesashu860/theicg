import Image from "next/image";
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
    <article className="flex items-center gap-4 border border-outline-variant bg-pure-white p-3 md:gap-5 md:p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-surface-container md:h-24 md:w-24">
        {canDisplayImageUrl(member.imageUrl) ? (
          <Image
            src={member.imageUrl}
            alt={member.fullName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80px, 96px"
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center font-serif text-headline-md text-primary"
            aria-hidden="true"
          >
            {memberInitial(member.fullName)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="w-fit max-w-full border-b border-on-surface pb-0.5 font-sans text-xl font-semibold leading-tight text-primary md:text-2xl">
          {member.fullName}
        </h3>
        {member.designation ? (
          <p className="mt-1 font-sans text-body-md font-semibold leading-snug text-on-surface">
            {member.designation}
          </p>
        ) : null}
        {member.department ? (
          <p className="font-sans text-body-md leading-snug text-on-surface-variant">
            {member.department}
          </p>
        ) : null}
      </div>
    </article>
  );
}
