import { describe, expect, it } from "vitest";
import { applyReview, intervalForStreak } from "./spaced-repetition";
import type { Sentence } from "./types";

const base: Sentence = { id: "1", english: "Hello.", korean: "안녕.", note: "", tags: [], status: "new", reviewCount: 0, successStreak: 0, lastReviewedAt: null, nextReviewAt: "2026-10-28T00:00:00.000Z", createdAt: "2026-10-28T00:00:00.000Z", updatedAt: "2026-10-28T00:00:00.000Z" };

describe("spaced repetition", () => {
  it("uses 1, 3, 7, 14 and 30 day intervals", () => {
    expect([1, 2, 3, 4, 5, 8].map(intervalForStreak)).toEqual([1, 3, 7, 14, 30, 30]);
  });
  it("promotes a sentence to mastered on the fourth eligible success", () => {
    const reviewed = applyReview({ ...base, status: "learning", successStreak: 3 }, "got_it", new Date("2026-10-28T09:00:00Z"), new Date("2026-10-28T08:00:00Z"));
    expect(reviewed.successStreak).toBe(4);
    expect(reviewed.status).toBe("mastered");
    expect(reviewed.nextReviewAt).toBe("2026-11-11T09:00:00.000Z");
  });
  it("resets the streak after again", () => {
    const reviewed = applyReview({ ...base, status: "mastered", successStreak: 6 }, "again", new Date("2026-10-28T09:00:00Z"), new Date("2026-10-28T08:00:00Z"));
    expect(reviewed.successStreak).toBe(0);
    expect(reviewed.status).toBe("learning");
  });
  it("logs another same-day response without increasing the streak twice", () => {
    const reviewed = applyReview({ ...base, status: "learning", successStreak: 1, reviewCount: 1, lastReviewedAt: "2026-10-28T01:00:00Z" }, "got_it", new Date("2026-10-28T09:00:00Z"), new Date("2026-10-28T08:00:00Z"));
    expect(reviewed.reviewCount).toBe(2);
    expect(reviewed.successStreak).toBe(1);
    expect(reviewed.nextReviewAt).toBe(base.nextReviewAt);
  });
});
