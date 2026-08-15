import OpenAI from "openai";
import { auditReportSchema, type AuditReport, type PageSpeedScores } from "./schema";

const SYSTEM = `You are a senior Shopify conversion (CRO) auditor for Fluted, a custom Shopify agency.
Analyze ONLY the homepage content and PageSpeed scores provided.
Write clear, confident, specific findings a founder would trust — no fluff, no invented metrics, no fake client claims.
Focus on: value proposition clarity, primary CTA, trust signals, product/offer clarity, mobile funnel friction cues visible on the homepage, and performance implications for conversion.
Return JSON matching the schema exactly.
Provide 2–3 strengths and 5–7 improvements (extras will be gated behind a lead form).
Each improvement needs an "impact" field explaining what it reflects for conversion/revenue.`;

export async function generateAuditReport(input: {
  url: string;
  markdown: string;
  scores: PageSpeedScores;
}): Promise<AuditReport> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.AUDIT_LLM_MODEL ?? "gpt-5-mini";

  const user = JSON.stringify({
    url: input.url,
    pageSpeedMobile: input.scores,
    homepageMarkdown: input.markdown,
  });

  const response = await client.chat.completions.create({
    model,
    temperature: 0.4,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "website_audit_report",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            overallScore: { type: "number" },
            summary: { type: "string" },
            strengths: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  title: { type: "string" },
                  detail: { type: "string" },
                  impact: { type: "string" },
                },
                required: ["title", "detail", "impact"],
              },
            },
            improvements: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  title: { type: "string" },
                  detail: { type: "string" },
                  impact: { type: "string" },
                },
                required: ["title", "detail", "impact"],
              },
            },
          },
          required: ["overallScore", "summary", "strengths", "improvements"],
        },
      },
    },
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Produce a homepage conversion audit JSON for this store:\n${user}`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("The audit model returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("The audit model returned invalid JSON.");
  }

  const result = auditReportSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("The audit report failed validation.");
  }

  return result.data;
}
