import Link from "next/link";
import type { ReactNode } from "react";

type CtaBandProps = {
  title: ReactNode;
  lead?: ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

/** Closing navy call-to-action used at the foot of public pages. */
export function CtaBand({ title, lead, primary, secondary }: CtaBandProps) {
  return (
    <section className="bg-grid-navy text-cream">
      <div className="mx-auto grid max-w-container-max grid-cols-1 items-end gap-10 px-margin-mobile py-20 lg:grid-cols-12 md:px-margin-desktop md:py-28">
        <div className="lg:col-span-7">
          <h2 className="text-headline-lg-mobile text-cream md:text-headline-lg">
            {title}
          </h2>
          {lead ? (
            <p className="mt-5 max-w-2xl text-body-lg text-on-primary-container">
              {lead}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
          <Link href={primary.href} className="btn btn-light">
            {primary.label}
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="btn btn-outline-light">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
