import type { ReactNode } from "react";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
};

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-semibold text-white md:text-3xl">{title}</h2>
    </div>
  );
}
