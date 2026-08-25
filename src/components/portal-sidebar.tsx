"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { UserAvatar } from "@/components/user-avatar";
import { signOutUser } from "@/lib/auth-client";
import {
  AccountCircleIcon,
  AnalyticsIcon,
  AssignmentIcon,
  BusinessCenterIcon,
  CloseIcon,
  GroupsIcon,
  LightbulbIcon,
  LogoutIcon,
  MenuIcon,
} from "./icons";

const navItems = [
  {
    href: "/portal/requests",
    label: "Client Requests",
    icon: AssignmentIcon,
  },
  {
    href: "/portal/capabilities",
    label: "Capabilities",
    icon: BusinessCenterIcon,
  },
  {
    href: "/portal/blogs",
    label: "Blogs",
    icon: LightbulbIcon,
  },
  {
    href: "#",
    label: "Project Pipeline",
    icon: AnalyticsIcon,
    disabled: true,
  },
  {
    href: "#",
    label: "Expert Network",
    icon: GroupsIcon,
    disabled: true,
  },
  {
    href: "/portal/profile",
    label: "Profile Settings",
    icon: AccountCircleIcon,
  },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const displayName = user?.displayName?.trim() || user?.email || "Consultant";

  async function logout() {
    await signOutUser();
    router.replace("/admin");
    router.refresh();
  }

  const nav = (
    <>
      <div className="mb-8 mt-4 border-b border-outline-variant/30 px-6 pb-6">
        <h1 className="font-serif text-headline-md font-bold text-primary">
          Consultant Portal
        </h1>
        <p className="mt-1 font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
          Strategic Advisory Division
        </p>
      </div>

      <ul className="flex flex-1 flex-col gap-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href !== "#" && pathname.startsWith(item.href);
          const className = active
            ? "flex translate-x-1 items-center gap-3 border-r-4 border-secondary bg-secondary-container/30 px-4 py-3 font-sans text-label-md font-bold uppercase tracking-widest text-primary transition-transform"
            : "flex items-center gap-3 px-4 py-3 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary";

          if (item.disabled) {
            return (
              <li key={item.label}>
                <span className={`${className} cursor-not-allowed opacity-50`}>
                  <Icon />
                  {item.label}
                </span>
              </li>
            );
          }

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={className}
                onClick={() => setOpen(false)}
              >
                <Icon />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-outline-variant/30 p-6">
        <div className="mb-4 flex items-center gap-4">
          <UserAvatar
            name={user?.displayName}
            email={user?.email}
            photoURL={user?.photoURL}
            size={40}
          />
          <div className="min-w-0">
            <p className="truncate font-sans text-label-md text-primary">
              {displayName}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {user?.email || "Portal member"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 border border-outline-variant px-4 py-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
        >
          <LogoutIcon />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-24 z-40 bg-pure-white p-2 text-primary shadow-sm md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <aside className="fixed left-0 top-20 z-40 hidden h-[calc(100vh-5rem)] w-64 flex-col border-r border-outline-variant bg-surface-container-lowest py-2 md:flex">
        {nav}
      </aside>

      {open ? (
        <div className="fixed inset-0 top-20 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-primary/40"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
          <aside className="relative z-10 flex h-full w-72 flex-col bg-surface-container-lowest py-2">
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}
