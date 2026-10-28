import type { Metadata } from "next";
import "./globals.css";
import { AppNav } from "@/components/app-nav";
import { DataProvider } from "@/components/data-provider";

export const metadata: Metadata = { title: { default: "RECALL", template: "%s — RECALL" }, description: "Save what you learn. Recall what you know." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body><DataProvider><AppNav/><main className="app-main">{children}</main></DataProvider></body></html>; }
