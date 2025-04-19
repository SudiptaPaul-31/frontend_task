"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"
import type { EVData } from "@/types/ev-data"
import { useState } from "react"

interface ManufacturerDistributionProps {
  data: EVData[]
}

export function ManufacturerDistribution({ data }: ManufacturerDistributionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const manufacturerCounts = data.reduce((acc: Record<string, number>, item) => {
    const make = item["Make"]
    if (make) {
      acc[make] = (acc[make] || 0) + 1
    }
    return acc
  }, {})
  let chartData = Object.entries(manufacturerCounts)
    .map(([make, count]) => ({ make, count }))
    .sort((a, b) => b.count - a.count)

  if (chartData.length > 8) {
    const topManufacturers = chartData.slice(0, 7)
    const others = chartData.slice(7).reduce((sum, item) => sum + item.count, 0)
    chartData = [...topManufacturers, { make: "Others", count: others }]
  }

  const COLORS = [
    "#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#6366f1"]

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
          nameKey="make"
          label={({ make, percent }) => `${make} ${(percent * 100).toFixed(0)}%`}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          animationDuration={1000}
          animationBegin={0}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              opacity={activeIndex === index ? 1 : 0.8}
              stroke={activeIndex === index ? "#fff" : "none"}
              strokeWidth={activeIndex === index ? 2 : 0}
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-3 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Manufacturer</span>
                      <span className="font-bold text-muted-foreground">{payload[0].name}</span>
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
      </PieChart>
    </ResponsiveContainer>
  )
}
