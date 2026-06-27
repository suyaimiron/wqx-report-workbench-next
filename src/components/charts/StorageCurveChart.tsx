"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { storageCurve } from "@/data/curves";

export function StorageCurveChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <AreaChart data={storageCurve} margin={{ top: 16, right: 18, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="storageFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#14B8C8" stopOpacity={0.52} />
              <stop offset="95%" stopColor="#14B8C8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(15, 45, 75, 0.12)" vertical={false} />
          <XAxis dataKey="level" tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} unit="m" />
          <YAxis tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} width={54} unit="亿" />
          <Tooltip formatter={(value) => [`${value} 亿m³`, "库容"]} labelFormatter={(label) => `水位 ${label} m`} />
          <Area type="monotone" dataKey="storage" stroke="#0891B2" strokeWidth={3} fill="url(#storageFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
