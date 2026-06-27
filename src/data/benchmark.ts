export type SchemeId = "I" | "II" | "III" | "IV";

export type SchemeBenchmark = {
  id: SchemeId;
  name: string;
  shortName: string;
  level: number;
  deadLevel: number;
  floodLimitLevel: number;
  floodHighLevel: number;
  designFloodLevel: number;
  checkFloodLevel: number;
  totalStorage: number;
  floodStorage: number;
  combinedStorage: number;
  damCrestLevel: number;
  designMaxDischarge: number;
  checkMaxDischarge: number;
  capacity: number;
  energy: number;
  runoffUtilization: number;
  economy: {
    constructionEndValue: number;
    equivalentAnnualCostBase: number;
    equivalentAnnualCost: number;
    hydroOperationCost: number;
    thermalOperationCost: number;
    floodBenefit: number;
    netAnnualCost: number;
    totalAnnualCost: number;
  };
};

export const reportMetrics = {
  project: "五强溪水电站",
  title: "水利计算可复核决策工作台",
  recommendedSchemeId: "II" as SchemeId,
  recommendedScheme: "方案Ⅱ",
  recommendedLevel: 115,
  minTotalAnnualCost: 33954.03,
  recommendedCapacity: 127.44,
  recommendedEnergy: 69.25,
  method: "年费用最小法",
  year: "2026"
};

export const schemes: SchemeBenchmark[] = [
  {
    id: "I",
    name: "方案Ⅰ",
    shortName: "Ⅰ",
    level: 120,
    deadLevel: 95.5,
    floodLimitLevel: 119.97,
    floodHighLevel: 123.14,
    designFloodLevel: 132.43,
    checkFloodLevel: 136.05,
    totalStorage: 129.25,
    floodStorage: 11.91,
    combinedStorage: 0.07,
    damCrestLevel: 137.42,
    designMaxDischarge: 35017,
    checkMaxDischarge: 42530,
    capacity: 143.43,
    energy: 73.93,
    runoffUtilization: 98.45,
    economy: {
      constructionEndValue: 409763.06,
      equivalentAnnualCostBase: 409763.06,
      equivalentAnnualCost: 41328.36,
      hydroOperationCost: 2468.34,
      thermalOperationCost: 0,
      floodBenefit: 6252.28,
      netAnnualCost: 3783.94,
      totalAnnualCost: 37544.43
    }
  },
  {
    id: "II",
    name: "方案Ⅱ",
    shortName: "Ⅱ",
    level: 115,
    deadLevel: 92.21,
    floodLimitLevel: 113.4,
    floodHighLevel: 116.19,
    designFloodLevel: 125.08,
    checkFloodLevel: 129.01,
    totalStorage: 91.31,
    floodStorage: 6.69,
    combinedStorage: 3.84,
    damCrestLevel: 130.37,
    designMaxDischarge: 40348,
    checkMaxDischarge: 50063,
    capacity: 127.44,
    energy: 69.25,
    runoffUtilization: 91.65,
    economy: {
      constructionEndValue: 348629.77,
      equivalentAnnualCostBase: 348629.77,
      equivalentAnnualCost: 35162.51,
      hydroOperationCost: 2043.54,
      thermalOperationCost: 2679,
      floodBenefit: 5931.01,
      netAnnualCost: 1208.48,
      totalAnnualCost: 33954.03
    }
  },
  {
    id: "III",
    name: "方案Ⅲ",
    shortName: "Ⅲ",
    level: 108,
    deadLevel: 87.59,
    floodLimitLevel: 104.85,
    floodHighLevel: 110.2,
    designFloodLevel: 119.74,
    checkFloodLevel: 123.2,
    totalStorage: 69.4,
    floodStorage: 8.13,
    combinedStorage: 4.68,
    damCrestLevel: 124.56,
    designMaxDischarge: 44098,
    checkMaxDischarge: 52883,
    capacity: 107.97,
    energy: 61.78,
    runoffUtilization: 89.12,
    economy: {
      constructionEndValue: 340200.15,
      equivalentAnnualCostBase: 340200.15,
      equivalentAnnualCost: 34312.31,
      hydroOperationCost: 1653.15,
      thermalOperationCost: 6029.04,
      floodBenefit: 6029.39,
      netAnnualCost: 1652.8,
      totalAnnualCost: 35965.11
    }
  },
  {
    id: "IV",
    name: "方案Ⅳ",
    shortName: "Ⅳ",
    level: 100,
    deadLevel: 82.34,
    floodLimitLevel: 94.62,
    floodHighLevel: 101.4,
    designFloodLevel: 110.02,
    checkFloodLevel: 113.25,
    totalStorage: 41.14,
    floodStorage: 6.81,
    combinedStorage: 4.73,
    damCrestLevel: 114.61,
    designMaxDischarge: 49322,
    checkMaxDischarge: 58795,
    capacity: 102.24,
    energy: 53.52,
    runoffUtilization: 70.9,
    economy: {
      constructionEndValue: 330876.28,
      equivalentAnnualCostBase: 330876.28,
      equivalentAnnualCost: 33371.91,
      hydroOperationCost: 1398.05,
      thermalOperationCost: 9321.24,
      floodBenefit: 5939.21,
      netAnnualCost: 4780.08,
      totalAnnualCost: 38151.99
    }
  }
];

export const recommendationText =
  "按年费用最小法比较，方案Ⅱ总年费用最低，为 33954.03 万元/年，因此推荐方案Ⅱ（正常蓄水位 115 m）。方案Ⅳ虽然施工期末折算值较低，但替代火电站正常运行费较高，最终总年费用并非最低，不能作为推荐方案。";
