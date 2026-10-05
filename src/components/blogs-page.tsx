import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import type { BlogRecord } from "@/lib/blogs-data";
import type { CapabilityRecord } from "@/lib/capabilities-data";
import { SITE_IMAGES } from "@/lib/site-images";

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
          imageSrc={SITE_IMAGES.blogsHero}
          eyebrow="Perspectives"
          title="Blogs"
          lead="Insights on knowledge, strategy, and smarter decisions across our capability areas."
        />

        <div className="mx-auto max-w-container-max px-margin-mobile py-section-sm md:px-margin-desktop">
          <nav
            className="-mx-margin-mobile mb-10 flex gap-2 overflow-x-auto px-margin-mobile pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
            aria-label="Filter by capability"
          >
            <Link
              href="/blogs"
              className={
                activeCapabilityId === null
                  ? "shrink-0 whitespace-nowrap border border-navy bg-navy px-4 py-2 text-[14px] font-medium text-cream"
                  : "shrink-0 whitespace-nowrap border border-outline-variant bg-surface-container-lowest px-4 py-2 text-[14px] font-medium text-on-surface-variant transition-colors hover:border-navy hover:text-primary"
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
                    ? "shrink-0 whitespace-nowrap border border-navy bg-navy px-4 py-2 text-[14px] font-medium text-cream"
                    : "shrink-0 whitespace-nowrap border border-outline-variant bg-surface-container-lowest px-4 py-2 text-[14px] font-medium text-on-surface-variant transition-colors hover:border-navy hover:text-primary"
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
