import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Over ons", description: "Meer over Kentekencheck." };
export default function OverOnsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[var(--color-navy-600)] transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Terug
      </Link>
      <h1 className="font-display font-bold text-3xl text-[var(--color-navy-700)] mb-2">Over ons</h1>
      <p className="text-gray-500 mb-10">Kentekencheck — eenvoudig Nederlands kenteken opzoeken</p>
      <div className="space-y-8 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="font-display font-semibold text-[var(--color-navy-700)] text-lg mb-2">Wat is Kentekencheck?</h2>
          <p>Kentekencheck is een gratis dienst waarmee je snel voertuiggegevens kunt opzoeken op basis van een Nederlands kenteken.</p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-[var(--color-navy-700)] text-lg mb-2">Waar komt de data vandaan?</h2>
          <p>Alle gegevens zijn afkomstig van het <a href="https://opendata.rdw.nl" target="_blank" rel="noopener noreferrer" className="text-[var(--color-navy-600)] underline hover:text-[var(--color-navy-800)]">RDW Open Data platform</a>. De gegevens worden door ons niet opgeslagen of gedeeld.</p>
        </section>
        <section>
          <h2 className="font-display font-semibold text-[var(--color-navy-700)] text-lg mb-2">Disclaimer</h2>
          <p>Aan de weergegeven gegevens kunnen geen rechten worden ontleend. Kentekencheck is geen officiële RDW-dienst.</p>
        </section>
      </div>
    </div>
  );
}
