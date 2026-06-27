import { reportMetrics, schemes } from "@/data/benchmark";
import type { CustomTrialResult, WorkbenchMode } from "./mode";

export function buildExportPayload(mode: WorkbenchMode, trial?: CustomTrialResult) {
  return {
    generatedAt: new Date().toLocaleString("zh-CN"),
    mode: mode === "report" ? "报告复现模式" : "自定义试算模式",
    reportBenchmark: reportMetrics,
    schemes,
    customTrial: trial ?? null,
    disclaimer:
      mode === "report"
        ? "报告复现模式以课程设计报告为唯一基准。"
        : "自定义试算模式为简化分析，不作为正式结论。"
  };
}

export function downloadJson(payload: unknown, fileName: string) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
