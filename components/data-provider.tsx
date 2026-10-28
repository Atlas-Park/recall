"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiStorageRepository } from "@/lib/storage/api-storage";
import { sampleSentences } from "@/lib/seed";
import type { RecallData, ReviewResult, SentenceInput, SentenceRepository } from "@/lib/types";

type DataContextValue = RecallData & {
  loading: boolean; error: string | null;
  createSentence(input: SentenceInput & { isSample?: boolean }): Promise<void>;
  updateSentence(id: string, input: SentenceInput): Promise<void>;
  deleteSentence(id: string): Promise<void>;
  recordReview(id: string, result: ReviewResult, sessionStartedAt: string): Promise<void>;
  importSamples(): Promise<void>;
  reload(): Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const repository = useMemo<SentenceRepository>(() => new ApiStorageRepository(), []);
  const [data, setData] = useState<RecallData>({ sentences: [], stats: { total: 0, mastered: 0, due: 0, studiedToday: 0, reviewCount: 0, gotItCount: 0, activity: [] } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try { setError(null); setData(await repository.load()); } catch (cause) { setError(cause instanceof Error ? cause.message : "데이터를 불러오지 못했습니다."); } finally { setLoading(false); }
  }, [repository]);
  useEffect(() => {
    repository.load().then(setData).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "데이터를 불러오지 못했습니다.")).finally(() => setLoading(false));
  }, [repository]);

  const run = async (action: () => Promise<unknown>) => {
    try { setError(null); await action(); await reload(); } catch (cause) { const message = cause instanceof Error ? cause.message : "작업을 완료하지 못했습니다."; setError(message); throw cause; }
  };

  const value: DataContextValue = {
    ...data, loading, error, reload,
    createSentence: (input) => run(() => repository.create(input)),
    updateSentence: (id, input) => run(() => repository.update(id, input)),
    deleteSentence: (id) => run(() => repository.remove(id)),
    recordReview: (id, result, sessionStartedAt) => run(() => repository.review(id, result, sessionStartedAt)),
    importSamples: () => run(async () => { for (const input of sampleSentences) await repository.create({ ...input, isSample: true }); }),
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useRecallData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useRecallData must be used within DataProvider");
  return context;
}
