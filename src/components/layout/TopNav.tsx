"use client";

import { clsx } from "clsx";
import {
  BadgeCheck,
  BarChart3,
  Gauge,
  GitBranch,
  Landmark,
  ShieldCheck,
  Waves,
  Zap
} from "lucide-react";
import type { PageKey } from "@/lib/mode";

const navItems: { key: PageKey; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "observatory", label: "工程总览", icon: Gauge },
  { key: "deadwater", label: "死水位与保证出力", icon: ShieldCheck },
  { key: "capacity", label: "装机容量选择", icon: Zap },
  { key: "dispatch", label: "调度图绘制", icon: GitBranch },
  { key: "repeat", label: "重复容量与电能", icon: BarChart3 },
  { key: "flood", label: "防洪计算", icon: Waves },
  { key: "indicators", label: "水利指标", icon: BadgeCheck },
  { key: "economy", label: "经济计算", icon: Landmark }
];

type TopNavProps = {
  activePage: PageKey;
  onPageChange: (page: PageKey) => void;
};

export function TopNav({ activePage, onPageChange }: TopNavProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-cyan-100/12 bg-basin-950/78 backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[var(--nav-height)] max-w-[1500px] flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <button
          className="group flex items-center gap-3 text-left"
          onClick={() => onPageChange("observatory")}
          type="button"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-basin-950 shadow-glow">
            <Gauge size={24} />
          </span>
          <span>
            <span className="block text-base font-semibold text-white">五强溪水电站</span>
            <span className="block text-sm text-cyan-100/82">水利计算工作台</span>
          </span>
        </button>

        <nav className="flex flex-wrap items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.key === activePage;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onPageChange(item.key)}
                className={clsx(
                  "relative inline-flex h-10 items-center gap-1.5 rounded-2xl px-3 text-sm font-medium transition",
                  active
                    ? "bg-white text-basin-900 shadow-glow"
                    : "text-cyan-50/78 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={16} />
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-cyan-300" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
