"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Clock3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SentenceForm } from "@/components/sentence-form";
import { useRecallData } from "@/components/data-provider";
import { DatabaseErrorState, LoadingState } from "@/components/page-state";
import { formatDate } from "@/lib/utils";

export default function Dashboard() {
  const { sentences, stats: learningStats, loading, error } = useRecallData();
  if (loading) return <LoadingState/>;
  if (error) return <DatabaseErrorState message={error}/>;
  const stats = [{ label: "Total sentences", value: learningStats.total, icon: BookOpen }, { label: "Mastered", value: learningStats.mastered, icon: Check }, { label: "Due today", value: learningStats.due, icon: Clock3 }, { label: "Studied today", value: learningStats.studiedToday, icon: Sparkles }];
  return <div className="page-shell dashboard-page"><section className="hero"><div><p className="kicker">Neon workspace</p><h1>What will you<br/>remember today?</h1><p>Save what you learn. Recall what you know.</p></div><div className="hero-actions"><Link href="/review"><Button className="min-w-36">Start Review <ArrowRight className="size-4"/></Button></Link><SentenceForm/></div></section><section className="stats-grid" aria-label="학습 현황">{stats.map(({ label, value, icon: Icon }) => <article className="stat-card" key={label}><Icon/><strong>{value}</strong><span>{label}</span></article>)}</section><section className="section-block"><div className="section-heading"><div><p className="kicker">Library</p><h2>Recently saved</h2></div><Link href="/library" className="text-link">View all <ArrowRight/></Link></div>{sentences.length ? <div className="recent-list">{sentences.slice(0, 5).map((sentence) => <Link href="/library" key={sentence.id} className="recent-row"><div><p>{sentence.english}</p><span>{sentence.korean}</span></div><div><Badge>{sentence.status}</Badge><time>{formatDate(sentence.createdAt)}</time></div></Link>)}</div> : <EmptyDashboard/>}</section></div>;
}

function EmptyDashboard() { const { importSamples } = useRecallData(); return <div className="empty-state"><BookOpen/><h3>Your library is quiet.</h3><p>첫 문장을 저장하거나, 과제 시연용 샘플 10개를 가져오세요.</p><div><SentenceForm/><Button variant="secondary" onClick={() => void importSamples()}>Import sample set</Button></div></div>; }
