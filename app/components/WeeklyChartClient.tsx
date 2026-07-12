"use client";

import { useState, useTransition } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { getFocusChart, ChartPeriod } from "../actions/stats-actions";

const TABS: { id: ChartPeriod; label: string; title: string }[] = [
  { id: "week", label: "Week", title: "This Week" },
  { id: "month", label: "Month", title: "This Month" },
  { id: "year", label: "Year", title: "This Year" },
];

export default function WeeklyChartClient({
  initialData,
}: {
  initialData: { day: string; minutes: number }[];
}) {
  const [period, setPeriod] = useState<ChartPeriod>("week");
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const hasData = data.some((d) => d.minutes > 0);
  const activeTab = TABS.find((t) => t.id === period) ?? TABS[0];

  function handleTabClick(next: ChartPeriod) {
    if (next === period) return;

    setPeriod(next);

    startTransition(async () => {
      const fresh = await getFocusChart(next);
      setData(fresh);
    });
  }

  return (
    <div className="card">
      <div className="chartHeaderRow">
        <h2>{activeTab.title}</h2>

        <div className="tabRow">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tabButton ${
                period === tab.id ? "tabButtonActive" : ""
              }`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData && !isPending && (
        <p style={{ opacity: 0.6, marginBottom: 12 }}>
          No sessions logged for this period yet.
        </p>
      )}

      <div style={{ width: "100%", height: 180, opacity: isPending ? 0.5 : 1 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,.08)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="rgba(255,255,255,.5)"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              interval={period === "month" ? 2 : 0}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,.06)" }}
              contentStyle={{
                background: "#0d1420",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 12,
                color: "white",
              }}
              formatter={(value) => [`${value}m`, "Focus"]}
            />
            <Bar dataKey="minutes" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
