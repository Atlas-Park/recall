import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { sentences } from "@/db/schema";
import { apiError, sentenceDto } from "@/lib/server-api";
import { sentenceInputSchema } from "@/lib/validation";
import { getVisitorId } from "@/lib/visitor";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ownerId = getVisitorId(request);
    const input = sentenceInputSchema.omit({ isSample: true }).parse(await request.json());
    const [row] = await getDb().update(sentences).set({ english: input.english, korean: input.korean, note: input.note || null, tags: input.tags, updatedAt: new Date() }).where(and(eq(sentences.id, id), eq(sentences.ownerId, ownerId))).returning();
    if (!row) return NextResponse.json({ error: "문장을 찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json(sentenceDto(row));
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ownerId = getVisitorId(request);
    const [deleted] = await getDb().delete(sentences).where(and(eq(sentences.id, id), eq(sentences.ownerId, ownerId))).returning({ id: sentences.id });
    if (!deleted) return NextResponse.json({ error: "문장을 찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) { return apiError(error); }
}
