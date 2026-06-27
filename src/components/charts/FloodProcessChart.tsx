"use client";

import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { floodProcessSeries } from "@/data/curves";

export function FloodProcessChart() {
  return (
    <div className="h-[330px] w-full">
      <ResponsiveContainer>
        <ComposedChart data={floodProcessSeries} margin={{ top: 16, right: 18, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="floodFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.26} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(15, 45, 75, 0.12)" vertical={false} />
          <XAxis dataKey="hour" tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="flow" tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} width={62} />
          <YAxis yAxisId="level" orientation="right" tick={{ fill: "#36516B", fontSize: 12 }} axisLine={false} tickLine={false} width={52} />
          <Tooltip />
          <Area yAxisId="flow" name="入库流量" type="monotone" dataKey="inflow" stroke="#2563EB" fill="url(#floodFill)" />
          <Line yAxisId="flow" name="下泄流量" type="monotone" dataKey="outflow" stroke="#14B8C8" strokeWidth={3} dot={{ r: 4 }} />
          <Line yAxisId="level" name="库水位" type="monotone" dataKey="level" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
