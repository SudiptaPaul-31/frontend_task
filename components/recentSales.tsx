import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { EVData } from "@/types/ev-data"

interface RecentSalesProps {
  data: EVData[]
}

export function RecentSales({ data }: RecentSalesProps) {
  const modelCounts = data.reduce((acc: Record<string, { count: number; make: string }>, item) => {
    const model = item["Model"]
    const make = item["Make"]
    if (model && make) {
      if (!acc[model]) {
        acc[model] = { count: 0, make }
      }
      acc[model].count += 1
    }
    return acc
  }, {})
  const topModels = Object.entries(modelCounts)
    .map(([model, { count, make }]) => ({ model, count, make }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  const getColorFromString = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = hash % 360
    return `hsl(${hue}, 70%, 60%)`
  }

  return (
    <div className="space-y-8">
      {topModels.map((item, index) => (
        <div
          key={item.model}
          className="flex items-center p-2 rounded-lg transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          style={{
            animationDelay: `${index * 150}ms`,
            animation: "fadeIn 0.5s ease-out forwards",
            opacity: 0,
          }}
        >
          <Avatar className="h-9 w-9 border-2" style={{ borderColor: getColorFromString(item.make) }}>
            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={item.make} />
            <AvatarFallback style={{ backgroundColor: getColorFromString(item.make), color: "white" }}>
              {item.make.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.model}</p>
            <p className="text-sm text-muted-foreground">{item.make}</p>
          </div>
          <div className="ml-auto font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {item.count.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
