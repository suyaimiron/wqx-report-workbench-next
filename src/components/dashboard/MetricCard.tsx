import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type MetricCardProps = {
  label: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  tone?: "highlight" | "normal";
};

export function MetricCard({ label, value, unit, icon, tone = "normal" }: MetricCardProps) {
  return (
    <Card
      className={
        tone === "highlight"
          ? "relative overflow-hidden ring-2 ring-cyan-300/70"
          : "relative overflow-hidden"
      }
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-cyan-300/20" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="numeric text-3xl font-semibold text-basin-950 md:text-4xl">
              {value}
            </span>
            {unit ? <span className="pb-1 text-sm font-semibold text-slate-500">{unit}</span> : null}
          </div>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-basin-900 text-cyan-200">
          {icon}
        </div>
      </div>
    </Card>
  );
}
