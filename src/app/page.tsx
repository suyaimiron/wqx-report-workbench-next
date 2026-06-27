"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HeroHeader } from "@/components/layout/HeroHeader";
import { DesignSectionPage } from "@/components/pages/DesignSectionPage";
import { ObservatoryPage } from "@/components/pages/ObservatoryPage";
import { getReportSection } from "@/data/reportSections";
import { createInitialWorkflowState } from "@/lib/customWorkflow";
import type { CustomTrialResult, CustomWorkflowState, PageKey, WorkbenchMode } from "@/lib/mode";

export default function Home() {
  const [activePage, setActivePage] = useState<PageKey>("observatory");
  const [mode, setMode] = useState<WorkbenchMode>("report");
  const [trial, setTrial] = useState<CustomTrialResult | undefined>();
  const [workflow, setWorkflow] = useState<CustomWorkflowState>(() => createInitialWorkflowState());
  const section = getReportSection(activePage);

  useEffect(() => {
    const pageKeys: PageKey[] = [
      "observatory",
      "deadwater",
      "capacity",
      "dispatch",
      "repeat",
      "flood",
      "indicators",
      "economy"
    ];

    function syncFromHash() {
      const key = window.location.hash.replace("#", "") as PageKey;
      if (pageKeys.includes(key)) {
        setActivePage(key);
      }
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function handlePageChange(page: PageKey) {
    setActivePage(page);
    const nextHash = page === "observatory" ? "" : `#${page}`;
    const nextUrl = `${window.location.pathname}${nextHash}`;
    window.history.replaceState(null, "", nextUrl);
  }

  return (
    <AppShell activePage={activePage} onPageChange={handlePageChange}>
      <div className="space-y-9">
        <HeroHeader mode={mode} onModeChange={setMode} />
        {section ? (
          <DesignSectionPage
            section={section}
            mode={mode}
            workflow={workflow}
            onWorkflowChange={setWorkflow}
          />
        ) : (
          <ObservatoryPage
            mode={mode}
            trial={trial}
            onTrialChange={setTrial}
            onPageChange={handlePageChange}
            workflow={workflow}
          />
        )}
      </div>
    </AppShell>
  );
}
