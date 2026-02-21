import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Trophy,
    CheckCircle,
    Clock,
    Layers,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    Star,
    BarChart3,
    Target,
    MessageSquare,
    Eye,
    ArrowUpRight,
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    AreaChart, Area,
    Legend,
} from 'recharts';

/* ─── Activity Data (shared with ActivityModule) ───────── */
const mockScores = [
    { id: 1, activity: "React Component Library", module: "Frontend Development", date: "2026-02-10", score: 85, max_score: 100, status: "Passed", instructor: "Engr. Sarah Connor", remarks: "Good component structure and prop validation." },
    { id: 2, activity: "API Integration", module: "Backend Integration", date: "2026-02-12", score: 92, max_score: 100, status: "Passed", instructor: "Engr. John Doe", remarks: "Excellent error handling." },
    { id: 3, activity: "UI/UX Design", module: "Design Systems", date: "2026-02-14", score: null, max_score: 100, status: "Pending", instructor: "Ms. Jane Smith", remarks: "Waiting for submission review." },
    { id: 4, activity: "Database Schema", module: "Database Management", date: "2026-02-08", score: 78, max_score: 100, status: "Passed", instructor: "Mr. Alex Router", remarks: "Schema is normalized but misses some foreign keys." },
    { id: 5, activity: "System Architecture", module: "System Design", date: "2026-02-15", score: 88, max_score: 100, status: "Passed", instructor: "Mr. Architect", remarks: "Solid diagramming." },
    { id: 6, activity: "REST API Design", module: "Backend Integration", date: "2026-02-11", score: 90, max_score: 100, status: "Passed", instructor: "Engr. John Doe", remarks: "Clean endpoint design." },
];

/* ─── Helpers ──────────────────────────────────────────── */
const moduleColors = {
    "Frontend Development": "#3b82f6",
    "Backend Integration": "#8b5cf6",
    "Design Systems": "#f59e0b",
    "Database Management": "#10b981",
    "System Design": "#ef4444",
};

/* ─── Count-Up Hook (optimized – runs once) ─────────────── */
const useCountUp = (target, duration = 800) => {
    const [count, setCount] = useState(0);
    const frameRef = useRef(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const startTime = performance.now();
        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };
        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [target, duration]);

    return count;
};

/* ─── Liquid Glass Card Style (reusable) ──────────────── */
const glassStyle = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.35) 100%)',
    backdropFilter: 'blur(20px) saturate(1.6)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
    border: '1px solid rgba(255,255,255,0.6)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.07), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.1)',
};

/* ─── Lightweight Glass Overlay (single div) ─────────── */
const LiquidGlassOverlay = () => (
    <div className="absolute top-0 left-0 right-0 h-[50%] rounded-t-[28px] pointer-events-none"
        style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
        }}
    />
);

/* ─── Custom Tooltip ──────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.5)',
                borderRadius: '16px',
                padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#1f2937', marginBottom: '4px' }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ fontSize: '11px', color: p.color, fontWeight: 600 }}>
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    );
};

/* ─── KPI Card Sub-component (lightweight) ────────────── */
const KpiCard = ({ icon: Icon, iconBg, iconColor, value, suffix, label, trend, index }) => {
    const animatedValue = useCountUp(value, 800);

    return (
        <div
            className="relative p-6 rounded-[28px] overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
            style={{ ...glassStyle, animationDelay: `${index * 60}ms` }}
        >
            <LiquidGlassOverlay />

            <div className="flex items-center justify-between mb-3 relative z-10">
                <div
                    className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shadow-sm`}
                >
                    <Icon size={20} className={iconColor} />
                </div>
                {trend && (
                    <div
                        className="flex items-center gap-1 text-emerald-500 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50/60"
                    >
                        <TrendingUp size={14} /> {trend}
                    </div>
                )}
            </div>

            <p className="text-3xl font-extrabold text-gray-900 relative z-10">
                {animatedValue}
                {suffix && <span className="text-base font-medium text-gray-400">{suffix}</span>}
            </p>
            <p className="text-xs text-gray-500 font-semibold mt-1 relative z-10">
                {label}
            </p>
        </div>
    );
};

/* ─── Fade-in Section Wrapper ─────────────────────────── */
const FadeInSection = ({ children, delay = 0, className = '' }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);

    return (
        <div
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

/* ─── Main Component ──────────────────────────────────── */
const StudentAnalyticsModule = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [trendView, setTrendView] = useState('Monthly');

    /* Computed Stats */
    const stats = useMemo(() => {
        const scored = mockScores.filter(s => s.score !== null);
        const avgScore = scored.length > 0 ? Math.round(scored.reduce((a, b) => a + b.score, 0) / scored.length) : 0;
        const completed = scored.length;
        const pending = mockScores.filter(s => s.status === 'Pending').length;
        const modules = [...new Set(mockScores.map(s => s.module))];
        const completionPct = Math.round((completed / mockScores.length) * 100);
        return { avgScore, completed, pending, totalModules: modules.length, completionPct, total: mockScores.length };
    }, []);

    /* Module Bar Chart Data */
    const moduleBarData = useMemo(() => {
        const groups = {};
        mockScores.forEach(s => {
            if (!groups[s.module]) groups[s.module] = { scores: [], count: 0 };
            groups[s.module].count++;
            if (s.score !== null) groups[s.module].scores.push(s.score);
        });
        return Object.entries(groups).map(([name, data]) => ({
            name: name.length > 16 ? name.substring(0, 14) + '…' : name,
            fullName: name,
            avg: data.scores.length > 0 ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) : 0,
            max: 100,
            color: moduleColors[name] || '#6b7280',
        }));
    }, []);

    /* Score Trend Data */
    const trendData = useMemo(() => {
        return mockScores
            .filter(s => s.score !== null)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(s => ({
                date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: s.score,
                activity: s.activity,
            }));
    }, []);

    /* Donut Data */
    const donutData = [
        { name: 'Completed', value: stats.completionPct },
        { name: 'Remaining', value: 100 - stats.completionPct },
    ];
    const donutColors = ['#10b981', '#e5e7eb'];

    /* Animated counters */
    const donutCountUp = useCountUp(stats.completionPct, 1000);
    const completedCountUp = useCountUp(stats.completed, 800);
    const avgCountUp = useCountUp(stats.avgScore, 900);

    /* Filtered activities for table */
    const filteredActivities = useMemo(() => {
        if (activeFilter === 'All') return mockScores;
        return mockScores.filter(s => s.status === activeFilter);
    }, [activeFilter]);

    /* Recent feedback */
    const recentFeedback = useMemo(() => {
        return mockScores
            .filter(s => s.score !== null && s.remarks)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, []);

    return (
        <div className="w-full pb-20">

            {/* ═══ KPI Cards ═══════════════════════════════════ */}
            <FadeInSection delay={0}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <KpiCard icon={Trophy} iconBg="bg-yellow-50" iconColor="text-yellow-500"
                        value={stats.avgScore} suffix="/100" label="Average Score" trend="+4.2%" index={0} />
                    <KpiCard icon={CheckCircle} iconBg="bg-emerald-50" iconColor="text-emerald-500"
                        value={stats.completed} suffix={`/${stats.total}`} label="Activities Completed" index={1} />
                    <KpiCard icon={Clock} iconBg="bg-orange-50" iconColor="text-orange-500"
                        value={stats.pending} label="Pending Reviews" index={2} />
                    <KpiCard icon={Layers} iconBg="bg-blue-50" iconColor="text-blue-500"
                        value={stats.totalModules} label="Total Modules" index={3} />
                </div>
            </FadeInSection>

            {/* ═══ Middle Row: Charts ══════════════════════════ */}
            <FadeInSection delay={100}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

                    {/* Score by Module (Bar Chart) + Overall Progress (Donut) */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-5 gap-6">

                        {/* ── Bar Chart ─────────────────────────── */}
                        <div className="md:col-span-3 p-6 rounded-[28px] overflow-hidden relative"
                            style={glassStyle}>
                            <LiquidGlassOverlay />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Score Analytics</h3>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">Average score per module</p>
                                    </div>
                                    <div className="flex gap-1 bg-white/40 rounded-full p-1">
                                        {['Monthly', 'Weekly'].map(v => (
                                            <button key={v}
                                                onClick={() => setTrendView(v)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${trendView === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                                            >{v}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs text-gray-400 font-semibold">Total scored activities</p>
                                    <p className="text-2xl font-extrabold text-gray-900">
                                        {completedCountUp}<span className="text-sm font-medium text-gray-400">/{stats.total}</span>
                                    </p>
                                </div>

                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={moduleBarData} layout="vertical" margin={{ left: 0, right: 12 }}>
                                            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }} width={90} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="avg" radius={[0, 8, 8, 0]} barSize={14} name="Avg Score" isAnimationActive={true} animationDuration={800} animationEasing="ease-out">
                                                {moduleBarData.map((entry, idx) => (
                                                    <Cell key={idx} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* ── Donut / Overall Progress ──────────── */}
                        <div className="md:col-span-2 p-6 rounded-[28px] flex flex-col items-center justify-center overflow-hidden relative"
                            style={glassStyle}>
                            <LiquidGlassOverlay />
                            <div className="relative z-10 flex flex-col items-center w-full">
                                <div className="flex items-center justify-between w-full mb-4">
                                    <h3 className="text-base font-bold text-gray-900">Progress</h3>
                                    <div className="flex gap-1 bg-white/40 rounded-full p-1">
                                        {['Monthly', 'Yearly'].map(v => (
                                            <button key={v} className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${v === 'Yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>{v}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative w-[160px] h-[160px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={donutData}
                                                innerRadius={55}
                                                outerRadius={75}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                                stroke="none"
                                                isAnimationActive={true}
                                                animationDuration={900}
                                                animationEasing="ease-out"
                                            >
                                                {donutData.map((_, idx) => (
                                                    <Cell key={idx} fill={donutColors[idx]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-extrabold text-gray-900">{donutCountUp}%</span>
                                        <span className="text-[10px] text-gray-400 font-semibold">Achieved</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] text-gray-500 font-semibold">Completed</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                                        <span className="text-[10px] text-gray-500 font-semibold">Remaining</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column: Score Trend ─────────────── */}
                    <div className="lg:col-span-5 p-6 rounded-[28px] overflow-hidden relative"
                        style={glassStyle}>
                        <LiquidGlassOverlay />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-bold text-gray-900">Score Trend</h3>
                                <div className="flex gap-1 bg-white/40 rounded-full p-1">
                                    <button className="px-3 py-1 rounded-full text-xs font-bold text-gray-400">Scores</button>
                                    <button className="px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-900 shadow-sm">Progress</button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium mb-1">Total Average</p>
                            <p className="text-2xl font-extrabold text-gray-900 mb-4">
                                {avgCountUp}<span className="text-sm text-gray-400 font-medium">/100</span>
                            </p>

                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} fill="url(#scoreGradient)" name="Score"
                                            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                                            isAnimationActive={true} animationDuration={1000} animationEasing="ease-out"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeInSection>

            {/* ═══ Bottom Row: Table + Feedback ════════════════ */}
            <FadeInSection delay={200}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ── Activity Overview Table ──────────────── */}
                    <div className="lg:col-span-7 p-6 rounded-[28px] overflow-hidden relative"
                        style={glassStyle}>
                        <LiquidGlassOverlay />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-base font-bold text-gray-900">Activity Overview</h3>
                                <div className="flex gap-1 bg-white/40 rounded-full p-1">
                                    {['All', 'Passed', 'Pending'].map(f => (
                                        <button key={f}
                                            onClick={() => setActiveFilter(f)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeFilter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                                        >{f}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Activity</th>
                                            <th className="py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Module</th>
                                            <th className="py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score</th>
                                            <th className="py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredActivities.map((item) => (
                                            <tr key={item.id}
                                                className="border-t border-gray-100/50 hover:bg-white/40 transition-colors group cursor-pointer"
                                            >
                                                <td className="py-4 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                                                            style={{ backgroundColor: moduleColors[item.module] || '#6b7280' }}>
                                                            {item.activity[0]}
                                                        </div>
                                                        <span className="font-semibold text-gray-900 text-sm">{item.activity}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-3 text-gray-500 font-medium text-xs">{item.module}</td>
                                                <td className="py-4 px-3 font-bold text-gray-900">{item.score !== null ? item.score : '—'}</td>
                                                <td className="py-4 px-3 text-gray-500 text-xs font-medium">
                                                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                                </td>
                                                <td className="py-4 px-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${item.status === 'Passed'
                                                        ? 'bg-emerald-50/80 text-emerald-600'
                                                        : 'bg-orange-50/80 text-orange-500'
                                                        }`}>
                                                        {item.status === 'Passed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ── Recent Feedback ───────────────────────── */}
                    <div className="lg:col-span-5 p-6 rounded-[28px] overflow-hidden relative"
                        style={glassStyle}>
                        <LiquidGlassOverlay />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-base font-bold text-gray-900">Recent Feedback</h3>
                                <div className="flex gap-1 bg-white/40 rounded-full p-1">
                                    <button className="px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-900 shadow-sm">Active</button>
                                    <button className="px-3 py-1 rounded-full text-xs font-bold text-gray-400">Archived</button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {recentFeedback.map((item) => (
                                    <div key={item.id}
                                        className="p-4 rounded-2xl hover:bg-white/40 transition-all group cursor-pointer border border-transparent hover:border-white/50"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 min-w-0">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 shadow-sm"
                                                    style={{ backgroundColor: moduleColors[item.module] || '#6b7280' }}
                                                >
                                                    {item.score}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-sm text-gray-900 truncate">{item.activity}</h4>
                                                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">Reviewed by {item.instructor}</p>
                                                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{item.remarks}</p>
                                                </div>
                                            </div>
                                            <button
                                                className="px-3 py-1.5 rounded-lg text-emerald-600 text-[10px] font-bold shrink-0 hover:scale-105 active:scale-95 transition-transform"
                                                style={{
                                                    background: 'rgba(16, 185, 129, 0.1)',
                                                    border: '1px solid rgba(16, 185, 129, 0.15)',
                                                }}
                                            >
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </div>
    );
};

export default StudentAnalyticsModule;
