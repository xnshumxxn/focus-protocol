"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function WeeklyChartClient({
  data,
}: {
  data: { day: string; minutes: number }[];
}) {
  const hasData = data.some((d) => d.minutes > 0);

  return (
    <div className="card">
      <h2>This Week</h2>

      {!hasData && (
        <p style={{ opacity: 0.6, marginBottom: 12 }}>
          No sessions logged this week yet.
        </p>
      )}

      <div style={{ width: "100%", height: 180 }}>
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
