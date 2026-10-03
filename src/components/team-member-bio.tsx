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
        className={`font-sans text-body-md leading-relaxed text-on-surface-variant ${
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
          className="mt-2 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:text-primary-container"
        >
          {expanded ? "View less" : "View more"}
        </button>
      ) : null}
    </div>
  );
}
