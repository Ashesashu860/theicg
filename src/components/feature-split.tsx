import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowForwardIcon } from "@/components/icons";

type FeatureSplitProps = {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  link?: { href: string; label: string };
  /** Put the photo on the right instead of the left. */
  reverse?: boolean;
  className?: string;
};

/** Photo on one side, text on the other: the standard editorial block on consulting sites. */
export function FeatureSplit({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  children,
  link,
  reverse = false,
  className = "band-alt",
}: FeatureSplitProps) {
  return (
    <section className={className}>
      <div className="mx-auto grid max-w-container-max grid-cols-1 md:grid-cols-2">
        <div
          className={`relative min-h-[300px] md:min-h-[560px] ${
            reverse ? "md:order-2" : ""
          }`}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col justify-center px-margin-mobile py-16 md:px-16 md:py-20 lg:px-20">
          <p className="eyebrow mb-4 text-on-surface-variant">{eyebrow}</p>
          <h2 className="mb-6 text-headline-lg-mobile md:text-headline-lg">{title}</h2>
          <div className="space-y-4 text-body-lg text-on-surface-variant">{children}</div>
          {link ? (
            <Link
              href={link.href}
              className="mt-10 inline-flex items-center gap-2 self-start border-b border-navy pb-1 text-[14px] font-semibold uppercase tracking-[0.08em] text-primary"
            >
              {link.label}
              <ArrowForwardIcon className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
