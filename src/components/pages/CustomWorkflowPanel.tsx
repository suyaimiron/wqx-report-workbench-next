"use client";

import { useState } from "react";
import { AlertTriangle, Calculator, CheckCircle2, ChevronDown, CircleHelp, Database, Download, FileUp, LockKeyhole, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { schemes } from "@/data/benchmark";
import {
  calculateCustomStep,
  getBlockedDependency,
  getStepInputSpec,
  markDownstreamStale,
  stepDisplayName
} from "@/lib/customWorkflow";
import { parseUploadedFile } from "@/lib/fileParser";
import type {
  CustomSchemeId,
  CustomStepKey,
  CustomWorkflowState,
  ParsedFileSummary
} from "@/lib/mode";

type CustomWorkflowPanelProps = {
  stepKey: CustomStepKey;
  state: CustomWorkflowState;
  onChange: (state: CustomWorkflowState) => void;
};

type Field = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  source: string;
  help: string;
};

function HelpButton({ field, side = "left" }: { field: Field; side?: "left" | "right" }) {
  return (
    <details className="relative inline-block">
      <summary
        className="inline-flex h-6 w-6 cursor-pointer list-none items-center justify-center rounded-full border border-cyan-200 bg-white text-cyan-800 transition hover:bg-cyan-50"
        aria-label={`${field.label}说明`}
      >
        <CircleHelp size={15} />
      </summary>
      <div
        className={clsx(
          "absolute top-1/2 z-30 w-72 -translate-y-1/2 rounded-2xl border border-cyan-100 bg-white p-4 text-sm leading-6 text-slate-700 shadow-xl",
          side === "right" ? "left-full ml-3" : "right-full mr-3"
        )}
      >
        <p className="font-semibold text-basin-950">{field.label}</p>
        <p className="mt-1">{field.help}</p>
        <p className="mt-2 text-xs font-semibold text-cyan-800">来源：{field.source}</p>
      </div>
    </details>
  );
}

function FieldList({ title, icon, fields, emptyText, helpSide = "left" }: {
  title: string;
  icon: React.ReactNode;
  fields: Field[];
  emptyText: string;
  helpSide?: "left" | "right";
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/60 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-basin-950">
        {icon}
        {title}
      </div>
      {fields.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/70 px-4 py-3 text-sm text-slate-600">
          {emptyText}
        </p>
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <div
              key={field.id}
              className="grid gap-2 rounded-2xl border border-slate-200 bg-white/78 px-4 py-3 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-basin-950">{field.label}</span>
                  <HelpButton field={field} side={helpSide} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{field.source}</p>
              </div>
              <div className="numeric text-left text-base font-semibold text-cyan-900 sm:text-right">
                {field.value}
                {field.unit ? <span className="ml-1 text-sm text-slate-500">{field.unit}</span> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkflowTable({ rows, stepKey }: { rows: string[][]; stepKey: CustomStepKey }) {
  if (rows.length === 0) return null;
  const headers: Record<CustomStepKey, string[]> = {
    deadwater: ["方案", "正常蓄水位", "最终死水位", "死库容", "保证出力"],
    capacity: ["方案", "保证出力", "工作容量", "备用容量", "必需容量"],
    dispatch: ["方案", "正常蓄水位", "死水位", "汛限水位", "辅助线"],
    repeat: ["方案", "装机容量", "重复容量", "多年平均电能", "径流利用系数"],
    flood: ["方案", "汛限水位", "防洪高水位", "设计洪水位", "校核洪水位", "坝顶高程"],
    indicators: ["方案", "总库容", "防洪库容", "装机容量", "多年平均电能", "径流利用系数"],
    economy: ["方案", "总年费用", "备注"]
  };

  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-sm">
        <thead>
          <tr>
            {headers[stepKey].map((header) => (
              <th
                key={header}
                className="bg-basin-900 px-4 py-3 text-left font-semibold text-cyan-50 first:rounded-l-2xl last:rounded-r-2xl"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.join("-")}
              className={clsx(
                row[0]?.includes("Ⅱ") || row[0]?.includes("II") ? "bg-cyan-50 ring-1 ring-cyan-200" : "bg-white/84"
              )}
            >
              {row.map((cell, index) => (
                <td
                  key={`${cell}-${index}`}
                  className={clsx(
                    "px-4 py-3 text-slate-700 first:rounded-l-2xl last:rounded-r-2xl",
                    index === 0 ? "font-semibold text-basin-950" : "numeric"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type FileSavePicker = {
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  }>;
};

type SavePickerWindow = Window & {
  showSaveFilePicker?: (options: {
    suggestedName: string;
    types?: Array<{ description: string; accept: Record<string, string[]> }>;
  }) => Promise<FileSavePicker>;
};

function buildExportText(stepKey: CustomStepKey, output: NonNullable<CustomWorkflowState["outputs"][CustomStepKey]>) {
  const lines = [
    "五强溪水电站水利计算自定义试算结果",
    `步骤：${stepDisplayName(stepKey)}`,
    `生成时间：${output.generatedAt}`,
    "",
    "一、核心结果",
    ...output.highlights.map((item) => `${item.label}：${item.value}`),
    "",
    "二、结果表",
    ...output.rows.map((row) => row.join(",")),
    "",
    "三、说明",
    output.note
  ];

  return lines.join("\n");
}

async function saveExportFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const pickerWindow = window as SavePickerWindow;

  if (pickerWindow.showSaveFilePicker) {
    const handle = await pickerWindow.showSaveFilePicker({
      suggestedName: fileName,
      types: [{ description: "文本文件", accept: { "text/plain": [".txt"] } }]
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function CustomWorkflowPanel({ stepKey, state, onChange }: CustomWorkflowPanelProps) {
  const [fileError, setFileError] = useState("");
  const [exportMessage, setExportMessage] = useState("");
  const spec = getStepInputSpec(stepKey, state);
  const blocked = getBlockedDependency(stepKey, state);
  const output = state.outputs[stepKey];
  const status = state.statuses[stepKey];
  const canCalculate = !blocked && state.selectedSchemeIds.length > 0;

  function updateSource(source: ParsedFileSummary, type: "runoff" | "flood") {
    const next = markDownstreamStale(
      {
        ...state,
        runoffSource: type === "runoff" ? source : state.runoffSource,
        floodSource: type === "flood" ? source : state.floodSource
      },
      type === "runoff" ? "deadwater" : "flood"
    );
    onChange({
      ...next,
      statuses: {
        ...next.statuses,
        [type === "runoff" ? "deadwater" : "flood"]: "empty"
      },
      outputs: {
        ...next.outputs,
        [type === "runoff" ? "deadwater" : "flood"]: undefined
      }
    });
  }

  async function handleFile(file: File | undefined, type: "runoff" | "flood") {
    if (!file) return;
    setFileError("");
    try {
      const summary = await parseUploadedFile(file);
      updateSource(summary, type);
    } catch (error) {
      setFileError(error instanceof Error ? error.message : "文件解析失败，请检查格式。");
    }
  }

  function handleSchemeToggle(id: CustomSchemeId) {
    const selected = state.selectedSchemeIds.includes(id)
      ? state.selectedSchemeIds.filter((item) => item !== id)
      : [...state.selectedSchemeIds, id];
    const next = markDownstreamStale({ ...state, selectedSchemeIds: selected }, "deadwater");
    onChange({ ...next, statuses: { ...next.statuses, deadwater: "empty" }, outputs: { ...next.outputs, deadwater: undefined } });
  }

  function handleCalculate() {
    if (!canCalculate) return;
    setExportMessage("");
    const nextOutput = calculateCustomStep(stepKey, state);
    onChange({
      ...state,
      statuses: { ...state.statuses, [stepKey]: "calculated" },
      outputs: { ...state.outputs, [stepKey]: nextOutput }
    });
  }

  async function handleExport() {
    if (!output) return;
    setExportMessage("");
    const safeStepName = stepDisplayName(stepKey).replace(/[\\/:*?"<>|]/g, "-");
    const fileName = `五强溪水电站-${safeStepName}-自定义试算结果.txt`;

    try {
      await saveExportFile(fileName, buildExportText(stepKey, output));
      setExportMessage("已生成导出文件。若浏览器弹出保存窗口，可选择 D 盘位置保存。");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setExportMessage("已取消导出。");
        return;
      }
      setExportMessage("导出失败，请重试或检查浏览器下载权限。");
    }
  }

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
            自定义试算模式
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-basin-950">{spec.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            输入区只保留必要数据；前一步结果会在站内直接固化为后续输入。
          </p>
        </div>
        <div
          className={clsx(
            "rounded-2xl px-4 py-2 text-sm font-semibold",
            status === "calculated" && "bg-emerald-50 text-emerald-700",
            status === "stale" && "bg-amber-50 text-amber-700",
            status === "empty" && "bg-slate-100 text-slate-600"
          )}
        >
          {status === "calculated" ? "已计算" : status === "stale" ? "需重新计算" : "未计算"}
        </div>
      </div>

      {stepKey === "deadwater" ? (
        <div className="rounded-3xl border border-cyan-100 bg-cyan-50/54 p-4">
          <div className="mb-3 flex items-center gap-2 font-semibold text-basin-950">
            <CheckCircle2 size={18} />
            方案选择
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {schemes.map((scheme) => (
              <label
                key={scheme.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white bg-white/80 px-4 py-3 text-sm font-semibold text-basin-950"
              >
                <input
                  type="checkbox"
                  checked={state.selectedSchemeIds.includes(scheme.id)}
                  onChange={() => handleSchemeToggle(scheme.id)}
                  className="h-4 w-4 accent-cyan-500"
                />
                {scheme.name} {scheme.level} m
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {(stepKey === "deadwater" || stepKey === "flood") ? (
        <div className="rounded-3xl border border-white/70 bg-white/60 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-basin-950">
            <FileUp size={17} />
            {stepKey === "deadwater" ? "可选：上传径流资料" : "可选：上传洪水过程"}
          </div>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(event) => handleFile(event.target.files?.[0], stepKey === "deadwater" ? "runoff" : "flood")}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-basin-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-cyan-50"
          />
          {fileError ? <p className="mt-2 text-sm font-semibold text-rose-600">{fileError}</p> : null}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <FieldList
          title="必要输入"
          icon={<Calculator size={17} />}
          fields={spec.required}
          helpSide="right"
          emptyText="本步骤无需用户额外输入，直接读取前序结果或指导书内置资料。"
        />
        <FieldList
          title="已由前步带入"
          icon={<LockKeyhole size={17} />}
          fields={spec.carried}
          helpSide="left"
          emptyText="本步骤是第一步，暂无前序输入。"
        />
        <FieldList
          title="指导书内置资料"
          icon={<Database size={17} />}
          fields={spec.library}
          helpSide="right"
          emptyText="本步骤主要汇总前序结果，不需要额外内置资料。"
        />
        <details className="rounded-3xl border border-white/70 bg-white/60 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-basin-950">
            <span className="flex items-center gap-2">
              <RotateCcw size={17} />
              高级参数
            </span>
            <ChevronDown size={18} />
          </summary>
          <div className="mt-3">
            <FieldList title="高级参数" icon={<RotateCcw size={17} />} fields={spec.advanced} helpSide="left" emptyText="当前步骤没有需要用户处理的高级参数。" />
          </div>
        </details>
      </div>

      {blocked ? (
        <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} />
          请先完成“{stepDisplayName(blocked)}”，本步骤会自动读取它的输出，不需要手动补填。
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={handleCalculate} disabled={!canCalculate}>
          <Calculator size={18} />
          计算本步骤
        </Button>
        <span className="text-sm text-slate-600">
          {canCalculate ? "计算后结果会自动固化给后续步骤。" : "请先补齐前置步骤或至少选择一个方案。"}
        </span>
      </div>

      {output ? (
        <div className="rounded-3xl border border-cyan-100 bg-white/70 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-xl font-semibold text-basin-950">自定义试算输出</h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
                {output.generatedAt}
              </span>
              <Button type="button" onClick={handleExport}>
                <Download size={17} />
                导出本步结果
              </Button>
            </div>
          </div>
          {exportMessage ? (
            <p className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800">
              {exportMessage}
            </p>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {output.highlights.map((item) => (
              <div key={item.label} className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4">
                <p className="text-sm font-semibold text-cyan-800">{item.label}</p>
                <p className="numeric mt-2 text-xl font-semibold text-basin-950">{item.value}</p>
              </div>
            ))}
          </div>
          <WorkflowTable rows={output.rows} stepKey={stepKey} />
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            {output.note}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-cyan-200 bg-cyan-50/50 px-5 py-8 text-center text-slate-600">
          尚未计算。本页会在点击“计算本步骤”后生成表格、图表入口和固化结果。
        </div>
      )}
    </Card>
  );
}
