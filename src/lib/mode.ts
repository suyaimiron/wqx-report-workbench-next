export type WorkbenchMode = "report" | "custom";

export type PageKey =
  | "observatory"
  | "deadwater"
  | "capacity"
  | "dispatch"
  | "repeat"
  | "flood"
  | "indicators"
  | "economy";

export type CustomStepKey = Exclude<PageKey, "observatory">;

export type CustomSchemeId = "I" | "II" | "III" | "IV";

export type ParsedFileSummary = {
  fileName: string;
  rowCount: number;
  fields: string[];
  numericFields: string[];
  preview: Record<string, string | number>[];
  warning?: string;
};

export type CustomTrialResult = {
  source?: ParsedFileSummary;
  method: string;
  recommendedSchemeId: string;
  totalAnnualCost: number;
  capacity: number;
  energy: number;
  note: string;
};

export type CustomStepStatus = "empty" | "calculated" | "stale";

export type CustomStepOutput = {
  generatedAt: string;
  versionHash: string;
  highlights: { label: string; value: string }[];
  rows: string[][];
  note: string;
};

export type CustomWorkflowState = {
  selectedSchemeIds: CustomSchemeId[];
  runoffSource?: ParsedFileSummary;
  floodSource?: ParsedFileSummary;
  statuses: Record<CustomStepKey, CustomStepStatus>;
  outputs: Partial<Record<CustomStepKey, CustomStepOutput>>;
};
