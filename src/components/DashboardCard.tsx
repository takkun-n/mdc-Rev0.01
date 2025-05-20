import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel, 
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 border-blue-200 text-blue-800',
    green: 'bg-green-100 border-green-200 text-green-800',
    red: 'bg-red-100 border-red-200 text-red-800',
    yellow: 'bg-yellow-100 border-yellow-200 text-yellow-800',
    purple: 'bg-purple-100 border-purple-200 text-purple-800',
  };

  const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  const trendColor = trend && trend > 0 
    ? 'text-green-600' 
    : trend && trend < 0 
      ? 'text-red-600' 
      : 'text-gray-600';

  const trendIcon = trend && trend > 0 
    ? '↑' 
    : trend && trend < 0 
      ? '↓' 
      : '→';

  return (
    <div className={`rounded-lg border p-4 shadow-sm ${selectedColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-md font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
          
          {trend !== undefined && (
            <div className={`flex items-center mt-1 text-sm ${trendColor}`}>
              <span>{trendIcon}</span>
              <span className="ml-1">{Math.abs(trend)}%</span>
              {trendLabel && <span className="ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className="p-2 rounded-full bg-white bg-opacity-50">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;