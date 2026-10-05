import Image from "next/image";
import Link from "next/link";
import { ArrowForwardIcon } from "@/components/icons";
import {
  excerptFromContent,
  resolvePublicBlogSlug,
  type BlogRecord,
} from "@/lib/blogs-data";
import { canDisplayImageUrl } from "@/lib/image-url";

type FeaturedInsightsProps = {
  /** Newest first; the first is featured, the next two are listed beneath it. */
  blogs: BlogRecord[];
};

/** Lead article large, followed by smaller items, like a consulting firm's featured insights. */
export function FeaturedInsights({ blogs }: FeaturedInsightsProps) {
  const [featured, ...rest] = blogs;
  if (!featured) return null;
  const secondary = rest.slice(0, 2);
  const featuredHasImage = canDisplayImageUrl(featured.imageUrl);

  return (
    <div>
      <Link
        href={`/blogs/${resolvePublicBlogSlug(featured)}`}
        className="group grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12"
      >
        {featuredHasImage ? (
          <div className="relative aspect-[16/10] overflow-hidden bg-surface-container md:col-span-7">
            <Image
              src={featured.imageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        ) : null}
        <div className={featuredHasImage ? "md:col-span-5" : "md:col-span-8"}>
          <h3 className="mb-4 text-[26px] leading-[1.2] tracking-[-0.02em] text-primary underline-offset-4 group-hover:underline md:text-[34px]">
            {featured.title}
          </h3>
          <p className="mb-8 line-clamp-4 text-body-lg text-on-surface-variant">
            {excerptFromContent(featured.content)}
          </p>
          <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary">
            Read article
            <ArrowForwardIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      {secondary.length > 0 ? (
        <ul className="mt-12 grid grid-cols-1 gap-x-12 border-t border-outline-variant md:mt-16 md:grid-cols-2">
          {secondary.map((blog) => (
            <li
              key={blog.id}
              className="border-b border-outline-variant md:border-b-0"
            >
              <Link
                href={`/blogs/${resolvePublicBlogSlug(blog)}`}
                className="group flex gap-5 py-8"
              >
                {canDisplayImageUrl(blog.imageUrl) ? (
                  <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden bg-surface-container sm:w-40">
                    <Image
                      src={blog.imageUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="160px"
                    />
                  </div>
                ) : null}
                <div className="min-w-0">
                  <h3 className="mb-2 text-[18px] leading-snug text-primary underline-offset-4 group-hover:underline md:text-[20px]">
                    {blog.title}
                  </h3>
                  <p className="line-clamp-2 text-body-md text-on-surface-variant">
                    {excerptFromContent(blog.content)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
