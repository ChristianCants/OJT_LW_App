import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
    TrendingUp,
    Users,
    Award,
    Target,
    Download,
    Calendar,
    Filter
} from 'lucide-react';

/* ── Reusable glass style ────────────────────────────────── */
const glass = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 8px 32px rgba(31,38,135,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
};

// Mock Data
const performanceData = [];

const skillsData = [];

const gradeDistribution = [];

const AnalyticsModule = () => {
    return (
        <div className="h-full overflow-y-auto pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Program Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">Holistic view of student performance and trends</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white/40 backdrop-blur-sm border border-white/40 px-4 py-2 rounded-xl shadow-sm text-sm font-semibold text-gray-700">
                        <Calendar size={16} />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl shadow-lg shadow-gray-900/20 text-sm font-semibold hover:bg-black transition-colors">
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="p-6 rounded-2xl group hover:scale-[1.02] transition-transform" style={glass}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Users size={24} className="text-blue-600" />
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg">+12%</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">48</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Total Interns</p>
                </div>

                <div className="p-6 rounded-2xl group hover:scale-[1.02] transition-transform" style={glass}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <TrendingUp size={24} className="text-emerald-600" />
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg">+5.2%</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">88.5%</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Avg Score</p>
                </div>

                <div className="p-6 rounded-2xl group hover:scale-[1.02] transition-transform" style={glass}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Award size={24} className="text-purple-600" />
                        </div>
                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-lg">Top 10%</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">12</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Distinctions</p>
                </div>

                <div className="p-6 rounded-2xl group hover:scale-[1.02] transition-transform" style={glass}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-xl">
                            <Target size={24} className="text-orange-600" />
                        </div>
                        <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">95% Goal</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">92%</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Completion Rate</p>
                </div>
            </div>

            {/* Main Section: Trend & Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Score Trend Chart */}
                <div className="lg:col-span-2 p-6 rounded-2xl" style={glass}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Performance Trend</h3>
                        <div className="flex gap-2">
                            <select className="bg-white/50 border border-white/60 rounded-lg text-xs font-semibold px-2 py-1 outline-none">
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="avgScore" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Grade Distribution */}
                <div className="p-6 rounded-2xl" style={glass}>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Grade Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gradeDistribution} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }} width={50} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: '12px' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                                    {gradeDistribution.map((entry, index) => (
                                        <cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#f59e0b'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Skills Radar & Top Performers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl" style={glass}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Skills Assessment</h3>
                    <div className="h-[300px] w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                                <PolarGrid stroke="rgba(0,0,0,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Cohort Average" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.4} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 rounded-2xl" style={glass}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Top Performers</h3>
                        <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-white/40 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm
                                        ${i === 1 ? 'bg-yellow-500' : i === 2 ? 'bg-gray-400' : i === 3 ? 'bg-orange-400' : 'bg-blue-500'}`}>
                                        {i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Student Name {i}</p>
                                        <p className="text-xs text-gray-500">React Specialist</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900">9{9 - i}%</p>
                                    <p className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded ml-auto w-fit">Top 5%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsModule;
