import { schemes } from "./benchmark";

export const economicBarData = schemes.map((scheme) => ({
  name: scheme.name,
  value: scheme.economy.totalAnnualCost,
  level: scheme.level,
  recommended: scheme.id === "II"
}));

export const sensitivityData = [
  { factor: "投资 +5%", planI: 39420, planII: 35712, planIII: 37681, planIV: 39820 },
  { factor: "投资基准", planI: 37544, planII: 33954, planIII: 35965, planIV: 38152 },
  { factor: "火电费 +5%", planI: 37544, planII: 34088, planIII: 36267, planIV: 38618 },
  { factor: "防洪效益 -5%", planI: 37857, planII: 34251, planIII: 36267, planIV: 38449 }
];

export const archiveRows = [
  { name: "径流资料", source: "原始数据及说明/data_new.xlsx", records: "372 条月径流", state: "已归档" },
  { name: "水位库容曲线", source: "原始数据及说明/Z_v.dat", records: "基础曲线", state: "已归档" },
  { name: "水位流量曲线", source: "原始数据及说明/z_q.dat", records: "下泄能力", state: "已归档" },
  { name: "设计洪水", source: "原始数据及说明/设计洪水.xls", records: "三种频率", state: "已归档" },
  { name: "报告基准表", source: "报告.docx", records: "表 5-7 与关键指标", state: "已复核" }
];
