import type { Metadata } from "next";
import { Hanken_Grotesk, Source_Serif_4 } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const siteDescription =
  "ICG – IITans Consulting Group brings together great minds to deliver expert consultation, strategic guidance, and practical solutions that help individuals and organizations achieve their goals.";

const socialDescription =
  "ICG – IITans Consulting Group | Great minds. Better perspectives. Smarter decisions. Expert consultation and strategic guidance designed to help you turn challenges into opportunities.";

export const metadata: Metadata = {
  title: "ICG: IITans Consulting Group | Expert Consulting & Guidance",
  description: siteDescription,
  keywords: [
    "IITans Consulting Group",
    "ICG consulting",
    "consulting group",
    "expert consultants",
    "strategic consulting",
    "business consultation",
    "professional consulting",
    "IIT consultants",
    "management consulting",
    "strategic guidance",
    "consulting services",
  ],
  openGraph: {
    title: "ICG: IITans Consulting Group | Expert Consulting & Guidance",
    description: socialDescription,
    siteName: "ICG: IITans Consulting Group",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ICG: IITans Consulting Group | Expert Consulting & Guidance",
    description: socialDescription,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
