import { Loader2 } from "lucide-react";

export default function MonitoringSkeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          <Loader2 className="size-4 mr-1 animate-spin" />
          Loading data...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we load your data.
        </p>
      </div>
    </div>
  );
}
