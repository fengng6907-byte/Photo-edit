"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { useState, useEffect, createContext, useContext, useCallback } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((data: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2);
    const newToast: Toast = { ...data, id };
    setToasts((prev) => [...prev, newToast]);
    const duration = data.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  error: "border-red-500/30 bg-red-500/10 text-red-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  info: "border-brand-500/30 bg-brand-500/10 text-brand-400",
};

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 min-w-[320px] max-w-md">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border glass shadow-glass animate-slide-up",
              styles[t.type]
            )}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{t.title}</p>
              {t.description && (
                <p className="text-xs text-white/50 mt-0.5">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="p-0.5 hover:bg-white/10 rounded text-white/40 hover:text-white/70 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function ProgressBar({ value, max = 100, label, color = "brand" }: {
  value: number;
  max?: number;
  label?: string;
  color?: "brand" | "green" | "amber" | "red";
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const colors = {
    brand: "bg-brand-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-xs text-white/50">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
