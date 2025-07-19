import mqtt from "mqtt";
import { Home, Settings } from "lucide-react"
import { Suspense, lazy, useEffect } from "react"
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton"
import { useRoomActions } from "@/stores/room-store";
import { useControlsActions } from "@/stores/controls-store"
import { useAuthActions, useUser } from "@/stores/auth-store";
import { useAlerts, useAlertsActions } from "@/stores/alerts-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllReadings, MQTT_CLUSTER_WS, MQTT_PASSWORD, MQTT_USERNAME } from "@/lib/api"
import Header from "@/components/Header"
import AlertsPanel from "@/components/dashboard/alerts-panel"
import MonitoringView from "@/components/dashboard/monitoring-view"
import MonitoringError from "@/components/monitoring-error";
import RoomMonitoringGrid from "@/components/dashboard/room-monitoring-grid"
import MonitoringSkeleton from "@/components/monitoring-skeleton";
import AvgTempPanel from "@/components/dashboard/avgtemp-panel";
import RoomMonitoringView from "@/components/dashboard/room-monitoring-view";
const DashboardGrid = lazy(() => import("@/components/dashboard/dashboard-grid"))

export default function Dashboard() {
  const mqttClient = mqtt.connect(MQTT_CLUSTER_WS, {
    protocol: "wss",
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD
  })
  const { data, isPending, isError } = useQuery({
    queryKey: ["monitoring-data"],
    queryFn: getAllReadings,
    staleTime: 45 * 1000
  });
  const { setLED, setRelay, setPiOnline } = useControlsActions();
  const { setAuth } = useAuthActions();
  const { addAlert } = useAlertsActions();
  const { setRoomData, setRoom } = useRoomActions();
  const countAlerts = useAlerts().length;
  const user = useUser();

  function publish(topic: string, message: string) {
    mqttClient.publishAsync(topic, message);
  }

  useEffect(() => {
    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker")
      mqttClient.subscribe("pi/led")
      mqttClient.subscribe("pi/alert")
      mqttClient.subscribe("pi/relay")
      mqttClient.subscribe("pi/online")
      mqttClient.publishAsync("client/online", "1")
    })
    
    mqttClient.on("error", (error) => {
      console.error("MQTT connection error:", error)
    })
    
    mqttClient.on("message", (topic, message) => {
      switch (topic) {
        case "pi/online": {
          const online = message.toString() === "1";
          setPiOnline(online);
          break;
        }
        
        case "pi/led": {
          if (message.length === 0)
            break;
          
          const msg = message.toString().split("|");

          setLED(msg.map((item, id) => ({
            id,
            color: item.slice(0, item.length - 1) as "Red" | "Green" | "Yellow" | "RGB",
            state: item[item.length - 1] === "1"
          })));
          break;
        }
    
        case "pi/relay": {
          if (message.length === 0)
            break;
          
          const relayMsg = message.toString().split("|");
          const relays = new Array(relayMsg.length);
    
          for (let i = 0; i < relayMsg.length; ++i) {
            const relay = relayMsg[i];
            relays[i] = { id: i, name: relay.slice(0, relay.length - 1), state: relay[relay.length - 1] === "1" };
          }
    
          setRelay(relays);
          break;
        }

        case "pi/alert": {
          if (message.length === 0)
            break;
          
          const alertMsg = message.toString().split("|");
          
          addAlert({
            id: countAlerts + 1,
            type: alertMsg[0],
            title: alertMsg[1],
            description: alertMsg[2],
            time: new Date().toISOString(),
            room: alertMsg[3]
          });
          break;
        }
    
        default: {
          console.log("Unknown topic:", topic);
          break;
        }
      }
    })
  }, []);

  if (data?.refresh)
    setAuth(JSON.parse(localStorage.getItem("user")!), localStorage.getItem("access_token")!);

  if (data) {
    setRoomData(data.data.reduce((acc, item) => {
      const room = item.room;
      
      if (!acc[room])
        acc[room] = [];
      
      acc[room].push({
        temperature: item.temperature,
        humidity: item.humidity,
        time: item.time
      });
      
      return acc;
    }, {} as {
      [key: string]: {
        temperature: number;
        humidity: number;
        time: Date;
      }[]
    }))
    
    const roomName = data.data[0].room
    setRoom(roomName)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-8 relative">
        <Tabs defaultValue="monitoring" className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Xin chào, {user?.username}</h1>
              <p className="text-muted-foreground">Trang giám sát và điều khiển thiết bị</p>
            </div>

            <TabsList className="max-sm:w-full">
              <TabsTrigger value="monitoring" className="cursor-pointer">
                <Home className="size-4 mr-2" />
                Giám sát
              </TabsTrigger>
              <TabsTrigger value="devices" className="cursor-pointer">
                <Settings className="size-4 mr-2" />
                Thiết bị
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monitoring" className="space-y-8">
            {isPending ? (
              <MonitoringSkeleton />
            ) : isError ? (
              <MonitoringError />
            ) : (
              <>
                <MonitoringView data={data.data} />
                <AvgTempPanel />

                <RoomMonitoringGrid /> {/* Changes monitoring chart for each room in <MonitoringView /> below */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div className="md:col-span-2 lg:col-span-3">
                    <RoomMonitoringView />
                  </div>
                  <AlertsPanel />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="devices" className="space-y-8">
            <Suspense fallback={<DevicesSkeleton />}>
              <DashboardGrid publish={publish}/>
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
