import type { ReactNode } from "react";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** `dark` for use on navy backgrounds. */
  tone?: "light" | "dark";
  align?: "left" | "center";
  /** Optional content aligned to the right of the heading on desktop (e.g. a link). */
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  tone = "light",
  align = "left",
  action,
  className = "mb-12 md:mb-16",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${
        centered ? "items-center text-center md:flex-col md:items-center" : ""
      } ${className}`}
    >
      <div className={`max-w-3xl ${centered ? "mx-auto" : ""}`}>
        {eyebrow ? (
          <p
            className={`eyebrow mb-4 ${
              dark ? "text-secondary-fixed" : "text-on-surface-variant"
            }`}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className={`text-headline-lg-mobile md:text-headline-lg ${
            dark ? "text-cream" : "text-primary"
          }`}
        >
          {title}
        </h2>
        {lead ? (
          <p
            className={`mt-4 text-body-lg ${
              dark ? "text-on-primary-container" : "text-on-surface-variant"
            }`}
          >
            {lead}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
