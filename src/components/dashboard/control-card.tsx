import { Power } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { GradientCard } from "@/components/ui/gradient-card"

interface ControlCardProps {
  deviceName: string
  description: string
  initialState?: boolean
  icon?: React.ReactNode
  gradient?: "blue" | "purple" | "green" | "orange" | "pink"
}

export default function ControlCard({
  deviceName,
  description,
  initialState = false,
  icon,
  gradient = "blue",
}: ControlCardProps) {
  const [isOn, setIsOn] = useState(initialState)

  const handleToggle = (checked: boolean) => {
    setIsOn(checked)
  }

  return (
    <GradientCard gradient={gradient} className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className={`p-3 rounded-xl transition-all duration-300 ${
              isOn ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25" : "bg-white/10"
            }`}
            animate={{
              scale: isOn ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {icon || <Power className={`size-5 ${isOn ? "text-white" : "text-muted-foreground"}`} />}
          </motion.div>
          <div>
            <h3 className="font-semibold text-foreground">{deviceName}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${isOn ? "bg-green-500" : "bg-gray-500"}`}
            animate={{
              scale: isOn ? [1, 1.2, 1] : 1,
              opacity: isOn ? [0.7, 1, 0.7] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isOn ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          />
          <span className={`font-semibold transition-colors ${isOn ? "text-green-500" : "text-muted-foreground"}`}>
            {isOn ? "Active" : "Inactive"}
          </span>
        </div>

        <Switch onCheckedChange={handleToggle} checked={isOn} />
      </div>
    </GradientCard>
  )
}
