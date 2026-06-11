import { cn } from "@/lib/utils/cn";
interface BadgeProps { children: React.ReactNode; variant?: "green" | "orange" | "red" | "blue" | "gray"; className?: string; }
export function Badge({ children, variant = "gray", className }: BadgeProps) {
  const variants = { green: "bg-green-50 text-green-700 border-green-200", orange: "bg-amber-50 text-amber-700 border-amber-200", red: "bg-red-50 text-red-700 border-red-200", blue: "bg-blue-50 text-blue-700 border-blue-200", gray: "bg-gray-50 text-gray-700 border-gray-200" };
  return <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full", variants[variant], className)}>{children}</span>;
}
