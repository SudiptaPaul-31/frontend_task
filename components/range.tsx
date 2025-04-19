"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import type { EVData } from "@/types/ev-data"

interface RangeDistributionProps {
  data: EVData[]
}

export function RangeDistribution({ data }: RangeDistributionProps) {
  const ranges = data.map((item) => Number.parseFloat(item["Electric Range"])).filter((range) => !isNaN(range))
  const rangeBuckets: Record<string, number> = {
    "0-50": 0,"51-100": 0,"101-150": 0,"151-200": 0,"201-250": 0,"251-300": 0,"301-350": 0,"351+": 0,}

  ranges.forEach((range) => {
    if (range <= 50) rangeBuckets["0-50"]++
    else if (range <= 100) rangeBuckets["51-100"]++
    else if (range <= 150) rangeBuckets["101-150"]++
    else if (range <= 200) rangeBuckets["151-200"]++
    else if (range <= 250) rangeBuckets["201-250"]++
    else if (range <= 300) rangeBuckets["251-300"]++
    else if (range <= 350) rangeBuckets["301-350"]++
    else rangeBuckets["351+"]++
  })
  const chartData = Object.entries(rangeBuckets).map(([range, count]) => ({
    range,
    count,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
        <XAxis dataKey="range" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-3 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Range (miles)</span>
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
        <Area
          type="monotone"
          dataKey="count"
          stroke="#8b5cf6"
          fillOpacity={1}
          fill="url(#colorCount)"
          animationDuration={1500}
          animationBegin={300}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
