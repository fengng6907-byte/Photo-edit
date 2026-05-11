import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, glass = true, hover = false, gradient = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border",
        glass && "glass",
        hover && "glass-hover cursor-pointer",
        gradient && "gradient-border",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 border-b border-white/10", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 border-t border-white/10", className)}>
      {children}
    </div>
  );
}

export function StatCard({
  title,
  value,
  change,
  icon,
  color = "purple",
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: "purple" | "blue" | "green" | "pink";
}) {
  const colors = {
    purple: "from-brand-600/20 to-brand-500/10 border-brand-500/20",
    blue: "from-cyan-600/20 to-cyan-500/10 border-cyan-500/20",
    green: "from-emerald-600/20 to-emerald-500/10 border-emerald-500/20",
    pink: "from-pink-600/20 to-pink-500/10 border-pink-500/20",
  };

  const iconColors = {
    purple: "text-brand-400 bg-brand-500/20",
    blue: "text-cyan-400 bg-cyan-500/20",
    green: "text-emerald-400 bg-emerald-500/20",
    pink: "text-pink-400 bg-pink-500/20",
  };

  return (
    <div className={cn("rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm", colors[color])}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", iconColors[color])}>
          {icon}
        </div>
        {change && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-lg",
            change.startsWith("+")
              ? "text-emerald-400 bg-emerald-500/20"
              : "text-red-400 bg-red-500/20"
          )}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/50">{title}</div>
    </div>
  );
}
