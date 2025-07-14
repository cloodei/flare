"use client"

import { motion } from "framer-motion"
import { GradientCard } from "@/components/ui/gradient-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "High Humidity in Bedroom",
    description: "Humidity level has exceeded 70% for the past 30 minutes",
    time: "5 minutes ago",
    room: "Bedroom",
  },
  {
    id: 2,
    type: "info",
    title: "Temperature Sensor Calibrated",
    description: "Living room temperature sensor has been successfully calibrated",
    time: "1 hour ago",
    room: "Living Room",
  },
  {
    id: 3,
    type: "error",
    title: "Sensor Connection Lost",
    description: "Kitchen humidity sensor is not responding",
    time: "2 hours ago",
    room: "Kitchen",
  },
]

export default function AlertsPanel() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="size-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="size-4 text-yellow-400" />
      case "info":
        return <CheckCircle className="size-4 text-blue-400" />
      default:
        return <Clock className="size-4 text-gray-400" />
    }
  }

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-600 hover:bg-red-600"
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-600"
      case "info":
        return "bg-blue-600 hover:bg-blue-600"
      default:
        return "bg-gray-600 hover:bg-gray-600"
    }
  }

  return (
    <GradientCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
        <Badge className="bg-gray-700 text-gray-200">{alerts.length} active</Badge>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="mt-0.5">{getAlertIcon(alert.type)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-white text-sm">{alert.title}</h4>
                <Badge className={`text-xs ${getAlertBadgeColor(alert.type)}`}>{alert.room}</Badge>
              </div>
              <p className="text-sm text-gray-400 mb-2">{alert.description}</p>
              <p className="text-xs text-gray-500">{alert.time}</p>
            </div>

            <Button variant="ghost" size="sm" className="hover:bg-gray-700">
              <X className="size-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4 bg-gray-800 border-gray-700 hover:bg-gray-700">
        View All Alerts
      </Button>
    </GradientCard>
  )
}
