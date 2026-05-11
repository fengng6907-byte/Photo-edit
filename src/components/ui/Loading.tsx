import { cn } from "@/lib/utils";

export function Spinner({ size = "md", className }: { size?: "xs" | "sm" | "md" | "lg"; className?: string }) {
  const sizes = { xs: "w-3 h-3", sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <svg
      className={cn("animate-spin text-brand-400", sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function SkeletonBox({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0828]">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-glow">
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-white" fill="currentColor">
            <path d="M16 2L4 9v14l12 7 12-7V9L16 2z" opacity="0.2" />
            <path d="M16 2L4 9l12 7 12-7L16 2z" />
            <path d="M4 9v14l12 7V16L4 9z" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute -inset-2 rounded-3xl bg-brand-500/20 animate-pulse-slow blur-xl" />
      </div>
      <div className="flex items-center gap-2 text-white/60">
        <Spinner size="sm" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

export function AIProcessingAnimation({ message = "AI is processing..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-brand-500/30 animate-spin-slow" />
        <div className="absolute inset-2 rounded-full border-2 border-t-brand-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-4 rounded-full bg-brand-500/20 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="text-white font-medium">{message}</p>
        <div className="flex gap-1 justify-center mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 p-4 rounded-2xl bg-white/5 text-white/30">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-white/70 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-white/40 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
