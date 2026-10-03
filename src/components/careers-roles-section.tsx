"use client";

import { useMemo, useState } from "react";
import { CareerRoleDetailModal } from "@/components/career-role-detail-modal";
import { ArrowForwardIcon, SearchIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
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
      className="mx-auto w-full max-w-container-max scroll-mt-20 px-margin-mobile pb-section-sm md:px-margin-desktop md:pb-section-lg"
    >
      <SectionHeading
        eyebrow="Join us"
        title="Open Roles"
        lead="Explore current openings across ICG. Search by role, category, or keywords to find where you fit best."
        className="mb-10"
      />

      <label className="relative mb-10 block max-w-xl">
        <span className="sr-only">Search open roles</span>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search roles…"
          className="w-full border border-outline-variant bg-surface-container-lowest py-3 pl-12 pr-4 text-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:border-navy"
        />
      </label>

      {roles.length === 0 ? (
        <p className="border border-outline-variant bg-surface-container-lowest p-8 text-body-md text-on-surface-variant">
          No open roles at the moment. Register your interest below to stay
          informed about upcoming opportunities.
        </p>
      ) : filtered.length === 0 ? (
        <p className="border border-outline-variant bg-surface-container-lowest p-8 text-body-md text-on-surface-variant">
          No roles match “{query.trim()}”. Try a different search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((role) => {
            const categoryName =
              categoryNameById.get(role.categoryId) || "General";

            return (
              <button
                key={role.id}
                type="button"
                aria-haspopup="dialog"
                onClick={() => setSelectedRole(role)}
                className="card-hover group flex min-h-[280px] cursor-pointer flex-col justify-between border border-outline-variant bg-surface-container-lowest p-8 text-left"
              >
                <div>
                  <p className="mb-4 text-label-md uppercase text-on-surface-variant">
                    {categoryName}
                  </p>
                  <h3 className="mb-3 text-[22px] leading-tight text-primary">
                    {role.title}
                  </h3>
                  <p className="line-clamp-4 text-body-md text-on-surface-variant">
                    {role.description}
                  </p>
                </div>
                <span className="mt-6 flex items-center gap-2 text-[14px] font-semibold text-primary">
                  View details{" "}
                  <ArrowForwardIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
