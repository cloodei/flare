import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

interface SensorCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
}

export default function SensorCard({ title, value, unit, description }: SensorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="text-4xl font-bold text-primary">
          {value}<span className="text-2xl text-muted-foreground">{unit}</span>
        </div>
        {/* Placeholder for sparkline chart */}
        <div className="h-16 mt-4 bg-card-foreground/5 rounded-lg"></div>
      </CardContent>
    </Card>
  );
}
