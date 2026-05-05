import type { CVFormData } from "@/components/cv-form/types";
import { aiAPI } from "@/lib/api";
import {
  calculateResumeScore,
  type ResumeScore,
} from "@/lib/resumeScorer";

function normalizeAiScore(raw: {
  overallScore: number;
  estimatedPages?: number;
  categories: Array<{
    name: string;
    score: number;
    maxScore: number;
    feedback: string;
  }>;
  suggestions: string[];
}): ResumeScore {
  return {
    overallScore: Math.max(0, Math.min(10, Number(raw.overallScore) || 0)),
    categories: (raw.categories || []).map((c) => ({
      name: c.name,
      score: Math.max(0, Math.min(c.maxScore || 0, Number(c.score) || 0)),
      maxScore: c.maxScore,
      feedback: c.feedback || "",
    })),
    suggestions: Array.isArray(raw.suggestions)
      ? raw.suggestions.filter((s) => typeof s === "string" && s.trim())
      : [],
  };
}

/**
 * For logged-in users, scores via DeepSeek on the server (rubric-aware).
 * Falls back to local heuristic scoring if the API fails or user is a guest.
 */
export async function getResumeScoreWithOptionalAI(
  data: CVFormData,
  isAuthenticated: boolean,
): Promise<ResumeScore> {
  if (!isAuthenticated) {
    return calculateResumeScore(data);
  }
  try {
    const raw = await aiAPI.scoreResume(data);
    return normalizeAiScore(raw);
  } catch {
    return calculateResumeScore(data);
  }
}
