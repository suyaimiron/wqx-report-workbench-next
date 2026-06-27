"use client";

import { useRef, useState } from "react";
import { FileSpreadsheet, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { parseUploadedFile } from "@/lib/fileParser";
import type { ParsedFileSummary } from "@/lib/mode";

type FileUploadCardProps = {
  onParsed: (summary: ParsedFileSummary) => void;
};

export function FileUploadCard({ onParsed }: FileUploadCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<ParsedFileSummary | null>(null);
  const [status, setStatus] = useState("等待上传 CSV 或 Excel 文件");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleParse() {
    if (!file) {
      setError("请先选择需要解析的文件。");
      return;
    }
    setLoading(true);
    setError("");
    setStatus("正在解析数据");
    try {
      const parsed = await parseUploadedFile(file);
      setSummary(parsed);
      setStatus("解析完成");
      onParsed(parsed);
    } catch (parseError) {
      const message = parseError instanceof Error ? parseError.message : "文件解析失败。";
      setError(message);
      setStatus("解析失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-amber-200/70 bg-amber-50/90">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-amber-950">
              <UploadCloud size={24} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-amber-950">自定义数据上传</h3>
              <p className="text-sm text-amber-800">支持 CSV、XLSX、XLS</p>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0] ?? null;
              setFile(selected);
              setSummary(null);
              setError("");
              setStatus(selected ? "文件已选择，等待解析" : "等待上传 CSV 或 Excel 文件");
            }}
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
              <FileSpreadsheet size={18} />
              选择文件
            </Button>
            <Button onClick={handleParse} disabled={loading || !file}>
              <UploadCloud size={18} />
              {loading ? "解析中" : "解析数据"}
            </Button>
          </div>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-white/70 px-4 py-3 text-sm text-amber-900">
            <p>文件名：{file?.name ?? "未选择"}</p>
            <p className="mt-1">上传状态：{status}</p>
            {error ? <p className="mt-2 font-semibold text-red-700">{error}</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-white/75 p-4">
          <h4 className="font-semibold text-amber-950">数据摘要</h4>
          {summary ? (
            <div className="mt-3 space-y-3 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-amber-100/70 p-3">
                  <p className="text-xs text-amber-700">数据行数</p>
                  <p className="numeric mt-1 text-2xl font-semibold text-amber-950">
                    {summary.rowCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-100/70 p-3">
                  <p className="text-xs text-amber-700">字段数</p>
                  <p className="numeric mt-1 text-2xl font-semibold text-amber-950">
                    {summary.fields.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-100/70 p-3">
                  <p className="text-xs text-amber-700">数值字段</p>
                  <p className="numeric mt-1 text-2xl font-semibold text-amber-950">
                    {summary.numericFields.length}
                  </p>
                </div>
              </div>
              <p>字段：{summary.fields.slice(0, 8).join("、") || "未识别"}</p>
              {summary.warning ? <p className="font-semibold text-amber-700">{summary.warning}</p> : null}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-600">
              上传并解析后，这里会展示行数、字段名和数值字段识别结果。数据不完整时会提示“仅用于示意试算”。
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
