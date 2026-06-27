import { CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import { EconomicBarChart } from "@/components/charts/EconomicBarChart";
import { RepeatCapacityDashboard } from "@/components/charts/RepeatCapacityDashboard";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { ReportImage, ReportImageGroup, ReportSection, ReportTable } from "@/data/reportSections";
import type { CustomWorkflowState, WorkbenchMode } from "@/lib/mode";
import { CustomWorkflowPanel } from "./CustomWorkflowPanel";

type DesignSectionPageProps = {
  section: ReportSection;
  mode: WorkbenchMode;
  workflow: CustomWorkflowState;
  onWorkflowChange: (state: CustomWorkflowState) => void;
};

function groupGridClass(columns: ReportImageGroup["columns"]) {
  if (columns === 4) return "grid gap-4 md:grid-cols-2 2xl:grid-cols-4";
  if (columns === 3) return "grid gap-4 lg:grid-cols-3";
  return "grid gap-5 md:grid-cols-2";
}

function imageFrameClass(columns: ReportImageGroup["columns"]) {
  if (columns === 3) return "h-[300px]";
  if (columns === 4) return "h-[260px]";
  return "h-[420px]";
}

function ImageFigure({
  image,
  frameClass = "h-[380px]"
}: {
  image: ReportImage;
  frameClass?: string;
}) {
  return (
    <figure className="rounded-[28px] border border-slate-200 bg-white/88 p-3 shadow-sm">
      <div className={clsx("overflow-hidden rounded-2xl border border-slate-100 bg-white", frameClass)}>
        <img src={image.src} alt={image.alt} className="h-full w-full object-contain" />
      </div>
      <figcaption className="px-2 pt-3 text-base font-semibold text-basin-950">
        {image.title}
      </figcaption>
    </figure>
  );
}

function ReportTableView({ table }: { table: ReportTable }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-xl font-semibold text-basin-950">{table.title}</h3>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
          网页表格
        </span>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr>
              {table.headers.map((header, index) => (
                <th
                  key={`${header}-${index}`}
                  className="bg-basin-900 px-4 py-3 font-semibold text-cyan-50 first:rounded-l-2xl last:rounded-r-2xl"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr
                key={`${row[0]}-${rowIndex}`}
                className={clsx(
                  rowIndex % 2 === 0 ? "bg-white/88" : "bg-cyan-50/82",
                  row.some((cell) => cell.includes("方案 II") || cell.includes("方案Ⅱ")) ? "ring-1 ring-cyan-200" : ""
                )}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${cell}-${cellIndex}`}
                    className={clsx(
                      "px-4 py-3 text-slate-700 first:rounded-l-2xl last:rounded-r-2xl",
                      cellIndex === 0 ? "font-semibold text-basin-950" : "numeric",
                      cell === "方案 II" || cell === "方案Ⅱ" ? "font-semibold text-cyan-800" : ""
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
    </Card>
  );
}

function ReportContent({ section }: { section: ReportSection }) {
  const hasSideVisualContent = section.chart === "annualCost" || Boolean(section.images?.length);
  const hasVisualContent =
    Boolean(section.chart) ||
    Boolean(section.images?.length) ||
    Boolean(section.imageGroups?.length) ||
    Boolean(section.tables?.length);

  return (
    <div className="space-y-8">
      <div
        className={clsx(
          "grid gap-6",
          hasSideVisualContent ? "xl:grid-cols-[0.82fr_1.18fr]" : "xl:grid-cols-2"
        )}
      >
        <div className={clsx("space-y-6", !hasSideVisualContent && "xl:space-y-0")}>
          <Card>
            <h3 className="text-xl font-semibold text-basin-950">计算过程</h3>
            <div className="mt-5 space-y-3">
              {section.process.map((item, index) => (
                <div key={item} className="grid grid-cols-[34px_1fr] gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-basin-900 text-sm font-semibold text-cyan-100">
                    {index + 1}
                  </span>
                  <p className="rounded-2xl border border-slate-200 bg-white/72 px-4 py-3 text-base leading-7 text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {hasSideVisualContent ? (
            <Card>
              <h3 className="text-xl font-semibold text-basin-950">最终结果</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {section.results.map((result) => (
                  <div key={result.label} className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4">
                    <div className="mb-3 flex items-center gap-2 text-cyan-800">
                      <CheckCircle2 size={18} />
                      <span className="font-semibold">{result.label}</span>
                    </div>
                    <p className="numeric text-2xl font-semibold text-basin-950">{result.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          {!hasSideVisualContent ? (
            <Card className="h-full">
              <h3 className="text-xl font-semibold text-basin-950">最终结果</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {section.results.map((result) => (
                  <div key={result.label} className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-5">
                    <div className="mb-3 flex items-center gap-2 text-cyan-800">
                      <CheckCircle2 size={18} />
                      <span className="font-semibold">{result.label}</span>
                    </div>
                    <p className="numeric text-2xl font-semibold text-basin-950">{result.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {section.chart === "annualCost" ? (
            <Card>
              <h3 className="text-xl font-semibold text-basin-950">四方案总年费用对比</h3>
              <EconomicBarChart mode="report" />
            </Card>
          ) : null}

          {section.images?.map((image) => (
            <Card key={image.src} className="overflow-hidden p-4">
              <ImageFigure image={image} frameClass="h-[340px] md:h-[400px]" />
            </Card>
          ))}
        </div>
      </div>

      {section.chart === "repeatCapacity" ? <RepeatCapacityDashboard /> : null}

      {section.tables?.map((table) => <ReportTableView key={table.title} table={table} />)}

      {section.imageGroups?.map((group) => (
        <Card key={group.title}>
          <h3 className="text-xl font-semibold text-basin-950">{group.title}</h3>
          <div className={clsx("mt-5", groupGridClass(group.columns))}>
            {group.images.map((image) => (
              <ImageFigure
                key={image.src}
                image={image}
                frameClass={imageFrameClass(group.columns)}
              />
            ))}
          </div>
        </Card>
      ))}

      {!hasVisualContent ? (
        <Card>
          <p className="text-base leading-7 text-slate-700">
            本部分报告未配置图件，已保留计算过程与最终结果用于复核展示。
          </p>
        </Card>
      ) : null}
    </div>
  );
}

export function DesignSectionPage({
  section,
  mode,
  workflow,
  onWorkflowChange
}: DesignSectionPageProps) {
  const customCalculated = workflow.statuses[section.key] === "calculated";

  return (
    <div className="space-y-8">
      <SectionTitle title={`${section.order}. ${section.title}`} />

      {mode === "custom" ? (
        <>
          <CustomWorkflowPanel
            stepKey={section.key}
            state={workflow}
            onChange={onWorkflowChange}
          />
          {customCalculated ? (
            <div className="rounded-[2rem] border border-cyan-100/20 bg-white/8 p-1">
              <ReportContent section={section} />
            </div>
          ) : null}
        </>
      ) : (
        <ReportContent section={section} />
      )}
    </div>
  );
}
