import Image from "next/image";
import Link from "next/link";
import { ArrowBackIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { looksLikeHtml } from "@/lib/blog-html";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";
import type { BlogRecord } from "@/lib/blogs-data";
import type { CapabilityRecord } from "@/lib/capabilities-data";

type BlogDetailPageProps = {
  blog: BlogRecord;
  capability: CapabilityRecord | null;
};

function isLocalImagePath(src: string): boolean {
  return Boolean(src) && src.startsWith("/");
}

function formatBlogDate(value: Date | null): string {
  if (!value) return "";
  return value.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogDetailPage({ blog, capability }: BlogDetailPageProps) {
  const storedAsHtml = looksLikeHtml(blog.content);
  const htmlContent = storedAsHtml ? sanitizeBlogHtml(blog.content) : "";
  const paragraphs = storedAsHtml
    ? []
    : blog.content
        .split(/\n+/)
        .map((part) => part.trim())
        .filter(Boolean);

  return (
    <>
      <main className="bg-off-white pt-32">
        <article className="mx-auto max-w-container-max px-margin-mobile pb-24 md:px-margin-desktop md:pb-32">
          <Link
            href={
              capability?.slug
                ? `/capabilities/${capability.slug}`
                : "/capabilities"
            }
            className="mb-10 inline-flex items-center gap-2 font-sans text-label-md uppercase tracking-wider text-primary-container transition-colors hover:text-primary"
          >
            <ArrowBackIcon />
            {capability?.name ? `Back to ${capability.name}` : "All Capabilities"}
          </Link>

          <header className="mx-auto mb-12 max-w-3xl md:mb-16">
            {capability ? (
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-12 bg-primary" />
                <span className="font-sans text-label-md uppercase tracking-wider text-primary">
                  {capability.name}
                </span>
              </div>
            ) : null}
            <h1 className="mb-6 font-serif text-headline-lg-mobile font-bold tracking-[-0.02em] text-primary md:text-display-lg">
              {blog.title}
            </h1>
            {blog.createdAt ? (
              <p className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                {formatBlogDate(blog.createdAt)}
              </p>
            ) : null}
          </header>

          {isLocalImagePath(blog.imageUrl) ? (
            <div className="relative mx-auto mb-12 aspect-[2/1] max-w-4xl overflow-hidden border border-outline-variant/30 bg-surface-container md:mb-16">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          ) : null}

          <div className="mx-auto max-w-3xl">
            {storedAsHtml ? (
              htmlContent ? (
                <div
                  className="blog-prose"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <p className="font-sans text-body-lg text-on-surface-variant">
                  This article has no content yet.
                </p>
              )
            ) : paragraphs.length > 0 ? (
              <div className="space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={`${index}-${paragraph.slice(0, 24)}`}
                    className="font-sans text-body-lg leading-relaxed text-on-surface-variant"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="font-sans text-body-lg text-on-surface-variant">
                This article has no content yet.
              </p>
            )}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
