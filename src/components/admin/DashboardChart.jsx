import React from 'react';

const DashboardChart = ({ data, title, type = 'bar' }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-gray-500 text-center py-8">No hay datos disponibles</div>
      </div>
    );
  }

  const maxValue = Math.max(...Object.values(data));
  const colors = {
    pedidos: ['bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-500'],
    productos: ['bg-green-500', 'bg-yellow-500', 'bg-red-500'],
    consultas: ['bg-yellow-500', 'bg-blue-500', 'bg-green-500'],
    ventas: ['bg-purple-500', 'bg-blue-500']
  };

  const getColor = (index, category) => {
    const colorArray = colors[category] || colors.pedidos;
    return colorArray[index % colorArray.length];
  };

  const renderBarChart = () => (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value], index) => (
        <div key={key} className="flex items-center space-x-3">
          <div className="w-24 text-sm text-gray-600 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-6">
            <div
              className={`h-6 rounded-full ${getColor(index, title.toLowerCase())} transition-all duration-500`}
              style={{ width: `${(value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-16 text-right text-sm font-medium text-gray-900">
            {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => (
    <div className="flex justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
          {Object.entries(data).map(([key, value], index) => {
            const percentage = (value / maxValue) * 100;
            const circumference = 2 * Math.PI * 14; // radio = 14
            const strokeDasharray = (percentage / 100) * circumference;
            const strokeDashoffset = circumference - strokeDasharray;
            
            return (
              <circle
                key={key}
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke={getColor(index, title.toLowerCase()).replace('bg-', 'rgb(').replace('-500', '')}
                strokeWidth="4"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${(index * 360) / Object.keys(data).length} 16 16)`}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{maxValue}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {type === 'bar' ? renderBarChart() : renderPieChart()}
    </div>
  );
};

export default DashboardChart; 