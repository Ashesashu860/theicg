"use client";

import { useMemo, useState } from "react";
import { CareerRoleDetailModal } from "@/components/career-role-detail-modal";
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
  const [selectedRole, setSelectedRole] = useState<CareerRoleRecord | null>(
    null,
  );

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
      id="open-roles"
      className="mx-auto max-w-container-max px-margin-mobile pb-section-sm md:px-margin-desktop md:pb-section-lg"
    >
      <div className="mb-12 text-center">
        <h2 className="mb-4 font-serif text-headline-lg-mobile text-primary md:text-headline-md">
          Open Roles
        </h2>
        <p className="mx-auto max-w-3xl font-sans text-body-lg text-on-surface-variant">
          Explore current openings across ICG. Search by role, category, or
          keywords to find where you fit best.
        </p>
      </div>

      <label className="relative mx-auto mb-10 block max-w-xl">
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
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((role) => {
            const categoryName =
              categoryNameById.get(role.categoryId) || "General";

            return (
              <button
                key={role.id}
                type="button"
                aria-haspopup="dialog"
                onClick={() => setSelectedRole(role)}
                className="ghost-border group flex min-h-[280px] cursor-pointer flex-col justify-between bg-pure-white p-8 text-left transition-colors duration-300 hover:bg-surface-container-lowest"
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
                <span className="mt-6 flex items-center gap-2 font-sans text-label-md uppercase text-primary-container transition-colors group-hover:text-secondary">
                  View details <ArrowForwardIcon className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {selectedRole ? (
        <CareerRoleDetailModal
          role={selectedRole}
          categoryName={
            categoryNameById.get(selectedRole.categoryId) || "General"
          }
          onClose={() => setSelectedRole(null)}
        />
      ) : null}
    </section>
  );
}
