import React from 'react';

const DonutChart = ({ data, size = 180, strokeWidth = 30 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    let currentOffset = 0;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="flex items-center gap-8">
            {/* Chart */}
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#f3f4f6"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Segments */}
                    {data.map((item, index) => {
                        const segmentLength = (item.value / total) * circumference;
                        const offset = currentOffset;
                        currentOffset += segmentLength;

                        return (
                            <circle
                                key={index}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={item.color}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                                strokeDashoffset={-offset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        );
                    })}
                </svg>
                {/* Center number */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{total}</span>
                </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.value}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonutChart;
