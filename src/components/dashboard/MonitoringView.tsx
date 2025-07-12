import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion } from "framer-motion";
import { CalendarRange, Clock3, History } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const mockData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  temperature: parseFloat((22 + Math.sin(i / 4) * 3 + Math.random() * 2).toFixed(1)),
  humidity: parseFloat((45 + Math.cos(i / 3) * 5 + Math.random() * 5).toFixed(1)),
}));

const todayStats = {
  avgTemp: (mockData.reduce((sum, item) => sum + item.temperature, 0) / mockData.length).toFixed(1),
  avgHumidity: (mockData.reduce((sum, item) => sum + item.humidity, 0) / mockData.length).toFixed(1),
};

export default function MonitoringView() {
  const [activeFilters, setActiveFilters] = useState({
    dataType: "both",
    timeRange: "24h",
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/60 backdrop-blur-lg border border-border/20 rounded-lg p-3 shadow-lg">
          <p className="label text-sm text-muted-foreground">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="text-sm font-semibold">
              {`${pld.name}: ${pld.value}${pld.name === 'Temperature' ? '°C' : '%'}`}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs defaultValue="both" onValueChange={(value) => setActiveFilters(prev => ({...prev, dataType: value}))}>
          <TabsList>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
            <TabsTrigger value="both">Both</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button size="sm" variant={activeFilters.timeRange === '24h' ? "secondary" : "outline"} onClick={() => setActiveFilters(prev => ({...prev, timeRange: '24h'}))}>
            <Clock3 className="size-4" />24h
          </Button>

          <Button size="sm" variant={activeFilters.timeRange === '7d' ? "secondary" : "outline"} onClick={() => setActiveFilters(prev => ({...prev, timeRange: '7d'}))}>
            <History className="size-4" />7d
          </Button>

          <Button size="sm" variant={activeFilters.timeRange === '30d' ? "secondary" : "outline"} onClick={() => setActiveFilters(prev => ({...prev, timeRange: '30d'}))}>
            <CalendarRange className="size-4" />30d
          </Button>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border border-border/20 shadow-md shadow-black/5">
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.2)" />
              <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              {['both', 'humidity'].includes(activeFilters.dataType) && <Line type="monotone" dataKey="humidity" stroke="#facc15" strokeWidth={2} dot={false} name="Humidity" />}
              {['both', 'temperature'].includes(activeFilters.dataType) && <Line type="monotone" dataKey="temperature" stroke="#38bdf8" strokeWidth={2} dot={false} name="Temperature" />}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-xl border border-border/20 shadow-md shadow-black/5">
          <CardHeader>
            <CardTitle>Avg. Temperature (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todayStats.avgTemp}°C</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border border-border/20 shadow-md shadow-black/5">
          <CardHeader>
            <CardTitle>Avg. Humidity (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todayStats.avgHumidity}%</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
