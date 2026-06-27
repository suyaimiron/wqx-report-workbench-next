"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { schemes } from "@/data/benchmark";
import type { CustomTrialResult, WorkbenchMode } from "@/lib/mode";

type EconomicBarChartProps = {
  mode: WorkbenchMode;
  trial?: CustomTrialResult;
};

export function EconomicBarChart({ mode, trial }: EconomicBarChartProps) {
  const recommendedId = mode === "report" ? "II" : trial?.recommendedSchemeId ?? "II";
  const data = schemes.map((scheme, index) => {
    const customShift =
      mode === "custom" && trial ? (index - 1) * 320 + (trial.totalAnnualCost - 33954.03) * 0.12 : 0;
    return {
      id: scheme.id,
      name: scheme.name,
      value:
        mode === "custom" && scheme.id === recommendedId && trial
          ? Number(trial.totalAnnualCost.toFixed(2))
          : Number((scheme.economy.totalAnnualCost + customShift).toFixed(2)),
      level: `${scheme.level} m`
    };
  });

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 30, right: 18, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="rgba(15, 45, 75, 0.12)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#36516B", fontSize: 13 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "#36516B", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={72}
            unit="万"
          />
          <Tooltip
            cursor={{ fill: "rgba(20,184,200,0.08)" }}
            contentStyle={{
              border: "1px solid rgba(20,184,200,0.28)",
              borderRadius: 16,
              boxShadow: "0 16px 40px rgba(1,14,32,0.18)"
            }}
            formatter={(value) => [`${value} 万元/年`, "总年费用"]}
            labelFormatter={(label) => `${label}`}
          />
          <Bar dataKey="value" radius={[14, 14, 6, 6]}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value: number) => value.toFixed(2)}
              fill="#102033"
              fontSize={12}
            />
            {data.map((entry) => (
              <Cell
                key={entry.id}
                fill={entry.id === recommendedId ? "#14B8C8" : "#8BA9C0"}
                stroke={entry.id === recommendedId ? "#0E7490" : "#6F879A"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
