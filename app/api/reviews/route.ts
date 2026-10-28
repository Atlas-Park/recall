import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { reviewLogs, sentences } from "@/db/schema";
import { applyReview } from "@/lib/spaced-repetition";
import { apiError, reviewLogDto, sentenceDto } from "@/lib/server-api";
import { reviewInputSchema } from "@/lib/validation";
import { getVisitorId } from "@/lib/visitor";

export async function POST(request: Request) {
  try {
    const ownerId = getVisitorId(request);
    const input = reviewInputSchema.parse(await request.json());
    const result = await getDb().transaction(async (tx) => {
      const [row] = await tx.select().from(sentences).where(and(eq(sentences.id, input.sentenceId), eq(sentences.ownerId, ownerId))).for("update");
      if (!row) throw new Error("SENTENCE_NOT_FOUND");
      const reviewedAt = new Date();
      const reviewed = applyReview(sentenceDto(row), input.result, reviewedAt, new Date(input.sessionStartedAt));
      const updatedRows = await tx.update(sentences).set({ status: reviewed.status, reviewCount: reviewed.reviewCount, successStreak: reviewed.successStreak, lastReviewedAt: reviewedAt, nextReviewAt: new Date(reviewed.nextReviewAt), updatedAt: reviewedAt }).where(eq(sentences.id, input.sentenceId)).returning();
      const logRows = await tx.insert(reviewLogs).values({ sentenceId: input.sentenceId, result: input.result, reviewedAt }).returning();
      return { sentence: sentenceDto(updatedRows[0]), log: reviewLogDto(logRows[0]) };
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "SENTENCE_NOT_FOUND") return NextResponse.json({ error: "문장을 찾을 수 없습니다." }, { status: 404 });
    return apiError(error);
  }
}
