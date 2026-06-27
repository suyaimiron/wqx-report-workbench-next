import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "五强溪水电站水利计算可复核决策工作台",
  description: "水利计算课程设计评优展示 Next.js 工作台"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
