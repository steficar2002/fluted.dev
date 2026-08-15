import type { PageSpeedScores } from "./schema";

function scoreFromCategory(value: unknown): number | null {
  if (
    value &&
    typeof value === "object" &&
    "score" in value &&
    typeof (value as { score: unknown }).score === "number"
  ) {
    return Math.round((value as { score: number }).score * 100);
  }
  return null;
}

export async function fetchPageSpeedScores(
  url: string,
): Promise<PageSpeedScores> {
  const key = process.env.PAGESPEED_API_KEY;
  const endpoint = new URL(
    "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed",
  );
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", "mobile");
  for (const category of [
    "performance",
    "accessibility",
    "best-practices",
    "seo",
  ]) {
    endpoint.searchParams.append("category", category);
  }
  if (key) endpoint.searchParams.set("key", key);

  const res = await fetch(endpoint.toString(), {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    // Soft-fail: audit can continue with LLM-only scoring
    console.warn("[pagespeed]", res.status, await res.text().catch(() => ""));
    return {
      performance: null,
      accessibility: null,
      bestPractices: null,
      seo: null,
    };
  }

  const data = (await res.json()) as {
    lighthouseResult?: {
      categories?: Record<string, unknown>;
    };
  };
  const categories = data.lighthouseResult?.categories ?? {};

  return {
    performance: scoreFromCategory(categories.performance),
    accessibility: scoreFromCategory(categories.accessibility),
    bestPractices: scoreFromCategory(categories["best-practices"]),
    seo: scoreFromCategory(categories.seo),
  };
}
