export type EditorialItem = {
  key: string;
  number: string;
  title: string;
  text: string;
};

type EditorialListProps = {
  items: readonly EditorialItem[];
  /** Columns on desktop; always one column on mobile. */
  columns?: 2 | 3;
};

/** Numbered list with a thin navy rule above each item, in the style of consulting-firm editorial pages. */
export function EditorialList({ items, columns = 3 }: EditorialListProps) {
  return (
    <ol
      className={`grid grid-cols-1 gap-x-12 gap-y-14 md:gap-y-20 ${
        columns === 3
          ? "md:grid-cols-3 lg:gap-x-16"
          : "md:grid-cols-2 lg:gap-x-24"
      }`}
    >
      {items.map((item) => (
        <li key={item.key} className="border-t border-navy pt-6 md:pt-8">
          <span
            className="block text-[48px] font-extralight leading-none tracking-[-0.04em] text-primary md:text-[64px]"
            aria-hidden="true"
          >
            {item.number}
          </span>
          <h3 className="mb-3 mt-8 text-[22px] leading-snug text-primary md:mt-10 md:text-[24px]">
            {item.title}
          </h3>
          <p
            className={`text-body-md text-on-surface-variant ${
              columns === 3 ? "max-w-md" : "max-w-xl"
            }`}
          >
            {item.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
