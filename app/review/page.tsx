"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, Check, RotateCcw } from "lucide-react";
import { useRecallData } from "@/components/data-provider";
import { Button } from "@/components/ui/button";
import { DatabaseErrorState, LoadingState } from "@/components/page-state";
import { isDue } from "@/lib/spaced-repetition";
import type { ReviewResult, Sentence } from "@/lib/types";

type Direction = "ko-en" | "en-ko";

export default function ReviewPage() {
  const { sentences, loading, error, recordReview } = useRecallData();
  const initialQueue = useMemo(() => sentences.filter((item) => isDue(item)), [sentences]);
  const [queue, setQueue] = useState<Sentence[]>([]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState<Direction>("ko-en");
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState({ again: 0, gotIt: 0 });
  const [sessionStartedAt, setSessionStartedAt] = useState("");
  const lockRef = useRef(false);
  if (loading) return <LoadingState/>;
  if (error) return <DatabaseErrorState message={error}/>;

  const start = () => { setQueue(initialQueue); setStarted(true); setIndex(0); setFlipped(false); setResults({ again: 0, gotIt: 0 }); setSessionStartedAt(new Date().toISOString()); };
  const finished = started && index >= queue.length;
  const current = queue[index];
  const answer = async (result: ReviewResult) => {
    if (!current || !flipped || lockRef.current) return;
    lockRef.current = true; setSubmitting(true);
    try { await recordReview(current.id, result, sessionStartedAt); setResults((value) => ({ again: value.again + (result === "again" ? 1 : 0), gotIt: value.gotIt + (result === "got_it" ? 1 : 0) })); setIndex((value) => value + 1); setFlipped(false); } finally { setSubmitting(false); lockRef.current = false; }
  };

  if (!started) return <div className="review-shell"><div className="review-intro"><p className="kicker">Focused review</p><h1>Recall it<br/>before you see it.</h1><p>{initialQueue.length ? `${initialQueue.length}개의 문장이 복습을 기다리고 있습니다.` : "지금 복습할 문장이 없습니다. 잘하고 있어요."}</p><div className="direction-control"><span>Card direction</span><button onClick={() => setDirection((value) => value === "ko-en" ? "en-ko" : "ko-en")}><ArrowLeftRight/>{direction === "ko-en" ? "Korean → English" : "English → Korean"}</button></div>{initialQueue.length ? <Button onClick={start} className="min-w-40">Start Review</Button> : <Link href="/library"><Button variant="secondary">Open Library</Button></Link>}</div></div>;
  if (finished) { const total = results.again + results.gotIt; return <div className="review-shell"><div className="session-result"><span className="result-icon"><Check/></span><p className="kicker">Session complete</p><h1>{results.gotIt} of {total}</h1><p>문장을 기억했습니다.</p><div><span><strong>{results.gotIt}</strong> Got it</span><span><strong>{results.again}</strong> Again</span></div><Link href="/"><Button>Back to Home</Button></Link></div></div>; }

  const front = direction === "ko-en" ? current.korean : current.english;
  const back = direction === "ko-en" ? current.english : current.korean;
  const progress = queue.length ? index / queue.length * 100 : 0;
  return <div className="review-shell active-review"><header className="review-progress"><span>{index + 1} / {queue.length}</span><div><i style={{ width: `${progress}%` }}/></div><button onClick={() => setDirection((value) => value === "ko-en" ? "en-ko" : "ko-en")} aria-label="카드 방향 전환"><ArrowLeftRight/></button></header><button className={`flashcard ${flipped ? "is-flipped" : ""}`} onClick={() => setFlipped((value) => !value)} aria-label={flipped ? "정답 숨기기" : "정답 확인하기"}><span className="flashcard-inner"><span className="flashcard-face front"><small>{direction === "ko-en" ? "Korean" : "English"}</small><strong>{front}</strong><em>Tap to reveal</em></span><span className="flashcard-face back"><small>{direction === "ko-en" ? "English" : "Korean"}</small><strong>{back}</strong>{current.note && <p>{current.note}</p>}</span></span></button><div className={`review-actions ${flipped ? "visible" : ""}`}><Button variant="secondary" disabled={!flipped || submitting} onClick={() => void answer("again")}><RotateCcw className="size-4"/>Again</Button><Button disabled={!flipped || submitting} onClick={() => void answer("got_it")}><Check className="size-4"/>Got it</Button></div></div>;
}
