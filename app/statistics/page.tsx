"use client";
import { useRecallData } from "@/components/data-provider";
import { DatabaseErrorState, LoadingState } from "@/components/page-state";

export default function StatisticsPage() {
  const { stats: learningStats, loading, error } = useRecallData();
  if (loading) return <LoadingState/>;
  if (error) return <DatabaseErrorState message={error}/>;
  const successRate = learningStats.reviewCount ? Math.round(learningStats.gotItCount / learningStats.reviewCount * 100) : 0;
  const max = Math.max(1, ...learningStats.activity.map((day) => day.count));
  const stats = [{ label: "Total sentences", value: learningStats.total }, { label: "Mastered", value: learningStats.mastered }, { label: "Waiting for review", value: learningStats.due }, { label: "Review success", value: `${successRate}%` }];
  return <div className="page-shell"><header className="page-heading"><div><p className="kicker">Statistics</p><h1>A quiet view<br/>of your progress.</h1></div></header><section className="stats-grid">{stats.map((item) => <article className="stat-card" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></article>)}</section><section className="activity-card"><div><p className="kicker">Last 7 days</p><h2>Review activity</h2></div><div className="bar-chart" aria-label="최근 7일 복습 활동">{learningStats.activity.map((day) => <div className="bar-column" key={day.key}><span>{day.count || ""}</span><div className="bar-track"><i style={{ height: `${Math.max(day.count ? 10 : 2, day.count / max * 100)}%` }}/></div><small>{day.label}</small></div>)}</div><p className="chart-note">총 {learningStats.reviewCount}개의 복습 응답 중 {learningStats.gotItCount}개를 기억했습니다.</p></section></div>;
}
