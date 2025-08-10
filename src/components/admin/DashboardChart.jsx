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

  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const colors = {
    pedidos: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'],
    productos: ['#10B981', '#F59E0B', '#EF4444'],
    consultas: ['#F59E0B', '#3B82F6', '#10B981'],
    ventas: ['#8B5CF6', '#3B82F6'],
    default: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899']
  };

  const getColor = (index, category) => {
    const colorArray = colors[category] || colors.default;
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
              className="h-6 rounded-full transition-all duration-500"
              style={{ 
                width: `${(value / total) * 100}%`,
                backgroundColor: getColor(index, title.toLowerCase())
              }}
            />
          </div>
          <div className="w-16 text-right text-sm font-medium text-gray-900">
            {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDoughnutChart = () => {
    const radius = 60;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    let currentOffset = 0;

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <svg width={radius * 2} height={radius * 2}>
            {Object.entries(data).map(([key, value], index) => {
              const percentage = value / total;
              const strokeDasharray = circumference * percentage;
              const strokeDashoffset = circumference - strokeDasharray;
              const offset = currentOffset;
              currentOffset += strokeDasharray;

              return (
                <circle
                  key={key}
                  stroke={getColor(index, title.toLowerCase())}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  transform={`rotate(-90 ${radius} ${radius})`}
                  style={{
                    transformOrigin: 'center',
                    transform: `rotate(${offset / circumference * 360}deg)`
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="grid grid-cols-1 gap-2 w-full">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColor(index, title.toLowerCase()) }}
                />
                <span className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{value}</span>
                <span className="text-gray-400 text-xs">
                  ({((value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const radius = 60;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    let currentOffset = 0;

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <svg width={radius * 2} height={radius * 2}>
            {Object.entries(data).map(([key, value], index) => {
              const percentage = value / total;
              const strokeDasharray = circumference * percentage;
              const strokeDashoffset = circumference - strokeDasharray;
              const offset = currentOffset;
              currentOffset += strokeDasharray;

              return (
                <circle
                  key={key}
                  stroke={getColor(index, title.toLowerCase())}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  transform={`rotate(-90 ${radius} ${radius})`}
                  style={{
                    transformOrigin: 'center',
                    transform: `rotate(${offset / circumference * 360}deg)`
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="grid grid-cols-1 gap-2 w-full">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColor(index, title.toLowerCase()) }}
                />
                <span className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{value}</span>
                <span className="text-gray-400 text-xs">
                  ({((value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'doughnut':
        return renderDoughnutChart();
      case 'pie':
        return renderPieChart();
      case 'bar':
      default:
        return renderBarChart();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      {renderChart()}
    </div>
  );
};

export default DashboardChart; 