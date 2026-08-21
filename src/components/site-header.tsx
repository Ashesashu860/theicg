"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { UserAvatar } from "@/components/user-avatar";
import { signOutUser } from "@/lib/auth-client";
import { CloseIcon, MenuIcon } from "./icons";

const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/careers", label: "Careers" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [pathname]);

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
    router.replace("/login");
    router.refresh();
  }

  const displayName = user?.displayName?.trim() || user?.email || "Account";

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
          className="absolute right-0 mt-2 min-w-48 border border-outline-variant bg-surface py-2 shadow-sm"
        >
          <div className="border-b border-outline-variant/30 px-4 py-2">
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
            href="/portal/profile"
            role="menuitem"
            className="block px-4 py-2.5 font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            onClick={() => setAccountOpen(false)}
          >
            My Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="ICG"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className="hidden font-serif text-headline-md font-bold tracking-tighter text-primary md:block">
            ICG
          </span>
        </Link>

        <nav className="hidden gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "border-b-2 border-secondary pb-1 font-sans text-label-md font-bold uppercase tracking-widest text-secondary transition-colors duration-300 hover:text-primary"
                    : "font-sans text-label-md uppercase tracking-widest text-on-surface-variant transition-colors duration-300 hover:text-primary"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/careers#connect"
            className="hidden items-center justify-center border border-primary px-6 py-2 font-sans text-label-md uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-pure-white md:inline-flex"
          >
            Contact Us
          </Link>
          <button
            type="button"
            className="text-primary md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
          {!loading && !user ? (
            <Link
              href="/login"
              className="inline-flex items-center justify-center border-b-4 border-transparent bg-primary-container px-4 py-2 font-sans text-label-md uppercase tracking-widest text-pure-white transition-all hover:border-secondary-fixed hover:bg-primary md:px-6"
            >
              Portal Login
            </Link>
          ) : null}
          {!loading && user ? accountMenu : null}
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-outline-variant/30 bg-surface px-margin-mobile py-6 md:hidden"
        >
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    active
                      ? "font-sans text-label-md font-bold uppercase tracking-widest text-secondary"
                      : "font-sans text-label-md uppercase tracking-widest text-on-surface-variant"
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/careers#connect"
              className="inline-flex w-fit items-center justify-center border border-primary px-6 py-3 font-sans text-label-md uppercase tracking-widest text-primary"
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
