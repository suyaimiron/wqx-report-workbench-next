"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dispatchSeries } from "@/data/curves";

export function DispatchChart() {
  return (
    <div className="h-[330px] w-full">
      <ResponsiveContainer>
        <LineChart data={dispatchSeries} margin={{ top: 16, right: 18, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="rgba(15, 45, 75, 0.12)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} width={54} unit="m" />
          <Tooltip formatter={(value) => [`${value} m`, ""]} />
          <Legend />
          <Line name="上包线" type="monotone" dataKey="upper" stroke="#2563EB" strokeWidth={2.5} dot={false} />
          <Line name="下包线" type="monotone" dataKey="lower" stroke="#94A3B8" strokeWidth={2.5} dot={false} />
          <Line name="运行线" type="monotone" dataKey="operation" stroke="#14B8C8" strokeWidth={3.5} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
