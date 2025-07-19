import { useState, useMemo } from "react"
import { motion } from "motion/react"
import { type DateRange } from "react-day-picker"
import { CalendarRange, Clock3, History, Thermometer, Droplets } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { DatePicker } from "../ui/date-picker"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { useRoomData, useRoom } from "@/stores/room-store"

const time = new Date()

export default function RoomMonitoringView() {
  const roomName = useRoom()
  const data = useRoomData()[roomName]
  const [activeFilters, setActiveFilters] = useState({
    dataType: "both",
    timeRange: "7d"
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

      switch (activeFilters.timeRange) {
        case "30d":
          fromDate.setDate(time.getDate() - 30)
          break;
        case "7d":
          fromDate.setDate(time.getDate() - 7)
          break;
        case "24h":
          fromDate.setHours(time.getHours() - 24)
          break;
      }
    }

    if (!fromDate || !toDate)
      return { chartData: [], timeFormat: "hour" }

    const endOfDayToDate = new Date(toDate)
    endOfDayToDate.setHours(23, 59, 59, 999)
    const filteredData = data.filter((d) => d.time >= fromDate! && d.time <= endOfDayToDate)

    const dayDifference = (endOfDayToDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)
    if (dayDifference < 3) {
      const n = filteredData.length
      const chartData = new Array<{ time: string; temperature: number; humidity: number }>(n)

      for (let i = 0; i < n; ++i) {
        const item = filteredData[i]
        chartData[i] = {
          time: item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          temperature: item.temperature,
          humidity: item.humidity
        }
      }

      return {
        chartData,
        timeFormat: "hour"
      }
    }

    const groupedByDay: { [key: string]: { temps: number[]; humids: number[]; count: number } } = {}, n = filteredData.length

    for (let i = 0; i < n; ++i) {
      const item = filteredData[i]

      const day = item.time.toISOString().split("T")[0]
      if (!groupedByDay[day])
        groupedByDay[day] = { temps: [], humids: [], count: 0 }
      
      groupedByDay[day].temps.push(item.temperature)
      groupedByDay[day].humids.push(item.humidity)
    }

    const dailyData = Object.entries(groupedByDay)
      .map(([day, { temps, humids }]) => ({
        time: new Date(day).toLocaleDateString([], { month: "short", day: "numeric" }),
        humidity: parseFloat(((humids.reduce((a, b) => a + b, 0) / humids.length) || 0).toFixed(1)),
        temperature: parseFloat(((temps.reduce((a, b) => a + b, 0) / temps.length) || 0).toFixed(1))
      }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

    return { chartData: dailyData, timeFormat: "day" }
  }, [activeFilters.timeRange, dateRange, data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-popover-foreground/80 mb-2">{label}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="text-sm font-semibold flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pld.color }} />
              <span style={{ color: pld.color }}>
                {pld.name}: {pld.value}
                {pld.name === "Temperature" ? "°C" : "%"}
              </span>
            </div>
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
              Nhiệt độ
            </TabsTrigger>
            <TabsTrigger value="humidity">
              <Droplets className="size-4 mr-1" />
              Độ ẩm
            </TabsTrigger>
            <TabsTrigger value="both">Cả hai</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          {[
            { key: "24h" as const, icon: Clock3, label: "24h" },
            { key: "7d" as const, icon: History, label: "7d" },
            { key: "30d" as const, icon: CalendarRange, label: "30d" },
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
              const from = value?.from, to = value?.to
              setActiveFilters((prev) => ({ ...prev, timeRange: "custom" }))
              setDateRange({ from, to })
            }}
          />
        </div>
      </div>

      {/* Chart */}
      <Card className="pt-2.5 pr-4 md:pt-3.5 md:pr-10">
        <h2 className="pl-4 text-2xl font-semibold capitalize">{roomName}</h2>

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
              tickFormatter={(value, index) => {
                if (timeFormat === "day")
                  return value
                
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
                name="Độ ẩm"
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
                name="Nhiệt độ"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}
