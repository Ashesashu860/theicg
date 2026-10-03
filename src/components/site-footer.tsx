import Link from "next/link";
import { IcgLogo } from "@/components/icg-logo";

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/purpose", label: "Purpose" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/blogs", label: "Blogs" },
  { href: "/careers", label: "Careers" },
] as const;

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-cream/10 bg-navy text-on-primary-container">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-cream"
            >
              <IcgLogo variant="mark" className="h-9 w-9" />
              <span className="flex flex-col leading-none">
                <span className="text-[22px] font-bold tracking-[-0.03em]">
                  ICG
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-on-primary-container">
                  IITians Consulting Group
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-body-md">
              Built on knowledge, collaboration, and strategic thinking to help
              clients make smarter decisions.
            </p>
            <p className="mt-6 text-[15px] font-medium text-cream">
              Great minds. Better perspectives. Smarter decisions.
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <h2 className="mb-5 text-label-md uppercase text-cream">Company</h2>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-md transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="mb-5 text-label-md uppercase text-cream">
              Work with us
            </h2>
            <p className="mb-6 max-w-xs text-body-md">
              Tell us about your challenge and the right specialists will be in
              touch.
            </p>
            <Link href="/careers#connect" className="btn btn-light">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-cream/10 py-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ICG – IITians Consulting Group. All
            rights reserved.
          </p>
          <Link
            href="/admin"
            className="text-on-primary-container/70 transition-colors hover:text-cream"
          >
            Staff sign-in
          </Link>
        </div>
      </div>
    </footer>
  );
}
