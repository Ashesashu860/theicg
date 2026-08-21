import type { Metadata } from "next";
import { CareersPage } from "@/components/careers-page";

export const metadata: Metadata = {
  title: "Careers | THE ICG",
  description:
    "Work with leaders across industries at THE ICG. Explore openings, culture, and early career paths.",
};

export default function Careers() {
  return <CareersPage />;
}
