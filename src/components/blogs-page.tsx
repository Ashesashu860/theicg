import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { SiteFooter } from "@/components/site-footer";
import type { BlogRecord } from "@/lib/blogs-data";
import type { CapabilityRecord } from "@/lib/capabilities-data";

type BlogsPageProps = {
  blogs: BlogRecord[];
  capabilities: CapabilityRecord[];
  activeCapabilityId: string | null;
};

export function BlogsPage({
  blogs,
  capabilities,
  activeCapabilityId,
}: BlogsPageProps) {
  const capabilityNameById = Object.fromEntries(
    capabilities.map((capability) => [capability.id, capability.name]),
  );

  const filtered = activeCapabilityId
    ? blogs.filter((blog) => blog.capabilityId === activeCapabilityId)
    : blogs;

  return (
    <>
      <main className="mx-auto w-full max-w-container-max flex-grow bg-off-white px-margin-mobile pb-24 pt-32 md:px-margin-desktop">
        <section className="mb-10 max-w-4xl md:mb-12">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-12 bg-primary" />
            <span className="font-sans text-label-md uppercase tracking-wider text-primary">
              Perspectives
            </span>
          </div>
          <h1 className="mb-6 font-serif text-headline-lg-mobile font-bold tracking-[-0.02em] text-primary md:text-display-lg">
            Blogs
          </h1>
          <p className="max-w-2xl border-l-2 border-primary-container py-2 pl-6 font-sans text-body-lg text-on-surface-variant">
            Insights on knowledge, strategy, and smarter decisions across our
            capability areas.
          </p>
        </section>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/blogs"
            className={
              activeCapabilityId === null
                ? "border border-primary bg-primary px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary"
                : "border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            }
          >
            All
          </Link>
          {capabilities.map((capability) => (
            <Link
              key={capability.id}
              href={`/blogs?capability=${capability.id}`}
              className={
                activeCapabilityId === capability.id
                  ? "border border-primary bg-primary px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-primary"
                  : "border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              }
            >
              {capability.name}
            </Link>
          ))}
        </div>

        {blogs.length === 0 ? (
          <p className="font-sans text-body-lg text-on-surface-variant">
            Blogs will appear here once they are published.
          </p>
        ) : filtered.length === 0 ? (
          <p className="font-sans text-body-lg text-on-surface-variant">
            No blogs in this category.
          </p>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-gutter lg:grid-cols-3 lg:pb-8">
            {filtered.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                meta={capabilityNameById[blog.capabilityId] || undefined}
              />
            ))}
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
