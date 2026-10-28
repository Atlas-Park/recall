import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { sentences } from "@/db/schema";
import { apiError, sentenceDto } from "@/lib/server-api";
import { sentenceInputSchema } from "@/lib/validation";
import { getVisitorId } from "@/lib/visitor";

export async function GET(request: Request) {
  try {
    const ownerId = getVisitorId(request);
    const rows = await getDb().select().from(sentences).where(eq(sentences.ownerId, ownerId)).orderBy(desc(sentences.createdAt));
    return NextResponse.json(rows.map(sentenceDto));
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const ownerId = getVisitorId(request);
    const input = sentenceInputSchema.parse(await request.json());
    const tags = [...new Set([...input.tags, ...(input.isSample ? ["sample"] : [])])];
    const [row] = await getDb().insert(sentences).values({ ownerId, english: input.english, korean: input.korean, note: input.note || null, tags }).returning();
    return NextResponse.json(sentenceDto(row), { status: 201 });
  } catch (error) { return apiError(error); }
}
