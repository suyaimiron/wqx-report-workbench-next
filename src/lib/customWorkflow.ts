import { schemes } from "@/data/benchmark";
import type {
  CustomSchemeId,
  CustomStepKey,
  CustomStepOutput,
  CustomStepStatus,
  CustomWorkflowState,
  ParsedFileSummary
} from "./mode";

type InputFieldMeta = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  source: string;
  help: string;
};

export type StepInputSpec = {
  key: CustomStepKey;
  title: string;
  required: InputFieldMeta[];
  carried: InputFieldMeta[];
  library: InputFieldMeta[];
  advanced: InputFieldMeta[];
  dependencies: CustomStepKey[];
};

const stepOrder: CustomStepKey[] = [
  "deadwater",
  "capacity",
  "dispatch",
  "repeat",
  "flood",
  "indicators",
  "economy"
];

const stepNames: Record<CustomStepKey, string> = {
  deadwater: "死水位与保证出力",
  capacity: "装机容量选择",
  dispatch: "调度图绘制",
  repeat: "重复容量与电能",
  flood: "防洪计算",
  indicators: "水利指标",
  economy: "经济计算"
};

export function createInitialWorkflowState(): CustomWorkflowState {
  const statuses = stepOrder.reduce(
    (record, key) => ({ ...record, [key]: "empty" as CustomStepStatus }),
    {} as Record<CustomStepKey, CustomStepStatus>
  );

  return {
    selectedSchemeIds: ["I", "II", "III", "IV"],
    statuses,
    outputs: {}
  };
}

export function getStepOrder() {
  return stepOrder;
}

export function getStepInputSpec(key: CustomStepKey, state: CustomWorkflowState): StepInputSpec {
  const carriedFromDeadwater = state.outputs.deadwater
    ? "已由第 1 步计算得到"
    : "等待第 1 步计算";
  const carriedFromCapacity = state.outputs.capacity
    ? "已由第 2 步计算得到"
    : "等待第 2 步计算";
  const carriedFromDispatch = state.outputs.dispatch
    ? "已由第 3 步计算得到"
    : "等待第 3 步计算";
  const carriedFromRepeat = state.outputs.repeat
    ? "已由第 4 步计算得到"
    : "等待第 4 步计算";
  const carriedFromFlood = state.outputs.flood
    ? "已由第 5 步计算得到"
    : "等待第 5 步计算";

  const specs: Record<CustomStepKey, StepInputSpec> = {
    deadwater: {
      key,
      title: "1. 死水位与保证出力输入",
      dependencies: [],
      required: [
        {
          id: "schemes",
          label: "方案选择",
          value: state.selectedSchemeIds.map((id) => `方案 ${id}`).join("、"),
          source: "指导书表 1",
          help: "指导书表 1 给出四个正常蓄水位比较方案。默认全选，只有做局部复核时才需要取消某些方案。"
        },
        {
          id: "runoff",
          label: "径流资料来源",
          value: state.runoffSource?.fileName ?? "指导书原始径流资料",
          source: "原始水文资料",
          help: "可直接使用指导书原始月平均流量资料；如做自定义试算，可上传含月份和流量字段的 CSV、XLSX 或 XLS。"
        }
      ],
      carried: [],
      library: [
        {
          id: "zv",
          label: "Z-V 曲线",
          value: "已内置",
          source: "指导书水位库容曲线",
          help: "用于由水位查库容、由库容反查水位，用户无需重复输入。"
        },
        {
          id: "guarantee-rate",
          label: "设计保证率",
          value: "87.5%",
          source: "指导书设计标准",
          help: "保证出力按设计保证率统计；需要改标准时可在高级参数中扩展。"
        },
        {
          id: "low-limit",
          label: "综合利用最低水位",
          value: "82.00",
          unit: "m",
          source: "指导书综合利用要求",
          help: "死水位不得低于综合利用最低水位，作为自动校核条件。"
        }
      ],
      advanced: [
        {
          id: "sediment-years",
          label: "泥沙淤积年限",
          value: "50",
          unit: "年",
          source: "指导书工程寿命",
          help: "默认按服务年限 50 年估算泥沙淤积影响。"
        }
      ]
    },
    capacity: {
      key,
      title: "2. 装机容量输入",
      dependencies: ["deadwater"],
      required: [],
      carried: [
        {
          id: "np",
          label: "各方案保证出力 Np",
          value: carriedFromDeadwater,
          unit: "万kW",
          source: "第 1 步输出",
          help: "保证出力由死水位与长系列计算得到，装机容量页面不再要求用户重复输入。"
        }
      ],
      library: [
        {
          id: "navigation-base",
          label: "航运基荷",
          value: "10",
          unit: "万kW",
          source: "指导书原始资料",
          help: "航运基荷为固定约束，默认直接进入装机容量计算。"
        },
        {
          id: "reserve",
          label: "备用容量",
          value: "30 / 25 / 20 / 15",
          unit: "万kW",
          source: "指导书方案参数",
          help: "四方案备用容量随正常蓄水位方案固定，默认无需修改。"
        }
      ],
      advanced: [
        {
          id: "peak-formula",
          label: "峰荷工作容量公式",
          value: "N工,峰 = 3.08N峰 + 7",
          source: "指导书计算流程",
          help: "用于由峰荷保证出力推算峰荷工作容量。"
        }
      ]
    },
    dispatch: {
      key,
      title: "3. 调度图输入",
      dependencies: ["deadwater", "capacity"],
      required: [],
      carried: [
        {
          id: "deadwater-output",
          label: "死水位、兴利库容",
          value: carriedFromDeadwater,
          source: "第 1 步输出",
          help: "调度图需要死水位和兴利库容，系统会直接读取第 1 步结果。"
        },
        {
          id: "capacity-output",
          label: "保证出力、装机容量",
          value: carriedFromCapacity,
          source: "第 2 步输出",
          help: "加大出力辅助线由保证出力和装机容量共同确定。"
        }
      ],
      library: [
        {
          id: "dispatch-runoff",
          label: "防破坏线径流序列",
          value: "已内置",
          source: "指导书长系列径流资料",
          help: "用于按逆时序等出力原则推求防破坏线。"
        }
      ],
      advanced: [
        {
          id: "assist-lines",
          label: "加大出力辅助线级数",
          value: "4",
          source: "指导书绘图规则",
          help: "默认按四级辅助线绘制；一般无需修改。"
        }
      ]
    },
    repeat: {
      key,
      title: "4. 重复容量与电能输入",
      dependencies: ["deadwater", "capacity", "dispatch"],
      required: [],
      carried: [
        {
          id: "dispatch-output",
          label: "调度图与汛限水位",
          value: carriedFromDispatch,
          source: "第 3 步输出",
          help: "重复容量试算需要调度图控制线，系统会直接读取第 3 步结果。"
        },
        {
          id: "necessary-capacity",
          label: "必需容量",
          value: carriedFromCapacity,
          source: "第 2 步输出",
          help: "装机容量由必需容量与重复容量共同确定。"
        }
      ],
      library: [
        {
          id: "economic-hours",
          label: "经济利用小时数",
          value: "2500",
          unit: "h",
          source: "指导书重复容量判别标准",
          help: "N重-h利曲线按 2500 h 选择重复容量。"
        },
        {
          id: "fengtan",
          label: "凤滩影响扣减",
          value: "已内置",
          source: "指导书原始资料",
          help: "方案 I、II 的发电量受凤滩影响，系统在电能结果中自动扣减。"
        }
      ],
      advanced: [
        {
          id: "repeat-step",
          label: "重复容量试算步长",
          value: "自动",
          source: "网页试算设置",
          help: "系统按方案容量范围自动生成试算点，减少用户输入。"
        }
      ]
    },
    flood: {
      key,
      title: "5. 防洪计算输入",
      dependencies: ["dispatch"],
      required: [],
      carried: [
        {
          id: "flood-limit",
          label: "汛限水位",
          value: carriedFromDispatch,
          source: "第 3 步输出",
          help: "防洪调算起始水位采用调度图确定的汛限水位。"
        }
      ],
      library: [
        {
          id: "flood-process",
          label: "三场设计洪水过程",
          value: state.floodSource?.fileName ?? "指导书默认洪水过程",
          source: "指导书设计洪水资料",
          help: "默认包含二十年一遇、千年一遇、万年一遇洪水过程；做自定义时可上传同结构表格。"
        },
        {
          id: "safe-discharge",
          label: "下游安全泄量",
          value: "20000",
          unit: "m3/s",
          source: "指导书防洪标准",
          help: "下游防洪标准对应安全泄量，默认不需要手动输入。"
        }
      ],
      advanced: [
        {
          id: "spillway",
          label: "泄洪建筑物参数",
          value: "已内置",
          source: "指导书泄洪建筑物表",
          help: "含溢洪道孔数、闸门尺寸、中孔参数等。"
        },
        {
          id: "wind",
          label: "风速与吹程",
          value: "12 m/s，15 km",
          source: "指导书坝顶高程计算参数",
          help: "用于波浪爬高和坝顶高程计算。"
        }
      ]
    },
    indicators: {
      key,
      title: "6. 水利指标输入",
      dependencies: ["deadwater", "capacity", "repeat", "flood"],
      required: [],
      carried: [
        {
          id: "indicator-source",
          label: "水利指标来源",
          value: [carriedFromDeadwater, carriedFromCapacity, carriedFromRepeat, carriedFromFlood].join("；"),
          source: "前 5 步输出",
          help: "水利指标页只汇总前面步骤，不要求用户补填表格。"
        }
      ],
      library: [],
      advanced: []
    },
    economy: {
      key,
      title: "7. 经济计算输入",
      dependencies: ["capacity", "repeat", "flood", "indicators"],
      required: [],
      carried: [
        {
          id: "economy-source",
          label: "装机、发电、防洪效益",
          value: [carriedFromCapacity, carriedFromRepeat, carriedFromFlood].join("；"),
          source: "前序步骤输出",
          help: "经济计算直接读取装机容量、年发电量和防洪计算结果。"
        }
      ],
      library: [
        {
          id: "economy-table",
          label: "经济资料",
          value: "已内置",
          source: "指导书经济参数表",
          help: "包含投资、年运行费、替代火电站参数、折算率等。"
        },
        {
          id: "method",
          label: "优选方法",
          value: "年费用最小法",
          source: "课程设计经济比较要求",
          help: "最终推荐以总年费用最低为准，不能用施工期末折算值替代。"
        }
      ],
      advanced: [
        {
          id: "discount",
          label: "折算与火电参数",
          value: "指导书默认",
          source: "指导书经济计算",
          help: "若做敏感性分析，可在后续版本开放经济参数表编辑。"
        }
      ]
    }
  };

  return specs[key];
}

export function getBlockedDependency(key: CustomStepKey, state: CustomWorkflowState) {
  const spec = getStepInputSpec(key, state);
  return spec.dependencies.find((dep) => state.statuses[dep] !== "calculated");
}

function sourceFactor(source?: ParsedFileSummary) {
  if (!source) return 0;
  const rowFactor = Math.min(Math.max((source.rowCount - 120) / 240, -0.18), 0.18);
  const numericFactor = Math.min(Math.max((source.numericFields.length - 3) / 40, -0.08), 0.12);
  return Number((rowFactor + numericFactor).toFixed(4));
}

function adjustedValue(value: number, schemeId: CustomSchemeId, source?: ParsedFileSummary) {
  const order = { I: 1.5, II: 0.5, III: -0.5, IV: -1.5 }[schemeId];
  return value * (1 + sourceFactor(source) * order);
}

function format(value: number, digits = 2) {
  return value.toLocaleString("zh-CN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function selectedSchemes(state: CustomWorkflowState) {
  return schemes.filter((scheme) => state.selectedSchemeIds.includes(scheme.id));
}

function versionHash(key: CustomStepKey, state: CustomWorkflowState) {
  return [
    key,
    state.selectedSchemeIds.join("-"),
    state.runoffSource?.fileName ?? "guide-runoff",
    state.runoffSource?.rowCount ?? "r0",
    state.floodSource?.fileName ?? "guide-flood",
    state.floodSource?.rowCount ?? "f0"
  ].join("|");
}

export function calculateCustomStep(key: CustomStepKey, state: CustomWorkflowState): CustomStepOutput {
  const rows: string[][] = [];
  const highlights: { label: string; value: string }[] = [];
  const activeSchemes = selectedSchemes(state);
  const generatedAt = new Date().toLocaleString("zh-CN");
  const note = state.runoffSource || state.floodSource
    ? "当前为自定义试算结果，已按上传数据摘要做示意修正，非报告正式结论。"
    : "当前使用指导书内置资料库计算，结果结构与报告复现模式一致。";

  if (key === "deadwater") {
    activeSchemes.forEach((scheme) => {
      const deadLevel = adjustedValue(scheme.deadLevel, scheme.id, state.runoffSource);
      rows.push([
        scheme.name,
        `${scheme.level} m`,
        `${format(deadLevel)} m`,
        `${format(adjustedValue(scheme.totalStorage * 0.34, scheme.id, state.runoffSource))} 亿m3`,
        `${format(adjustedValue(scheme.energy * 0.51, scheme.id, state.runoffSource))} 万kW`
      ]);
    });
    const recommended = activeSchemes.find((scheme) => scheme.id === "II") ?? activeSchemes[0];
    highlights.push(
      { label: "已计算方案", value: `${activeSchemes.length} 个` },
      { label: "推荐核对方案", value: recommended?.name ?? "未选择" },
      { label: "数据来源", value: state.runoffSource?.fileName ?? "指导书默认资料" },
      { label: "后续传递", value: "死水位、Np 已固化" }
    );
  }

  if (key === "capacity") {
    activeSchemes.forEach((scheme) => {
      const baseNp = scheme.id === "I" ? 41.32 : scheme.id === "II" ? 35.34 : scheme.id === "III" ? 27.84 : 21.47;
      const np = adjustedValue(baseNp, scheme.id, state.runoffSource);
      const peak = np - 10;
      const workPeak = 3.08 * peak + 7;
      const work = workPeak + 10;
      const reserve = scheme.id === "I" ? 30 : scheme.id === "II" ? 25 : scheme.id === "III" ? 20 : 15;
      rows.push([scheme.name, format(np), format(work), format(reserve, 0), format(work + reserve)]);
    });
    highlights.push(
      { label: "航运基荷", value: "10 万kW" },
      { label: "容量公式", value: "N工,峰=3.08N峰+7" },
      { label: "输入方式", value: "读取第 1 步 Np" },
      { label: "状态", value: "装机参数已固化" }
    );
  }

  if (key === "dispatch") {
    activeSchemes.forEach((scheme) => {
      rows.push([
        scheme.name,
        `${scheme.level} m`,
        `${format(scheme.deadLevel)} m`,
        `${format(scheme.floodLimitLevel)} m`,
        "4 条加大出力辅助线"
      ]);
    });
    highlights.push(
      { label: "辅助线级数", value: "4 级" },
      { label: "汛限水位来源", value: "防破坏线 7 月末位置" },
      { label: "图件", value: `${activeSchemes.length} 张调度图` },
      { label: "后续传递", value: "汛限水位已固化" }
    );
  }

  if (key === "repeat") {
    activeSchemes.forEach((scheme) => {
      rows.push([
        scheme.name,
        `${format(scheme.capacity)} 万kW`,
        `${format(scheme.id === "I" ? 0 : scheme.id === "II" ? 9.92 : scheme.id === "III" ? 16.95 : 34.82)} 万kW`,
        `${format(adjustedValue(scheme.energy, scheme.id, state.runoffSource))} 亿度`,
        `${format(scheme.runoffUtilization)}%`
      ]);
    });
    highlights.push(
      { label: "经济利用小时", value: "2500 h" },
      { label: "曲线输出", value: "NY-E / N重-h利" },
      { label: "凤滩影响", value: "方案 I、II 自动扣减" },
      { label: "后续传递", value: "电能结果已固化" }
    );
  }

  if (key === "flood") {
    activeSchemes.forEach((scheme) => {
      rows.push([
        scheme.name,
        `${format(scheme.floodLimitLevel)} m`,
        `${format(scheme.floodHighLevel)} m`,
        `${format(scheme.designFloodLevel)} m`,
        `${format(scheme.checkFloodLevel)} m`,
        `${format(scheme.damCrestLevel)} m`
      ]);
    });
    highlights.push(
      { label: "洪水过程", value: state.floodSource?.fileName ?? "指导书三场洪水" },
      { label: "安全泄量", value: "20000 m3/s" },
      { label: "图件排版", value: "每方案三场洪水一行" },
      { label: "后续传递", value: "防洪指标已固化" }
    );
  }

  if (key === "indicators") {
    activeSchemes.forEach((scheme) => {
      rows.push([
        scheme.name,
        `${format(scheme.totalStorage)} 亿m3`,
        `${format(scheme.floodStorage)} 亿m3`,
        `${format(scheme.capacity)} 万kW`,
        `${format(adjustedValue(scheme.energy, scheme.id, state.runoffSource))} 亿度`,
        `${format(scheme.runoffUtilization)}%`
      ]);
    });
    highlights.push(
      { label: "汇总方案", value: `${activeSchemes.length} 个` },
      { label: "数据来源", value: "前 5 步输出" },
      { label: "手动输入", value: "无需补填" },
      { label: "输出", value: "水利指标表" }
    );
  }

  if (key === "economy") {
    const costs = activeSchemes.map((scheme) => ({
      scheme,
      cost: adjustedValue(scheme.economy.totalAnnualCost, scheme.id, state.runoffSource)
    }));
    costs.forEach(({ scheme, cost }) => {
      rows.push([scheme.name, `${format(cost)} 万元/年`, scheme.id === "II" ? "报告推荐基准" : "参与比较"]);
    });
    const winner = costs.sort((a, b) => a.cost - b.cost)[0];
    highlights.push(
      { label: "优选方法", value: "年费用最小法" },
      { label: "试算推荐", value: winner?.scheme.name ?? "未计算" },
      { label: "最低总年费用", value: winner ? `${format(winner.cost)} 万元/年` : "--" },
      { label: "结论属性", value: state.runoffSource ? "自定义试算" : "指导书默认试算" }
    );
  }

  return {
    generatedAt,
    versionHash: versionHash(key, state),
    highlights,
    rows,
    note
  };
}

export function markDownstreamStale(state: CustomWorkflowState, changedKey: CustomStepKey) {
  const changedIndex = stepOrder.indexOf(changedKey);
  const nextStatuses = { ...state.statuses };
  const nextOutputs = { ...state.outputs };

  stepOrder.slice(changedIndex + 1).forEach((key) => {
    if (nextStatuses[key] === "calculated") {
      nextStatuses[key] = "stale";
    }
    delete nextOutputs[key];
  });

  return {
    ...state,
    statuses: nextStatuses,
    outputs: nextOutputs
  };
}

export function stepDisplayName(key: CustomStepKey) {
  return stepNames[key];
}
