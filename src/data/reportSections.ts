import type { PageKey } from "@/lib/mode";

export type ReportImage = {
  title: string;
  src: string;
  alt: string;
};

export type ReportImageGroup = {
  title: string;
  columns?: 2 | 3 | 4;
  images: ReportImage[];
};

export type ReportTable = {
  title: string;
  headers: string[];
  rows: string[][];
};

export type ReportSection = {
  key: Exclude<PageKey, "observatory">;
  order: number;
  title: string;
  process: string[];
  results: { label: string; value: string }[];
  images?: ReportImage[];
  imageGroups?: ReportImageGroup[];
  tables?: ReportTable[];
  chart?: "annualCost" | "repeatCapacity";
};

const dispatch = "/report-images/dispatch";
const flood = "/report-images/flood";
const floodStorage = "/report-images/economy";

export const deadwaterStorageTable: ReportTable = {
  title: "表 3-2-5 各方案死水位及相关库容结果表",
  headers: ["方案", "正常蓄水位 (m)", "正常库容 (m3/s·月)", "最终死水位 (m)", "死库容 (m3/s·月)", "兴利库容 (m3/s·月)"],
  rows: [
    ["方案 I", "120.00", "2183.43", "95.50", "553.31", "1630.12"],
    ["方案 II", "115.00", "1726.50", "92.21", "442.91", "1283.59"],
    ["方案 III", "108.00", "1156.45", "87.59", "321.63", "834.82"],
    ["方案 IV", "100.00", "703.96", "82.34", "218.22", "485.74"]
  ]
};

export const guaranteeOutputTable: ReportTable = {
  title: "表 3-3-2 保证出力成果表",
  headers: ["方案", "I", "II", "III", "IV"],
  rows: [["保证出力 / 万kW", "41.32", "35.34", "27.84", "21.47"]]
};

export const capacityResultTable: ReportTable = {
  title: "表 3-4-1 水电站装机容量成果表",
  headers: ["指标", "方案 I", "方案 II", "方案 III", "方案 IV"],
  rows: [
    ["保证出力 Np (万kW)", "41.32", "35.34", "27.84", "21.47"],
    ["航运基荷 N工,基 (万kW)", "10", "10", "10", "10"],
    ["峰荷保证出力 N峰 (万kW)", "31.32", "25.34", "17.84", "11.47"],
    ["峰荷工作容量 N工,峰 (万kW)", "103.5", "85.05", "61.94", "42.31"],
    ["工作容量 N工 (万kW)", "113.47", "95.05", "71.94", "52.31"],
    ["备用容量 N备 (万kW)", "30", "25", "20", "15"],
    ["必需容量 N必 (万kW)", "143.47", "120.05", "91.94", "67.31"]
  ]
};

export const indicatorTable: ReportTable = {
  title: "四个方案水利指标汇总表",
  headers: ["项目", "单位", "方案 I", "方案 II", "方案 III", "方案 IV"],
  rows: [
    ["正常高水位", "m", "120", "115", "108", "100"],
    ["设计洪水位", "m", "132.43", "125.08", "119.74", "110.02"],
    ["校核洪水位", "m", "136.05", "129.01", "123.20", "113.25"],
    ["死水位", "m", "95.50", "92.21", "87.59", "82.34"],
    ["防洪限制水位", "m", "119.97", "113.40", "104.85", "94.62"],
    ["防洪高水位", "m", "123.14", "116.19", "110.20", "101.40"],
    ["总库容", "亿m3", "129.25", "91.31", "69.40", "41.14"],
    ["兴利库容", "亿m3", "42.82", "33.71", "21.93", "12.76"],
    ["防洪库容", "亿m3", "11.91", "6.69", "8.13", "6.81"],
    ["兴利防洪结合库容", "亿m3", "0.07", "3.84", "4.68", "4.73"],
    ["设计洪水最大泄流量", "m3/s", "35017", "40348", "44098", "49322"],
    ["校核洪水位最大泄流量", "m3/s", "42530", "50063", "52883", "58795"],
    ["保证出力", "kW", "413200", "353400", "278400", "214700"],
    ["工作容量", "万kW", "113.47", "95.05", "71.94", "52.31"],
    ["备用容量", "万kW", "30", "25", "20", "15"],
    ["重复容量", "万kW", "0.00", "9.92", "16.95", "34.82"],
    ["重复容量利用小时", "h", "2500", "2500", "2500", "2500"],
    ["装机容量", "万kW", "143.43", "127.44", "107.97", "102.24"],
    ["多年平均发电量", "亿度", "73.93", "69.25", "61.78", "53.52"],
    ["库容系数", "-", "-", "-", "-", "-"],
    ["调节系数", "-", "-", "-", "-", "-"],
    ["径流利用系数", "%", "98.45", "91.65", "89.12", "70.90"]
  ]
};

export const reportSections: ReportSection[] = [
  {
    key: "deadwater",
    order: 1,
    title: "水电站死水位选择及保证出力 Np 计算",
    process: [
      "比较四个正常蓄水位方案下的正常库容、最终死水位、死库容与兴利库容。",
      "按保证率要求统计保证出力，形成四方案保证出力成果。",
      "报告复现模式下，方案 II 死水位取 92.21 m，保证出力取 35.34 万kW。"
    ],
    results: [
      { label: "方案 II 死水位", value: "92.21 m" },
      { label: "方案 II 保证出力", value: "35.34 万kW" },
      { label: "方案 II 兴利库容", value: "1283.59 m3/s·月" },
      { label: "报告依据", value: "表 3-2-5、表 3-3-2" }
    ],
    tables: [deadwaterStorageTable, guaranteeOutputTable]
  },
  {
    key: "capacity",
    order: 2,
    title: "水电站装机容量选择",
    process: [
      "以保证出力、航运基荷、峰荷工作容量、备用容量为基础计算必需容量。",
      "四方案装机容量成果采用报告表 3-4-1。",
      "方案 II 的必需容量为 120.05 万kW，后续经济优选仍以年费用最小法为准。"
    ],
    results: [
      { label: "方案 II 保证出力", value: "35.34 万kW" },
      { label: "方案 II 工作容量", value: "95.05 万kW" },
      { label: "方案 II 备用容量", value: "25 万kW" },
      { label: "方案 II 必需容量", value: "120.05 万kW" }
    ],
    tables: [capacityResultTable]
  },
  {
    key: "dispatch",
    order: 3,
    title: "绘制水电站调度图",
    process: [
      "绘制各方案防破坏线、加大出力辅助线、正常蓄水位与汛限水位。",
      "四张调度图保持统一尺寸展示，便于横向比较。",
      "报告推荐方案 II，正常蓄水位 115 m，汛期限制水位 113.40 m。"
    ],
    results: [
      { label: "方案 II 正常蓄水位", value: "115 m" },
      { label: "方案 II 汛限水位", value: "113.40 m" },
      { label: "图件数量", value: "4 张调度图" },
      { label: "展示方式", value: "统一 2×2 排版" }
    ],
    imageGroups: [
      {
        title: "四方案调度图",
        columns: 2,
        images: [
          { title: "方案 I 调度图", src: `${dispatch}/dispatch-plan-i.png`, alt: "方案 I 调度图" },
          { title: "方案 II 调度图", src: `${dispatch}/dispatch-plan-ii.png`, alt: "方案 II 调度图" },
          { title: "方案 III 调度图", src: `${dispatch}/dispatch-plan-iii.png`, alt: "方案 III 调度图" },
          { title: "方案 IV 调度图", src: `${dispatch}/dispatch-plan-iv.png`, alt: "方案 IV 调度图" }
        ]
      }
    ]
  },
  {
    key: "repeat",
    order: 4,
    title: "求重复容量，计算水电站多年平均电能",
    process: [
      "分别展示四个方案的 NY-E 关系线和 N重-h利关系线。",
      "根据曲线选点确定装机容量、重复容量和多年平均发电量。",
      "页面曲线采用网页矢量图重绘，避免截图放大后模糊。"
    ],
    results: [
      { label: "方案 II 装机容量", value: "127.44 万kW" },
      { label: "方案 II 重复容量", value: "9.92 万kW" },
      { label: "方案 II 多年平均发电量", value: "69.25 亿度" },
      { label: "重复容量利用小时", value: "2500 h" }
    ],
    chart: "repeatCapacity"
  },
  {
    key: "flood",
    order: 5,
    title: "进行防洪计算，确定各种防洪特征水位及坝顶高程",
    process: [
      "每个方案分别展示二十年一遇、千年一遇、万年一遇三场洪水调洪过程。",
      "同一方案的三场洪水放在同一行，四个方案共四行。",
      "拦洪量频率曲线作为防洪效益计算依据，统一放在防洪计算部分展示。"
    ],
    results: [
      { label: "方案 II 防洪高水位", value: "116.19 m" },
      { label: "方案 II 设计洪水位", value: "125.08 m" },
      { label: "方案 II 校核洪水位", value: "129.01 m" },
      { label: "方案 II 坝顶高程", value: "130.37 m" }
    ],
    imageGroups: [
      {
        title: "方案 I 三场洪水调洪过程",
        columns: 3,
        images: [
          { title: "二十年一遇 P=5%", src: `${flood}/flood-plan-i-p5.png`, alt: "方案 I 二十年一遇调洪过程" },
          { title: "千年一遇 P=0.1%", src: `${flood}/flood-plan-i-p01.png`, alt: "方案 I 千年一遇调洪过程" },
          { title: "万年一遇 P=0.01%", src: `${flood}/flood-plan-i-p001.png`, alt: "方案 I 万年一遇调洪过程" }
        ]
      },
      {
        title: "方案 II 三场洪水调洪过程",
        columns: 3,
        images: [
          { title: "二十年一遇 P=5%", src: `${flood}/flood-plan-ii-p5.png`, alt: "方案 II 二十年一遇调洪过程" },
          { title: "千年一遇 P=0.1%", src: `${flood}/flood-plan-ii-p01.png`, alt: "方案 II 千年一遇调洪过程" },
          { title: "万年一遇 P=0.01%", src: `${flood}/flood-plan-ii-p001.png`, alt: "方案 II 万年一遇调洪过程" }
        ]
      },
      {
        title: "方案 III 三场洪水调洪过程",
        columns: 3,
        images: [
          { title: "二十年一遇 P=5%", src: `${flood}/flood-plan-iii-p5.png`, alt: "方案 III 二十年一遇调洪过程" },
          { title: "千年一遇 P=0.1%", src: `${flood}/flood-plan-iii-p01.png`, alt: "方案 III 千年一遇调洪过程" },
          { title: "万年一遇 P=0.01%", src: `${flood}/flood-plan-iii-p001.png`, alt: "方案 III 万年一遇调洪过程" }
        ]
      },
      {
        title: "方案 IV 三场洪水调洪过程",
        columns: 3,
        images: [
          { title: "二十年一遇 P=5%", src: `${flood}/flood-plan-iv-p5.png`, alt: "方案 IV 二十年一遇调洪过程" },
          { title: "千年一遇 P=0.1%", src: `${flood}/flood-plan-iv-p01.png`, alt: "方案 IV 千年一遇调洪过程" },
          { title: "万年一遇 P=0.01%", src: `${flood}/flood-plan-iv-p001.png`, alt: "方案 IV 万年一遇调洪过程" }
        ]
      },
      {
        title: "拦洪量频率曲线",
        columns: 4,
        images: [
          { title: "方案 I 拦洪量频率曲线", src: `${floodStorage}/flood-storage-plan-i.png`, alt: "方案 I 拦洪量频率曲线" },
          { title: "方案 II 拦洪量频率曲线", src: `${floodStorage}/flood-storage-plan-ii.png`, alt: "方案 II 拦洪量频率曲线" },
          { title: "方案 III 拦洪量频率曲线", src: `${floodStorage}/flood-storage-plan-iii.png`, alt: "方案 III 拦洪量频率曲线" },
          { title: "方案 IV 拦洪量频率曲线", src: `${floodStorage}/flood-storage-plan-iv.png`, alt: "方案 IV 拦洪量频率曲线" }
        ]
      }
    ]
  },
  {
    key: "indicators",
    order: 6,
    title: "求水利指标",
    process: [
      "按报告表 6-1 至表 6-4 录入四个方案的水利指标。",
      "网页中以可读表格展示，不再放截图。",
      "方案 II 作为推荐方案，在关键指标中重点核对。"
    ],
    results: [
      { label: "方案 II 总库容", value: "91.31 亿m3" },
      { label: "方案 II 防洪库容", value: "6.69 亿m3" },
      { label: "方案 II 装机容量", value: "127.44 万kW" },
      { label: "方案 II 多年平均发电量", value: "69.25 亿度" }
    ],
    tables: [indicatorTable]
  },
  {
    key: "economy",
    order: 7,
    title: "经济计算，比较方案优劣",
    process: [
      "按年费用最小法比较四个方案总年费用。",
      "总年费用依次为 37544.43、33954.03、35965.11、38151.99 万元/年。",
      "方案 II 总年费用最低，因此最终推荐方案 II。"
    ],
    results: [
      { label: "方案 I 总年费用", value: "37544.43 万元/年" },
      { label: "方案 II 总年费用", value: "33954.03 万元/年" },
      { label: "方案 III 总年费用", value: "35965.11 万元/年" },
      { label: "方案 IV 总年费用", value: "38151.99 万元/年" }
    ],
    chart: "annualCost"
  }
];

export function getReportSection(key: PageKey) {
  return reportSections.find((section) => section.key === key);
}
