import Firecrawl from "@mendable/firecrawl-js";

const MAX_MARKDOWN_CHARS = 12_000;

export async function scrapeHomepage(url: string): Promise<string> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY is not configured.");
  }

  const firecrawl = new Firecrawl({ apiKey });
  const doc = await firecrawl.scrape(url, {
    formats: ["markdown"],
    onlyMainContent: true,
  });

  const markdown =
    typeof doc === "object" && doc && "markdown" in doc
      ? String((doc as { markdown?: string }).markdown ?? "")
      : "";

  if (!markdown.trim()) {
    throw new Error("Could not read that homepage. Try another URL.");
  }

  return markdown.slice(0, MAX_MARKDOWN_CHARS);
}
