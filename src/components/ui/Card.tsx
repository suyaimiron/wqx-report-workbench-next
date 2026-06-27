import { clsx } from "clsx";
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
};

export function Card({ children, className, tone = "light" }: CardProps) {
  return (
    <section
      className={clsx(
        "rounded-3xl p-5 md:p-6",
        tone === "light" ? "glass-card text-ink" : "dark-glass text-white",
        className
      )}
    >
      {children}
    </section>
  );
}
