import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ChartData {
  date: string;
  [key: string]: string | number;
}

interface ChartComponentProps {
  data: ChartData[];
  type?: 'line' | 'area' | 'bar';
  dataKey: string;
  xAxisDataKey?: string;
  yAxisLabel?: string;
  height?: number;
  color?: string;
  title: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  type = 'line',
  dataKey,
  xAxisDataKey = 'date',
  yAxisLabel,
  height = 300,
  color = '#3b82f6',
  title,
  valuePrefix = '',
  valueSuffix = ''
}) => {
  // 日付の書式化関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MM/dd', { locale: ja });
  };

  // データが空の場合
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <div className="flex justify-center items-center h-[300px] bg-gray-50 rounded-md">
          <p className="text-gray-400">データがありません</p>
        </div>
      </div>
    );
  }

  // ツールチップの書式を定義
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dateObj = new Date(label);
      const formattedDate = format(dateObj, 'yyyy年MM月dd日', { locale: ja });
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="text-gray-600 mb-1">{formattedDate}</p>
          <p className="font-medium">
            {valuePrefix}{payload[0].value.toFixed(2)}{valueSuffix}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {type === 'line' ? (
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={xAxisDataKey} 
              tickFormatter={formatDate} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={yAxisLabel ? { 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12 }
              } : undefined}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
          </LineChart>
        ) : type === 'area' ? (
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={xAxisDataKey} 
              tickFormatter={formatDate} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={yAxisLabel ? { 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12 }
              } : undefined}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fill={`${color}33`}
            />
          </AreaChart>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={xAxisDataKey} 
              tickFormatter={formatDate} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={yAxisLabel ? { 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12 }
              } : undefined}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey={dataKey} 
              fill={color} 
              barSize={20}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;