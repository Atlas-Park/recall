import { z } from "zod";

export const sentenceInputSchema = z.object({
  english: z.string().trim().min(1, "영어 문장을 입력해 주세요.").max(500),
  korean: z.string().trim().min(1, "한국어 해석을 입력해 주세요.").max(500),
  note: z.string().trim().max(1000).default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  isSample: z.boolean().optional(),
});

export const reviewInputSchema = z.object({
  sentenceId: z.string().uuid(),
  result: z.enum(["again", "got_it"]),
  sessionStartedAt: z.string().datetime(),
});
