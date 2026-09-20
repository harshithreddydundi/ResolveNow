import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export const StatusPieChart = ({ data = {} }) => {
  const COLORS = {
    OPEN: '#3b82f6',
    ASSIGNED: '#6366f1',
    IN_PROGRESS: '#f59e0b',
    WAITING_FOR_CUSTOMER: '#a855f7',
    ESCALATED: '#f43f5e',
    RESOLVED: '#10b981',
    CLOSED: '#64748b',
    REOPENED: '#f97316',
  };

  const chartData = Object.entries(data).map(([key, val]) => ({
    name: key.replace(/_/g, ' '),
    rawKey: key,
    value: val,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No status data available
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.rawKey}`}
                fill={COLORS[entry.rawKey] || '#94a3b8'}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-[11px] text-slate-600 dark:text-slate-400">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusPieChart;

