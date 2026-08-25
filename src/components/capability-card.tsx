import Image from "next/image";
import Link from "next/link";
import { ArrowForwardIcon } from "@/components/icons";
import type { CapabilityRecord } from "@/lib/capabilities-data";
import { canDisplayImageUrl } from "@/lib/image-url";

type CapabilityCardProps = {
  capability: CapabilityRecord;
  /** Optional stagger offset used on the capabilities grid. */
  offset?: boolean;
  className?: string;
};

export function CapabilityCard({
  capability,
  offset = false,
  className = "",
}: CapabilityCardProps) {
  return (
    <Link
      href={`/capabilities/${capability.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden border border-outline-variant/30 bg-pure-white transition-all duration-500 hover:border-primary-container/50 hover:shadow-sm ${
        offset ? "lg:translate-y-8" : ""
      } ${className}`}
    >
      {canDisplayImageUrl(capability.imageUrl) ? (
        <div className="relative aspect-[1.49] overflow-hidden bg-surface-container">
          <Image
            src={capability.imageUrl}
            alt={capability.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 360px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      ) : null}
      <div className="relative z-10 flex flex-grow flex-col bg-pure-white p-6 md:p-8">
        <h3 className="mb-4 font-serif text-headline-md text-primary transition-colors group-hover:text-primary-container">
          {capability.name}
        </h3>
        <p className="mb-8 flex-grow font-sans text-body-md text-on-surface-variant">
          {capability.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 font-sans text-label-md uppercase tracking-wider text-primary transition-colors group-hover:text-primary-container">
          Explore Category
          <ArrowForwardIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-primary-container transition-transform duration-500 group-hover:scale-x-100" />
    </Link>
  );
}
