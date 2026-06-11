import Link from "next/link";
export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#e5e9f2]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-6 bg-plate-yellow rounded-[3px] border border-plate-dark/20 shadow-sm" aria-hidden="true">
            <span className="font-plate text-[9px] font-bold text-[var(--color-navy-700)] tracking-wide leading-none">NL</span>
          </div>
          <span className="font-display font-bold text-[var(--color-navy-700)] text-lg tracking-tight group-hover:text-[var(--color-navy-500)] transition-colors">Kentekencheck</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/over-ons" className="text-sm text-gray-500 hover:text-[var(--color-navy-600)] px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Over ons</Link>
        </nav>
      </div>
    </header>
  );
}
