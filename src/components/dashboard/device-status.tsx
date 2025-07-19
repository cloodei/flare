import { motion } from "motion/react"
import { Wifi, WifiOff, Activity } from "lucide-react"
import { Card } from "../ui/card"

interface Device {
  name: string
  isOnline: boolean
}

export default function DeviceStatus({ devices }: { devices: Device[] }) {
  const onlineCount = devices.filter((d) => d.isOnline).length

  return (
    <Card className="p-6 lg:col-span-2">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
          <Activity className="size-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Connected Devices</h3>
          <p className="text-sm text-muted-foreground">
            {onlineCount} of {devices.length} devices online
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {devices.map((device, index) => (
          <motion.div
            key={device.name}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-lg ${
                  device.isOnline ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                }`}
                animate={{
                  scale: device.isOnline ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: device.isOnline ? Number.POSITIVE_INFINITY : 0,
                  ease: "easeInOut",
                }}
              >
                {device.isOnline ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
              </motion.div>
              <div>
                <p className="font-medium text-foreground">
                  {device.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${device.isOnline ? "bg-green-500" : "bg-red-500"}`}
                animate={{
                  opacity: device.isOnline ? [0.5, 1, 0.5] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: device.isOnline ? Number.POSITIVE_INFINITY : 0,
                  ease: "easeInOut",
                }}
              />
              <span className={`text-sm font-medium ${device.isOnline ? "text-green-500" : "text-red-500"}`}>
                {device.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
