"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowForwardIcon, ExpandMoreIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";

const featuredStories = [
  {
    category: "Operational Excellence",
    title: "Transforming Global Aviation Hubs",
    description:
      "ICG worked with a leading global airline on an ambitious transformation across personnel, leadership, and technology, delivering operational excellence and setting a new standard for hub efficiency.",
    metric: "15-year",
    metricLabel: "Best Performance Achieved",
    span: "md:col-span-8",
    featured: true,
    dark: false,
  },
  {
    category: "Applied AI",
    title: "Scaling GenAI Across Global Operations",
    description:
      "Turned AI into a scalable capability for a major pharma distributor—optimizing costs and strengthening supply chain resilience.",
    metric: "29",
    metricLabel: "Countries Improved",
    span: "md:col-span-4",
    featured: false,
    dark: false,
  },
  {
    category: "Innovation",
    title: "Reinventing Marketing with AI for Consumer Goods",
    description:
      "Implemented a robust GenAI platform for a global consumer leader, drastically improving innovation-to-launch effectiveness while freeing capacity.",
    metric: "60%",
    metricLabel: "Efficiency Increase",
    span: "md:col-span-6",
    featured: false,
    dark: false,
  },
  {
    category: "Operations",
    title: "Optimizing Complex Scheduling",
    description:
      "Supported a global mining leader's deployment of AI-enabled scheduling, enhancing decision quality across a complex supply chain network.",
    metric: "2x",
    metricLabel: "Productivity Gain",
    span: "md:col-span-6",
    featured: false,
    dark: true,
  },
] as const;

const libraryStories = [
  {
    industry: "Technology",
    capability: "Artificial Intelligence",
    title: "How IBM Achieved Over $4.5 Billion in Bottom-Line Impact",
    excerpt:
      "Increasing productivity and fueling growth with AI—eliminating complexity and driving automation function by function.",
  },
  {
    industry: "Manufacturing",
    capability: "Business Transformation",
    title: "Building the Digital Backbone for RHI Magnesita",
    excerpt:
      "Redesigning the digital core to establish a future-ready operating model built for scale, resilience, and AI-driven innovation.",
  },
  {
    industry: "Public Sector",
    capability: "Corporate Strategy",
    title: "Turning Economic Transition into Community Resilience",
    excerpt:
      "Supporting the State of Michigan in standing up a new office to address major shifts in utility and auto sectors.",
  },
  {
    industry: "Healthcare",
    capability: "Artificial Intelligence",
    title: "Scaling GenAI Across Global Operations",
    excerpt:
      "Turned AI into a scalable capability for a major pharma distributor—optimizing costs and strengthening supply chain resilience.",
  },
  {
    industry: "Energy",
    capability: "Business Transformation",
    title: "Optimizing Complex Scheduling",
    excerpt:
      "Supported a global mining leader's deployment of AI-enabled scheduling, enhancing decision quality across a complex supply chain network.",
  },
  {
    industry: "Automotive",
    capability: "Corporate Strategy",
    title: "Reinventing Marketing with AI for Consumer Goods",
    excerpt:
      "Implemented a robust GenAI platform for a global consumer leader, drastically improving innovation-to-launch effectiveness while freeing capacity.",
  },
] as const;

const industries = [
  "All Industries",
  "Automotive",
  "Energy",
  "Financial Institutions",
  "Healthcare",
  "Manufacturing",
  "Public Sector",
  "Technology",
] as const;

const capabilities = [
  "All Capabilities",
  "Artificial Intelligence",
  "Business Transformation",
  "Corporate Strategy",
] as const;

export function ClientImpactPage() {
  const [industry, setIndustry] = useState<(typeof industries)[number]>(
    "All Industries",
  );
  const [capability, setCapability] = useState<(typeof capabilities)[number]>(
    "All Capabilities",
  );
  const [showAll, setShowAll] = useState(false);

  const filteredStories = useMemo(() => {
    return libraryStories.filter((story) => {
      const industryMatch =
        industry === "All Industries" || story.industry === industry;
      const capabilityMatch =
        capability === "All Capabilities" || story.capability === capability;
      return industryMatch && capabilityMatch;
    });
  }, [industry, capability]);

  const visibleStories = showAll
    ? filteredStories
    : filteredStories.slice(0, 3);

  return (
    <>
      <main className="flex-grow bg-off-white pt-[100px]">
        <section className="relative mb-24 flex h-[70vh] min-h-[600px] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/client-impact-hero.jpg"
              alt="Modern glass skyscraper reflecting a twilight city skyline"
              fill
              className="object-cover opacity-80 mix-blend-multiply"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-primary/70" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
            <h1 className="mb-6 font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-pure-white drop-shadow-md md:text-display-lg">
              Transformative Impact in Action
            </h1>
            <p className="mx-auto mb-10 max-w-3xl font-sans text-body-lg leading-relaxed text-surface-variant">
              Real change happens when strategy, execution, and technology come
              together. We partner with leading organizations to transform their
              impact, combining strategic clarity with action and applied AI to
              create lasting competitive advantage.
            </p>
          </div>
        </section>

        <section className="mx-auto mb-32 max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mb-12 flex items-center justify-between border-b border-outline-variant pb-4">
            <h2 className="font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
              Featured Client Impact
            </h2>
            <span className="font-sans text-label-md uppercase tracking-wider text-outline">
              Executive Perspective
            </span>
          </div>

          <div className="grid auto-rows-min grid-cols-1 gap-8 md:grid-cols-12">
            {featuredStories.map((story) => (
              <article
                key={story.title}
                className={`hover-border-expand group flex flex-col justify-between border border-surface-dim p-8 transition-all duration-300 ${story.span} ${
                  story.dark
                    ? "bg-primary-container text-pure-white hover:border-primary hover:bg-primary"
                    : "bg-pure-white hover:border-primary-container"
                }`}
              >
                <div className="mb-8">
                  <span
                    className={`mb-2 block font-sans text-label-md uppercase tracking-widest ${
                      story.dark ? "text-secondary-fixed" : "text-secondary"
                    }`}
                  >
                    {story.category}
                  </span>
                  <h3
                    className={`mb-4 font-serif text-headline-md transition-colors ${
                      story.dark
                        ? "text-pure-white group-hover:text-secondary-fixed-dim"
                        : "text-primary group-hover:text-secondary"
                    } ${story.featured ? "" : "md:text-[28px]"}`}
                  >
                    {story.title}
                  </h3>
                  <p
                    className={`font-sans text-body-md ${
                      story.dark
                        ? "text-surface-variant/90"
                        : "max-w-2xl text-on-surface-variant"
                    }`}
                  >
                    {story.description}
                  </p>
                </div>
                <div
                  className={`flex items-end justify-between border-t pt-6 ${
                    story.dark
                      ? "border-surface-tint"
                      : "border-surface-container"
                  }`}
                >
                  <div>
                    <div
                      className={`mb-1 font-serif leading-none ${
                        story.featured || story.dark
                          ? "text-display-lg"
                          : "text-headline-lg"
                      } ${
                        story.dark
                          ? "text-secondary-fixed"
                          : "text-primary"
                      }`}
                    >
                      {story.metric}
                    </div>
                    <div
                      className={`font-sans text-label-md uppercase tracking-wider ${
                        story.dark ? "text-surface-variant" : "text-outline"
                      }`}
                    >
                      {story.metricLabel}
                    </div>
                  </div>
                  {story.featured ? (
                    <a
                      href="#library"
                      className="group/link flex items-center gap-2 font-sans font-bold text-primary transition-colors hover:text-secondary"
                    >
                      Read Case
                      <ArrowForwardIcon className="transition-transform group-hover/link:translate-x-1" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="library"
          className="mx-auto mb-32 max-w-container-max px-margin-mobile md:px-margin-desktop"
        >
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
              Our Client Impact Library
            </h2>
            <p className="font-sans text-body-lg text-on-surface-variant">
              When strategy meets execution, extraordinary outcomes follow.
              Browse the stories that bring our client impact to life across
              industries and capabilities.
            </p>
          </div>

          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <div className="relative">
              <label htmlFor="industry-filter" className="sr-only">
                Filter by industry
              </label>
              <select
                id="industry-filter"
                value={industry}
                onChange={(event) => {
                  setIndustry(
                    event.target.value as (typeof industries)[number],
                  );
                  setShowAll(false);
                }}
                className="min-w-[200px] cursor-pointer appearance-none border-0 border-b-2 border-outline bg-pure-white py-2 pl-4 pr-10 font-sans text-label-md uppercase tracking-wider text-primary focus:border-primary-container focus:outline-none"
              >
                {industries.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ExpandMoreIcon className="pointer-events-none absolute right-2 top-2 text-primary" />
            </div>
            <div className="relative">
              <label htmlFor="capability-filter" className="sr-only">
                Filter by capability
              </label>
              <select
                id="capability-filter"
                value={capability}
                onChange={(event) => {
                  setCapability(
                    event.target.value as (typeof capabilities)[number],
                  );
                  setShowAll(false);
                }}
                className="min-w-[200px] cursor-pointer appearance-none border-0 border-b-2 border-outline bg-pure-white py-2 pl-4 pr-10 font-sans text-label-md uppercase tracking-wider text-primary focus:border-primary-container focus:outline-none"
              >
                {capabilities.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ExpandMoreIcon className="pointer-events-none absolute right-2 top-2 text-primary" />
            </div>
          </div>

          {visibleStories.length === 0 ? (
            <p className="py-12 text-center font-sans text-body-md text-on-surface-variant">
              No stories match these filters. Try another industry or
              capability.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {visibleStories.map((story) => (
                <article
                  key={`${story.industry}-${story.title}`}
                  className="hover-border-expand group flex cursor-pointer flex-col border border-surface-dim bg-pure-white p-6 transition-all duration-300 hover:border-primary-container"
                >
                  <div className="flex-grow">
                    <span className="mb-3 block font-sans text-label-md uppercase tracking-wider text-outline">
                      {story.industry}
                    </span>
                    <h4 className="mb-3 font-serif text-[24px] leading-tight text-primary transition-colors group-hover:text-secondary">
                      {story.title}
                    </h4>
                    <p className="line-clamp-3 font-sans text-body-md text-on-surface-variant">
                      {story.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-surface-container pt-4">
                    <span className="font-sans text-label-md font-bold text-primary">
                      Read Story
                    </span>
                    <ArrowForwardIcon className="text-primary" />
                  </div>
                </article>
              ))}
            </div>
          )}

          {!showAll && filteredStories.length > 3 ? (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="border border-primary bg-transparent px-8 py-3 font-sans text-label-md uppercase tracking-wider text-primary transition-colors hover:bg-surface-container"
              >
                View All Stories
              </button>
            </div>
          ) : null}
        </section>

        <section className="border-y border-outline-variant bg-off-white py-24">
          <div className="mx-auto max-w-4xl px-margin-mobile text-center md:px-margin-desktop">
            <h2 className="mb-6 font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
              Ready to Drive Transformative Impact?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl font-sans text-body-lg text-on-surface-variant">
              Connect with our experts to discuss how ICG can help your
              organization unlock value, scale AI, and build lasting competitive
              advantage.
            </p>
            <Link
              href="/careers#connect"
              className="hover-btn-primary inline-block bg-primary-container px-8 py-3 font-sans text-label-md uppercase tracking-wider text-pure-white transition-all duration-300"
            >
              Contact Our Experts
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
