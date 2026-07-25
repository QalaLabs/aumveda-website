import type { Metadata } from "next";
import HomeMarketing from "@/components/marketing/HomeMarketing";

export const metadata: Metadata = {
  title: "AUMVEDA — Mother–Daughter Neuro-Vedic Healing",
  description:
    "Your Daily Dose of Healing. Mother–daughter Neuro-Vedic practice — Archana Jain (Jaipur) & Sejal Jain (Mumbai).",
  openGraph: {
    title: "AUMVEDA — Your Daily Dose of Healing",
    description:
      "Mother–Daughter Neuro-Vedic Healing. Eastern wisdom held with Western nervous-system practice.",
  },
};

/**
 * Marketing homepage — port of Lovable aesthetic.
 * Primary CTAs open the portal at /step-1. Public layout hides site footer on home.
 */
export default function HomePage() {
  return <HomeMarketing />;
}
