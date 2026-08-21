import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";

export const metadata: Metadata = {
  title: "About Us | THE ICG",
  description:
    "THE ICG bridges the gap between ambition and outcomes through strategic clarity and applied AI.",
};

export default function About() {
  return <AboutPage />;
}
