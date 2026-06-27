import { reportMetrics, schemes } from "@/data/benchmark";

export function getReportAuditItems() {
  const sorted = [...schemes].sort(
    (a, b) => a.economy.totalAnnualCost - b.economy.totalAnnualCost
  );
  const winner = sorted[0];
  return [
    {
      label: "推荐方案",
      value: winner.name,
      expected: reportMetrics.recommendedScheme,
      passed: winner.id === reportMetrics.recommendedSchemeId
    },
    {
      label: "最低总年费用",
      value: winner.economy.totalAnnualCost.toFixed(2),
      expected: reportMetrics.minTotalAnnualCost.toFixed(2),
      passed:
        Math.abs(winner.economy.totalAnnualCost - reportMetrics.minTotalAnnualCost) < 0.01
    },
    {
      label: "正常蓄水位",
      value: `${winner.level} m`,
      expected: `${reportMetrics.recommendedLevel} m`,
      passed: winner.level === reportMetrics.recommendedLevel
    },
    {
      label: "方案Ⅳ处理",
      value: "未推荐",
      expected: "不得作为推荐方案",
      passed: winner.id !== "IV"
    }
  ];
}
