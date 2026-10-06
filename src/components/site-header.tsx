"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { IcgLogo } from "@/components/icg-logo";
import { UserAvatar } from "@/components/user-avatar";
import { signOutUser } from "@/lib/auth-client";
import { CloseIcon, MenuIcon } from "./icons";

const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/purpose", label: "Purpose" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/blogs", label: "Blogs" },
  { href: "/careers", label: "Careers" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const accountRef = useRef<HTMLDivElement>(null);

  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setOpen(false);
    setAccountOpen(false);
  }

  useEffect(() => {
    if (!accountOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  async function logout() {
    setAccountOpen(false);
    setOpen(false);
    await signOutUser();
    router.replace("/admin");
    router.refresh();
  }

  const displayName = user?.displayName?.trim() || user?.email || "Account";
  const links = user
    ? [...navLinks, { href: "/portal/requests", label: "Portal" }]
    : navLinks;

  function isNavActive(href: string) {
    return href.startsWith("/portal")
      ? pathname.startsWith("/portal")
      : pathname === href;
  }

  const accountMenu = user ? (
    <div className="relative" ref={accountRef}>
      <button
        type="button"
        className="rounded-full transition-opacity hover:opacity-90"
        aria-expanded={accountOpen}
        aria-haspopup="menu"
        aria-label="Account menu"
        onClick={() => setAccountOpen((value) => !value)}
      >
        <UserAvatar
          name={user.displayName}
          email={user.email}
          photoURL={user.photoURL}
          size={40}
        />
      </button>

      {accountOpen ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 min-w-56 border border-outline-variant bg-surface-container-lowest py-2 shadow-[0_12px_32px_-12px_rgb(11_27_51/0.25)]"
        >
          <div className="border-b border-outline-variant px-4 py-2">
            <p className="truncate font-sans text-sm font-semibold text-primary">
              {displayName}
            </p>
            {user.email ? (
              <p className="truncate font-sans text-xs text-on-surface-variant">
                {user.email}
              </p>
            ) : null}
          </div>
          <Link
            href="/portal/requests"
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left text-[14px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            onClick={() => setAccountOpen(false)}
          >
            Portal
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left text-[14px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-cream">
      <div className="mx-auto flex h-20 max-w-container-max items-center justify-between gap-6 px-margin-mobile md:px-margin-desktop">
        <Link
          href="/"
          className="flex items-center gap-3 text-primary"
          aria-label="ICG – IITians Consulting Group, home"
        >
          <IcgLogo variant="mark" className="h-8 w-8" />
          <span className="flex flex-col leading-none">
            <span className="text-[20px] font-bold tracking-[-0.03em]">
              ICG
            </span>
            <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-on-surface-variant sm:block">
              IITians Consulting Group
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((link) => {
            const active = isNavActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-[14px] font-medium transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:bg-navy after:transition-transform after:duration-300 hover:text-primary ${
                  active
                    ? "text-primary after:scale-x-100"
                    : "text-on-surface-variant after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/careers#connect"
            className="btn btn-primary hidden min-h-0 px-5 py-3 lg:inline-flex"
          >
            Contact Us
          </Link>
          <button
            type="button"
            className="p-1 text-primary lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
          {!loading && user ? accountMenu : null}
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-outline-variant bg-cream px-margin-mobile pb-8 pt-2 lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((link) => {
              const active = isNavActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b border-outline-variant py-4 text-[17px] font-medium ${
                    active ? "text-primary" : "text-on-surface-variant"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/careers#connect"
              className="btn btn-primary mt-6 w-full"
              onClick={() => setOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
