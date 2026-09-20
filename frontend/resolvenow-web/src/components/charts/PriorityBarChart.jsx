import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const PriorityBarChart = ({ data = {} }) => {
  const COLORS = {
    LOW: '#10b981',
    MEDIUM: '#0ea5e9',
    HIGH: '#f59e0b',
    CRITICAL: '#f43f5e',
  };

  const chartData = [
    { name: 'Low', rawKey: 'LOW', count: data.LOW || 0 },
    { name: 'Medium', rawKey: 'MEDIUM', count: data.MEDIUM || 0 },
    { name: 'High', rawKey: 'HIGH', count: data.HIGH || 0 },
    { name: 'Critical', rawKey: 'CRITICAL', count: data.CRITICAL || 0 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            allowDecimals={false}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={`bar-${entry.rawKey}`} fill={COLORS[entry.rawKey]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityBarChart;

