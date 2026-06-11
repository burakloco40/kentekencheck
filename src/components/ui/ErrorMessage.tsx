import { cn } from "@/lib/utils/cn";
interface ErrorMessageProps { title?: string; message: string; className?: string; }
export function ErrorMessage({ title, message, className }: ErrorMessageProps) {
  return (
    <div className={cn("flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl", className)} role="alert">
      <div className="shrink-0 mt-0.5">
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        {title && <p className="text-sm font-semibold text-red-800 mb-0.5">{title}</p>}
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
}
