import type { LearningStats, RecallData, ReviewLog, ReviewResult, Sentence, SentenceInput, SentenceRepository } from "@/lib/types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? "Request failed");
  return response.json() as Promise<T>;
}

export class ApiStorageRepository implements SentenceRepository {
  async load(): Promise<RecallData> {
    const [sentences, stats] = await Promise.all([request<Sentence[]>("/api/sentences"), request<LearningStats>("/api/stats")]);
    return { sentences, stats };
  }
  create(input: SentenceInput & { isSample?: boolean }) { return request<Sentence>("/api/sentences", { method: "POST", body: JSON.stringify(input) }); }
  update(id: string, input: SentenceInput) { return request<Sentence>(`/api/sentences/${id}`, { method: "PATCH", body: JSON.stringify(input) }); }
  async remove(id: string) { await request<{ ok: true }>(`/api/sentences/${id}`, { method: "DELETE" }); }
  review(id: string, result: ReviewResult, sessionStartedAt: string) { return request<{ sentence: Sentence; log: ReviewLog }>("/api/reviews", { method: "POST", body: JSON.stringify({ sentenceId: id, result, sessionStartedAt }) }); }
}
