import { cn } from "@/lib/utils/cn";
interface CardProps { children: React.ReactNode; className?: string; as?: "div" | "section" | "article"; }
export function Card({ children, className, as: Tag = "div" }: CardProps) {
  return <Tag className={cn("bg-white rounded-xl border border-[#e5e9f2] shadow-card", className)}>{children}</Tag>;
}
interface CardHeaderProps { children: React.ReactNode; className?: string; }
export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("px-5 py-4 border-b border-[#e5e9f2]", className)}>{children}</div>;
}
interface CardContentProps { children: React.ReactNode; className?: string; }
export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}
