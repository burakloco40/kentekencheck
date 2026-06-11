import Link from "next/link";
import { LicensePlateInput } from "@/components/search/LicensePlateInput";
export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-stretch rounded-plate border-2 border-plate-dark/30 overflow-hidden shadow-plate mx-auto mb-8" aria-hidden="true">
        <div className="flex flex-col items-center justify-center bg-[var(--color-navy-600)] w-10 gap-1 px-1">
          <div className="flex flex-wrap justify-center w-5 gap-0.5">
            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="w-[3px] h-[3px] rounded-full bg-plate-yellow" />)}
          </div>
          <span className="font-plate text-[11px] font-bold text-white tracking-wider leading-none">NL</span>
        </div>
        <div className="bg-plate-yellow px-6 py-3 flex items-center">
          <span className="font-plate font-bold text-3xl text-[var(--color-navy-800)] tracking-widest">404</span>
        </div>
      </div>
      <h1 className="font-display font-bold text-2xl text-[var(--color-navy-700)] mb-3">Pagina niet gevonden</h1>
      <p className="text-gray-500 mb-8">Gebruik het zoekveld hieronder om een kenteken op te zoeken.</p>
      <div className="flex justify-center mb-6"><LicensePlateInput autoFocus size="compact" /></div>
      <Link href="/" className="text-sm text-[var(--color-navy-600)] hover:text-[var(--color-navy-800)] underline transition-colors">Terug naar beginpagina</Link>
    </div>
  );
}
