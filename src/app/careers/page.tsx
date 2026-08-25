import type { Metadata } from "next";
import { CareersPage } from "@/components/careers-page";

export const metadata: Metadata = {
  title: "Careers | ICG: IITians Consulting Group",
  description:
    "Join ICG – IITians Consulting Group. Work with great minds to deliver expert consultation, strategic guidance, and practical solutions.",
};

export default function Careers() {
  return <CareersPage />;
}
