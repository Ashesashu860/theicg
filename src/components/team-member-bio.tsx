"use client";

import { useState } from "react";

type TeamMemberBioProps = {
  bio: string;
};

const PREVIEW_LIMIT = 180;

export function TeamMemberBio({ bio }: TeamMemberBioProps) {
  const text = bio.trim();
  const [expanded, setExpanded] = useState(false);
  const needsToggle = text.length > PREVIEW_LIMIT;

  if (!text) return null;

  return (
    <div>
      <p
        className={`border-t border-outline-variant pt-5 text-body-md text-on-surface-variant ${
          needsToggle && !expanded ? "line-clamp-3" : ""
        }`}
      >
        {text}
      </p>
      {needsToggle ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 text-[14px] font-semibold text-primary underline-offset-4 hover:underline"
        >
          {expanded ? "View less" : "View more"}
        </button>
      ) : null}
    </div>
  );
}
