import { Lightbulb, Fan } from "lucide-react"
import { motion, type Variants } from "motion/react"
import ControlCard from "./control-card"
import DeviceStatus from "./device-status"

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

export default function DashboardGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <ControlCard
          deviceName="Main Light"
          description="Living room ceiling"
          initialState={true}
          gradient="orange"
          icon={<Lightbulb className="size-5" />}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ControlCard
          deviceName="Desk Fan"
          description="Office workspace"
          gradient="green"
          icon={<Fan className="size-5" />}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DeviceStatus devices={mockDevices} />
      </motion.div>
    </motion.div>
  )
}
