import { InfiniteOption, MixedItem } from "@/types";

export const MIXED_ITEMS: MixedItem[] = [
  { key: "plan-basic", label: "Choose: Basic plan", type: "select", value: "basic", description: "Free forever" },
  { key: "plan-pro", label: "Choose: Pro plan", type: "select", value: "pro", description: "Best for teams" },
  { key: "docs", label: "Open documentation", type: "link", href: "https://example.com/docs", description: "New tab" },
  { key: "support", label: "Get support", type: "link", href: "https://example.com/support", description: "Help center" },
];

export const ALL_OPTIONS: InfiniteOption[] = Array.from({ length: 100 }).map((_, i) => ({
  key: `opt-${i + 1}`,
  label: `Option ${i + 1}`,
}));






export const sampleTimeSeries = [
  { month: "Jan", revenue: 12000, cost: 8000,  profit: 4000 },
  { month: "Feb", revenue: 13500, cost: 9000,  profit: 4500 },
  { month: "Mar", revenue: 15000, cost: 9400,  profit: 5600 },
  { month: "Apr", revenue: 16500, cost: 9900,  profit: 6600 },
  { month: "May", revenue: 18200, cost: 10250, profit: 7950 },
  { month: "Jun", revenue: 17000, cost: 10400, profit: 6600 },
  { month: "Jul", revenue: 19000, cost: 11000, profit: 8000 },
  { month: "Aug", revenue: 21000, cost: 11800, profit: 9200 },
  { month: "Sep", revenue: 22000, cost: 12000, profit: 10000 },
  { month: "Oct", revenue: 24000, cost: 13000, profit: 11000 },
  { month: "Nov", revenue: 26000, cost: 14200, profit: 11800 },
  { month: "Dec", revenue: 30000, cost: 16000, profit: 14000 },
];

export const sampleBars = [
  { label: "Q1", sales: 32000, target: 30000 },
  { label: "Q2", sales: 39000, target: 36000 },
  { label: "Q3", sales: 42000, target: 41000 },
  { label: "Q4", sales: 51000, target: 48000 },
];

export const samplePie = [
  { category: "Desktop", value: 540 },
  { category: "Mobile",  value: 820 },
  { category: "Tablet",  value: 260 },
  { category: "Other",   value: 120 },
];
