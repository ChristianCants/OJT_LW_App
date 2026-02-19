import React, { useState } from 'react';
import {
    ClipboardList,
    Plus,
    Search,
    Filter,
    Calendar,
    FileText,
    CheckCircle2,
    Trophy,
    MoreVertical,
    Edit,
    Trash2,
    ChevronDown,
    Award
} from 'lucide-react';

/* ── Reusable glass style ────────────────────────────────── */
const glass = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 8px 32px rgba(31,38,135,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
};

// Mock data
const mockActivities = [
    { id: 1, title: 'Week 1 Report', type: 'Report', date: '2026-02-10', maxScore: 100, submissions: 12, status: 'Closed' },
    { id: 2, title: 'React Basics Quiz', type: 'Quiz', date: '2026-02-12', maxScore: 50, submissions: 10, status: 'Closed' },
    { id: 3, title: 'Final Project', type: 'Project', date: '2026-02-15', maxScore: 200, submissions: 8, status: 'Active' },
    { id: 4, title: 'Code Review', type: 'Code', date: '2026-02-18', maxScore: 100, submissions: 5, status: 'Upcoming' },
];

const mockInterns = [
    { id: 1, name: 'John Doe', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', avatar: 'JS' },
    { id: 3, name: 'Alice Johnson', avatar: 'AJ' },
];

// Mock scores: { [internId]: { [activityId]: score } }
const mockScores = {
    1: { 1: 95, 2: 48, 3: 180 },
    2: { 1: 88, 2: 45, 3: 190 },
    3: { 1: 92, 2: 42, 3: 175 },
};

const ActivitiesModule = () => {
    const [activeView, setActiveView] = useState('activities'); // 'activities' or 'scoring'
    const [searchQuery, setSearchQuery] = useState('');

    const getTypeColor = (type) => {
        switch (type) {
            case 'Report': return 'text-blue-600 bg-blue-100';
            case 'Quiz': return 'text-purple-600 bg-purple-100';
            case 'Project': return 'text-orange-600 bg-orange-100';
            case 'Code': return 'text-emerald-600 bg-emerald-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-green-600 bg-green-100';
            case 'Closed': return 'text-gray-600 bg-gray-100';
            case 'Upcoming': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="h-full overflow-y-auto pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Activities & Scoring</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage intern deliverables and grade performance</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setActiveView('activities')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'activities'
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'bg-white/40 text-gray-600 hover:bg-white/60'
                            }`}
                    >
                        Activities
                    </button>
                    <button
                        onClick={() => setActiveView('scoring')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'scoring'
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'bg-white/40 text-gray-600 hover:bg-white/60'
                            }`}
                    >
                        Scoring Board
                    </button>
                    <button
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:translate-y-[-1px] transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        New Activity
                    </button>
                </div>
            </div>

            {/* Content Views */}
            {activeView === 'activities' && (
                <div className="grid grid-cols-1 gap-4">
                    {mockActivities.map(activity => (
                        <div
                            key={activity.id}
                            className="p-5 rounded-2xl flex items-center justify-between group hover:translate-y-[-2px] transition-all duration-300"
                            style={glass}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${getTypeColor(activity.type).replace('text-', 'bg-').replace('bg-', 'text-white ')}`}>
                                    {activity.type === 'Report' && <FileText size={22} />}
                                    {activity.type === 'Quiz' && <CheckCircle2 size={22} />}
                                    {activity.type === 'Project' && <Trophy size={22} />}
                                    {activity.type === 'Code' && <Award size={22} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{activity.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${getTypeColor(activity.type)}`}>
                                            {activity.type}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span>•</span>
                                        <span>{activity.maxScore} pts</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-1 font-medium">{activity.submissions} Submissions</p>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-black/5 rounded-lg transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeView === 'scoring' && (
                <div
                    className="rounded-2xl overflow-hidden pb-2"
                    style={glass}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/40 border-b border-gray-200/50">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-white/40 backdrop-blur-md z-10 w-64 border-r border-gray-200/30">
                                        Intern
                                    </th>
                                    {mockActivities.map(activity => (
                                        <th key={activity.id} className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[120px]">
                                            <div className="flex flex-col items-center gap-1">
                                                <span>{activity.title}</span>
                                                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-normal">
                                                    /{activity.maxScore}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/40">
                                {mockInterns.map(intern => {
                                    let totalScore = 0;
                                    let maxTotal = 0;
                                    mockActivities.forEach(act => {
                                        if (mockScores[intern.id]?.[act.id] !== undefined && mockScores[intern.id]?.[act.id] !== null) {
                                            totalScore += mockScores[intern.id][act.id];
                                        }
                                        maxTotal += act.maxScore;
                                    });
                                    const percentage = Math.round((totalScore / maxTotal) * 100) || 0;

                                    return (
                                        <tr key={intern.id} className="hover:bg-white/40 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white/10 backdrop-blur-[2px] border-r border-gray-200/30 group-hover:bg-white/60 transition-colors z-10">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-9 w-9">
                                                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-md">
                                                            {intern.avatar}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{intern.name}</div>
                                                        <div className="text-xs text-gray-500">ID: #{String(intern.id).padStart(4, '0')}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {mockActivities.map(activity => {
                                                const score = mockScores[intern.id]?.[activity.id];
                                                const hasScore = score !== undefined && score !== null;
                                                return (
                                                    <td key={activity.id} className="px-6 py-4 text-center whitespace-nowrap">
                                                        {hasScore ? (
                                                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-sm font-bold
                                                                ${score >= activity.maxScore * 0.9 ? 'bg-green-100 text-green-700' :
                                                                    score >= activity.maxScore * 0.7 ? 'bg-blue-50 text-blue-700' :
                                                                        'bg-orange-50 text-orange-700'}`}>
                                                                {score}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-300 text-sm font-medium">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-sm font-bold ${percentage >= 90 ? 'text-green-600' : percentage >= 75 ? 'text-blue-600' : 'text-orange-500'}`}>
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivitiesModule;
