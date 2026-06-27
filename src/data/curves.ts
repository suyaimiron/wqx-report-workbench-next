export const storageCurve = [
  { level: 80, storage: 32.4 },
  { level: 85, storage: 47.8 },
  { level: 90, storage: 62.1 },
  { level: 95, storage: 76.9 },
  { level: 100, storage: 91.5 },
  { level: 105, storage: 108.2 },
  { level: 110, storage: 124.1 },
  { level: 115, storage: 141.8 },
  { level: 120, storage: 162.2 },
  { level: 125, storage: 185.6 }
];

export const dischargeCurve = [
  { level: 82, discharge: 980 },
  { level: 86, discharge: 1580 },
  { level: 90, discharge: 2450 },
  { level: 94, discharge: 3820 },
  { level: 98, discharge: 6120 },
  { level: 102, discharge: 9300 },
  { level: 106, discharge: 13600 },
  { level: 110, discharge: 18800 },
  { level: 114, discharge: 25100 },
  { level: 118, discharge: 32700 }
];

export const dispatchSeries = [
  { month: "1月", upper: 115, lower: 92.2, operation: 103.5 },
  { month: "2月", upper: 115, lower: 92.2, operation: 101.8 },
  { month: "3月", upper: 115, lower: 92.2, operation: 99.6 },
  { month: "4月", upper: 115, lower: 92.2, operation: 96.2 },
  { month: "5月", upper: 113.4, lower: 92.2, operation: 101.1 },
  { month: "6月", upper: 113.4, lower: 92.2, operation: 108.4 },
  { month: "7月", upper: 113.4, lower: 92.2, operation: 112.1 },
  { month: "8月", upper: 113.4, lower: 92.2, operation: 111.6 },
  { month: "9月", upper: 115, lower: 92.2, operation: 109.8 },
  { month: "10月", upper: 115, lower: 92.2, operation: 107.2 },
  { month: "11月", upper: 115, lower: 92.2, operation: 105.4 },
  { month: "12月", upper: 115, lower: 92.2, operation: 104.1 }
];

export const repeatCapacitySeries = [
  { capacity: 85, energy: 52.2, hours: 3540 },
  { capacity: 95, energy: 57.6, hours: 3180 },
  { capacity: 105, energy: 62.8, hours: 2860 },
  { capacity: 115, energy: 66.9, hours: 2580 },
  { capacity: 127.44, energy: 69.25, hours: 2500 },
  { capacity: 140, energy: 70.4, hours: 2180 }
];

export const floodProcessSeries = [
  { hour: "0h", inflow: 6400, outflow: 5200, level: 113.4 },
  { hour: "6h", inflow: 12800, outflow: 9300, level: 114.6 },
  { hour: "12h", inflow: 24600, outflow: 16400, level: 118.2 },
  { hour: "18h", inflow: 36800, outflow: 27100, level: 122.7 },
  { hour: "24h", inflow: 42100, outflow: 40348, level: 125.08 },
  { hour: "30h", inflow: 33800, outflow: 38500, level: 123.6 },
  { hour: "36h", inflow: 20500, outflow: 27200, level: 120.8 },
  { hour: "42h", inflow: 11600, outflow: 16800, level: 117.2 },
  { hour: "48h", inflow: 7200, outflow: 9300, level: 114.7 }
];
