"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowForwardIcon, SearchIcon } from "@/components/icons";
import type {
  CareerCategoryRecord,
  CareerRoleRecord,
} from "@/lib/careers-data";

type CareersRolesSectionProps = {
  roles: CareerRoleRecord[];
  categories: CareerCategoryRecord[];
};

export function CareersRolesSection({
  roles,
  categories,
}: CareersRolesSectionProps) {
  const [query, setQuery] = useState("");

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) {
      map.set(category.id, category.name);
    }
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return roles;
    }

    return roles.filter((role) => {
      const categoryName = categoryNameById.get(role.categoryId) || "";
      return (
        role.title.toLowerCase().includes(needle) ||
        role.description.toLowerCase().includes(needle) ||
        categoryName.toLowerCase().includes(needle)
      );
    });
  }, [roles, query, categoryNameById]);

  return (
    <section
      id="roles"
      className="mx-auto mb-section-lg max-w-container-max px-margin-mobile md:px-margin-desktop"
    >
      <div className="mb-12">
        <h2 className="mb-4 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
          Open Roles
        </h2>
        <p className="max-w-3xl font-sans text-body-lg text-on-surface-variant">
          Explore current openings across ICG. Search by role, category, or
          keywords to find where you fit best.
        </p>
      </div>

      <label className="relative mb-10 block max-w-xl">
        <span className="sr-only">Search open roles</span>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search roles…"
          className="w-full border border-outline-variant bg-pure-white py-3 pl-12 pr-4 font-sans text-body-md text-on-surface outline-none transition-colors focus:border-primary"
        />
      </label>

      {roles.length === 0 ? (
        <p className="border border-outline-variant bg-pure-white p-8 font-sans text-body-md text-on-surface-variant">
          No open roles at the moment. Register your interest below to stay
          informed about upcoming opportunities.
        </p>
      ) : filtered.length === 0 ? (
        <p className="border border-outline-variant bg-pure-white p-8 font-sans text-body-md text-on-surface-variant">
          No roles match “{query.trim()}”. Try a different search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((role) => {
            const categoryName =
              categoryNameById.get(role.categoryId) || "General";

            return (
              <article
                key={role.id}
                className="hover-border-expand group flex min-h-[280px] flex-col justify-between border border-outline-variant bg-pure-white p-8 transition-all duration-300"
              >
                <div>
                  <p className="mb-3 font-sans text-label-md uppercase tracking-widest text-primary-container">
                    {categoryName}
                  </p>
                  <h3 className="mb-3 font-serif text-headline-md text-primary">
                    {role.title}
                  </h3>
                  <p className="line-clamp-4 font-sans text-body-md text-on-surface-variant">
                    {role.description}
                  </p>
                </div>
                <Link
                  href="#connect"
                  className="mt-6 flex items-center gap-2 font-sans text-label-md uppercase text-primary-container transition-colors group-hover:text-secondary"
                >
                  Register Interest <ArrowForwardIcon className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
