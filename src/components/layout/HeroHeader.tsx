"use client";

import { motion } from "framer-motion";
import type { WorkbenchMode } from "@/lib/mode";
import { ModeSwitch } from "./ModeSwitch";

type HeroHeaderProps = {
  mode: WorkbenchMode;
  onModeChange: (mode: WorkbenchMode) => void;
};

export function HeroHeader({ mode, onModeChange }: HeroHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-white/8 px-6 py-8 shadow-glass backdrop-blur-2xl md:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.23),transparent_30%),radial-gradient(circle_at_72%_18%,rgba(96,165,250,0.18),transparent_30%)]" />
      <div className="absolute right-8 top-8 hidden h-28 w-28 rounded-full border border-cyan-200/20 lg:block" />
      <div className="absolute right-20 top-20 hidden h-44 w-44 rounded-full border border-white/10 lg:block" />

      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="max-w-5xl text-4xl font-semibold leading-tight text-white md:text-6xl">
            五强溪水电站水利计算可复核决策工作台
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-cyan-50/82 md:text-lg">
            按课程设计指示书七项内容组织，展示计算过程、关键成果和报告图件。
          </p>
        </motion.div>

        <div className="flex justify-start rounded-3xl border border-cyan-100/15 bg-basin-950/42 p-4 lg:justify-end">
          <ModeSwitch mode={mode} onModeChange={onModeChange} />
        </div>
      </div>
    </section>
  );
}
