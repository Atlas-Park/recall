export type SentenceStatus = "new" | "learning" | "mastered";
export type ReviewResult = "again" | "got_it";

export type Sentence = {
  id: string;
  english: string;
  korean: string;
  note: string;
  tags: string[];
  status: SentenceStatus;
  reviewCount: number;
  successStreak: number;
  lastReviewedAt: string | null;
  nextReviewAt: string;
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
};

export type ReviewLog = {
  id: string;
  sentenceId: string;
  result: ReviewResult;
  reviewedAt: string;
};

export type SentenceInput = Pick<Sentence, "english" | "korean" | "note" | "tags">;

export type ActivityDay = { key: string; label: string; count: number };
export type LearningStats = { total: number; mastered: number; due: number; studiedToday: number; reviewCount: number; gotItCount: number; activity: ActivityDay[] };
export type RecallData = { sentences: Sentence[]; stats: LearningStats };

export interface SentenceRepository {
  load(): Promise<RecallData>;
  create(input: SentenceInput & { isSample?: boolean }): Promise<Sentence>;
  update(id: string, input: SentenceInput): Promise<Sentence>;
  remove(id: string): Promise<void>;
  review(id: string, result: ReviewResult, sessionStartedAt: string): Promise<{ sentence: Sentence; log: ReviewLog }>;
}
