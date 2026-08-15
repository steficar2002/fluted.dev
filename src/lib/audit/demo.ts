import type { AuditReport, PageSpeedScores } from "./schema";

/** Local UI/dev path — dummy PDP / CRO findings until live APIs are connected. */
export function demoReport(url: string): {
  scores: PageSpeedScores;
  report: AuditReport;
} {
  const host = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  return {
    scores: {
      performance: 62,
      accessibility: 88,
      bestPractices: 79,
      seo: 91,
    },
    report: {
      overallScore: 68,
      summary: `${host} has a workable ecommerce shell, but product-page conversion and path-to-cart clarity are where most revenue is left on the table.`,
      strengths: [
        {
          title: "Product imagery reads at first glance",
          detail:
            "Hero media on key PDPs shows the product clearly enough that shoppers understand what they are buying without scrolling for context.",
          impact: "Cuts early PDP bounce from visual ambiguity.",
        },
        {
          title: "Price and availability are visible above the fold",
          detail:
            "Core purchase facts are not buried — shoppers can evaluate cost without hunting through secondary tabs.",
          impact: "Keeps consideration moving toward add-to-cart.",
        },
        {
          title: "Collection paths into PDPs are coherent",
          detail:
            "Category to product handoff preserves enough context that shoppers do not lose the thread mid-browse.",
          impact: "Supports browse-to-PDP continuation rates.",
        },
      ],
      improvements: [
        {
          title: "Add-to-cart CTA competes with secondary actions",
          detail:
            "Wishlist, size guides, and promo modules sit at equal visual weight to the primary purchase button on the PDP.",
          impact: "Splits attention and slows add-to-cart decisions.",
        },
        {
          title: "Variant selection friction before purchase",
          detail:
            "Size/color picking lacks strong defaults, stock cues, or error recovery — shoppers stall before they can buy.",
          impact: "Raises abandon rate on otherwise interested traffic.",
        },
        {
          title: "Social proof is generic on the PDP",
          detail:
            "Reviews and trust lines lack specificity (fit, use case, quantity sold) next to the buy box.",
          impact: "Misses an easy lift on perceived purchase risk.",
        },
        {
          title: "Shipping / returns clarity arrives too late",
          detail:
            "Delivery windows and return policy sit below the fold or in footer links instead of beside the CTA.",
          impact: "Uncertainty blocks conversion for first-time buyers.",
        },
        {
          title: "Cross-sell blocks dilute the buy decision",
          detail:
            "Related products interrupt the purchase path before the shopper commits to the current PDP.",
          impact: "Increases comparison loops and cart hesitation.",
        },
        {
          title: "Mobile PDP performance headroom",
          detail:
            "Lab signals suggest mobile shoppers wait longer than needed before interacting with variants or ATC.",
          impact: "Latency compounds drop-off before conversion.",
        },
      ],
    },
  };
}

export function isDemoMode(): boolean {
  // Placeholder flow until live APIs are connected. Set AUDIT_LIVE=1 to enable real scrapes/LLM.
  if (process.env.AUDIT_LIVE === "1") return false;
  return true;
}
