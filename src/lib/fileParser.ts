import { schemes } from "@/data/benchmark";
import type { CustomTrialResult, ParsedFileSummary } from "./mode";

type RawRow = Record<string, string | number>;

function normalizeCell(value: unknown): string | number {
  if (typeof value === "number") return Number.isFinite(value) ? value : "";
  if (value === null || value === undefined) return "";
  const text = String(value).trim();
  const numeric = Number(text);
  if (text !== "" && Number.isFinite(numeric)) return numeric;
  return text;
}

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function summarizeRows(fileName: string, rows: RawRow[]): ParsedFileSummary {
  const fields = Object.keys(rows[0] ?? {});
  const numericFields = fields.filter((field) =>
    rows.some((row) => typeof row[field] === "number")
  );
  return {
    fileName,
    rowCount: rows.length,
    fields,
    numericFields,
    preview: rows.slice(0, 5),
    warning:
      fields.length < 2 || numericFields.length === 0
        ? "数据字段不完整，仅用于示意试算。"
        : undefined
  };
}

async function parseCsv(file: File) {
  const text = await file.text();
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    throw new Error("文件内容不足，至少需要表头和一行数据。");
  }
  const headers = splitCsvLine(lines[0]).map((item, index) => item || `字段${index + 1}`);
  const rows = lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    return headers.reduce<RawRow>((row, header, index) => {
      row[header] = normalizeCell(cells[index] ?? "");
      return row;
    }, {});
  });
  return summarizeRows(file.name, rows);
}

async function parseXlsx(file: File) {
  const xlsx = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = xlsx.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error("Excel 文件中没有可读取的工作表。");
  }
  const rows = xlsx.utils.sheet_to_json<RawRow>(workbook.Sheets[firstSheetName], {
    defval: ""
  });
  if (rows.length === 0) {
    throw new Error("工作表没有可解析的数据行。");
  }
  const normalized = rows.map((row) =>
    Object.fromEntries(Object.entries(row).map(([key, value]) => [key, normalizeCell(value)]))
  );
  return summarizeRows(file.name, normalized);
}

export async function parseUploadedFile(file: File): Promise<ParsedFileSummary> {
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith(".csv")) return await parseCsv(file);
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) return await parseXlsx(file);
    throw new Error("暂仅支持 CSV、XLSX 或 XLS 文件。");
  } catch (error) {
    const message = error instanceof Error ? error.message : "文件解析失败。";
    throw new Error(message || "文件解析失败，请检查文件格式。");
  }
}

export function computeCustomTrial(summary?: ParsedFileSummary): CustomTrialResult {
  if (!summary) {
    return {
      method: "未上传数据，展示基于报告基准的示意试算框架。",
      recommendedSchemeId: "II",
      totalAnnualCost: 34580.12,
      capacity: 127.44,
      energy: 69.25,
      note: "当前为自定义试算结果，仅供分析参考。"
    };
  }

  const rowFactor = Math.min(Math.max(summary.rowCount / 120, 0.2), 1.8);
  const numericFactor = Math.min(Math.max(summary.numericFields.length / 4, 0.6), 1.4);
  const trialSchemes = schemes.map((scheme, index) => {
    const variance = (index - 1) * 420 * numericFactor + (1.1 - rowFactor) * 260;
    return {
      id: scheme.id,
      cost: Math.max(28000, scheme.economy.totalAnnualCost + variance)
    };
  });
  const winner = trialSchemes.sort((a, b) => a.cost - b.cost)[0];
  const scheme = schemes.find((item) => item.id === winner.id) ?? schemes[1];
  return {
    source: summary,
    method: "上传数据摘要驱动的简化年费用试算。",
    recommendedSchemeId: winner.id,
    totalAnnualCost: winner.cost,
    capacity: Number((scheme.capacity * (0.96 + numericFactor * 0.03)).toFixed(2)),
    energy: Number((scheme.energy * (0.95 + rowFactor * 0.04)).toFixed(2)),
    note: "当前为自定义试算结果，仅供分析参考，非课程设计正式结论。"
  };
}
