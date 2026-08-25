import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

export const metadata: Metadata = {
  title: "ICG: IITians Consulting Group | The Great Minds Behind Better Decisions",
  description:
    "At ICG – IITians Consulting Group, we believe great decisions are powered by great minds. Expert consultation, strategic guidance, and practical solutions tailored to your needs.",
};

export default function Home() {
  return <HomePage />;
}
