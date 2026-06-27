"use client";

import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card } from "@/components/ui/Card";

type Point = {
  x: number;
  y: number;
};

type RepeatPlan = {
  id: string;
  name: string;
  energyPoint: Point;
  repeatPoint: Point;
  energy: Point[];
  hours: Point[];
};

const plans: RepeatPlan[] = [
  {
    id: "I",
    name: "方案 I",
    energyPoint: { x: 143.43, y: 73.93 },
    repeatPoint: { x: 0, y: 2500 },
    energy: [
      { x: 143, y: 73.6 },
      { x: 144, y: 73.8 },
      { x: 145, y: 74.0 },
      { x: 146, y: 74.1 },
      { x: 147, y: 74.3 },
      { x: 148, y: 74.5 },
      { x: 149, y: 74.7 },
      { x: 150, y: 74.9 },
      { x: 151, y: 75.05 },
      { x: 152, y: 75.22 },
      { x: 153, y: 75.4 },
      { x: 154, y: 75.52 },
      { x: 155, y: 75.64 },
      { x: 156, y: 75.78 },
      { x: 157, y: 75.95 },
      { x: 158, y: 76.1 },
      { x: 159, y: 76.25 },
      { x: 160, y: 76.35 },
      { x: 161, y: 76.52 },
      { x: 162, y: 76.65 },
      { x: 163, y: 76.78 }
    ],
    hours: [1900, 2000, 1100, 2000, 2000, 1800, 1700, 1900, 1700, 1800, 1200, 1200, 1300, 1700, 1500, 1800, 1000, 1600, 1300, 1300].map((y, index) => ({
      x: index + 1,
      y
    }))
  },
  {
    id: "II",
    name: "方案 II",
    energyPoint: { x: 127.44, y: 69.25 },
    repeatPoint: { x: 9.92, y: 2500 },
    energy: [
      { x: 118, y: 66.7 },
      { x: 119, y: 67.0 },
      { x: 120, y: 67.25 },
      { x: 121, y: 67.55 },
      { x: 122, y: 67.85 },
      { x: 123, y: 68.12 },
      { x: 124, y: 68.38 },
      { x: 125, y: 68.62 },
      { x: 126, y: 68.9 },
      { x: 127, y: 69.12 },
      { x: 128, y: 69.38 },
      { x: 129, y: 69.7 },
      { x: 130, y: 70.0 },
      { x: 131, y: 70.25 },
      { x: 132, y: 70.5 },
      { x: 133, y: 70.75 },
      { x: 134, y: 70.98 },
      { x: 135, y: 71.18 },
      { x: 136, y: 71.38 },
      { x: 137, y: 71.58 }
    ],
    hours: [2700, 2800, 2900, 3300, 2500, 2600, 2300, 2900, 2300, 2500, 1800, 2300, 2400, 2400, 2200, 2600, 2400, 2100, 2100, 1900].map((y, index) => ({
      x: index + 1,
      y
    }))
  },
  {
    id: "III",
    name: "方案 III",
    energyPoint: { x: 107.97, y: 61.78 },
    repeatPoint: { x: 16.95, y: 2500 },
    energy: [
      { x: 91, y: 56.2 },
      { x: 92, y: 56.5 },
      { x: 93, y: 56.85 },
      { x: 94, y: 57.2 },
      { x: 95, y: 57.6 },
      { x: 96, y: 57.95 },
      { x: 97, y: 58.3 },
      { x: 98, y: 58.65 },
      { x: 99, y: 58.95 },
      { x: 100, y: 59.2 },
      { x: 101, y: 59.5 },
      { x: 102, y: 59.82 },
      { x: 103, y: 60.15 },
      { x: 104, y: 60.5 },
      { x: 105, y: 60.85 },
      { x: 106, y: 61.2 },
      { x: 107, y: 61.55 },
      { x: 108, y: 61.8 },
      { x: 109, y: 62.05 },
      { x: 110, y: 62.28 }
    ],
    hours: [3300, 3400, 3700, 3900, 3400, 3400, 3600, 3100, 2600, 3000, 3100, 3200, 3700, 3400, 3300, 3500, 2800, 3100, 3000, 2700].map((y, index) => ({
      x: index + 1,
      y
    }))
  },
  {
    id: "IV",
    name: "方案 IV",
    energyPoint: { x: 102.24, y: 53.52 },
    repeatPoint: { x: 34.82, y: 2500 },
    energy: [
      { x: 68, y: 42.0 },
      { x: 69, y: 42.4 },
      { x: 70, y: 42.9 },
      { x: 71, y: 43.4 },
      { x: 72, y: 43.8 },
      { x: 73, y: 44.2 },
      { x: 74, y: 44.6 },
      { x: 75, y: 45.0 },
      { x: 76, y: 45.4 },
      { x: 77, y: 45.8 },
      { x: 78, y: 46.2 },
      { x: 79, y: 46.55 },
      { x: 80, y: 46.9 },
      { x: 81, y: 47.25 },
      { x: 82, y: 47.55 },
      { x: 83, y: 47.8 },
      { x: 84, y: 48.05 },
      { x: 85, y: 48.28 },
      { x: 86, y: 48.5 },
      { x: 102.24, y: 53.52 }
    ],
    hours: [3600, 3500, 3300, 3400, 3300, 3400, 3300, 3300, 3300, 3300, 3400, 3300, 3200, 3100, 3100, 3100, 3000, 3000, 3000, 3000, 2850, 2700, 2500].map((y, index) => ({
      x: index < 20 ? index + 1 : index === 20 ? 25 : index === 21 ? 30 : 34.82,
      y
    }))
  }
];

const axisTick = { fill: "#36516B", fontSize: 12 };

function formatTooltip(value: number | string, name: string): [string, string] {
  const numeric = typeof value === "number" ? value.toFixed(2) : value;
  return [String(numeric), name];
}

function EnergyChart({ plan }: { plan: RepeatPlan }) {
  return (
    <div className="h-[330px] w-full rounded-3xl border border-slate-200 bg-white/92 p-4">
      <ResponsiveContainer>
        <LineChart data={plan.energy} margin={{ top: 18, right: 24, left: 0, bottom: 18 }}>
          <CartesianGrid stroke="rgba(15, 45, 75, 0.12)" />
          <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tick={axisTick} axisLine={false} tickLine={false}>
            <Label value="装机容量 NY (万kW)" position="bottom" offset={0} fill="#36516B" fontSize={12} />
          </XAxis>
          <YAxis dataKey="y" type="number" domain={["dataMin - 0.4", "dataMax + 0.4"]} tick={axisTick} axisLine={false} tickLine={false} width={48}>
            <Label value="多年平均电能 E (亿kW·h)" angle={-90} position="insideLeft" fill="#36516B" fontSize={12} />
          </YAxis>
          <Tooltip formatter={formatTooltip} labelFormatter={(label) => `NY=${label} 万kW`} />
          <Legend verticalAlign="top" height={28} />
          <Line name="计算点" type="monotone" dataKey="y" stroke="#256FA8" strokeWidth={3} dot={{ r: 3 }} isAnimationActive={false} />
          <Scatter name="选定点" dataKey="y" data={[plan.energyPoint]} fill="#D94B63" shape="circle" />
          <ReferenceLine x={plan.energyPoint.x} stroke="#D94B63" strokeDasharray="5 5" />
          <ReferenceLine y={plan.energyPoint.y} stroke="#D94B63" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function HoursChart({ plan }: { plan: RepeatPlan }) {
  return (
    <div className="h-[330px] w-full rounded-3xl border border-slate-200 bg-white/92 p-4">
      <ResponsiveContainer>
        <LineChart data={plan.hours} margin={{ top: 18, right: 24, left: 0, bottom: 18 }}>
          <CartesianGrid stroke="rgba(15, 45, 75, 0.12)" />
          <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tick={axisTick} axisLine={false} tickLine={false}>
            <Label value="重复容量 N重 (万kW)" position="bottom" offset={0} fill="#36516B" fontSize={12} />
          </XAxis>
          <YAxis dataKey="y" type="number" domain={["dataMin - 120", "dataMax + 160"]} tick={axisTick} axisLine={false} tickLine={false} width={56}>
            <Label value="补充千瓦利用小时数 h利 (h)" angle={-90} position="insideLeft" fill="#36516B" fontSize={12} />
          </YAxis>
          <Tooltip formatter={formatTooltip} labelFormatter={(label) => `N重=${label} 万kW`} />
          <Legend verticalAlign="top" height={28} />
          <ReferenceLine y={2500} stroke="#64748B" strokeDasharray="6 5" label={{ value: "h经济=2500h", fill: "#64748B", fontSize: 12 }} />
          <Line name="计算点" type="linear" dataKey="y" stroke="#256FA8" strokeWidth={3} dot={{ r: 3 }} isAnimationActive={false} />
          <Scatter name="选定点" dataKey="y" data={[plan.repeatPoint]} fill="#D94B63" shape="circle" />
          <ReferenceLine x={plan.repeatPoint.x} stroke="#D94B63" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RepeatCapacityDashboard() {
  return (
    <div className="space-y-6">
      {plans.map((plan) => (
        <Card key={plan.id}>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-basin-950">{plan.name} 重复容量与电能</h3>
              <p className="mt-1 text-sm text-slate-600">
                选定点：NY={plan.energyPoint.x} 万kW，E={plan.energyPoint.y} 亿度；N重={plan.repeatPoint.x} 万kW，h利={plan.repeatPoint.y} h
              </p>
            </div>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <div>
              <EnergyChart plan={plan} />
              <p className="mt-3 px-2 text-base font-semibold text-basin-950">{plan.name} NY-E 关系线</p>
            </div>
            <div>
              <HoursChart plan={plan} />
              <p className="mt-3 px-2 text-base font-semibold text-basin-950">{plan.name} N重-h利关系线</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
