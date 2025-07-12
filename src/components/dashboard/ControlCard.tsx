import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface ControlCardProps {
  deviceName: string;
  description: string;
  initialState?: boolean;
}

export default function ControlCard({ deviceName, description, initialState = false }: ControlCardProps) {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = (checked: boolean) => {
    // In a real application, you would send a command to your backend here
    setIsOn(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{deviceName}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex justify-between items-center">
        <div className={`font-semibold transition-colors ${isOn ? 'text-primary' : 'text-muted-foreground'}`}>
          {isOn ? 'On' : 'Off'}
        </div>
        
        <Switch onCheckedChange={handleToggle} checked={isOn} />
      </CardContent>
    </Card>
  );
}
