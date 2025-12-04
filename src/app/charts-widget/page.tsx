"use client";
// App.tsx (or any parent)


import { sampleBars, samplePie, sampleTimeSeries } from "@/appData";
import ReusableChart from "@/UI/components/Charts";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Custom tooltip (dark themed)
const MyTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl bg-gray-900/90 p-3 text-xs text-white shadow-xl">
            <div className="mb-1 font-medium opacity-80">{label}</div>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
                    <span className="opacity-90">{p.name ?? p.dataKey}</span>
                    <span className="ml-auto font-semibold">{p.value}</span>

                </div>
            ))}
        </div>
    );
};

// Chip-style legend
const MyLegend = ({ payload }: any) => {
    if (!payload?.length) return null;
    return (
        <div className="flex flex-wrap gap-3 text-xs">
            {payload.map((entry: any) => (
                <div key={entry.value} className="flex items-center gap-1 rounded-full border px-2 py-1">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: entry.color }} />
                    <span className="text-gray-700">{entry.value}</span>
                
                </div>
            ))}
        </div>
    );
};



export const apiData= [
    {
        "sales": 258366.5,
        "purchases": 126650.0,
        "expenses": 188.32,
        "period": "June 2025"
    },
    {
        "sales": 2000000.0,
        "purchases": 8000.0,
        "expenses": 10.0,
        "period": "July 2025"
    },
    {
        "sales": 51972.0,
        "purchases": 10500.0,
        "expenses": 0.0,
        "period": "August 2025"
    },
    {
        "sales": 263000.0,
        "purchases": 1000.0,
        "expenses": 0.0,
        "period": "September 2025"
    },
    {
        "sales": 264000.0,
        "purchases": 1500.0,
        "expenses": 0.0,
        "period": "October 2025"
    },
    {
        "sales": 0.0,
        "purchases": 0.0,
        "expenses": 0.0,
        "period": "November 2025"
    }
]


const data = apiData?.map((item: { period: string, sales: number, purchases: number, expenses: number }) => (
        { month: item?.period, sales: item?.sales, purchases: item?.purchases, expenses: item?.expenses }))
     0

export default function App() {
    return (
        <div className="p-6 space-y-8">
            <div className="h-[320px]"> 
                 <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 0, left: 0, bottom: 40 }}
                >
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    padding={{ right: 10, left: 0 }}
                    tickMargin={40}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    orientation="left"
                  />

                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={false}
                    content={({ payload, label }) => {
                      if (!payload || payload.length === 0) return null;

                      const item = payload[0]?.payload;

                      return (
                        <div className="p-3 rounded-md bg-white shadow-md text-sm text-gray-800 min-w-[160px]">
                          <div className="font-semibold text-dark mb-2">{label}</div>

                          {payload.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 mb-1 last:mb-0"
                            >
                              <span className="capitalize" style={{ color: entry?.color }}>
                                {entry?.name}:
                              </span>
                              <span className="font-medium" style={{ color: entry?.color }}>
                               {entry?.value }
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />


                  {/* <Tooltip
                    formatter={(value: any) => formatCurrency(value, 'en-US', 'USD')}
                  /> */}

                  <Line
                    dataKey="purchases"
                    yAxisId="left"
                    stroke="#52C41A"
                  />

                  <Line
                    dataKey="sales"
                    yAxisId="right"
                    stroke="#EB2F96"
                  />

                  <Line
                    dataKey="expenses"
                    yAxisId="right"
                    stroke="red"
                  />

                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Multi-line example */}
             
            {/* <ReusableChart
                type="multi-line"
                data={data}
                xKey="month"
                series={[
                    { key: "sales", name: "Sales", color: "red" },
                    { key: "purchases", name: "Purchases", color: "green" },
                     { key: "expenses", name: "Expenses", color: "blue" },
                ]}
                legend                        // enables positioning
                legendContent={MyLegend}      // custom renderer
                legendProps={{}}              // optional passthrough (e.g., wrapperStyle)
                tooltip                       // (defaults true; can omit)
                tooltipContent={MyTooltip}    // custom tooltip
                tooltipProps={{}}             // optional passthrough
                height={300}
            /> */}


            {/* <ReusableChart
        type="multi-line"
        data={sampleTimeSeries}
        xKey="month"
        series={[
          { key: "revenue", name: "Revenue", color: "#2563eb" },
          { key: "cost", name: "Cost", color: "#ef4444" },
        ]}
        legend
        tooltip
        height={300}
        className="rounded-2xl border p-4"
      /> */}

            {/* Stacked area example */}
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
                height={300}
                className="rounded-2xl border p-4"
            />

            {/* Bar example */}
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
                height={300}
                className="rounded-2xl border p-4"
            />

            {/* Pie & Donut */}
            <ReusableChart
                type="pie"
                data={samplePie}
                pie={{ nameKey: "category", valueKey: "value" }}
                legend
                tooltip
                height={280}
                className="rounded-2xl border p-4"
            />

            <ReusableChart
                type="donut"
                data={samplePie}
                pie={{ nameKey: "category", valueKey: "value", innerRadius: "60%" }}
                legend
                tooltip
                height={280}
                className="rounded-2xl border p-4"
            />
        </div>
    );
}
