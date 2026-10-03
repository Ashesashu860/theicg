import Image from "next/image";
import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Buttons or links rendered under the lead. */
  actions?: ReactNode;
  /** Optional photo, shown desaturated behind the navy panel. */
  imageSrc?: string;
  /** Optional content for the right-hand column on desktop. */
  aside?: ReactNode;
  /** `navy` for landing-style pages, `cream` for index and detail pages. */
  tone?: "navy" | "cream";
  /** Larger type and height, for the home page. */
  size?: "default" | "large";
};

/** Shared top-of-page hero so every public route opens the same way. */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  imageSrc,
  aside,
  tone = "navy",
  size = "default",
}: PageHeroProps) {
  const navy = tone === "navy";
  const large = size === "large";

  return (
    <section
      className={`relative overflow-hidden ${
        navy ? "bg-navy text-cream" : "border-b border-outline-variant bg-cream"
      }`}
    >
      {navy && imageSrc ? (
        <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            className="object-cover opacity-35 grayscale"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-navy/10" />
        </div>
      ) : null}
      {navy ? (
        <div className="grid-lines pointer-events-none absolute inset-0" />
      ) : null}

      <div
        className={`relative mx-auto grid max-w-container-max grid-cols-1 items-center gap-12 px-margin-mobile md:grid-cols-12 md:px-margin-desktop ${
          large
            ? "pb-24 pt-40 md:min-h-[min(88vh,820px)] md:pb-32 md:pt-44"
            : "pb-16 pt-36 md:pb-24 md:pt-44"
        }`}
      >
        <div className={aside ? "md:col-span-7" : "md:col-span-9"}>
          {eyebrow ? (
            <p
              className={`eyebrow animate-fade-up mb-6 ${
                navy ? "text-secondary-fixed" : "text-on-surface-variant"
              }`}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={`animate-fade-up ${
              large
                ? "text-[40px] leading-[1.05] tracking-[-0.035em] sm:text-[52px] md:text-[72px]"
                : "text-[36px] leading-[1.08] tracking-[-0.03em] md:text-display-lg"
            } ${navy ? "text-cream" : "text-primary"}`}
            style={{ animationDelay: "60ms" }}
          >
            {title}
          </h1>
          {lead ? (
            <div
              className={`animate-fade-up mt-6 max-w-2xl text-body-lg md:mt-8 md:text-[20px] md:leading-[1.6] ${
                navy ? "text-on-primary-container" : "text-on-surface-variant"
              }`}
              style={{ animationDelay: "120ms" }}
            >
              {lead}
            </div>
          ) : null}
          {actions ? (
            <div
              className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "180ms" }}
            >
              {actions}
            </div>
          ) : null}
        </div>
        {aside ? (
          <div
            className="animate-fade-up md:col-span-5"
            style={{ animationDelay: "160ms" }}
          >
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}
