import Image from "next/image";
import Link from "next/link";
import { ArrowForwardIcon } from "@/components/icons";
import type { CapabilityRecord } from "@/lib/capabilities-data";
import { canDisplayImageUrl } from "@/lib/image-url";

type CapabilityCardProps = {
  capability: CapabilityRecord;
  className?: string;
};

export function CapabilityCard({
  capability,
  className = "",
}: CapabilityCardProps) {
  return (
    <Link
      href={`/capabilities/${capability.slug}`}
      className={`card-hover group flex h-full flex-col border border-outline-variant bg-surface-container-lowest ${className}`}
    >
      {canDisplayImageUrl(capability.imageUrl) ? (
        <div className="relative aspect-[3/2] overflow-hidden bg-surface-container">
          <Image
            src={capability.imageUrl}
            alt=""
            fill
            className="object-cover grayscale-[35%] transition duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 360px"
          />
        </div>
      ) : null}
      <div className="flex flex-grow flex-col p-6 md:p-8">
        <h3 className="mb-3 text-[22px] leading-tight text-primary">
          {capability.name}
        </h3>
        <p className="mb-8 flex-grow text-body-md text-on-surface-variant">
          {capability.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 text-[14px] font-semibold text-primary">
          Explore capability
          <ArrowForwardIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
