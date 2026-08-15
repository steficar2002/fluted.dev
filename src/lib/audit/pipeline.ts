import { nanoid } from "nanoid";
import { demoReport, isDemoMode } from "./demo";
import { generateAuditReport } from "./llm";
import { fetchPageSpeedScores } from "./pagespeed";
import { scrapeHomepage } from "./scrape";
import { saveAudit } from "./store";
import type { AuditRecord } from "./schema";

export async function runHomepageAudit(url: string): Promise<AuditRecord> {
  const demo = isDemoMode();

  if (demo) {
    // Artificial delay so the loading page can show its placeholder states
    await new Promise((r) => setTimeout(r, 2200));
    const { scores, report } = demoReport(url);
    const record: AuditRecord = {
      id: nanoid(12),
      url,
      createdAt: new Date().toISOString(),
      unlocked: false,
      scores,
      report,
    };
    await saveAudit(record);
    return record;
  }

  const [markdown, scores] = await Promise.all([
    scrapeHomepage(url),
    fetchPageSpeedScores(url),
  ]);

  const report = await generateAuditReport({ url, markdown, scores });

  const record: AuditRecord = {
    id: nanoid(12),
    url,
    createdAt: new Date().toISOString(),
    unlocked: false,
    scores,
    report,
  };
  await saveAudit(record);
  return record;
}
