import { cn } from "@/lib/utils/cn";
interface DataFieldProps { label: string; value: string | number | null | undefined; unit?: string; className?: string; highlight?: boolean; }
export function DataField({ label, value, unit, className, highlight = false }: DataFieldProps) {
  const displayValue = value !== null && value !== undefined && value !== "" ? String(value) : null;
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</dt>
      <dd className={cn("text-sm font-semibold", highlight ? "text-[var(--color-navy-700)] text-base" : "text-gray-800", !displayValue && "text-gray-300 font-normal")}>
        {displayValue ? <>{displayValue}{unit && <span className="text-gray-400 font-normal ml-1">{unit}</span>}</> : "—"}
      </dd>
    </div>
  );
}
