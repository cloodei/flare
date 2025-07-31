import type { DateRange } from "react-day-picker";
import { create } from "zustand";

type TimeRange = DateRange | "7d" | "30d" | "24h";

interface Avg {
  temperature: number;
  humidity: number;
}
interface AvgStore {
  avg: Avg;
  time: TimeRange;

  actions: {
    setAvg: (avg: {
      temperature: number;
      humidity: number
    }) => void;
    setTime: (time: TimeRange) => void;
  }
}

const useAvgStore = create<AvgStore>()((set) => ({
  avg: {
    temperature: 0,
    humidity: 0
  },
  time: "30d",

  actions: {
    setAvg: (avg: {
      temperature: number;
      humidity: number
    }) => set({ avg: { temperature: avg.temperature, humidity: avg.humidity } }),
    setTime: (time: TimeRange) => set({ time })
  }
}))

const useAvg = () => useAvgStore((state) => state.avg)
const useAvgTime = () => useAvgStore((state) => state.time)
const useAvgActions = () => useAvgStore((state) => state.actions)

export { useAvg, useAvgTime, useAvgActions }
