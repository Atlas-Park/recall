import { and, count, countDistinct, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { reviewLogs, sentences } from "@/db/schema";
import { apiError } from "@/lib/server-api";
import type { ActivityDay, LearningStats } from "@/lib/types";
import { getVisitorId } from "@/lib/visitor";

function dayKey(date: Date) { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(date); }
function startOfSeoulDay(date = new Date()) { return new Date(`${dayKey(date)}T00:00:00+09:00`); }

export async function GET(request: Request) {
  try {
    const db = getDb();
    const ownerId = getVisitorId(request);
    const now = new Date();
    const todayStart = startOfSeoulDay(now);
    const activityStart = new Date(todayStart.getTime() - 6 * 86_400_000);
    const [[total], [mastered], [due], [studied], [reviewTotal], [gotItTotal], logs] = await Promise.all([
      db.select({ value: count() }).from(sentences).where(eq(sentences.ownerId, ownerId)),
      db.select({ value: count() }).from(sentences).where(and(eq(sentences.ownerId, ownerId), eq(sentences.status, "mastered"))),
      db.select({ value: count() }).from(sentences).where(and(eq(sentences.ownerId, ownerId), lte(sentences.nextReviewAt, now))),
      db.select({ value: countDistinct(reviewLogs.sentenceId) }).from(reviewLogs).innerJoin(sentences, eq(reviewLogs.sentenceId, sentences.id)).where(and(eq(sentences.ownerId, ownerId), gte(reviewLogs.reviewedAt, todayStart))),
      db.select({ value: count() }).from(reviewLogs).innerJoin(sentences, eq(reviewLogs.sentenceId, sentences.id)).where(eq(sentences.ownerId, ownerId)),
      db.select({ value: count() }).from(reviewLogs).innerJoin(sentences, eq(reviewLogs.sentenceId, sentences.id)).where(and(eq(sentences.ownerId, ownerId), eq(reviewLogs.result, "got_it"))),
      db.select({ result: reviewLogs.result, reviewedAt: reviewLogs.reviewedAt }).from(reviewLogs).innerJoin(sentences, eq(reviewLogs.sentenceId, sentences.id)).where(and(eq(sentences.ownerId, ownerId), gte(reviewLogs.reviewedAt, activityStart), lte(reviewLogs.reviewedAt, now))),
    ]);
    const activity: ActivityDay[] = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(activityStart.getTime() + index * 86_400_000);
      const key = dayKey(date);
      return { key, label: new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "Asia/Seoul" }).format(date), count: logs.filter((log) => dayKey(log.reviewedAt) === key).length };
    });
    const payload: LearningStats = { total: total.value, mastered: mastered.value, due: due.value, studiedToday: studied.value, reviewCount: reviewTotal.value, gotItCount: gotItTotal.value, activity };
    return NextResponse.json(payload);
  } catch (error) { return apiError(error); }
}
