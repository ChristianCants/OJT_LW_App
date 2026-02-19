import React from 'react';

const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = '#3b82f6', label, taskCount }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
                </div>
            </div>
            {label && (
                <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    {taskCount && <p className="text-xs text-gray-500">{taskCount} Tasks</p>}
                </div>
            )}
        </div>
    );
};

export default CircularProgress;
