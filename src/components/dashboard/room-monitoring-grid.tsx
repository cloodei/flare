import { motion } from "motion/react"
import { Thermometer, Droplets, Eye, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const roomData = [
  {
    name: "Living Room",
    temperature: 24.5,
    humidity: 62,
    occupancy: true,
    alerts: 0,
  },
  {
    name: "Bedroom",
    temperature: 22.1,
    humidity: 58,
    occupancy: false,
    alerts: 1,
  },
  {
    name: "Kitchen",
    temperature: 26.3,
    humidity: 45,
    occupancy: true,
    alerts: 0,
  },
  {
    name: "Office",
    temperature: 23.8,
    humidity: 55,
    occupancy: true,
    alerts: 0,
  },
]

export default function RoomMonitoringGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {roomData.map((room, index) => (
        <motion.div
          key={room.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="p-4 relative bg-card backdrop-blur-xl border rounded-md shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{room.name}</h3>
              <div className="flex items-center gap-2">
                {room.occupancy && (
                  <Badge className="bg-green-600 hover:bg-green-600">
                    <Eye className="size-3 mr-1" />
                    Occupied
                  </Badge>
                )}
                {room.alerts > 0 && (
                  <Badge className="bg-red-600 hover:bg-red-600">
                    <AlertTriangle className="size-3 mr-1" />
                    {room.alerts}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="size-4 text-blue-400" />
                  <span className="text-sm text-accent-foreground">Temperature</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold">{room.temperature.toFixed(1)}°C</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="size-4 text-purple-400" />
                  <span className="text-sm text-accent-foreground">Humidity</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold">{room.humidity}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
