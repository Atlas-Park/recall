"use client";
import { useMemo, useState } from "react";
import { Edit3, Search } from "lucide-react";
import { useRecallData } from "@/components/data-provider";
import { SentenceForm } from "@/components/sentence-form";
import { DeleteSentence } from "@/components/delete-sentence";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatabaseErrorState, ErrorBanner, LoadingState } from "@/components/page-state";
import type { SentenceStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function LibraryPage() {
  const { sentences, loading, error, importSamples } = useRecallData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SentenceStatus | "all">("all");
  const [tag, setTag] = useState("all");
  const tags = useMemo(() => [...new Set(sentences.flatMap((item) => item.tags))].sort(), [sentences]);
  const filtered = sentences.filter((item) => { const matchesText = `${item.english} ${item.korean}`.toLowerCase().includes(query.toLowerCase()); return matchesText && (status === "all" || item.status === status) && (tag === "all" || item.tags.includes(tag)); });
  if (loading) return <LoadingState/>;
  if (error) return <DatabaseErrorState message={error}/>;
  return <div className="page-shell">{error && <ErrorBanner message={error}/>}<header className="page-heading"><div><p className="kicker">Sentence library</p><h1>Everything you<br/>want to keep.</h1></div><SentenceForm/></header><div className="library-tools"><label className="search-box"><Search/><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search English or Korean" aria-label="문장 검색"/></label><select value={status} onChange={(e) => setStatus(e.target.value as SentenceStatus | "all")} aria-label="암기 상태"><option value="all">All status</option><option value="new">New</option><option value="learning">Learning</option><option value="mastered">Mastered</option></select><select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="태그"><option value="all">All tags</option>{tags.map((item) => <option key={item}>{item}</option>)}</select></div>{filtered.length ? <div className="sentence-list">{filtered.map((sentence) => <article className="sentence-row" key={sentence.id}><div className="sentence-copy"><div className="sentence-meta"><Badge className={`status-${sentence.status}`}>{sentence.status}</Badge>{sentence.isSample && <Badge>sample</Badge>}<time>Next {formatDate(sentence.nextReviewAt)}</time></div><h2>{sentence.english}</h2><p>{sentence.korean}</p>{sentence.note && <small>{sentence.note}</small>}<div className="tag-list">{sentence.tags.map((item) => <span key={item}>#{item}</span>)}</div></div><div className="row-actions"><SentenceForm sentence={sentence} trigger={<Button variant="ghost" size="icon" aria-label="문장 수정"><Edit3 className="size-4"/></Button>}/><DeleteSentence id={sentence.id}/></div></article>)}</div> : <div className="empty-state"><Search/><h3>{sentences.length ? "No matching sentences." : "No sentences yet."}</h3><p>{sentences.length ? "검색어나 필터를 바꿔 보세요." : "새 문장을 추가해 나만의 문장 라이브러리를 시작하세요."}</p>{!sentences.length && <div><SentenceForm/><Button variant="secondary" onClick={() => void importSamples()}>Import sample set</Button></div>}</div>}</div>;
}
