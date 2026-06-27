"use client";

import type { ReactNode } from "react";
import type { PageKey } from "@/lib/mode";
import { TopNav } from "./TopNav";

type AppShellProps = {
  activePage: PageKey;
  onPageChange: (page: PageKey) => void;
  children: ReactNode;
};

export function AppShell({ activePage, onPageChange, children }: AppShellProps) {
  return (
    <div className="dashboard-shell">
      <TopNav activePage={activePage} onPageChange={onPageChange} />
      <main className="mx-auto max-w-[1500px] px-5 pb-14 pt-[calc(var(--nav-height)+26px)] lg:px-8">
        {children}
      </main>
    </div>
  );
}
