import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
} from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import type { BlogRecord } from "@/lib/blogs-data";
import type { CapabilityRecord } from "@/lib/capabilities-data";

type CapabilityDetailPageProps = {
  capability: CapabilityRecord;
  blogs: BlogRecord[];
};

function isLocalImagePath(src: string): boolean {
  return Boolean(src) && src.startsWith("/");
}

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
      <main className="bg-off-white pt-32">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <Link
            href="/capabilities"
            className="mb-10 inline-flex items-center gap-2 font-sans text-label-md uppercase tracking-wider text-primary-container transition-colors hover:text-primary"
          >
            <ArrowBackIcon />
            All Capabilities
          </Link>

          <section className="mb-10 grid grid-cols-1 items-center gap-gutter border-b border-outline-variant pb-8 md:mb-12 md:grid-cols-12 md:pb-10">
            <div className="md:col-span-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-12 bg-primary" />
                <span className="font-sans text-label-md uppercase tracking-wider text-primary">
                  Capability
                </span>
              </div>
              <h1 className="mb-6 font-serif text-headline-lg-mobile font-bold tracking-[-0.02em] text-primary md:text-display-lg">
                {capability.name}
              </h1>
              <p className="max-w-xl border-l-2 border-primary-container py-2 pl-6 font-sans text-body-lg text-on-surface-variant">
                {capability.description}
              </p>
            </div>
            <div className="relative mt-10 aspect-[1.49] overflow-hidden border border-outline-variant/30 bg-surface-container md:col-span-6 md:mt-0">
              {isLocalImagePath(capability.imageUrl) ? (
                <Image
                  src={capability.imageUrl}
                  alt={capability.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-surface-container to-primary-container/40" />
              )}
            </div>
          </section>

          <section className="mb-24 md:mb-32">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="mb-2 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                  Related Blogs
                </h2>
                <p className="max-w-2xl font-sans text-body-md text-on-surface-variant">
                  Perspectives and practical reading tied to{" "}
                  {capability.name.toLowerCase()}.
                </p>
              </div>
              <Link
                href="/careers#connect"
                className="inline-flex items-center gap-2 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:text-primary-container"
              >
                Discuss this capability <ArrowForwardIcon />
              </Link>
            </div>

            {blogs.length === 0 ? (
              <p className="font-sans text-body-md text-on-surface-variant">
                No related blogs published for this capability yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
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
        </div>

        <section className="bg-primary py-24 text-center text-pure-white md:py-32">
          <div className="mx-auto max-w-3xl px-margin-mobile">
            <h2 className="mb-6 font-serif text-headline-lg-mobile md:text-headline-lg">
              Ready to explore {capability.name}?
            </h2>
            <p className="mb-10 font-sans text-body-lg text-pure-white/80">
              Tell us about your challenge. We will help you turn domain
              expertise into a clear next step.
            </p>
            <Link
              href="/careers#connect"
              className="inline-flex bg-pure-white px-8 py-4 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:bg-surface-variant"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
