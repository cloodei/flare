import { motion } from "motion/react"
import { Thermometer, Droplets } from "lucide-react"
import { useRoom, useRoomActions, useRoomData } from "@/stores/room-store"

export default function RoomMonitoringGrid() {
  const currentRoom = useRoom();
  const rooms = Object.entries(useRoomData()).map(([name, data]) => ({
    name,
    humidity: data.reduce((acc, item) => acc + item.humidity, 0) / data.length,
    temperature: data.reduce((acc, item) => acc + item.temperature, 0) / data.length
  }))
  const { setRoom } = useRoomActions();

  return (
    <div className="mt-7 md:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {rooms.map((room, index) => (
        <motion.div
          key={room.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div
            className={`p-4 relative backdrop-blur-xl border rounded-md shadow-md cursor-pointer transition-all duration-300 ease-in-out ${room.name === currentRoom ? "bg-gradient-to-br from-sky-100/60 to-violet-200/65 dark:from-sky-900/40 dark:to-teal-950/50" : "bg-card"}`}
            onClick={() => setRoom(room.name)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{room.name}</h3>
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
                  <span className="text-lg font-semibold">{room.humidity.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
