import { motion } from "motion/react"
import { type DateRange } from "react-day-picker"
import { useState, useMemo } from "react"
import { CalendarRange, Clock3, History, Thermometer, Droplets } from "lucide-react"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, type TooltipProps } from "recharts"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { DatePicker } from "../ui/date-picker"
import { useAvgActions } from "@/stores/avg-store"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

interface MonitoringViewProps {
  data: {
    time: Date;
    temperature: number;
    humidity: number;
  }[];
}
export default function MonitoringView({ data }: MonitoringViewProps) {
  const [activeFilters, setActiveFilters] = useState({
    dataType: "both",
    timeRange: "7d"
  })
  const [dateRange, setDateRange] = useState<DateRange>()
  const { setAvg, setTime } = useAvgActions()

  const { chartData, timeFormat } = useMemo(() => {
    let fromDate: Date | undefined, toDate: Date | undefined
    
    if (activeFilters.timeRange === "custom") {
      fromDate = dateRange?.from
      toDate = dateRange?.to
    }
    else {
      toDate = new Date()
      fromDate = new Date()

      switch (activeFilters.timeRange) {
        case "30d":
          fromDate.setDate(toDate.getDate() - 30)
          break;
        case "7d":
          fromDate.setDate(toDate.getDate() - 7)
          break;
        case "24h":
          fromDate.setHours(toDate.getHours() - 24)
          break;
      }
    }

    if (!fromDate || !toDate)
      return { chartData: [], timeFormat: "hour" }

    const endOfDayToDate = new Date(toDate)
    endOfDayToDate.setHours(23, 59, 59, 999)
    const filteredData = data.filter(d => ((d.time >= fromDate) && (d.time <= endOfDayToDate)))

    const dayDifference = (endOfDayToDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)
    if (dayDifference < 3) {
      const groupedByHour: { [key: string]: { temps: number[]; humids: number[] } } = {}
      let avgTemp = 0, avgHumidity = 0
      const n = filteredData.length

      for (let i = 0; i < n; ++i) {
        const item = filteredData[i]
        const hourKey = new Date(item.time)
        hourKey.setMinutes(0, 0, 0)
        const keyString = hourKey.toISOString()

        if (!groupedByHour[keyString])
          groupedByHour[keyString] = { temps: [], humids: [] }
        
        groupedByHour[keyString].temps.push(item.temperature)
        groupedByHour[keyString].humids.push(item.humidity)
        
        avgTemp += item.temperature
        avgHumidity += item.humidity
      }

      setAvg({
        temperature: avgTemp / n || 0,
        humidity: avgHumidity / n || 0
      })

      const hourlyData = Object.entries(groupedByHour)
        .map(([hourKey, { temps, humids }]) => ({
          time: new Date(hourKey),
          temperature: parseFloat((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)),
          humidity: parseFloat((humids.reduce((a, b) => a + b, 0) / humids.length).toFixed(1)),
        }))

      return {
        chartData: hourlyData,
        timeFormat: "hour"
      }
    }

    const groupedByDay: { [key: string]: { temps: number[]; humids: number[] } } = {}
    const n = filteredData.length
    let avgTemp = 0, avgHumidity = 0

    for (let i = 0; i < n; ++i) {
      const item = filteredData[i]
      avgTemp += item.temperature
      avgHumidity += item.humidity

      const day = item.time.toISOString().split("T")[0]
      if (!groupedByDay[day])
        groupedByDay[day] = { temps: [], humids: [] }
      
      groupedByDay[day].temps.push(item.temperature)
      groupedByDay[day].humids.push(item.humidity)
    }

    setAvg({
      temperature: avgTemp / n || 0,
      humidity: avgHumidity / n || 0
    })

    const dailyData = Object.entries(groupedByDay)
      .map(([day, { temps, humids }]) => ({
        time: new Date(day),
        temperature: parseFloat((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)),
        humidity: parseFloat((humids.reduce((a, b) => a + b, 0) / humids.length).toFixed(1)),
      }))

    return { chartData: dailyData, timeFormat: "day" }
  }, [activeFilters.timeRange, dateRange, data])

  const CustomTick = ({ x, y, payload, timeFormat }: any) => { // eslint-disable-line
    if (!payload || !payload.value)
      return null

    const date = new Date(payload.value)
    if (timeFormat === "day")
      return (
        <g transform={`translate(${x},${y - 4})`}>
          <text x={0} y={0} dy={16} textAnchor="middle" fill="oklch(from var(--muted-foreground) l c h)" fontSize={12}>
            {date.toLocaleDateString([], { month: "short", day: "numeric" })}
          </text>
        </g>
      )

    const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const dateString = date.toLocaleDateString([], { month: "short", day: "numeric" })

    return (
      <g transform={`translate(${x},${y + 12})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="oklch(from var(--muted-foreground) l c h)" fontSize={11}>
          <tspan x="0" dy="0em">{timeString}</tspan>
          <tspan x="0" dy="1.2em">{dateString}</tspan>
        </text>
      </g>
    )
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      label = (timeFormat === "day")
        ? label.toLocaleDateString([], { month: "short", day: "numeric" })
        : label.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        
      return (
        <div className="bg-popover border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-popover-foreground/80 mb-2">{label}</p>
          {payload.map((pld, index) => (
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
            { timeRange: "24h" as const, Icon: Clock3 },
            { timeRange: "7d" as const, Icon: History },
            { timeRange: "30d" as const, Icon: CalendarRange },
          ].map(({ timeRange, Icon }, i) => (
            <Button
              key={i}
              size="sm"
              variant={activeFilters.timeRange === timeRange ? "default" : "secondary"}
              onClick={() => {
                setActiveFilters((prev) => ({ ...prev, timeRange }))
                setDateRange({ from: undefined, to: undefined })
                setTime(timeRange)
              }}
            >
              <Icon className="size-4 mr-1" />
              {timeRange}
            </Button>
          ))}
          <DatePicker
            value={dateRange}
            onChange={(value) => {
              const from = value?.from, to = value?.to
              setActiveFilters((prev) => ({ ...prev, timeRange: "custom" }))
              setDateRange({ from, to })
              setTime({ from, to })
            }}
          />
        </div>
      </div>

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
              tick={<CustomTick timeFormat={timeFormat} />}
              tickFormatter={(value, index) => {
                if (timeFormat === "day")
                  return new Date(value).toLocaleDateString([], { month: "short", day: "numeric" })

                if (chartData.length > 12 && index % 3 !== 0)
                  return ""

                return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "oklch(from var(--muted-foreground) l c h)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "14px", color: "oklch(from var(--foreground) l c h)", bottom: 0 }} />

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
