import { Lightbulb } from "lucide-react"
import { motion, type Variants } from "motion/react"
import { useControlsActions, useLED, useRelay, usePiOnline } from "@/stores/controls-store"
import ControlCard from "./control-card"
import DeviceStatus from "./device-status"
import { TypeWriter } from "../ui/typewriter"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
}

const mockDevices = [
  { name: "temp_humidity_sensor", isOnline: true, lastSeen: "2 min ago" },
  { name: "main_light_relay", isOnline: true, lastSeen: "1 min ago" },
  { name: "desk_fan_relay", isOnline: false, lastSeen: "1 hour ago" },
  { name: "motion_sensor_living_room", isOnline: true, lastSeen: "30 sec ago" },
]

interface DashboardGridProps {
  publish: (topic: string, message: string) => void;
}
export default function DashboardGrid({ publish: pub }: DashboardGridProps) {
  let reds = 0, greens = 0, yellows = 0, rgbs = 0;
  const leds = useLED();
  const on = usePiOnline();
  // const relays = useRelay();
  const { setLED } = useControlsActions();

  const getLEDColor = (color: "Red" | "Green" | "Yellow" | "RGB") => {
    switch (color) {
      case "Red":
        return "LED Đỏ " + ++reds;
      case "Green":
        return "LED Xanh " + ++greens;
      case "Yellow":
        return "LED Vàng " + ++yellows;
      case "RGB":
        return "LED RGB " + ++rgbs;
    }
  }

  const publish = (topic: string, message: string, id: number) => {
    pub(topic, message);

    setLED(leds.map((led) => {
      if (led.id === id)
        return { ...led, state: !led.state };

      return led;
    }));
  }

  return (
    <motion.div
      className="flex justify-between gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {on ? (
        <>
          <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leds.map((led) => {
              const deviceName = getLEDColor(led.color);

              return (
                <motion.div variants={itemVariants} key={led.id}>
                  <ControlCard
                    id={led.id}
                    color={led.color}
                    deviceName={deviceName}
                    description={`Nhấn để ${led.state ? "tắt" : "bật"} ${deviceName}`}
                    initialState={led.state}
                    icon={<Lightbulb className="size-5" />}
                    publish={publish}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={itemVariants}>
            <DeviceStatus devices={mockDevices} />
          </motion.div>
        </>
      ) : (
        <div className="mt-3 mx-auto flex justify-center items-center">
          <TypeWriter
            words="Pi đang offline"
            className="bg-gradient-to-r pb-3 from-sky-400 to-rose-400 bg-clip-text text-5xl font-bold text-transparent"
          />
        </div>
      )}
    </motion.div>
  )
}
