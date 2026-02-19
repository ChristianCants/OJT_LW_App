import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const TimeSpendingsChart = ({ weeklyData }) => {
    const [hoveredDay, setHoveredDay] = useState(null);
    const [period, setPeriod] = useState('Weekly');

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Calculate total time
    const totalMinutes = weeklyData.reduce((sum, val) => sum + val, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    // Find max value for scaling
    const maxValue = Math.max(...weeklyData);

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Time Spendings</h2>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setPeriod('Weekly')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${period === 'Weekly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setPeriod('Monthly')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${period === 'Monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {/* Total Time Display */}
            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-gray-900">{totalHours}h</span>
                <span className="text-2xl font-bold text-gray-900">{remainingMinutes}m</span>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-48 mb-2">
                {weeklyData.map((value, index) => {
                    const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const hours = Math.floor(value / 60);
                    const minutes = value % 60;
                    const isCurrentDay = index === 2; // Wednesday is current day in reference

                    return (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center gap-2 relative"
                            onMouseEnter={() => setHoveredDay(index)}
                            onMouseLeave={() => setHoveredDay(null)}
                        >
                            {/* Tooltip */}
                            {hoveredDay === index && value > 0 && (
                                <div className="absolute -top-12 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap z-10">
                                    {hours}h {minutes}m
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                        <div className="border-4 border-transparent border-t-gray-900" />
                                    </div>
                                </div>
                            )}

                            {/* Bar */}
                            <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                                <div
                                    className={`w-full rounded-t-lg transition-all duration-300 ${isCurrentDay
                                        ? 'bg-red-400'
                                        : value > 0
                                            ? 'bg-gray-200 hover:bg-gray-300'
                                            : 'bg-gray-100'
                                        }`}
                                    style={{ height: `${heightPercentage}%`, minHeight: value > 0 ? '8px' : '0' }}
                                />
                            </div>

                            {/* Day label */}
                            <span className="text-xs font-medium text-gray-500">{days[index]}</span>
                        </div>
                    );
                })}
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Clock size={20} className="text-blue-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Hours Spent</p>
                        <p className="text-lg font-bold text-gray-900">42</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeSpendingsChart;
