'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Recommendation } from '@/lib/types';

interface ConsensusChartProps {
  data: Recommendation;
}

export const ConsensusChart = ({ data }: ConsensusChartProps) => {
  // Generate mock historical data for visualization
  const chartData = [
    { name: '7D Ago', price: data.current_price * 0.95 },
    { name: '5D Ago', price: data.current_price * 0.98 },
    { name: '3D Ago', price: data.current_price * 0.97 },
    { name: 'Current', price: data.current_price },
    { name: 'AI Consensus', price: data.target_price },
  ];

  return (
    <div className="w-full h-[200px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
          <XAxis 
            dataKey="name" 
            stroke="#666" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            hide 
            domain={['dataMin - 5', 'dataMax + 5']} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#3b82f6' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
