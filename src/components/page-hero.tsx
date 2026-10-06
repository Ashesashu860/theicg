import Image from "next/image";
import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Buttons or links rendered under the lead. */
  actions?: ReactNode;
  /** Optional full-bleed photo behind a navy gradient. */
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
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            className="animate-hero-zoom object-cover"
            sizes="100vw"
          />
          {/* Phones: even overlay, since text spans the full width. Wider: fade from navy on the text side. */}
          <div className="absolute inset-0 bg-navy/80 md:bg-transparent md:bg-gradient-to-r md:from-navy md:via-navy/80 md:to-navy/25" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/60 to-transparent" />
        </div>
      ) : null}
      {navy ? (
        <div className="navy-texture pointer-events-none absolute inset-0" />
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
                ? "text-[34px] leading-[1.08] tracking-[-0.03em] sm:text-[52px] sm:leading-[1.05] sm:tracking-[-0.035em] md:text-[72px]"
                : "text-[32px] leading-[1.1] tracking-[-0.03em] sm:text-[40px] md:text-display-lg"
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
