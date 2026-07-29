import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: { default: "Kentekencheck — Voertuiggegevens opzoeken", template: "%s | Kentekencheck" },
  description: "Gratis Nederlands kenteken opzoeken. Bekijk merk, model, APK-vervaldatum, brandstof, vermogen en meer.",
  metadataBase: new URL("https://kentekenrdwcheck.nl"),
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Kentekenrdwcheck",
    title: "Kentekencheck — Gratis Nederlands kenteken opzoeken",
    description: "Gratis Nederlands kenteken opzoeken. Bekijk APK, brandstof, vermogen en meer via het officiële RDW register.",
    url: "https://kentekenrdwcheck.nl",
    images: [
      {
        url: "https://kentekenrdwcheck.nl/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kentekencheck — Gratis voertuiggegevens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kentekencheck — Gratis Nederlands kenteken opzoeken",
    description: "Gratis Nederlands kenteken opzoeken via het officiële RDW register.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LMG58KVE43"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LMG58KVE43');
          `}
        </Script>
      </head>
      <body style={{minHeight:'100vh',display:'flex',flexDirection:'column',margin:0,padding:0,background:'#eef2f7',fontFamily:'Inter, system-ui, sans-serif'}}>
        <Header />
        <main style={{flex:1}}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}