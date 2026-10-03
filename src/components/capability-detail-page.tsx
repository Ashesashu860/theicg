import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { CtaBand } from "@/components/cta-band";
import { ArrowBackIcon, ArrowForwardIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import type { BlogRecord } from "@/lib/blogs-data";
import type { CapabilityRecord } from "@/lib/capabilities-data";
import { canDisplayImageUrl } from "@/lib/image-url";

type CapabilityDetailPageProps = {
  capability: CapabilityRecord;
  blogs: BlogRecord[];
};

function formatBlogDate(value: Date | null): string {
  if (!value) return "";
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CapabilityDetailPage({
  capability,
  blogs,
}: CapabilityDetailPageProps) {
  return (
    <>
      <main>
        <section className="border-b border-outline-variant">
          <div className="mx-auto max-w-container-max px-margin-mobile pb-16 pt-32 md:px-margin-desktop md:pb-20 md:pt-40">
            <Link
              href="/capabilities"
              className="mb-10 inline-flex items-center gap-2 text-[14px] font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              <ArrowBackIcon className="h-4 w-4" />
              All Capabilities
            </Link>

            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
              <div className="md:col-span-6">
                <p className="eyebrow mb-6 text-on-surface-variant">
                  Capability
                </p>
                <h1 className="mb-6 text-[36px] leading-[1.08] tracking-[-0.03em] text-primary md:text-display-lg">
                  {capability.name}
                </h1>
                <p className="max-w-xl text-body-lg text-on-surface-variant md:text-[20px] md:leading-[1.6]">
                  {capability.description}
                </p>
              </div>
              <div className="relative aspect-[3/2] overflow-hidden bg-grid-navy md:col-span-6">
                {canDisplayImageUrl(capability.imageUrl) ? (
                  <Image
                    src={capability.imageUrl}
                    alt=""
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop">
          <SectionHeading
            eyebrow="Perspectives"
            title="Related Blogs"
            lead={`Perspectives and practical reading tied to ${capability.name.toLowerCase()}.`}
            action={
              <Link
                href="/careers#connect"
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary underline-offset-4 hover:underline"
              >
                Discuss this capability <ArrowForwardIcon className="h-4 w-4" />
              </Link>
            }
          />

          {blogs.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">
              No related blogs published for this capability yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  meta={formatBlogDate(blog.createdAt)}
                />
              ))}
            </div>
          )}
        </section>

        <CtaBand
          title={`Ready to explore ${capability.name}?`}
          lead="Tell us about your challenge. We will help you turn domain expertise into a clear next step."
          primary={{ href: "/careers#connect", label: "Contact Us" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
