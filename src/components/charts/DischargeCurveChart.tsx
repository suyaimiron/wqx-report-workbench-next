"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dischargeCurve } from "@/data/curves";

export function DischargeCurveChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <LineChart data={dischargeCurve} margin={{ top: 16, right: 18, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="rgba(15, 45, 75, 0.12)" vertical={false} />
          <XAxis dataKey="level" tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} unit="m" />
          <YAxis tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} width={62} />
          <Tooltip formatter={(value) => [`${value} m³/s`, "泄量"]} labelFormatter={(label) => `下游水位 ${label} m`} />
          <Line type="monotone" dataKey="discharge" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: "#14B8C8" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
