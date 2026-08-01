"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type CategoryPoint = { name: string; value: number };

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function CategoryChart({ data, centerLabel = "Sales" }: { data: CategoryPoint[]; centerLabel?: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="relative h-[270px]">
      <div className="pointer-events-none absolute inset-x-0 top-[43%] z-10 -translate-y-1/2 text-center">
        <p className="text-xl font-bold tabular-nums">{total}%</p>
        <p className="text-[0.68rem] text-muted-foreground">{centerLabel}</p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="43%" innerRadius={58} outerRadius={84} paddingAngle={3} stroke="none">
            {data.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, "Share"]} contentStyle={{ borderRadius: 12, borderColor: "var(--border)", background: "var(--surface)", fontSize: 12 }} />
          <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "var(--muted)" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
