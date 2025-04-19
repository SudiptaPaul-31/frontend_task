"use client"

import { useEffect, useState } from "react"
import Papa from "papaparse"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recentSales"
import { EVStats } from "@/components/evStat"
import { ManufacturerDistribution } from "@/components/manufacturDistribution"
import { YearlyTrends } from "@/components/yearTrends"
import { RangeDistribution } from "@/components/range"
import { Skeleton } from "@/components/ui/skeleton"
import { ModeToggle } from "@/components/mode"
import { Input } from "@/components/ui/input"
import type { EVData } from "@/types/ev-data"

export default function Dashboard() {
  const [data, setData] = useState<EVData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/SudiptaPaul-31/analytics-dashboard-assessment/refs/heads/main/data-to-visualize/Electric_Vehicle_Population_Data.csv",
        )
        const csvText = await response.text()

        const result = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transform: (value) => (value === "" ? null : value),
        })

        if (result.data && Array.isArray(result.data)) {
          setData(result.data as EVData[])
        }
      } catch (error) {
        console.error("Error fetching or parsing data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="dashboard-bg min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              EV Analytics
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 animate-fade-in">
        <div className="flex items-center justify-center ">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            EV Population Dashboard
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-background/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 animate-slide-up">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="animate-pulse-slow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-[100px]" />
                        <Skeleton className="h-4 w-[200px] mt-4" />
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <EVStats data={data} />
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 card-hover-effect bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    EV Registrations Overview
                  </CardTitle>
                  <CardDescription>Monthly registration trends of electric vehicles</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {loading ? <Skeleton className="h-[300px] w-full animate-pulse-slow" /> : <Overview data={data} />}
                </CardContent>
              </Card>
              <Card className="col-span-3 card-hover-effect bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Top EV Models
                  </CardTitle>
                  <CardDescription>Most popular electric vehicle models</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="flex items-center animate-pulse-slow">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="ml-4 space-y-1">
                              <Skeleton className="h-4 w-[200px]" />
                              <Skeleton className="h-4 w-[150px]" />
                            </div>
                            <Skeleton className="ml-auto h-4 w-[50px]" />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <RecentSales data={data} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4 animate-slide-up">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card className="col-span-1 card-hover-effect bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Manufacturer Distribution
                  </CardTitle>
                  <CardDescription>Distribution of EVs by manufacturer</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {loading ? (
                    <Skeleton className="h-[300px] w-full animate-pulse-slow" />
                  ) : (
                    <ManufacturerDistribution data={data} />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-1 card-hover-effect bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Model Year Distribution
                  </CardTitle>
                  <CardDescription>Distribution of EVs by model year</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {loading ? (
                    <Skeleton className="h-[300px] w-full animate-pulse-slow" />
                  ) : (
                    <YearlyTrends data={data} />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-2 card-hover-effect bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Electric Range Distribution
                  </CardTitle>
                  <CardDescription>Distribution of EVs by electric range (miles)</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {loading ? (
                    <Skeleton className="h-[300px] w-full animate-pulse-slow" />
                  ) : (
                    <RangeDistribution data={data} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
