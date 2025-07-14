import { useState, useMemo } from "react"
import { motion } from "motion/react"
import { type DateRange } from "react-day-picker"
import { CalendarRange, Clock3, History, Thermometer, Droplets } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { DatePicker } from "../ui/date-picker"
import { AnimatedNumber } from "../ui/animated-number"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

const time = new Date()
/**
 * MOCK DATA GENERATION
 * Generates realistic-looking hourly temperature and humidity data for the last 30 days (720 hours).
 */
const mockData = Array.from({ length: 720 }, (_, i) => {
  const newTime = new Date(time)
  newTime.setHours(time.getHours() - i)

  return {
    time: newTime,
    temperature: Number.parseFloat((22 + Math.sin(i / 12) * 4 + Math.random() * 2).toFixed(1)),
    humidity: Number.parseFloat((45 + Math.cos(i / 10) * 6 + Math.random() * 5).toFixed(1)),
  }
})

const todayStats = {
  avgTemp: mockData.slice(0, 24).reduce((sum, item) => sum + item.temperature, 0) / 24,
  avgHumidity: mockData.slice(0, 24).reduce((sum, item) => sum + item.humidity, 0) / 24,
}

export default function MonitoringView() {
  const [activeFilters, setActiveFilters] = useState({
    dataType: "both",
    timeRange: "24h",
  })

  const [dateRange, setDateRange] = useState<DateRange>()

  const { chartData, timeFormat } = useMemo(() => {
    let fromDate: Date | undefined, toDate: Date | undefined
    
    if (activeFilters.timeRange === "custom") {
      fromDate = dateRange?.from
      toDate = dateRange?.to
    }
    else {
      toDate = new Date(time)
      fromDate = new Date(time)

      if (activeFilters.timeRange === "7d")
        fromDate.setDate(time.getDate() - 7)
      if (activeFilters.timeRange === "30d")
        fromDate.setDate(time.getDate() - 30)
      if (activeFilters.timeRange === "24h")
        fromDate.setHours(time.getHours() - 24)
    }

    if (!fromDate || !toDate) return { chartData: [], timeFormat: "hour" }

    const endOfDayToDate = new Date(toDate)
    endOfDayToDate.setHours(23, 59, 59, 999)

    const filteredData = mockData.filter((d) => d.time >= fromDate! && d.time <= endOfDayToDate)

    const dayDifference = (endOfDayToDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)
    if (dayDifference < 3) {
      return {
        chartData: filteredData
          .map((item) => ({
            ...item,
            time: item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            temperature: item.temperature,
            humidity: item.humidity,
          }))
          .reverse(),
        timeFormat: "hour",
      }
    }
    else {
      const groupedByDay: { [key: string]: { temps: number[]; humids: number[]; count: number } } = {}

      filteredData.forEach((item) => {
        const day = item.time.toISOString().split("T")[0]
        if (!groupedByDay[day]) {
          groupedByDay[day] = { temps: [], humids: [], count: 0 }
        }
        groupedByDay[day].temps.push(item.temperature)
        groupedByDay[day].humids.push(item.humidity)
      })

      const dailyData = Object.entries(groupedByDay)
        .map(([day, { temps, humids }]) => ({
          time: new Date(day).toLocaleDateString([], { month: "short", day: "numeric" }),
          temperature: parseFloat((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)),
          humidity: parseFloat((humids.reduce((a, b) => a + b, 0) / humids.length).toFixed(1)),
        }))
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

      return { chartData: dailyData, timeFormat: "day" }
    }
  }, [activeFilters.timeRange, dateRange])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-popover-foreground/80 mb-2">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} className="text-sm font-semibold flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pld.color }} />
              <span style={{ color: pld.color }}>
                {pld.name}: {pld.value}
                {pld.name === "Temperature" ? "°C" : "%"}
              </span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <Tabs defaultValue="both" onValueChange={(value) => setActiveFilters((prev) => ({ ...prev, dataType: value }))}>
          <TabsList className="px-1.5 border dark:border-gray-800 border-gray-400/50">
            <TabsTrigger value="temperature">
              <Thermometer className="size-4 mr-1" />
              Temperature
            </TabsTrigger>
            <TabsTrigger value="humidity">
              <Droplets className="size-4 mr-1" />
              Humidity
            </TabsTrigger>
            <TabsTrigger value="both">Both</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          {[
            { key: "24h", icon: Clock3, label: "24h" },
            { key: "7d", icon: History, label: "7d" },
            { key: "30d", icon: CalendarRange, label: "30d" },
          ].map(({ key, icon: Icon, label }) => (
            <Button
              key={key}
              size="sm"
              variant={activeFilters.timeRange === key ? "default" : "secondary"}
              onClick={() => {
                setActiveFilters((prev) => ({ ...prev, timeRange: key }))
                setDateRange({ from: undefined, to: undefined })
              }}
            >
              <Icon className="size-4 mr-1" />
              {label}
            </Button>
          ))}
          <DatePicker
            value={dateRange}
            onChange={(value) => {
              setDateRange({ from: value?.from, to: value?.to })
              setActiveFilters((prev) => ({ ...prev, timeRange: "custom" }))
            }}
          />
        </div>
      </div>

      {/* Chart */}
      <Card className="p-4 pl-0 md:p-8 md:pl-0 md:pr-10">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(from var(--chart-2) l c h)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(from var(--chart-2) l c h)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(from var(--chart-3) l c h)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(from var(--chart-3) l c h)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(from var(--border) l c h / 50%)" />
            <XAxis
              dataKey="time"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "oklch(from var(--muted-foreground) l c h)" }}
              tickFormatter={(value) => {
                if (timeFormat === "day")
                  return value
                
                const index = chartData.findIndex((d) => d.time === value)
                return index % 3 === 0 ? value : ""
              }}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "oklch(from var(--muted-foreground) l c h)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "14px", color: "oklch(from var(--foreground) l c h)" }} />

            {["both", "humidity"].includes(activeFilters.dataType) && (
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="oklch(from var(--chart-3) l c h)"
                strokeWidth={3}
                fill="url(#humidityGradient)"
                name="Humidity"
                dot={false}
              />
            )}
            {["both", "temperature"].includes(activeFilters.dataType) && (
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="oklch(from var(--chart-2) l c h)"
                strokeWidth={3}
                fill="url(#temperatureGradient)"
                name="Temperature"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-chart-2 to-chart-1">
              <Thermometer className="size-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Average Temperature</h3>
              <p className="text-sm text-muted-foreground">Last 24 hours</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <AnimatedNumber
              value={todayStats.avgTemp}
              className="text-4xl font-bold bg-gradient-to-br from-chart-2 to-chart-1 bg-clip-text text-transparent"
              suffix="°C"
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-chart-3 to-chart-4">
              <Droplets className="size-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Average Humidity</h3>
              <p className="text-sm text-muted-foreground">Last 24 hours</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <AnimatedNumber
              value={todayStats.avgHumidity}
              className="text-4xl font-bold bg-gradient-to-br from-chart-3 to-chart-4 bg-clip-text text-transparent"
              suffix="%"
            />
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
