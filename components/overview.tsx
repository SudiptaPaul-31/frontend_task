"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import type { EVData } from "@/types/ev-data"

interface OverviewProps {
  data: EVData[]
}

export function Overview({ data }: OverviewProps) {
  // Process data to get counts by model year
  const yearCounts = data.reduce((acc: Record<string, number>, item) => {
    const year = item["Model Year"]
    if (year && !isNaN(Number(year))) {
      acc[year] = (acc[year] || 0) + 1
    }
    return acc
  }, {})

  // Convert to array and sort by year
  const chartData = Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .filter((item) => item.year >= "2010") // Filter for recent years
    .sort((a, b) => Number(a.year) - Number(b.year))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-3 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Year</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.year}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Count</span>
                      <span className="font-bold">{payload[0].payload.count}</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Percentage</span>
                      <span className="ml-2 font-bold">
                        {((Number(payload[0].payload.count) / data.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="count"
          fill="url(#barGradient)"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
          animationBegin={0}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
