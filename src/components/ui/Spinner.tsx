import { cn } from "@/lib/utils/cn";
interface SpinnerProps { className?: string; size?: "sm" | "md" | "lg"; }
export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-6 h-6 border-2", lg: "w-8 h-8 border-[3px]" };
  return <div className={cn("animate-spin rounded-full border-current border-r-transparent", sizes[size], className)} role="status" aria-label="Laden..." />;
}
