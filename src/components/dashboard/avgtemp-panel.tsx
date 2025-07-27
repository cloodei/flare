import { Thermometer, Droplets } from "lucide-react";
import { useAvg, useAvgTime } from "@/stores/avg-store";
import { Card } from "../ui/card";

export default function AvgTempPanel() {
  const avg = useAvg()
  const time = useAvgTime()
  const getTimeText = timeText();

  function timeText() {
    switch (time) {
      case "7d":
        return "7 ngày trước"
      case "30d":
        return "30 ngày trước"
      case "24h":
        return "24 giờ trước"
      default:
        return "Từ ngày " + time.from?.toLocaleDateString("vi-VN") + " đến ngày " + time.to?.toLocaleDateString("vi-VN")
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-chart-2 to-chart-1">
            <Thermometer className="size-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Nhiệt độ trung bình</h3>
            <p className="text-sm text-muted-foreground">{getTimeText}</p>
          </div>
        </div>

        <div className="text-4xl font-bold bg-gradient-to-br from-chart-2 to-chart-1 bg-clip-text text-transparent">
          {avg.temperature.toFixed(1)}°C
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-chart-3 to-chart-4">
            <Droplets className="size-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Độ ẩm trung bình</h3>
            <p className="text-sm text-muted-foreground">{getTimeText}</p>
          </div>
        </div>

        <div className="text-4xl font-bold bg-gradient-to-br from-chart-3 to-chart-4 bg-clip-text text-transparent">
          {avg.humidity.toFixed(1)}%
        </div>
      </Card>
    </div>
  )
}
