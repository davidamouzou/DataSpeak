import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartVisualizationProps {
  type: 'bar' | 'line' | 'pie' | 'area';
  data: never[];
  dataKey?: string;
  xKey?: string;
  title?: string;
}

const COLORS = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#14B8A6'];

export function ChartVisualization({ type, data, dataKey = 'value', xKey = 'name', title }: ChartVisualizationProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      {title && (
        <h4 className="text-gray-900 mb-4">{title}</h4>
      )}

        {type === 'bar' && (
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey={xKey} stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Legend />
                <Bar dataKey={dataKey} fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
        )}

        {type === 'line' && (
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey={xKey} stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ fill: '#2563EB', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        )}

        {type === 'pie' && (
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey={dataKey}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                />
            </PieChart>
        )}
    </div>
  );
}
