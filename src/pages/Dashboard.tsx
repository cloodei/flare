import { Suspense, lazy } from "react"
import { Home, Settings } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/Header"
import AlertsPanel from "@/components/dashboard/alerts-panel"
import RoomMonitoringGrid from "@/components/dashboard/room-monitoring-grid"
import MonitoringView from "@/components/dashboard/monitoring-view"

const ModernDashboardGrid = lazy(() => import("@/components/dashboard/dashboard-grid"))

export default function Dashboard() {
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
            <RoomMonitoringGrid />

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
