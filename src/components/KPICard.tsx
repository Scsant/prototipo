import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  status?: 'normal' | 'warning' | 'critical' | 'success';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function KPICard({ title, value, subtitle, icon, status = 'normal', trend, trendValue }: KPICardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-700/50 bg-green-900/30 backdrop-blur-sm';
      case 'warning':
        return 'border-amber-700/50 bg-amber-900/30 backdrop-blur-sm';
      case 'critical':
        return 'border-red-700/50 bg-red-900/30 backdrop-blur-sm';
      default:
        return 'border-gray-700/50 bg-gray-900/30 backdrop-blur-sm';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="size-4 text-green-400" />;
      case 'warning':
      case 'critical':
        return <AlertCircle className="size-4 text-amber-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className={getStatusColor()}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm text-gray-300">{title}</CardTitle>
          {icon || getStatusIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl text-white">{value}</span>
            {trend && trendValue && (
              <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                {trend === 'up' ? <TrendingUp className="size-3" /> : trend === 'down' ? <TrendingDown className="size-3" /> : null}
                {trendValue}
              </div>
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}