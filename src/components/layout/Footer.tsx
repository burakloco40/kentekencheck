import Link from "next/link";
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#e5e9f2] bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-5 bg-plate-yellow rounded-[3px] border border-plate-dark/20" aria-hidden="true">
              <span className="font-plate text-[8px] font-bold text-[var(--color-navy-700)] leading-none">NL</span>
            </div>
            <span className="text-sm font-semibold text-[var(--color-navy-700)]">Kentekencheck</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Gegevens afkomstig van{" "}
            <a href="https://opendata.rdw.nl" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">RDW Open Data</a>.
            Geen rechten aan te ontlenen.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/over-ons" className="hover:text-gray-600 transition-colors">Over ons</Link>
            <span>© {year}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
