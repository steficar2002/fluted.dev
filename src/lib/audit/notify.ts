import { Resend } from "resend";
import { site } from "@/lib/content";
import type { AuditRecord } from "./schema";

export async function notifyAuditUnlock(record: AuditRecord): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.AUDIT_NOTIFY_EMAIL ?? site.email;
  const lead = record.lead;
  if (!lead) return;

  const subject = `Audit unlock: ${record.url}`;
  const text = [
    `New free audit unlock`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.company ? `Company: ${lead.company}` : null,
    lead.notes ? `Notes: ${lead.notes}` : null,
    ``,
    `Website: ${record.url}`,
    `Audit ID: ${record.id}`,
    `Score: ${record.report.overallScore}/100`,
    `Summary: ${record.report.summary}`,
    ``,
    `Unlocked at: ${lead.unlockedAt}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!apiKey) {
    console.info("[audit-unlock]", text);
    return;
  }

  const resend = new Resend(apiKey);
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Fluted Audits <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to: [to],
    replyTo: lead.email,
    subject,
    text,
  });
}
