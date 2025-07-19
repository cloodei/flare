import { AlertCircle } from "lucide-react";

export default function MonitoringError() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          <AlertCircle className="size-4 mr-1 text-red-500" />
          Error fetching data
        </h2>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    </div>
  );
}
