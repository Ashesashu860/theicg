import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-primary-fixed/20 bg-primary">
      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-gutter px-margin-mobile py-20 md:grid-cols-4 md:px-margin-desktop">
        <div className="mb-8 md:mb-0">
          <div className="mb-4 font-serif text-headline-lg text-pure-white">
            ICG
          </div>
          <p className="mb-6 max-w-xs font-sans text-body-md text-on-primary-container">
            ICG – IITans Consulting Group. Built on knowledge, collaboration,
            and strategic thinking to help clients make smarter decisions.
          </p>
          <div className="text-sm text-on-primary-container">
            © {new Date().getFullYear()} ICG.
            <br />
            All rights reserved.
          </div>
        </div>

        <div>
          <h4 className="mb-6 font-sans text-label-md uppercase tracking-widest text-pure-white">
            Company
          </h4>
          <ul className="space-y-4">
            <li>
              <Link
                href="/about"
                className="font-sans text-body-md text-on-primary-container opacity-80 transition-all hover:text-secondary-fixed hover:opacity-100"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/careers"
                className="font-sans text-body-md text-on-primary-container opacity-80 transition-all hover:text-secondary-fixed hover:opacity-100"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="/careers#connect"
                className="font-sans text-body-md text-on-primary-container opacity-80 transition-all hover:text-secondary-fixed hover:opacity-100"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 font-sans text-label-md uppercase tracking-widest text-pure-white">
            Legal
          </h4>
          <ul className="space-y-4">
            {["Privacy Policy", "Terms of Service", "Cookie Preferences"].map(
              (item) => (
                <li key={item}>
                  <span className="font-sans text-body-md text-on-primary-container opacity-80">
                    {item}
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h4 className="mb-6 font-sans text-label-md uppercase tracking-widest text-pure-white">
            Tagline
          </h4>
          <p className="font-sans text-body-md text-on-primary-container opacity-80">
            Great minds. Better perspectives. Smarter decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
