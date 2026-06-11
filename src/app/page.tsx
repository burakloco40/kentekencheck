import type { Metadata } from "next";
import { LicensePlateInput } from "@/components/search/LicensePlateInput";
export const metadata: Metadata = { title: "Kentekencheck — Voertuiggegevens opzoeken", description: "Gratis Nederlands kenteken opzoeken." };
const FEATURES = [
  { icon: "✓", title: "APK-status", desc: "Geldig of verlopen, inclusief vervaldatum" },
  { icon: "◎", title: "Voertuiggegevens", desc: "Merk, model, bouwjaar, brandstof en meer" },
  { icon: "⚡", title: "Direct resultaat", desc: "Rechtstreeks uit het officiële RDW register" },
];
export default function HomePage() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-navy-700 via-navy-600 to-navy-500 text-white overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white/80 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            Gratis · Officiële RDW data
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight mb-4">
            Kenteken <span className="text-plate-yellow">opzoeken</span>
          </h1>
          <p className="text-[var(--color-navy-100)]/70 text-lg sm:text-xl max-w-md mb-10">Voer een Nederlands kenteken in en bekijk direct alle voertuiggegevens.</p>
          <LicensePlateInput autoFocus size="hero" />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[var(--color-navy-100)]/40 text-xs">Voorbeeld:</span>
            <a href="/voertuig/SH239S" className="font-plate text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-white/70 hover:text-white transition-colors">SH-239-S</a>
          </div>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 p-5 bg-white rounded-xl border border-[#e5e9f2] shadow-card">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--color-navy-50)] text-[var(--color-navy-600)] flex items-center justify-center text-lg font-bold">{f.icon}</div>
              <div>
                <h3 className="font-display font-semibold text-[var(--color-navy-700)] text-sm mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-xl border border-[#e5e9f2] shadow-card p-6 sm:p-8">
          <h2 className="font-display font-bold text-[var(--color-navy-700)] text-xl mb-3">Hoe werkt het?</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
            Voer een geldig Nederlands kenteken in. Onze service raadpleegt het officiële{" "}
            <a href="https://opendata.rdw.nl" target="_blank" rel="noopener noreferrer" className="text-[var(--color-navy-600)] underline hover:text-[var(--color-navy-800)]">RDW Open Data register</a>{" "}
            en toont direct de beschikbare voertuiggegevens. De informatie is openbaar beschikbaar en wordt niet bewaard door ons.
          </p>
        </div>
      </section>
    </>
  );
}
