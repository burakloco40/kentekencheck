"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isValidPlate, normalizePlate, formatPlateDisplay } from "@/lib/validation/plate";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";
interface LicensePlateInputProps { initialValue?: string; autoFocus?: boolean; size?: "hero" | "compact"; }
export function LicensePlateInput({ initialValue = "", autoFocus = false, size = "hero" }: LicensePlateInputProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isHero = size === "hero";
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setValue(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""));
  }, [error]);
  const handleSearch = useCallback(async (plateInput: string) => {
    const normalized = normalizePlate(plateInput);
    if (!normalized) { setError("Voer een kenteken in."); inputRef.current?.focus(); return; }
    if (!isValidPlate(normalized)) { setError("Ongeldig kenteken. Probeer bijv. SH-239-S."); inputRef.current?.focus(); return; }
    setIsLoading(true); setError(null);
    router.push(`/voertuig/${normalized}`);
    setTimeout(() => setIsLoading(false), 500);
  }, [router]);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSearch(value); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") handleSearch(value); };
  return (
    <div className={cn("w-full", isHero ? "max-w-lg" : "max-w-sm")}>
      <form onSubmit={handleSubmit} noValidate>
        <div className={cn("relative flex items-stretch rounded-plate border-2 overflow-hidden transition-all duration-200", error ? "border-red-400 shadow-[0_0_0_3px_rgb(239_68_68_/_0.15)]" : "border-plate-dark/30 shadow-plate focus-within:border-plate-dark/60 focus-within:shadow-[0_0_0_3px_rgb(245_197_24_/_0.25)]")}>
          <div className={cn("flex flex-col items-center justify-center bg-[var(--color-navy-600)] shrink-0", isHero ? "w-10 gap-1" : "w-8 gap-0.5")} aria-hidden="true">
            <div className="flex flex-wrap justify-center w-5 gap-0.5">
              {Array.from({ length: 12 }).map((_, i) => <div key={i} className={cn("rounded-full bg-plate-yellow", isHero ? "w-[3px] h-[3px]" : "w-[2px] h-[2px]")} />)}
            </div>
            <span className={cn("font-plate font-bold text-white leading-none tracking-wider", isHero ? "text-[11px]" : "text-[9px]")}>NL</span>
          </div>
          <input ref={inputRef} type="text" inputMode="text" autoCapitalize="characters" autoCorrect="off" autoComplete="off" spellCheck={false}
            value={value} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="SH-239-S" maxLength={9} autoFocus={autoFocus}
            aria-label="Kenteken invoeren" aria-invalid={!!error} aria-describedby={error ? "plate-error" : undefined}
            className={cn("flex-1 bg-plate-yellow font-plate font-bold tracking-widest placeholder:text-plate-dark/40 text-[var(--color-navy-800)] focus:outline-none caret-navy-600", isHero ? "px-4 py-4 text-2xl" : "px-3 py-2.5 text-base")} />
          <button type="submit" disabled={isLoading} aria-label="Kenteken opzoeken"
            className={cn("flex items-center justify-center shrink-0 bg-[var(--color-navy-600)] hover:bg-[var(--color-navy-700)] active:bg-[var(--color-navy-800)] text-white transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed", isHero ? "w-14" : "w-11")}>
            {isLoading ? <Spinner size={isHero ? "md" : "sm"} className="text-white" /> : (
              <svg className={cn(isHero ? "w-5 h-5" : "w-4 h-4")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            )}
          </button>
        </div>
        {error && <p id="plate-error" role="alert" className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
      </form>
    </div>
  );
}
