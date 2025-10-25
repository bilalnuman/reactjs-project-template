import { InfiniteOption, MixedItem } from "@/types";

export const MIXED_ITEMS: MixedItem[] = [
  { key: "plan-basic", label: "Choose: Basic plan", type: "select", value: "basic", description: "Free forever" },
  { key: "plan-pro", label: "Choose: Pro plan", type: "select", value: "pro", description: "Best for teams" },
  { key: "docs", label: "Open documentation", type: "link", href: "https://example.com/docs", description: "New tab" },
  { key: "support", label: "Get support", type: "link", href: "https://example.com/support", description: "Help center" },
];

export const ALL_OPTIONS: InfiniteOption[] = Array.from({ length: 1000 }).map((_, i) => ({
  key: `opt-${i + 1}`,
  label: `Option ${i + 1}`,
}));