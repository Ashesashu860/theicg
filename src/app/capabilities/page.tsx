import type { Metadata } from "next";
import { CapabilitiesPage } from "@/components/capabilities-page";

export const metadata: Metadata = {
  title: "Capabilities | ICG: IITians Consulting Group",
  description:
    "Bridging strategic clarity with technical excellence across IT services, water, waste, urban planning, and geotechnical domains.",
};

export default function Capabilities() {
  return <CapabilitiesPage />;
}
