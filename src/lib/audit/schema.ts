import { z } from "zod";

export const auditFindingSchema = z.object({
  title: z.string().min(1).max(120),
  detail: z.string().min(1).max(400),
  impact: z.string().min(1).max(200),
});

export const auditReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string().min(1).max(400),
  strengths: z.array(auditFindingSchema).min(2).max(4),
  improvements: z.array(auditFindingSchema).min(4).max(8),
});

export type AuditFinding = z.infer<typeof auditFindingSchema>;
export type AuditReport = z.infer<typeof auditReportSchema>;

export type PageSpeedScores = {
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
};

export type AuditRecord = {
  id: string;
  url: string;
  createdAt: string;
  unlocked: boolean;
  lead?: {
    name: string;
    email: string;
    company?: string;
    notes?: string;
    unlockedAt: string;
  };
  scores: PageSpeedScores;
  report: AuditReport;
};

/** Public teaser: first 2 strengths + first 2 improvements visible; rest locked. */
export type AuditTeaser = {
  id: string;
  url: string;
  createdAt: string;
  unlocked: boolean;
  scores: PageSpeedScores;
  overallScore: number;
  summary: string;
  strengths: AuditFinding[];
  improvements: AuditFinding[];
  lockedCount: number;
  lockedTitles: string[];
};

export function toTeaser(record: AuditRecord): AuditTeaser {
  const visibleStrengths = record.report.strengths.slice(0, 2);
  const visibleImprovements = record.unlocked
    ? record.report.improvements
    : record.report.improvements.slice(0, 2);
  const locked = record.unlocked
    ? []
    : [
        ...record.report.strengths.slice(2),
        ...record.report.improvements.slice(2),
      ];

  return {
    id: record.id,
    url: record.url,
    createdAt: record.createdAt,
    unlocked: record.unlocked,
    scores: record.scores,
    overallScore: record.report.overallScore,
    summary: record.report.summary,
    strengths: visibleStrengths,
    improvements: visibleImprovements,
    lockedCount: locked.length,
    lockedTitles: locked.map((f) => f.title),
  };
}
