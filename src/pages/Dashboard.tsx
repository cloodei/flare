import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ControlCard from "@/components/dashboard/ControlCard"
import DashboardGrid from "@/components/dashboard/DashboardGrid"
import DeviceStatusCard from "@/components/dashboard/DeviceStatusCard"
import MonitoringView from "@/components/dashboard/MonitoringView"

const mockDevices = [
  { name: "temp_humidity_sensor", isOnline: true },
  { name: "main_light_relay", isOnline: true },
  { name: "desk_fan_relay", isOnline: false },
  { name: "motion_sensor_living_room", isOnline: true },
]

export default function Dashboard() {
  return (
    <Tabs defaultValue="monitoring">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Giám sát hệ thống</h1>
          <p className="text-muted-foreground">
            Theo dõi và điều khiển hệ thống nhà thông minh của bạn
          </p>
        </div>
        <TabsList>
          <TabsTrigger value="monitoring">Giám sát</TabsTrigger>
          <TabsTrigger value="devices">Thiết bị</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="monitoring">
        <MonitoringView />
      </TabsContent>

      <TabsContent value="devices">
        <DashboardGrid>
          <ControlCard
            deviceName="Đèn chính"
            description="Kính phòng khách"
            initialState={true}
          />
          <ControlCard deviceName="Đèn bàn" description="Văn phòng" />
          <DeviceStatusCard devices={mockDevices} />
        </DashboardGrid>
      </TabsContent>
    </Tabs>
  )
}

