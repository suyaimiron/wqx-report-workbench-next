import { clsx } from "clsx";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: "cyan" | "emerald" | "indigo" | "amber" | "muted";
};

const variants = {
  cyan: "border-cyan-200/60 bg-cyan-100/80 text-cyan-900",
  emerald: "border-emerald-200/60 bg-emerald-100/80 text-emerald-900",
  indigo: "border-indigo-200/60 bg-indigo-100/80 text-indigo-900",
  amber: "border-amber-200/70 bg-amber-100/85 text-amber-900",
  muted: "border-slate-200/70 bg-white/70 text-slate-700"
};

export function Badge({ children, className, variant = "cyan" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
