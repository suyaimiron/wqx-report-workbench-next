"use client";

import { Award, BatteryCharging, CheckCircle2, CircleDashed, Coins, RotateCcw, Zap } from "lucide-react";
import { clsx } from "clsx";
import { EconomicBarChart } from "@/components/charts/EconomicBarChart";
import { EconomicConclusionCard } from "@/components/dashboard/EconomicConclusionCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SchemeSummaryTable } from "@/components/dashboard/SchemeSummaryTable";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { reportMetrics } from "@/data/benchmark";
import { reportSections } from "@/data/reportSections";
import { formatNumber } from "@/lib/format";
import type { CustomTrialResult, CustomWorkflowState, PageKey, WorkbenchMode } from "@/lib/mode";

type ObservatoryPageProps = {
  mode: WorkbenchMode;
  trial?: CustomTrialResult;
  onTrialChange: (trial: CustomTrialResult) => void;
  onPageChange: (page: PageKey) => void;
  workflow: CustomWorkflowState;
};

const statusText = {
  empty: "未计算",
  calculated: "已计算",
  stale: "需重算"
};

export function ObservatoryPage({
  mode,
  trial,
  onTrialChange,
  onPageChange,
  workflow
}: ObservatoryPageProps) {
  void trial;
  void onTrialChange;

  const metrics = [
    {
      label: "推荐方案",
      value: "方案Ⅱ",
      unit: "115 m",
      icon: <Award size={24} />,
      tone: "highlight" as const
    },
    {
      label: "最小总年费用",
      value: formatNumber(reportMetrics.minTotalAnnualCost),
      unit: "万元/年",
      icon: <Coins size={24} />,
      tone: "highlight" as const
    },
    {
      label: "装机容量",
      value: formatNumber(reportMetrics.recommendedCapacity),
      unit: "万kW",
      icon: <BatteryCharging size={24} />
    },
    {
      label: "多年平均发电量",
      value: formatNumber(reportMetrics.recommendedEnergy),
      unit: "亿度",
      icon: <Zap size={24} />
    }
  ];

  if (mode === "custom") {
    const calculatedCount = reportSections.filter((section) => workflow.statuses[section.key] === "calculated").length;

    return (
      <div className="space-y-8">
        <SectionTitle title="自定义试算工作流" />

        <Card>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-basin-950">按指导书七项内容逐步计算</h3>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                当前不会提前生成结论。请从第 1 步开始，系统会把前一步结果自动固化为后续输入，减少重复填表。
              </p>
            </div>
            <div className="rounded-3xl border border-cyan-100 bg-cyan-50 px-5 py-4 text-cyan-900">
              <p className="text-sm font-semibold">完成进度</p>
              <p className="numeric mt-1 text-3xl font-semibold">{calculatedCount}/7</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reportSections.map((section) => {
              const status = workflow.statuses[section.key];
              const Icon = status === "calculated" ? CheckCircle2 : status === "stale" ? RotateCcw : CircleDashed;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => onPageChange(section.key)}
                  className="group rounded-3xl border border-slate-200 bg-white/78 p-5 text-left transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-basin-900 text-base font-semibold text-cyan-100">
                      {section.order}
                    </span>
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                        status === "calculated" && "bg-emerald-50 text-emerald-700",
                        status === "stale" && "bg-amber-50 text-amber-700",
                        status === "empty" && "bg-slate-100 text-slate-600"
                      )}
                    >
                      <Icon size={14} />
                      {statusText[status]}
                    </span>
                  </div>
                  <h4 className="mt-4 text-lg font-semibold leading-7 text-basin-950 group-hover:text-cyan-800">
                    {section.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-basin-950">自定义模式说明</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["少输入", "只让用户提供指导书和前序步骤无法自动得到的数据。"],
              ["有提示", "每个输入项都有圆形 i 说明来源和获取方式。"],
              ["自动传递", "导出用于留档，网页内部不需要反复导入。"]
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-cyan-100 bg-cyan-50/75 p-4">
                <p className="font-semibold text-cyan-900">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionTitle title="工程总览" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <Card>
        <h3 className="text-xl font-semibold text-basin-950">设计内容</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reportSections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => onPageChange(section.key)}
              className="group rounded-3xl border border-slate-200 bg-white/78 p-5 text-left transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-50"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-basin-900 text-base font-semibold text-cyan-100">
                {section.order}
              </span>
              <h4 className="mt-4 text-lg font-semibold leading-7 text-basin-950 group-hover:text-cyan-800">
                {section.title}
              </h4>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <h3 className="text-xl font-semibold text-basin-950">经济柱状图</h3>
          <EconomicBarChart mode={mode} />
        </Card>
        <EconomicConclusionCard mode={mode} />
      </div>

      <SchemeSummaryTable mode={mode} />
    </div>
  );
}
