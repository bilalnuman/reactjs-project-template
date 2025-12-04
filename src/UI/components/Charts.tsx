"use client";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * ReusableChart — a single, flexible chart component powered by Recharts.
 *
 * Supports: line, multi-line, bar, area, pie, donut
 * - Tailwind-friendly wrapper
 * - Fully responsive via <ResponsiveContainer />
 * - Highly customizable from the parent component
 *
 * Example usage:
 * <ReusableChart
 *   type="line"
 *   data={data}
 *   xKey="month"
 *   series=[{ key: 'revenue', name: 'Revenue', color: '#2563eb' }, { key: 'cost', name: 'Cost', color: '#ef4444' }]
 *   height={320}
 *   grid
 *   legend="bottom"
 *   tooltip
 * />
 *
 * <ReusableChart
 *   type="donut"
 *   data={data}
 *   pie={{ nameKey: 'category', valueKey: 'value', label: true }}
 * />
 */

// -------------------- Types --------------------
export type ChartType = "line" | "multi-line" | "bar" | "area" | "pie" | "donut";

export type SeriesConfig = {
  key: string; // data key for Y values
  name?: string;
  color?: string;
  yAxisId?: "left" | "right" | string;
  stack?: boolean | string; // true -> 'stack', or specify custom stackId
  dot?: boolean;
  strokeWidth?: number;
  type?: "monotone" | "linear" | "basis" | "step" | "natural";
  fillOpacity?: number; // for area/bar fill
  barSize?: number; // for bars
};

export type PieConfig = {
  nameKey: string; // label/name key
  valueKey: string; // numeric value key
  colors?: string[];
  label?: boolean;
  innerRadius?: number | string; // used for donut
  outerRadius?: number | string;
};

export interface ReusableChartProps {
  type: ChartType;
  data: Record<string, any>[];
  /** For line/bar/area charts */
  xKey?: string;
  series?: SeriesConfig[]; // If omitted, numeric keys (except xKey) will be auto-detected
  /** For pie & donut charts */
  pie?: PieConfig;

  /** Presentation */
  height?: number; // container height in px (responsive width)
  className?: string; // tailwind classes for the outer wrapper

  /** Toggles */
  grid?: boolean;
  legend?: boolean | "top" | "bottom" | "left" | "right";
  tooltip?: boolean;
  stacked?: boolean; // stack all series (bar/area); individual series.stack can override

  /** Axis and margins */
  xAxisProps?: any; // passthrough (Recharts XAxis props)
  yAxisProps?: any; // passthrough (Recharts YAxis props)
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  layout?: "horizontal" | "vertical"; // mainly for bar charts

  /** Custom slots/passthrough for Legend & Tooltip */
  legendContent?: React.ReactNode | ((props: any) => React.ReactNode);
  tooltipContent?: React.ReactNode | ((props: any) => React.ReactNode);
  legendProps?: any;
  tooltipProps?: any;
}

// -------------------- Defaults & helpers --------------------
const DEFAULT_COLORS = [
  "#2563eb", // blue-600
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#14b8a6", // teal-500
  "#f43f5e", // rose-500
  "#22c55e", // green-500
];

const titleCase = (s: string) =>
  (s || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[\-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());

const autoDetectSeries = (
  data: Record<string, any>[],
  xKey?: string
): SeriesConfig[] => {
  const first = data?.[0] ?? {};
  const keys = Object.keys(first).filter((k) => k !== xKey);
  const numericKeys = keys.filter((k) => typeof first[k] === "number");
  return numericKeys.map((key, i) => ({
    key,
    name: titleCase(key),
    color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
  }));
};

const hasRightAxis = (series: SeriesConfig[] = []) =>
  new Set(series.map((s) => s.yAxisId).filter(Boolean)).has("right");

const legendPosition = (
  pos?: boolean | "top" | "bottom" | "left" | "right"
): Partial<any> | null => {
  if (!pos) return null;
  const p = typeof pos === "string" ? pos : "bottom";
  const verticalMap: Record<string, any> = {
    top: { verticalAlign: "top", align: "center" },
    bottom: { verticalAlign: "bottom", align: "center" },
    left: { layout: "vertical", verticalAlign: "middle", align: "left" },
    right: { layout: "vertical", verticalAlign: "middle", align: "right" },
  };
  return verticalMap[p] ?? verticalMap.bottom;
};

const stackIdFor = (stack?: boolean | string, globalStacked?: boolean) =>
  stack ? (stack === true ? "stack" : String(stack)) : globalStacked ? "stack" : undefined;

// Tailwind-styled tooltip
const DefaultTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border bg-white/90 px-3 py-2 text-sm shadow-xl backdrop-blur">
      {label !== undefined && (
        <div className="mb-1 font-medium text-gray-800">{String(label)}</div>
      )}
      <div className="space-y-0.5">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-gray-700">{p.name ?? p.dataKey}</span>
            <span className="ml-auto font-semibold text-gray-900">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------- Main Component --------------------
const ReusableChart: React.FC<ReusableChartProps> = ({
  type,
  data,
  xKey,
  series: seriesProp,
  pie,
  height = 320,
  className = "",
  grid = true,
  legend = false,
  tooltip = true,
  stacked = false,
  xAxisProps,
  yAxisProps,
  margin = { top: 8, right: 16, bottom: 8, left: 8 },
  layout = "horizontal",
  legendContent,
  tooltipContent,
  legendProps,
  tooltipProps,
}) => {
  const series = (seriesProp?.length ? seriesProp : autoDetectSeries(data, xKey))
    .map((s, i) => ({
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      strokeWidth: 2,
      type: "monotone",
      dot: false,
      fillOpacity: 0.24,
      ...s,
    }));

  const rightAxis = hasRightAxis(series);
  const wrapperCN = `w-full ${className}`;

  // ---- Renderers ----
  const renderLineOrArea = (mode: "line" | "area") => {
    const ChartComp = mode === "line" ? LineChart : AreaChart;
    const SeriesComp: any = mode === "line" ? Line : Area;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <ChartComp data={data} margin={margin}>
          {grid && <CartesianGrid strokeDasharray="3 3" />}
          {xKey && <XAxis dataKey={xKey} {...xAxisProps} />}
          <YAxis yAxisId="left" {...yAxisProps} />
          {rightAxis && <YAxis yAxisId="right" orientation="right" />}
          {tooltip && (
          <Tooltip content={(tooltipContent as any) ?? <DefaultTooltip />} {...tooltipProps} />
        )} />}
          {(legend || legendContent) && (
          <Legend {...legendPosition(legend)} content={legendContent as any} {...legendProps} />
        )}

          {series.map((s, i) => (
            <SeriesComp
              key={`${mode}-${s.key}-${i}`}
              type={s.type}
              yAxisId={s.yAxisId ?? "left"}
              dataKey={s.key}
              name={s.name ?? titleCase(s.key)}
              stroke={s.color}
              fill={s.color}
              strokeWidth={s.strokeWidth}
              dot={s.dot}
              stackId={mode === "area" ? stackIdFor(s.stack, stacked) : undefined}
              fillOpacity={mode === "area" ? s.fillOpacity : undefined}
              isAnimationActive={true}
            />
          ))}
        </ChartComp>
      </ResponsiveContainer>
    );
  };

  const renderBar = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={margin}
        layout={layout}
      >
        {grid && <CartesianGrid strokeDasharray="3 3" />}
        {xKey && layout === "horizontal" && <XAxis dataKey={xKey} {...xAxisProps} />}
        {layout === "horizontal" ? (
          <YAxis yAxisId="left" {...yAxisProps} />
        ) : (
          <YAxis type="category" dataKey={xKey} {...yAxisProps} />
        )}
        {rightAxis && layout === "horizontal" && (
          <YAxis yAxisId="right" orientation="right" />
        )}
        {tooltip && (
          <Tooltip content={(tooltipContent as any) ?? <DefaultTooltip />} {...tooltipProps} />
        )} />}
        {(legend || legendContent) && (
          <Legend {...legendPosition(legend)} content={legendContent as any} {...legendProps} />
        )}

        {series.map((s, i) => (
          <Bar
            key={`bar-${s.key}-${i}`}
            yAxisId={s.yAxisId ?? "left"}
            dataKey={s.key}
            name={s.name ?? titleCase(s.key)}
            fill={s.color}
            stackId={stackIdFor(s.stack, stacked)}
            isAnimationActive={true}
            barSize={s.barSize}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieOrDonut = (isDonut: boolean) => {
    const cfg: PieConfig = {
      nameKey: pie?.nameKey ?? "name",
      valueKey: pie?.valueKey ?? "value",
      colors: pie?.colors ?? DEFAULT_COLORS,
      label: pie?.label ?? true,
      innerRadius: isDonut ? pie?.innerRadius ?? "55%" : 0,
      outerRadius: pie?.outerRadius ?? "85%",
    };

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={margin}>
          {tooltip && (
          <Tooltip content={(tooltipContent as any) ?? <DefaultTooltip />} {...tooltipProps} />
        )} />}
          {(legend || legendContent) && (
          <Legend {...legendPosition(legend)} content={legendContent as any} {...legendProps} />
        )}
          <Pie
            data={data}
            dataKey={cfg.valueKey}
            nameKey={cfg.nameKey}
            innerRadius={cfg.innerRadius as any}
            outerRadius={cfg.outerRadius as any}
            isAnimationActive={true}
            label={cfg.label}
          >
            {data?.map((_, i) => (
              <Cell key={`cell-${i}`} fill={cfg.colors![i % cfg.colors!.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // ---- Switch by type ----
  let content: React.ReactNode = null;

  if (!data || data.length === 0) {
    content = (
      <div className="flex h-[200px] w-full items-center justify-center rounded-2xl border border-dashed bg-gray-50 text-sm text-gray-500">
        No data
      </div>
    );
  } else {
    switch (type) {
      case "line":
      case "multi-line":
        content = renderLineOrArea("line");
        break;
      case "area":
        content = renderLineOrArea("area");
        break;
      case "bar":
        content = renderBar();
        break;
      case "pie":
        content = renderPieOrDonut(false);
        break;
      case "donut":
        content = renderPieOrDonut(true);
        break;
      default:
        content = (
          <div className="rounded-xl border p-4 text-sm text-red-600">
            Unknown chart type: <code>{String(type)}</code>
          </div>
        );
    }
  }

  return <div className={wrapperCN}>{content}</div>;
};

// -------------------- Example Data --------------------
export const sampleTimeSeries = [
  { month: "Jan", revenue: 12000, cost: 8000, profit: 4000 },
  { month: "Feb", revenue: 13500, cost: 9000, profit: 4500 },
  { month: "Mar", revenue: 15000, cost: 9400, profit: 5600 },
  { month: "Apr", revenue: 16500, cost: 9900, profit: 6600 },
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
  { category: "Mobile", value: 820 },
  { category: "Tablet", value: 260 },
  { category: "Other", value: 120 },
];

// -------------------- Example Usage Component --------------------
export const ExampleCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {/* Multi-line */}
      <div className="rounded-2xl border p-4">
        <div className="mb-2 text-sm font-semibold text-gray-700">Multi-line</div>
        <ReusableChart
          type="multi-line"
          data={sampleTimeSeries}
          xKey="month"
          series={[
            { key: "revenue", name: "Revenue", color: "#2563eb" },
            { key: "cost", name: "Cost", color: "#ef4444" },
          ]}
          legend
          tooltip
          height={260}
        />
      </div>

      {/* Area (stacked) */}
      <div className="rounded-2xl border p-4">
        <div className="mb-2 text-sm font-semibold text-gray-700">Area (stacked)</div>
        <ReusableChart
          type="area"
          data={sampleTimeSeries}
          xKey="month"
          series={[
            { key: "cost", name: "Cost", color: "#f59e0b", stack: true, fillOpacity: 0.3 },
            { key: "profit", name: "Profit", color: "#10b981", stack: true, fillOpacity: 0.3 },
          ]}
          stacked
          legend
          tooltip
          height={260}
        />
      </div>

      {/* Bar */}
      <div className="rounded-2xl border p-4">
        <div className="mb-2 text-sm font-semibold text-gray-700">Bar</div>
        <ReusableChart
          type="bar"
          data={sampleBars}
          xKey="label"
          series={[
            { key: "sales", name: "Sales", color: "#8b5cf6" },
            { key: "target", name: "Target", color: "#22c55e" },
          ]}
          legend
          tooltip
          height={260}
        />
      </div>

      {/* Line */}
      <div className="rounded-2xl border p-4">
        <div className="mb-2 text-sm font-semibold text-gray-700">Line</div>
        <ReusableChart
          type="line"
          data={sampleTimeSeries}
          xKey="month"
          series={[{ key: "revenue", name: "Revenue", color: "#2563eb" }]}
          grid
          tooltip
          height={260}
        />
      </div>

      {/* Pie */}
      <div className="rounded-2xl border p-4">
        <div className="mb-2 text-sm font-semibold text-gray-700">Pie</div>
        <ReusableChart
          type="pie"
          data={samplePie}
          pie={{ nameKey: "category", valueKey: "value" }}
          legend
          tooltip
          height={260}
        />
      </div>

      {/* Donut */}
      <div className="rounded-2xl border p-4">
        <div className="mb-2 text-sm font-semibold text-gray-700">Donut</div>
        <ReusableChart
          type="donut"
          data={samplePie}
          pie={{ nameKey: "category", valueKey: "value", innerRadius: "60%" }}
          legend
          tooltip
          height={260}
        />
      </div>
    </div>
  );
};

export default ReusableChart;
