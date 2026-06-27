import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" &&
          "bg-cyan-400 text-basin-950 shadow-glow hover:bg-cyan-300",
        variant === "secondary" &&
          "bg-white/85 text-basin-900 ring-1 ring-white/70 hover:bg-white",
        variant === "ghost" &&
          "bg-white/8 text-white ring-1 ring-white/15 hover:bg-white/14",
        className
      )}
      {...props}
    />
  );
}
