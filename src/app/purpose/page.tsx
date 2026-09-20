import type { Metadata } from "next";
import { PurposePeoplePage } from "@/components/purpose-people-page";

export const metadata: Metadata = {
  title: "Purpose | ICG: IITians Consulting Group",
  description:
    "To partner with government so that national priorities are served by practising expertise, advice that can be built, operated and sustained long after an engagement ends.",
};

export default function Purpose() {
  return <PurposePeoplePage />;
}
