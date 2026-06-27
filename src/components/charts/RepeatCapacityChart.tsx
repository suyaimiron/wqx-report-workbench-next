"use client";

import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { repeatCapacitySeries } from "@/data/curves";

export function RepeatCapacityChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <ComposedChart data={repeatCapacitySeries} margin={{ top: 16, right: 18, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="rgba(15, 45, 75, 0.12)" vertical={false} />
          <XAxis dataKey="capacity" tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} unit="万kW" />
          <YAxis yAxisId="left" tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} width={54} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} width={54} />
          <Tooltip />
          <Line yAxisId="left" name="多年平均电能" type="monotone" dataKey="energy" stroke="#14B8C8" strokeWidth={3} dot={{ r: 4 }} />
          <Line yAxisId="right" name="利用小时" type="monotone" dataKey="hours" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
