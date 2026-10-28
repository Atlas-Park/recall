CREATE INDEX "review_logs_sentence_id_idx" ON "review_logs" USING btree ("sentence_id");--> statement-breakpoint
CREATE INDEX "review_logs_reviewed_at_idx" ON "review_logs" USING btree ("reviewed_at");--> statement-breakpoint
CREATE INDEX "sentences_next_review_at_idx" ON "sentences" USING btree ("next_review_at");--> statement-breakpoint
ALTER TABLE "review_logs" ADD CONSTRAINT "review_logs_result_check" CHECK ("review_logs"."result" in ('again', 'got_it'));--> statement-breakpoint
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_status_check" CHECK ("sentences"."status" in ('new', 'learning', 'mastered'));--> statement-breakpoint
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_review_count_check" CHECK ("sentences"."review_count" >= 0);--> statement-breakpoint
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_success_streak_check" CHECK ("sentences"."success_streak" >= 0);