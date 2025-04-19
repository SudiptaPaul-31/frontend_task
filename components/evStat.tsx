import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, Car, Gauge, MapPin } from "lucide-react"
import type { EVData } from "@/types/ev-data"

interface EVStatsProps {
  data: EVData[]
}

export function EVStats({ data }: EVStatsProps) {
  const totalEVs = data.length

  const totalRange = data.reduce((sum, item) => {
    const range = Number.parseFloat(item["Electric Range"])
    return !isNaN(range) ? sum + range : sum
  }, 0)
  const avgRange = Math.round(
    totalRange / data.filter((item) => !isNaN(Number.parseFloat(item["Electric Range"]))).length,
  )
  const uniqueManufacturers = new Set(data.map((item) => item["Make"])).size

  const uniqueCounties = new Set(data.map((item) => item["County"])).size

  return (
    <>
      <Card className="card-hover-effect bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total EVs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEVs.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Registered electric vehicles</p>
        </CardContent>
      </Card>
      <Card className="card-hover-effect bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Electric Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgRange} mi</div>
          <p className="text-xs text-muted-foreground">Average range per charge</p>
        </CardContent>
      </Card>
      <Card className="card-hover-effect bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Manufacturers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueManufacturers}</div>
          <p className="text-xs text-muted-foreground">Unique EV manufacturers</p>
        </CardContent>
      </Card>
      <Card className="card-hover-effect bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Counties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueCounties}</div>
          <p className="text-xs text-muted-foreground">Counties with EVs</p>
        </CardContent>
      </Card>
    </>
  )
}
