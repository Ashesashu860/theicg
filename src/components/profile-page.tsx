"use client";

import { useAuth } from "@/components/auth-provider";
import { UserAvatar } from "@/components/user-avatar";
import {
  CheckCircleIcon,
  LanguageIcon,
  MailIcon,
  PhoneIcon,
} from "./icons";

const competencies = [
  {
    title: "Strategic Advisory",
    items: [
      "Market Entry Strategy",
      "Mergers & Acquisitions",
      "Competitive Positioning",
    ],
    featured: false,
  },
  {
    title: "AI Integration",
    description:
      "Developing frameworks for ethical and effective deployment of machine learning models in legacy systems.",
    items: ["Predictive Analytics", "Process Automation", "Data Governance"],
    featured: true,
  },
  {
    title: "Change Management",
    items: [
      "Organizational Design",
      "Stakeholder Alignment",
      "Culture Transformation",
    ],
    featured: false,
  },
];

export function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-container-max px-margin-mobile py-margin-desktop md:px-margin-desktop">
        <p className="font-sans text-body-md text-on-surface-variant">
          Loading profile…
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-container-max px-margin-mobile py-margin-desktop md:px-margin-desktop">
        <p className="font-sans text-body-md text-on-surface-variant">
          Sign in to view your profile.
        </p>
      </div>
    );
  }

  const displayName = user.displayName?.trim() || "Consultant";
  const email = user.email || "No email on file";
  const provider =
    user.providerData.find((entry) => entry.providerId === "google.com")
      ?.providerId === "google.com"
      ? "Google"
      : user.providerData[0]?.providerId || "Google";
  const verified = user.emailVerified;

  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-margin-desktop md:px-margin-desktop">
      <section className="mb-[120px] grid grid-cols-12 gap-gutter">
        <div className="group relative col-span-12 flex flex-col justify-between overflow-hidden border border-outline-variant bg-pure-white p-8 transition-colors duration-300 hover:border-primary md:col-span-5">
          <div className="pointer-events-none absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative z-10 mb-8 flex items-start gap-6">
            <UserAvatar
              name={user.displayName}
              email={user.email}
              photoURL={user.photoURL}
              size={96}
              className="border-2 border-primary"
              priority
            />
            <div>
              <h2 className="mb-2 text-headline-lg-mobile text-primary md:text-headline-lg">
                {displayName}
              </h2>
              <p className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                Consultant Portal Member
              </p>
              <p className="mt-2 font-sans text-body-md text-on-surface-variant">
                Signed in with {provider}
                {verified ? " · Verified email" : ""}
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-auto border-t border-outline-variant pt-6">
            <div className="flex flex-wrap items-center gap-4">
              {user.email ? (
                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center gap-2 text-primary transition-colors hover:text-secondary"
                >
                  <MailIcon />
                  <span className="font-sans text-body-md">{email}</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-primary">
                  <MailIcon />
                </span>
              )}
              <span className="text-primary/40">
                <PhoneIcon />
              </span>
              <span className="text-primary/40">
                <LanguageIcon />
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-12 border border-outline-variant bg-pure-white p-8 transition-colors duration-300 hover:border-primary md:col-span-7">
          <h3 className="mb-6 font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
            Account Overview
          </h3>
          <p className="font-sans text-body-lg leading-relaxed text-on-surface">
            Welcome, {displayName}. Your consultant portal profile is linked to
            your Google account
            {user.email ? (
              <>
                {" "}
                (<span className="font-semibold">{user.email}</span>)
              </>
            ) : null}
            .
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="mb-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                Display Name
              </dt>
              <dd className="font-sans text-body-md text-on-surface">
                {displayName}
              </dd>
            </div>
            <div>
              <dt className="mb-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                Email
              </dt>
              <dd className="font-sans text-body-md text-on-surface">{email}</dd>
            </div>
            <div>
              <dt className="mb-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                Provider
              </dt>
              <dd className="font-sans text-body-md text-on-surface">{provider}</dd>
            </div>
            <div>
              <dt className="mb-2 font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
                Email Status
              </dt>
              <dd className="font-sans text-body-md text-on-surface">
                {verified ? "Verified" : "Unverified"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mb-[120px]">
        <div className="mb-12 flex items-center justify-between border-b-2 border-primary pb-4">
          <h3 className="text-headline-md text-primary">
            Core Competencies
          </h3>
          <span className="font-sans text-label-md uppercase tracking-widest text-on-surface-variant">
            Expertise Map
          </span>
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          {competencies.map((area) =>
            area.featured ? (
              <div
                key={area.title}
                className="group relative col-span-12 overflow-hidden bg-primary p-6 text-on-primary md:col-span-4 md:row-span-2"
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-6 h-1 w-12 bg-secondary-fixed" />
                  <h4 className="mb-4 text-[24px] font-bold leading-tight text-off-white">
                    {area.title}
                  </h4>
                  <p className="mb-6 font-sans text-body-md text-off-white/80">
                    {area.description}
                  </p>
                  <ul className="mt-auto space-y-3 font-sans text-body-md text-off-white/90">
                    {area.items.map((item, index) => (
                      <li
                        key={item}
                        className={
                          index < area.items.length - 1
                            ? "flex items-start gap-2 border-b border-on-primary/20 pb-2"
                            : "flex items-start gap-2"
                        }
                      >
                        <CheckCircleIcon className="mt-1 shrink-0 text-secondary-fixed" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div
                key={area.title}
                className="group col-span-12 border border-outline-variant bg-pure-white p-6 transition-colors duration-300 hover:border-primary md:col-span-4"
              >
                <div className="mb-6 h-1 w-12 bg-primary transition-colors group-hover:bg-secondary-fixed" />
                <h4 className="mb-4 text-[24px] font-bold leading-tight text-primary">
                  {area.title}
                </h4>
                <ul className="space-y-3 font-sans text-body-md text-on-surface-variant">
                  {area.items.map((item, index) => (
                    <li
                      key={item}
                      className={
                        index < area.items.length - 1
                          ? "flex items-start gap-2 border-b border-outline-variant/30 pb-2"
                          : "flex items-start gap-2"
                      }
                    >
                      <CheckCircleIcon className="mt-1 shrink-0 text-secondary-fixed" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
