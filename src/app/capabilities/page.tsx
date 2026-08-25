import type { Metadata } from "next";
import { CapabilitiesPage } from "@/components/capabilities-page";
import { listCapabilities } from "@/lib/capabilities-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Capabilities | ICG: IITians Consulting Group",
  description:
    "Bridging strategic clarity with technical excellence across IT services, water, waste, urban planning, and geotechnical domains.",
};

export default async function Capabilities() {
  const capabilities = await listCapabilities();
  return <CapabilitiesPage capabilities={capabilities} />;
}
