import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditReportView } from "@/components/audit-report";
import { Nav } from "@/components/nav";
import { toTeaser } from "@/lib/audit/schema";
import { getAudit } from "@/lib/audit/store";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const record = await getAudit(id);
  if (!record) {
    return { title: "Audit not found — fluted" };
  }
  let host = record.url;
  try {
    host = new URL(record.url).hostname;
  } catch {
    /* keep url */
  }
  return {
    title: `Audit · ${host} — fluted`,
    description: record.report.summary,
    robots: { index: false, follow: false },
  };
}

export default async function AuditPage({ params }: Props) {
  const { id } = await params;
  const record = await getAudit(id);
  if (!record) notFound();

  return (
    <>
      <Nav variant="on-light" />
      <main className="flex-1 bg-ground">
        <AuditReportView initial={toTeaser(record)} />
      </main>
    </>
  );
}
