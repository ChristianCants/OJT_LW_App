import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    SlidersHorizontal,
    ChevronRight,
    FileText,
    CheckCircle,
    Clock,
    X,
    Download,
    Trophy,
    Target,
    TrendingUp,
    TrendingDown,
    Activity as ActivityIcon,
    BarChart3,
    Layers,
    Code,
    Database,
    Palette,
    Server,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import { getUserActivities } from '../services';

/* Module icon & color mapping */
const moduleConfig = {
    "Frontend Development": { icon: Code, color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-600' },
    "Backend Integration": { icon: Server, color: '#8b5cf6', bg: 'bg-purple-50', text: 'text-purple-600' },
    "Design Systems": { icon: Palette, color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600' },
    "Database Management": { icon: Database, color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    "System Design": { icon: Layers, color: '#ef4444', bg: 'bg-red-50', text: 'text-red-600' },
};

const defaultConfig = { icon: FileText, color: '#6b7280', bg: 'bg-gray-50', text: 'text-gray-600' };

/* ─── Activity Module ────────────────────────────────── */
const ActivityModule = ({ user }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [showFilter, setShowFilter] = useState(false);

    const fetchActivities = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const { data, error } = await getUserActivities(user.id);
            if (error) throw error;
            setActivities(data || []);
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [user?.id]);

    /* Group activities by module */
    const moduleGroups = useMemo(() => {
        const groups = {};
        activities.forEach(item => {
            const modName = item.module || 'Unassigned';
            if (!groups[modName]) {
                groups[modName] = [];
            }
            groups[modName].push({
                ...item,
                activity: item.activity_name || item.activity, // Handle potential aliasing
            });
        });
        return groups;
    }, [activities]);

    /* Filter module cards by search */
    const filteredModules = useMemo(() => {
        const modules = Object.entries(moduleGroups).map(([name, activities]) => {
            const scores = activities.filter(a => a.score !== null).map(a => a.score);
            const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
            const totalSize = (activities.length * 2.5); // Placeholder for logic
            return { name, activities, avgScore, totalSize: totalSize.toFixed(1) };
        });

        if (!searchQuery.trim()) return modules;
        return modules.filter(m =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.activities.some(a => a.activity.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [moduleGroups, searchQuery]);

    /* Activities filtered for modal list */
    const filteredActivities = useMemo(() => {
        if (!selectedModule) return [];
        let list = moduleGroups[selectedModule] || [];
        if (filter !== 'All') {
            list = list.filter(s => filter === 'Pending' ? s.status === 'Pending' : s.status === 'Passed');
        }
        return list;
    }, [selectedModule, filter, moduleGroups]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Loading activities...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 p-8 text-center bg-white/50 backdrop-blur-xl rounded-[28px] border border-white/60 shadow-lg">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Failed to load activities</h3>
            <p className="text-gray-500 max-w-md">{error}</p>
            <button onClick={fetchActivities} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                <RefreshCw size={18} /> Retry
            </button>
        </div>
    );


    return (
        <div className="w-full relative pb-20">

            {/* ─── Header: Search + Filter ─────────────── */}
            <div className="flex items-center gap-3 mb-8 shrink-0 sticky top-0 z-30 py-4 -mx-6 px-6 backdrop-blur-xl transition-all bg-gradient-to-b from-white/10 to-transparent">
                {/* Search Bar */}
                <div
                    className="flex-1 flex items-center gap-3 px-5 py-3.5 rounded-2xl liquid-glass-card cursor-text"
                    style={{ borderRadius: '16px' }}
                >
                    <Search size={18} className="text-gray-400 shrink-0" strokeWidth={1.5} />
                    <input
                        type="text"
                        placeholder="Search modules or activities..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full font-medium"
                    />
                </div>

                {/* Filter Button */}
                <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="liquid-glass-card flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors shrink-0"
                    style={{ borderRadius: '16px' }}
                >
                    <SlidersHorizontal size={16} strokeWidth={1.5} />
                    <span className="hidden sm:inline">Filter</span>
                </button>
            </div>

            {/* Filter Pills (collapsible) */}
            {showFilter && (
                <div className="flex gap-2 mb-6 animate-fade-in">
                    {['All', 'Passed', 'Pending'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300
                                ${filter === f
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'liquid-glass-card text-gray-500 hover:text-gray-900'
                                }`}
                            style={{ borderRadius: '999px' }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            )}

            {/* ─── Card Grid ──────────────────────────── */}
            <div className="">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredModules.map((mod) => {
                        const config = moduleConfig[mod.name] || defaultConfig;

                        // Helper to convert hex to rgba
                        const hexToRgba = (hex, alpha) => {
                            const r = parseInt(hex.slice(1, 3), 16);
                            const g = parseInt(hex.slice(3, 5), 16);
                            const b = parseInt(hex.slice(5, 7), 16);
                            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                        };

                        // Liquid Glass Style
                        const cardStyle = {
                            background: `linear-gradient(135deg, ${hexToRgba(config.color, 0.6)} 0%, ${hexToRgba(config.color, 0.1)} 100%)`,
                            backdropFilter: 'blur(20px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                            border: `1px solid ${hexToRgba(config.color, 0.3)}`,
                            boxShadow: `0 8px 32px 0 ${hexToRgba(config.color, 0.15)}`,
                            borderRadius: '32px',
                        };

                        // Use first activity date or default
                        const dateStr = mod.activities[0]?.date ? new Date(mod.activities[0].date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'No Date';

                        return (
                            <div
                                key={mod.name}
                                onClick={() => setSelectedModule(mod.name)}
                                className="relative overflow-hidden p-6 text-white cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl aspect-[4/3] flex flex-col justify-between group"
                                style={cardStyle}
                            >
                                {/* Top Row: Date & Menu */}
                                <div className="flex justify-between items-center opacity-80 relative z-10">
                                    <span className="text-xs font-semibold tracking-wide">{dateStr}</span>
                                    <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                        <div className="flex flex-col gap-[2px]">
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                        </div>
                                    </button>
                                </div>

                                {/* Middle: Title & Subtitle */}
                                <div className="mt-4 mb-6 relative z-10">
                                    <h3 className="text-2xl font-bold tracking-tight mb-1 text-shadow-sm">{mod.name}</h3>
                                    <p className="text-sm font-medium text-white/80">{mod.activities[0]?.activity || 'No main activity'}</p>
                                </div>

                                {/* Progress Section */}
                                <div className="mt-auto relative z-10">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-white/90">Progress</span>
                                        <span className="text-xs font-bold">{mod.avgScore || 0}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                            style={{
                                                width: `${mod.avgScore || 0}%`,
                                                backgroundColor: '#ffffff'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Bottom Row: Avatars & Time Left */}
                                <div className="flex justify-between items-center mt-6 relative z-10">
                                    {/* Avatars */}
                                    <div className="flex -space-x-2">
                                        {[1, 2].map((_, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white/10 bg-gray-600 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-lg backdrop-blur-md">
                                                <img src={`https://i.pravatar.cc/150?u=${mod.name}${i}`} alt="user" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                        <div
                                            className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center text-[10px] font-bold shadow-lg backdrop-blur-md"
                                            style={{ backgroundColor: hexToRgba(config.color, 0.8) }}
                                        >
                                            <ChevronRight size={14} className="text-white" />
                                        </div>
                                    </div>

                                    {/* Time Left Pill */}
                                    <div className="px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wide shadow-sm">
                                        {mod.activities.length} tasks left
                                    </div>
                                </div>

                                {/* Inner Glow/Reflection for Liquid Effect */}
                                <div
                                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[60px] pointer-events-none opacity-40 mix-blend-overlay"
                                    style={{ backgroundColor: '#ffffff' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            </div>
                        );
                    })}                </div>
            </div>

            {/* ─── Module Drawer (activity list) ──────── */}
            {selectedModule && !selectedActivity && (
                <div
                    className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm"
                    onClick={() => { setSelectedModule(null); setFilter('All'); }}
                >
                    <div
                        className="w-full sm:max-w-lg max-h-[80vh] flex flex-col overflow-hidden liquid-glass animate-fade-in"
                        style={{
                            background: 'rgba(255, 255, 255, 0.88)',
                            borderRadius: '28px 28px 0 0',
                            ...(window.innerWidth >= 640 ? { borderRadius: '28px' } : {}),
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-white/30 flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedModule}</h2>
                                <p className="text-xs text-gray-500 font-medium mt-1">
                                    {(moduleGroups[selectedModule] || []).length} activities
                                </p>
                            </div>
                            <button
                                onClick={() => { setSelectedModule(null); setFilter('All'); }}
                                className="p-2 hover:bg-black/5 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
                            >
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Filter pills inside drawer */}
                        <div className="px-6 py-3 flex gap-2 border-b border-white/20 shrink-0">
                            {['All', 'Passed', 'Pending'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300
                                        ${filter === f
                                            ? 'bg-gray-900 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900 bg-white/40'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Activity List */}
                        <div className="p-4 overflow-y-auto flex-1">
                            <div className="grid gap-3">
                                {filteredActivities.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedActivity(item)}
                                        className="liquid-glass-card cursor-pointer group p-4 flex items-center justify-between"
                                        style={{ borderRadius: '16px' }}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`p-2.5 rounded-xl shrink-0 ${item.status === 'Passed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                                                {item.status === 'Passed' ? <CheckCircle size={18} strokeWidth={1.5} /> : <Clock size={18} strokeWidth={1.5} />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm text-gray-900 truncate">{item.activity}</h4>
                                                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{item.date}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 ml-3">
                                            {item.score !== null && (
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-gray-900">{item.score}</p>
                                                    <p className="text-[10px] text-gray-400 font-semibold">pts</p>
                                                </div>
                                            )}
                                            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${item.status === 'Passed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                                                {item.status}
                                            </div>
                                            <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-gray-900 group-hover:text-white transition-colors text-gray-400">
                                                <ChevronRight size={14} strokeWidth={2} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredActivities.length === 0 && (
                                    <div className="text-center py-12 text-gray-400 text-sm font-medium">
                                        No activities match this filter.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Evaluation Detail Modal ────────────── */}
            {selectedActivity && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedActivity(null)}>
                    <div className="w-full max-w-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div
                            className="flex flex-col max-h-[85vh] overflow-hidden liquid-glass"
                            style={{
                                background: 'rgba(255, 255, 255, 0.92)',
                                borderRadius: '28px',
                            }}
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-white/30 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold pr-8 text-gray-900">{selectedActivity.activity}</h2>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">{selectedActivity.module}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedActivity(null)}
                                    className="p-2 hover:bg-black/5 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
                                >
                                    <X size={22} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div
                                        className="p-8 rounded-2xl flex flex-col items-center justify-center text-center liquid-glass-card"
                                        style={{ borderRadius: '20px' }}
                                    >
                                        <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">Score</span>
                                        <span className="text-6xl font-bold text-gray-900">
                                            {selectedActivity.score || '--'}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-400 mt-2">/ {selectedActivity.max_score}</span>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold">
                                                {selectedActivity.instructor[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">{selectedActivity.instructor}</p>
                                                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Evaluator</p>
                                            </div>
                                        </div>
                                        <div
                                            className="p-5 rounded-xl liquid-glass-card"
                                            style={{ borderRadius: '16px' }}
                                        >
                                            <p className="text-sm text-gray-700 leading-relaxed italic">
                                                "{selectedActivity.remarks}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedActivity.improvements.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4 flex items-center gap-2">
                                            <Target size={16} className="text-red-500" strokeWidth={2} />
                                            Areas for Improvement
                                        </h3>
                                        <div className="grid gap-3">
                                            {selectedActivity.improvements.map((imp, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 p-4 rounded-xl liquid-glass-card"
                                                    style={{ borderRadius: '14px' }}
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                                                    <span className="text-sm font-medium text-gray-700">{imp}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/30 flex gap-3">
                                <button className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 flex justify-center items-center gap-2">
                                    <Download size={16} strokeWidth={2} /> Download Report
                                </button>
                                <button className="w-14 h-14 liquid-glass-card flex items-center justify-center hover:bg-white/60 transition-all text-gray-600" style={{ borderRadius: '14px' }}>
                                    <FileText size={20} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityModule;
