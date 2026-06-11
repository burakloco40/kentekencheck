import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: { default: "Kentekencheck — Voertuiggegevens opzoeken", template: "%s | Kentekencheck" },
  description: "Gratis Nederlands kenteken opzoeken. Bekijk merk, model, APK-vervaldatum, brandstof, vermogen en meer.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://kentekencheck.vercel.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
