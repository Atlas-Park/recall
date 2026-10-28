import type { ReviewResult, Sentence } from "@/lib/types";

const DAY_MS = 86_400_000;

export function localDayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS).toISOString();
}

export function intervalForStreak(streak: number) {
  if (streak <= 1) return 1;
  if (streak === 2) return 3;
  if (streak === 3) return 7;
  if (streak === 4) return 14;
  return 30;
}

export function applyReview(sentence: Sentence, result: ReviewResult, reviewedAt: Date, sessionStartedAt: Date): Sentence {
  const alreadyAdvancedToday = sentence.lastReviewedAt
    ? localDayKey(new Date(sentence.lastReviewedAt)) === localDayKey(reviewedAt)
    : false;
  const wasDueAtSessionStart = new Date(sentence.nextReviewAt).getTime() <= sessionStartedAt.getTime();
  const canAdvanceSchedule = wasDueAtSessionStart && !alreadyAdvancedToday;
  const base = { ...sentence, reviewCount: sentence.reviewCount + 1, lastReviewedAt: reviewedAt.toISOString(), updatedAt: reviewedAt.toISOString() };

  if (!canAdvanceSchedule) return base;
  if (result === "again") {
    return { ...base, successStreak: 0, status: "learning", nextReviewAt: addDays(reviewedAt, 1) };
  }

  const successStreak = sentence.successStreak + 1;
  return {
    ...base,
    successStreak,
    status: successStreak >= 4 ? "mastered" : "learning",
    nextReviewAt: addDays(reviewedAt, intervalForStreak(successStreak)),
  };
}

export function isDue(sentence: Sentence, at = new Date()) {
  return new Date(sentence.nextReviewAt).getTime() <= at.getTime();
}
