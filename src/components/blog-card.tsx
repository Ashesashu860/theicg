import Image from "next/image";
import Link from "next/link";
import { ArrowOutwardIcon } from "@/components/icons";
import {
  excerptFromContent,
  resolvePublicBlogSlug,
  type BlogRecord,
} from "@/lib/blogs-data";
import { canDisplayImageUrl } from "@/lib/image-url";

type BlogCardProps = {
  blog: BlogRecord;
  /** Optional label above the title (date, category name, etc.). */
  meta?: string;
};

export function BlogCard({ blog, meta }: BlogCardProps) {
  const slug = resolvePublicBlogSlug(blog);

  return (
    <Link
      href={`/blogs/${slug}`}
      className="group flex h-full flex-col border border-outline-variant bg-pure-white transition-all duration-300 hover:border-primary-container"
    >
      {canDisplayImageUrl(blog.imageUrl) ? (
        <div className="relative h-48 overflow-hidden bg-surface-container">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      <div className="flex flex-grow flex-col p-6">
        {meta ? (
          <span className="mb-3 block font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
            {meta}
          </span>
        ) : null}
        <h3 className="mb-4 font-serif text-headline-md text-primary transition-colors group-hover:text-primary-container">
          {blog.title}
        </h3>
        <p className="mb-6 line-clamp-3 flex-grow font-sans text-body-md text-on-surface-variant">
          {excerptFromContent(blog.content)}
        </p>
        <div className="flex items-center justify-between border-t border-outline-variant/50 pt-4">
          <span className="font-sans text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
            Read Article
          </span>
          <ArrowOutwardIcon className="text-primary" />
        </div>
      </div>
    </Link>
  );
}
