import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

interface Device {
  name: string;
  isOnline: boolean;
}

interface DeviceStatusCardProps {
  devices: Device[];
}

export default function DeviceStatusCard({ devices }: DeviceStatusCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Connected Devices</CardTitle>
        <CardDescription>Real-time status of all system components.</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {devices.map((device, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-card-foreground/80">{device.name}</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2.5 h-2.5 rounded-full transition-colors ${device.isOnline ? 'bg-green-500' : 'bg-destructive'}`}></div>
                <span className={`text-sm font-medium ${device.isOnline ? 'text-green-500' : 'text-destructive'}`}>
                  {device.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
