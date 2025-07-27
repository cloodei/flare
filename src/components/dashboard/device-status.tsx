import { motion } from "motion/react"
import { Wifi, WifiOff, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "../ui/card"
import { useRelay } from "@/stores/controls-store"

export default function DeviceStatus() {
  const devices = useRelay()
  let onlineCount = 0

  for (let i = 0; i < devices.length; ++i)
    if (devices[i].state)
      ++onlineCount

  return (
    <Card className="p-6 lg:col-span-2">
      <div className="flex items-center gap-4 mb-6">
        <div
          className={cn(
            "p-3 rounded-xl bg-gradient-to-br",
            devices.length === onlineCount ? "from-green-500/60 to-emerald-600" : "from-red-500/60 to-red-600"
          )}
        >
          <Activity className="size-6 text-accent" />
        </div>

        <div>
          <h3 className="font-semibold text-foreground">Thiết bị</h3>
          <p className="text-sm text-muted-foreground">
            {onlineCount} / {devices.length} thiết bị đang bật
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {devices.map((device, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-between gap-4 p-4 rounded-xl shadow-md border border-gray-300/60 dark:bg-white/5 dark:border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-lg ${device.state ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                animate={{
                  scale: device.state ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: device.state ? Number.POSITIVE_INFINITY : 0,
                  ease: "easeInOut",
                }}
              >
                {device.state ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
              </motion.div>

              <p className="font-medium text-foreground capitalize">
                {device.name}
              </p>
            </div>

            <div className="flex items-center gap-2 ml-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${device.state ? "bg-green-500" : "bg-red-500"}`}
                animate={{
                  opacity: device.state ? [0.5, 1, 0.5] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: device.state ? Number.POSITIVE_INFINITY : 0,
                  ease: "easeInOut",
                }}
              />
              <span className={`text-sm font-medium ${device.state ? "text-green-500" : "text-red-500"}`}>
                {device.state ? "Bật" : "Tắt"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
