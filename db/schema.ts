import { sql } from "drizzle-orm";
import { check, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const sentences = pgTable("sentences", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").defaultRandom().notNull(),
  english: text("english").notNull(),
  korean: text("korean").notNull(),
  note: text("note"),
  tags: text("tags").array().notNull().default([]),
  status: text("status").notNull().default("new"),
  reviewCount: integer("review_count").notNull().default(0),
  successStreak: integer("success_streak").notNull().default(0),
  lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
  nextReviewAt: timestamp("next_review_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check("sentences_status_check", sql`${table.status} in ('new', 'learning', 'mastered')`),
  check("sentences_review_count_check", sql`${table.reviewCount} >= 0`),
  check("sentences_success_streak_check", sql`${table.successStreak} >= 0`),
  index("sentences_next_review_at_idx").on(table.nextReviewAt),
  index("sentences_owner_id_idx").on(table.ownerId),
]);

export const reviewLogs = pgTable("review_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  sentenceId: uuid("sentence_id").notNull().references(() => sentences.id, { onDelete: "cascade" }),
  result: text("result").notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check("review_logs_result_check", sql`${table.result} in ('again', 'got_it')`),
  index("review_logs_sentence_id_idx").on(table.sentenceId),
  index("review_logs_reviewed_at_idx").on(table.reviewedAt),
]);

export type SentenceRow = typeof sentences.$inferSelect;
export type ReviewLogRow = typeof reviewLogs.$inferSelect;
