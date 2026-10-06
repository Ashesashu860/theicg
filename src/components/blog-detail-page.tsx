import Image from "next/image";
import Link from "next/link";
import { ArrowBackIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { looksLikeHtml } from "@/lib/blog-html";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";
import type { BlogRecord } from "@/lib/blogs-data";
import type { CapabilityRecord } from "@/lib/capabilities-data";
import { canDisplayImageUrl } from "@/lib/image-url";

type BlogDetailPageProps = {
  blog: BlogRecord;
  capability: CapabilityRecord | null;
};

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
  let htmlContent = "";
  if (storedAsHtml) {
    try {
      htmlContent = sanitizeBlogHtml(blog.content);
    } catch {
      htmlContent = "";
    }
  }
  const paragraphs = storedAsHtml
    ? []
    : blog.content
        .split(/\n+/)
        .map((part) => part.trim())
        .filter(Boolean);

  return (
    <>
      <main className="pt-32 md:pt-40">
        <article className="mx-auto max-w-container-max px-margin-mobile pb-24 md:px-margin-desktop md:pb-32">
          <Link
            href={
              capability?.slug
                ? `/capabilities/${capability.slug}`
                : "/capabilities"
            }
            className="mb-10 inline-flex items-center gap-2 text-[14px] font-medium text-on-surface-variant transition-colors hover:text-primary"
          >
            <ArrowBackIcon className="h-4 w-4" />
            {capability?.name
              ? `Back to ${capability.name}`
              : "All Capabilities"}
          </Link>

          <header className="mx-auto mb-12 max-w-3xl md:mb-16">
            {capability ? (
              <p className="eyebrow mb-6 text-on-surface-variant">
                {capability.name}
              </p>
            ) : null}
            <h1 className="mb-6 text-[34px] leading-[1.1] tracking-[-0.03em] text-primary md:text-[52px]">
              {blog.title}
            </h1>
            {blog.createdAt ? (
              <p className="border-t border-outline-variant pt-6 text-label-md uppercase text-on-surface-variant">
                {formatBlogDate(blog.createdAt)}
              </p>
            ) : null}
          </header>

          {canDisplayImageUrl(blog.imageUrl) ? (
            <div className="relative mx-auto mb-12 aspect-[2/1] max-w-4xl overflow-hidden bg-surface-container md:mb-16">
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
                <p className="text-body-lg text-on-surface-variant">
                  This article has no content yet.
                </p>
              )
            ) : paragraphs.length > 0 ? (
              <div className="space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={`${index}-${paragraph.slice(0, 24)}`}
                    className="text-body-lg leading-relaxed text-on-surface-variant"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-body-lg text-on-surface-variant">
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
