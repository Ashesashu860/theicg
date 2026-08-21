"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";

const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/careers", label: "Careers" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="THE ICG"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className="hidden font-serif text-headline-md font-bold tracking-tighter text-primary md:block">
            THE ICG
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
            href="/login"
            className="hidden items-center justify-center border-b-4 border-transparent bg-primary-container px-6 py-2 font-sans text-label-md uppercase tracking-widest text-pure-white transition-all hover:border-secondary-fixed hover:bg-primary md:inline-flex"
          >
            Portal Login
          </Link>
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
              href="/login"
              className="mt-2 inline-flex w-fit items-center justify-center bg-primary-container px-6 py-3 font-sans text-label-md uppercase tracking-widest text-pure-white"
              onClick={() => setOpen(false)}
            >
              Portal Login
            </Link>
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
