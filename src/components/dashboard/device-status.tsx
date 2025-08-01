import { motion } from "motion/react"
import { Wifi, WifiOff, Activity, ThermometerSun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "../ui/card"
import { useDHT } from "@/stores/controls-store"
import { useRelay } from "@/stores/controls-store"
import { usePublish } from "@/stores/publish-store"
import { useControlsActions } from "@/stores/controls-store"

export default function DeviceStatus() {
  const pub = usePublish()
  const devices = useRelay()
  const dht = useDHT()
  const { setRelay, setDHT } = useControlsActions()
  let onlineCount = (!!dht && dht.online) ? 1 : 0

  for (let i = 0; i < devices.length; ++i)
    if (devices[i].state)
      ++onlineCount

  const publishRelay = (id: number) => {
    pub("client/relay", `${id}|${devices[id].state ? "0" : "1"}`);

    setRelay(devices.map(device => {
      if (device.id === id)
        return { ...device, state: !device.state };

      return device;
    }));
  }

  const publishDHT = () => {
    pub("client/dht", dht?.online ? "0" : "1");
    setDHT({ ...dht!, online: !dht?.online });
  }

  const total = devices.length + (dht ? 1 : 0)
  return (
    <Card className="p-4 lg:col-span-2">
      <div className="flex items-center gap-4 mb-6">
        <div
          className={cn(
            "p-3 rounded-xl bg-gradient-to-br",
            onlineCount > 0 ? "from-green-500/60 to-emerald-600" : "from-red-500/60 to-red-600"
          )}
        >
          <Activity className="size-6 text-accent" />
        </div>

        <div>
          <h3 className="font-semibold text-foreground">Thiết bị</h3>
          <p className="text-sm text-muted-foreground">
            {onlineCount} / {total} thiết bị đang bật
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {dht && (
          <motion.div
            className="flex items-center justify-between gap-1 p-4 rounded-xl shadow-md border border-gray-300/60 dark:bg-white/5 dark:border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="flex items-center pr-3 gap-3">
              <motion.div
                className={`p-2 rounded-lg ${dht.online ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <ThermometerSun className="size-4" />
              </motion.div>

              <p className="font-medium text-foreground">Cảm biến nhiệt độ - độ ẩm</p>
              <p className="text-[13px] text-muted-foreground">{dht.room}</p>
            </div>

            <div className="flex items-center gap-2 cursor-pointer" onClick={publishDHT}>
              <motion.div
                className={`w-2 h-2 rounded-full ${dht.online ? "bg-green-500" : "bg-red-500"}`}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <span className={`text-sm font-medium ${dht.online ? "text-green-500" : "text-red-500"}`}>
                {dht.online ? "Đang đo" : "Đang nghỉ"}
              </span>
            </div>
          </motion.div>
        )}

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

              <p className="font-medium text-foreground capitalize">{device.name}</p>
              <p className="text-[13px] text-muted-foreground">{device.room}</p>
            </div>

            <div className="flex items-center gap-2 ml-2 cursor-pointer" onClick={() => publishRelay(i)}>
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
