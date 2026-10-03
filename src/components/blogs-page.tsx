import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { PageHero } from "@/components/page-hero";
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
      <main className="flex-grow">
        <PageHero
          tone="cream"
          eyebrow="Perspectives"
          title="Blogs"
          lead="Insights on knowledge, strategy, and smarter decisions across our capability areas."
        />

        <div className="mx-auto max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop">
          <nav
            className="mb-10 flex flex-wrap gap-2"
            aria-label="Filter by capability"
          >
            <Link
              href="/blogs"
              className={
                activeCapabilityId === null
                  ? "border border-navy bg-navy px-4 py-2 text-[14px] font-medium text-cream"
                  : "border border-outline-variant bg-surface-container-lowest px-4 py-2 text-[14px] font-medium text-on-surface-variant transition-colors hover:border-navy hover:text-primary"
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
                    ? "border border-navy bg-navy px-4 py-2 text-[14px] font-medium text-cream"
                    : "border border-outline-variant bg-surface-container-lowest px-4 py-2 text-[14px] font-medium text-on-surface-variant transition-colors hover:border-navy hover:text-primary"
                }
              >
                {capability.name}
              </Link>
            ))}
          </nav>

          {blogs.length === 0 ? (
            <p className="text-body-lg text-on-surface-variant">
              Blogs will appear here once they are published.
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-body-lg text-on-surface-variant">
              No blogs in this category.
            </p>
          ) : (
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  meta={capabilityNameById[blog.capabilityId] || undefined}
                />
              ))}
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
