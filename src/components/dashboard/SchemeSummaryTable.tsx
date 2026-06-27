import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { schemes } from "@/data/benchmark";
import { formatNumber } from "@/lib/format";
import type { CustomTrialResult, WorkbenchMode } from "@/lib/mode";

type SchemeSummaryTableProps = {
  mode: WorkbenchMode;
  trial?: CustomTrialResult;
};

export function SchemeSummaryTable({ mode, trial }: SchemeSummaryTableProps) {
  const recommendedId = mode === "report" ? "II" : trial?.recommendedSchemeId ?? "II";

  return (
    <Card className="overflow-hidden">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-basin-950">四方案对比表</h3>
        <Badge variant={mode === "report" ? "emerald" : "amber"}>
          {mode === "report" ? "报告基准" : "试算数据"}
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-separate border-spacing-y-2 text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="px-4 py-2">方案</th>
              <th className="px-4 py-2">正常蓄水位</th>
              <th className="px-4 py-2">防洪限制水位</th>
              <th className="px-4 py-2">总库容</th>
              <th className="px-4 py-2">装机容量</th>
              <th className="px-4 py-2">多年平均发电量</th>
              <th className="px-4 py-2">总年费用</th>
              <th className="px-4 py-2">推荐</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme, index) => {
              const active = scheme.id === recommendedId;
              const customCost =
                mode === "custom" && trial
                  ? scheme.id === recommendedId
                    ? trial.totalAnnualCost
                    : scheme.economy.totalAnnualCost + (index - 1) * 320
                  : scheme.economy.totalAnnualCost;

              return (
                <tr key={scheme.id} className={active ? "bg-cyan-100/90 shadow-glow" : "bg-white/70 shadow-sm"}>
                  <td className="rounded-l-2xl px-4 py-4 font-semibold text-basin-950">{scheme.name}</td>
                  <td className="px-4 py-4 numeric">{scheme.level} m</td>
                  <td className="px-4 py-4 numeric">{scheme.floodLimitLevel} m</td>
                  <td className="px-4 py-4 numeric">{scheme.totalStorage} 亿m³</td>
                  <td className="px-4 py-4 numeric">{scheme.capacity} 万kW</td>
                  <td className="px-4 py-4 numeric">{scheme.energy} 亿度</td>
                  <td className="px-4 py-4 numeric">{formatNumber(customCost)} 万元/年</td>
                  <td className="rounded-r-2xl px-4 py-4">
                    {active ? (
                      <Badge variant={mode === "report" ? "emerald" : "amber"}>
                        {mode === "report" ? "推荐方案" : "试算推荐"}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
