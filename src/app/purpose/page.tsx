import type { Metadata } from "next";
import { PurposePeoplePage } from "@/components/purpose-people-page";

export const metadata: Metadata = {
  title: "Purpose & People | ICG: IITians Consulting Group",
  description:
    "Leading with empathy and expertise. Discover the ICG principles, standards, and purpose that guide how we work with clients and grow together.",
};

export default function Purpose() {
  return <PurposePeoplePage />;
}
