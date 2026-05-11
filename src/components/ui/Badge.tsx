import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple" | "blue";
  size?: "sm" | "md";
  className?: string;
}

const variants = {
  default: "bg-white/10 text-white/70 border-white/10",
  success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30",
  info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  purple: "bg-brand-500/20 text-brand-400 border-brand-500/30",
  blue: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs rounded-md",
  md: "px-2.5 py-1 text-xs rounded-lg",
};

export function Badge({ children, variant = "default", size = "md", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
