"use client";

import { clsx } from "clsx";
import { FileSpreadsheet, ShieldCheck } from "lucide-react";
import type { WorkbenchMode } from "@/lib/mode";

type ModeSwitchProps = {
  mode: WorkbenchMode;
  onModeChange: (mode: WorkbenchMode) => void;
};

export function ModeSwitch({ mode, onModeChange }: ModeSwitchProps) {
  const modes = [
    { key: "report" as const, label: "报告复现模式", icon: ShieldCheck },
    { key: "custom" as const, label: "自定义试算模式", icon: FileSpreadsheet }
  ];

  return (
    <div className="inline-flex flex-wrap gap-2 rounded-3xl border border-white/16 bg-white/10 p-1.5 backdrop-blur-xl">
      {modes.map((item) => {
        const Icon = item.icon;
        const active = item.key === mode;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onModeChange(item.key)}
            className={clsx(
              "inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition",
              active
                ? "bg-cyan-300 text-basin-950 shadow-glow"
                : "text-cyan-50/76 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
