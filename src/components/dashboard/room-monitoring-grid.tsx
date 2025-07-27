import { motion } from "motion/react"
import { Thermometer, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRoom, useRoomActions, useRoomData } from "@/stores/room-store"

export default function RoomMonitoringGrid() {
  const currentRoom = useRoom();
  const { setRoom } = useRoomActions();
  const rooms = Object.entries(useRoomData()).map(([name, data]) => ({
    name,
    humidity: data.reduce((acc, item) => acc + item.humidity, 0) / data.length,
    temperature: data.reduce((acc, item) => acc + item.temperature, 0) / data.length
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {rooms.map((room, index) => (
        <motion.div
          key={room.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div
            className={cn(
              "p-4 relative backdrop-blur-xl border rounded-md shadow-md cursor-pointer transition-all duration-300 ease-in-out",
              room.name === currentRoom
                ? "bg-gradient-to-br from-sky-50 to-violet-200/80 dark:from-sky-900/70 dark:to-emerald-950/30"
                : "bg-card"
            )}
            onClick={() => setRoom(room.name)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{room.name}</h3>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="size-4 text-blue-400" />
                  <p className="text-sm text-accent-foreground">Nhiệt độ</p>
                </div>

                <p className="text-lg font-semibold">{room.temperature.toFixed(1)}°C</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="size-4 text-purple-400" />
                  <p className="text-sm text-accent-foreground">Độ ẩm</p>
                </div>

                <p className="text-lg font-semibold">{room.humidity.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
