"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import type { EVData } from "@/types/ev-data"

interface YearlyTrendsProps {
  data: EVData[]
}

export function YearlyTrends({ data }: YearlyTrendsProps) {
  const yearCounts = data.reduce((acc: Record<string, number>, item) => {
    const year = item["Model Year"]
    if (year && !isNaN(Number(year))) {
      acc[year] = (acc[year] || 0) + 1
    }
    return acc
  }, {})
  const chartData = Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .filter((item) => item.year >= "2010") 
    .sort((a, b) => Number(a.year) - Number(b.year))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis dataKey="year" type="category" scale="band" width={50} tick={{ fontSize: 12 }} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-3 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Year</span>
                      <span className="font-bold text-muted-foreground">{label}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Count</span>
                      <span className="font-bold">{payload[0].value}</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Percentage</span>
                      <span className="ml-2 font-bold">
                        {((Number(payload[0].value) / data.length) * 100).toFixed(1)}%
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
          fill="url(#colorGradient)"
          radius={[0, 4, 4, 0]}
          animationDuration={1500}
          animationBegin={300}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
