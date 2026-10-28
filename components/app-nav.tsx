"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, Home, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [{ href: "/", label: "Home", icon: Home }, { href: "/library", label: "Library", icon: BookOpen }, { href: "/review", label: "Review", icon: RotateCcw }, { href: "/statistics", label: "Statistics", icon: BarChart3 }];
export function AppNav() {
  const pathname = usePathname();
  return <><header className="topbar"><Link href="/" className="wordmark">RECALL</Link><nav className="desktop-nav" aria-label="주요 메뉴">{links.map(({ href, label }) => <Link key={href} href={href} className={cn(pathname === href && "active")}>{label}</Link>)}</nav></header><nav className="mobile-nav" aria-label="모바일 메뉴">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn(pathname === href && "active")}><Icon/><span>{label}</span></Link>)}</nav></>;
}
