import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import {
  ArrowForwardIcon,
  BusinessCenterIcon,
  CheckCircleIcon,
  DesignServicesIcon,
  MemoryIcon,
  MonitoringIcon,
} from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const teams = [
  {
    title: "Careers in AI",
    description:
      "Build cutting-edge AI solutions that transform businesses and create meaningful impact.",
    icon: MemoryIcon,
    span: "md:col-span-6 lg:col-span-4",
    featured: false,
  },
  {
    title: "Consulting",
    description:
      "Partner with clients to solve their most challenging problems through thoughtful consultation and strategic guidance. Collaborate with great minds to shape lasting impact.",
    icon: BusinessCenterIcon,
    span: "md:col-span-6 lg:col-span-8",
    featured: false,
    background: "/images/careers-consulting.jpg",
  },
  {
    title: "Data Science",
    description:
      "Uncover innovative insights that create lasting impact for our firm and our clients.",
    icon: MonitoringIcon,
    span: "md:col-span-6 lg:col-span-4",
    featured: false,
  },
  {
    title: "Design Strategy",
    description:
      "Transform ideas into powerful design experiences that solve real problems and elevate user journeys.",
    icon: DesignServicesIcon,
    span: "md:col-span-6 lg:col-span-4",
    featured: false,
  },
];

const culturePoints = [
  "Comprehensive physical and mental wellbeing support.",
  "Continuous learning and aggressive career growth trajectories.",
  "Global mobility and cross-office collaboration opportunities.",
];

export function CareersPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen flex-col bg-off-white pb-section-lg pt-32">
        <section className="mx-auto mb-section-lg max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="animate-fade-up md:col-span-7 md:pr-12">
              <h1 className="mb-6 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-primary md:text-display-lg">
                Beyond Is Where We Begin
              </h1>
              <p className="mb-8 max-w-2xl font-sans text-body-lg text-on-surface-variant">
                At ICG – IITans Consulting Group, you&apos;ll join great minds
                delivering expert consultation, strategic guidance, and
                practical solutions. We invest in your growth, wellbeing, and
                future—empowering you to thrive and help clients make smarter
                decisions with confidence.
              </p>
              <Link
                href="#roles"
                className="hover-btn-primary inline-block bg-primary-container px-8 py-4 font-sans text-label-md uppercase tracking-wider text-pure-white transition-all duration-300"
              >
                Explore Openings
              </Link>
            </div>
            <div
              className="animate-fade-up relative mt-10 h-[500px] md:col-span-5 md:mt-0"
              style={{ animationDelay: "120ms" }}
            >
              <Image
                src="/images/careers-hero.jpg"
                alt="Corporate leaders in a modern glass boardroom overlooking the city"
                fill
                className="border border-outline-variant object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
        </section>

        <section
          id="roles"
          className="mx-auto mb-section-lg max-w-container-max px-margin-mobile md:px-margin-desktop"
        >
          <div className="mb-12">
            <h2 className="mb-4 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
              Find Your Team
            </h2>
            <p className="max-w-3xl font-sans text-body-lg text-on-surface-variant">
              Discover where your skills, passions, and ambitions fit best.
              Explore diverse teams across our organization, learn what drives
              them, and see how their work makes an impact.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
            {teams.map((team) => {
              const Icon = team.icon;
              return (
                <div
                  key={team.title}
                  className={`hover-border-expand group relative flex min-h-[320px] flex-col justify-between overflow-hidden border border-outline-variant bg-pure-white p-8 transition-all duration-300 ${team.span}`}
                >
                  {team.background ? (
                    <div className="absolute inset-0 opacity-10">
                      <Image
                        src={team.background}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="50vw"
                      />
                    </div>
                  ) : null}
                  <div className="relative z-10">
                    <Icon className="mb-4 text-primary-container" />
                    <h3 className="mb-3 font-serif text-headline-md text-primary">
                      {team.title}
                    </h3>
                    <p
                      className={
                        team.background
                          ? "max-w-lg font-sans text-body-md text-on-surface-variant"
                          : "font-sans text-body-md text-on-surface-variant"
                      }
                    >
                      {team.description}
                    </p>
                  </div>
                  <Link
                    href="#connect"
                    className="relative z-10 mt-6 flex items-center gap-2 font-sans text-label-md uppercase text-primary-container transition-colors group-hover:text-secondary"
                  >
                    Learn More <ArrowForwardIcon className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}

            <div className="col-span-1 flex min-h-[320px] flex-col justify-between border border-primary bg-primary p-8 text-pure-white md:col-span-12 lg:col-span-4">
              <div>
                <h3 className="mb-3 font-serif text-headline-md">
                  Early Careers &amp; Internships
                </h3>
                <p className="font-sans text-body-md text-surface-variant opacity-90">
                  Kickstart your journey with structured learning, dedicated
                  mentorship, and the chance to make an impact from your very
                  first day.
                </p>
              </div>
              <Link
                href="#connect"
                className="mt-6 flex items-center gap-2 font-sans text-label-md uppercase text-secondary-fixed transition-colors hover:text-pure-white"
              >
                Explore Paths <ArrowForwardIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-section-lg overflow-hidden">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
              <div className="flex flex-col justify-center md:col-span-4">
                <h2 className="mb-6 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
                  Award Winning Culture
                </h2>
                <ul className="space-y-4 border-t border-outline-variant pt-4 font-sans text-body-md text-on-surface-variant">
                  {culturePoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 border-b border-outline-variant pb-4"
                    >
                      <CheckCircleIcon className="mt-1 shrink-0 text-secondary-fixed-dim" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative mt-10 h-[600px] border border-outline-variant md:col-span-7 md:col-start-6 md:mt-0">
                <Image
                  src="/images/careers-culture.jpg"
                  alt="Diverse professionals collaborating in a modern office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="connect"
          className="mx-auto mb-section-sm max-w-container-max px-margin-mobile md:px-margin-desktop"
        >
          <div className="mx-auto max-w-4xl border border-outline-variant bg-pure-white p-8 md:p-16">
            <div className="mb-10 text-center">
              <h2 className="mb-3 font-serif text-headline-md text-primary">
                Connect With Us
              </h2>
              <p className="font-sans text-body-md text-on-surface-variant">
                Register your interest to stay informed about upcoming
                opportunities and firm news.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
