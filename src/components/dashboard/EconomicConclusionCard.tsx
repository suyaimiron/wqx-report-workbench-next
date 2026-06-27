import { Card } from "@/components/ui/Card";
import { recommendationText } from "@/data/benchmark";
import type { WorkbenchMode } from "@/lib/mode";

type EconomicConclusionCardProps = {
  mode: WorkbenchMode;
};

export function EconomicConclusionCard({ mode }: EconomicConclusionCardProps) {
  return (
    <Card className="h-full">
      <h3 className="mb-4 text-xl font-semibold text-basin-950">经济优选结论</h3>
      <p className="text-sm leading-7 text-slate-700 md:text-base">
        {mode === "report"
          ? recommendationText
          : "当前为自定义试算结果，基于用户上传数据与简化模型计算，仅用于方案对比演示，不作为正式结论。"}
      </p>
    </Card>
  );
}
