import mqtt from "mqtt";
import { Suspense, lazy } from "react"
import { Home, Settings } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useControlsActions } from "@/stores/controls-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/Header"
import AlertsPanel from "@/components/dashboard/alerts-panel"
import MonitoringView from "@/components/dashboard/monitoring-view"
import RoomMonitoringGrid from "@/components/dashboard/room-monitoring-grid"

const ModernDashboardGrid = lazy(() => import("@/components/dashboard/dashboard-grid"))
const mqttClient = mqtt.connect(import.meta.env.VITE_MQTT_CLUSTER_WS!, {
  username: import.meta.env.VITE_MQTT_USERNAME,
  password: import.meta.env.VITE_MQTT_PASSWORD
})

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  // mqttClient.publish("client/led", "")
  // mqttClient.publish("client/relay", "")
})

mqttClient.on("error", (error) => {
  console.error("MQTT connection error:", error);
})

mqttClient.subscribe("pi/led")
mqttClient.subscribe("pi/relay")

export default function Dashboard() {
  const { setLED, setRelay } = useControlsActions();

  mqttClient.on("message", (topic, message) => {
    console.log("Received message:", topic, message.toString());
    switch (topic) {
      case "pi/led":
        const msg = message.toString().split("|");
        setLED(msg.map((item, id) => ({ id, state: item === "1" })));

        break;

      case "pi/relay":
        const relayMsg = message.toString().split("|");
        const relays = new Array(relayMsg.length);

        for (let i = 0; i < relayMsg.length; i++) {
          const [name, state] = relayMsg[i].split("-");
          relays[i] = { id: i, name, state: state === "1" };
        }

        setRelay(relays);
        break;

      default:
        console.log("Unknown topic:", topic);
        break;
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-8 relative">
        <Tabs defaultValue="monitoring" className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Smart Home Dashboard</h1>
              <p className="text-muted-foreground">Monitor and control your connected devices</p>
            </div>

            <TabsList className="max-sm:w-full">
              <TabsTrigger value="monitoring" className="cursor-pointer">
                <Home className="size-4 mr-2" />
                Monitoring
              </TabsTrigger>
              <TabsTrigger value="devices" className="cursor-pointer">
                <Settings className="size-4 mr-2" />
                Devices
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monitoring" className="space-y-8">
            <MonitoringView />
            <RoomMonitoringGrid /> {/* Changes monitoring chart for each room in <MonitoringView /> below */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MonitoringView />
              </div>
              <AlertsPanel />
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-8">
            <Suspense fallback={<DevicesSkeleton />}>
              <ModernDashboardGrid />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function DevicesSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-[200px]" />
    </div>
  );
}
