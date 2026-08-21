import type { Metadata } from "next";
import { ClientImpactPage } from "@/components/client-impact-page";

export const metadata: Metadata = {
  title: "Client Impact | ICG: IITans Consulting Group",
  description:
    "See how ICG partners with leading organizations to deliver transformative impact—combining strategic clarity, execution, and applied AI.",
};

export default function Impact() {
  return <ClientImpactPage />;
}
