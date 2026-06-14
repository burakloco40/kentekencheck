import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Kentekencheck — Gratis Nederlands kenteken opzoeken",
    template: "%s | Kentekencheck.app",
  },
  description: "Gratis Nederlands kenteken opzoeken. Bekijk direct APK-status, brandstof, vermogen, gewicht, keuringshistorie en meer via het officiële RDW register.",
  keywords: ["kenteken opzoeken", "kenteken check", "rdw kenteken", "apk check", "kenteken informatie", "voertuig gegevens", "kenteken zoeken"],
  authors: [{ name: "Kentekencheck" }],
  creator: "Kentekencheck",
  publisher: "Kentekencheck",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Kentekencheck",
    title: "Kentekencheck — Gratis Nederlands kenteken opzoeken",
    description: "Gratis Nederlands kenteken opzoeken. APK, brandstof, vermogen en meer via het officiële RDW register.",
    url: "https://kentekencheckapp.vercel.app",
  },
  twitter: {
    card: "summary",
    title: "Kentekencheck — Gratis Nederlands kenteken opzoeken",
    description: "Gratis Nederlands kenteken opzoeken. APK, brandstof, vermogen en meer.",
  },
  metadataBase: new URL("https://kentekencheckapp.vercel.app"),
  alternates: {
    canonical: "https://kentekencheckapp.vercel.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body style={{minHeight:'100vh',display:'flex',flexDirection:'column',margin:0,padding:0,background:'#f9fafb',fontFamily:'Inter, system-ui, sans-serif'}}>
        <Header />
        <main style={{flex:1}}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}