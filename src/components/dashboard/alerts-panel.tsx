import { motion } from "motion/react"
import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAlerts } from "@/stores/alerts-store"

// const alerts = [
//   {
//     id: 1,
//     type: "warning",
//     title: "High Humidity in Bedroom",
//     description: "Humidity level has exceeded 70% for the past 30 minutes",
//     time: "5 minutes ago",
//     room: "Bedroom",
//   },
//   {
//     id: 2,
//     type: "info",
//     title: "Temperature Sensor Calibrated",
//     description: "Living room temperature sensor has been successfully calibrated",
//     time: "1 hour ago",
//     room: "Living Room",
//   },
//   {
//     id: 3,
//     type: "error",
//     title: "Sensor Connection Lost",
//     description: "Kitchen humidity sensor is not responding",
//     time: "2 hours ago",
//     room: "Kitchen",
//   },
// ]

export default function AlertsPanel() {
  const alerts = useAlerts();

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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Thông báo</h3>
        <Badge className="bg-gray-700 text-gray-200">{alerts.length} active</Badge>
      </div>

      <div className="space-y-4">
        {alerts.length > 0 ? alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            className="flex items-start gap-3 py-3 px-4 rounded-lg bg-accent border border-card hover:bg-accent/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="mt-1">{getAlertIcon(alert.type)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-foreground text-sm">{alert.title}</h4>
                <Badge className={`text-xs ${getAlertBadgeColor(alert.type)}`}>{alert.room}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
              <p className="text-xs text-muted-foreground">{alert.time}</p>
            </div>

            <Button variant="ghost" size="sm" className="hover:bg-popover-foreground/50">
              <X className="size-4" />
            </Button>
          </motion.div>
        )) : (
          <p className="text-center text-sm text-muted-foreground">Chưa có thông báo</p>
        )}
      </div>

      {/* <Button variant="outline" className="w-full mt-4 bg-card border-card hover:bg-card/50">
        Xem tất cả thông báo
      </Button> */}
    </Card>
  )
}
