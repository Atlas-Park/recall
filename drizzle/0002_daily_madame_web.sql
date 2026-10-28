ALTER TABLE "sentences" ADD COLUMN "owner_id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE INDEX "sentences_owner_id_idx" ON "sentences" USING btree ("owner_id");