import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { ReviewLogRow, SentenceRow } from "@/db/schema";
import type { ReviewLog, Sentence } from "@/lib/types";

export function sentenceDto(row: SentenceRow): Sentence {
  return { id: row.id, english: row.english, korean: row.korean, note: row.note ?? "", tags: row.tags, status: row.status as Sentence["status"], reviewCount: row.reviewCount, successStreak: row.successStreak, lastReviewedAt: row.lastReviewedAt?.toISOString() ?? null, nextReviewAt: row.nextReviewAt.toISOString(), createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), isSample: row.tags.includes("sample") };
}

export function reviewLogDto(row: ReviewLogRow): ReviewLog {
  return { id: row.id, sentenceId: row.sentenceId, result: row.result as ReviewLog["result"], reviewedAt: row.reviewedAt.toISOString() };
}

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: error.issues[0]?.message ?? "입력값이 올바르지 않습니다." }, { status: 400 });
  if (error instanceof Error && error.message === "DATABASE_URL_MISSING") return NextResponse.json({ error: "Neon 데이터베이스가 설정되지 않았습니다. .env.local에 DATABASE_URL을 추가한 뒤 서버를 다시 시작해 주세요.", code: "DATABASE_NOT_CONFIGURED" }, { status: 503 });
  if (error instanceof Error && error.message === "VISITOR_SESSION_MISSING") return NextResponse.json({ error: "방문자 세션을 만들지 못했습니다. 쿠키를 허용하고 새로고침해 주세요.", code: "VISITOR_SESSION_MISSING" }, { status: 401 });
  console.error(error);
  return NextResponse.json({ error: "Neon 데이터베이스에 연결하지 못했습니다. 연결 문자열과 네트워크 상태를 확인해 주세요.", code: "DATABASE_UNAVAILABLE" }, { status: 503 });
}
