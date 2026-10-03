import Image from "next/image";
import Link from "next/link";
import { ArrowForwardIcon } from "@/components/icons";
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
      className="card-hover group flex h-full flex-col border border-outline-variant bg-surface-container-lowest"
    >
      {canDisplayImageUrl(blog.imageUrl) ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-container">
          <Image
            src={blog.imageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      <div className="flex flex-grow flex-col p-6 md:p-7">
        {meta ? (
          <span className="mb-3 block text-label-md uppercase text-on-surface-variant">
            {meta}
          </span>
        ) : null}
        <h3 className="mb-3 text-[21px] leading-snug text-primary">
          {blog.title}
        </h3>
        <p className="mb-6 line-clamp-3 flex-grow text-body-md text-on-surface-variant">
          {excerptFromContent(blog.content)}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 border-t border-outline-variant pt-4 text-[14px] font-semibold text-primary">
          Read article
          <ArrowForwardIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
