import React, { useState, useMemo, useEffect } from 'react';
import {
    FileText,
    Search,
    Award,
    TrendingUp,
    CheckCircle,
    Clock,
    ChevronRight,
    Star,
    Quote,
    Eye,
    X,
    Download,
    BarChart3,
    Target,
    Sparkles,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import { getUserEvaluations } from '../services';

/* ─── Glass Styles ─────────────────────────────────────── */
const glassStyle = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.35) 100%)',
    backdropFilter: 'blur(20px) saturate(1.6)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
    border: '1px solid rgba(255,255,255,0.6)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.07), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.1)',
};

const GlassOverlay = () => (
    <div className="absolute top-0 left-0 right-0 h-[50%] rounded-t-[28px] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)' }}
    />
);

/* ─── Module Color Map ─────────────────────────────────── */
const moduleColors = {
    "Frontend Development": { bg: "bg-blue-50", text: "text-blue-600", accent: "#3b82f6", light: "#eff6ff" },
    "Backend Integration": { bg: "bg-purple-50", text: "text-purple-600", accent: "#8b5cf6", light: "#faf5ff" },
    "Design Systems": { bg: "bg-amber-50", text: "text-amber-600", accent: "#f59e0b", light: "#fffbeb" },
    "Database Management": { bg: "bg-emerald-50", text: "text-emerald-600", accent: "#10b981", light: "#ecfdf5" },
    "System Design": { bg: "bg-rose-50", text: "text-rose-600", accent: "#ef4444", light: "#fff1f2" },
};

const getModuleStyle = (module) => moduleColors[module] || { bg: "bg-gray-50", text: "text-gray-600", accent: "#6b7280", light: "#f9fafb" };

/* ─── Score Badge Component ───────────────────────────── */
const ScoreBadge = ({ score, maxScore }) => {
    if (score === null || score === undefined) return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50/80 text-orange-500 text-xs font-bold">
            <Clock size={12} /> Pending
        </div>
    );

    const max = maxScore || 100;
    const pct = (score / max) * 100;
    const color = pct >= 90 ? 'text-emerald-600 bg-emerald-50/80' : pct >= 80 ? 'text-blue-600 bg-blue-50/80' : pct >= 70 ? 'text-amber-600 bg-amber-50/80' : 'text-red-600 bg-red-50/80';

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold ${color}`}>
            <Star size={12} /> {score}/{max}
        </span>
    );
};

/* ─── Criteria Progress Bar ───────────────────────────── */
const CriteriaBar = ({ label, value, max = 25, color }) => {
    const [width, setWidth] = useState(0);
    const pct = value !== null && value !== undefined ? Math.min((value / max) * 100, 100) : 0;

    useEffect(() => {
        const t = requestAnimationFrame(() => setWidth(pct));
        return () => cancelAnimationFrame(t);
    }, [pct]);

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">{label}</span>
                <span className="text-xs font-bold" style={{ color }}>{value !== null && value !== undefined ? value : '--'}/{max}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                    className="h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${width}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
};

/* ─── Count-Up Hook ────────────────────────────────────── */
const useCountUp = (target, duration = 800) => {
    const [count, setCount] = useState(0);
    const hasRun = React.useRef(false);
    const frameRef = React.useRef(null);

    useEffect(() => {
        if (hasRun.current || target === 0) { setCount(target); return; }
        hasRun.current = true;
        const startTime = performance.now();
        const animate = (now) => {
            const p = Math.min((now - startTime) / duration, 1);
            setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    }, [target, duration]);

    return count;
};

/* ─── FadeIn Wrapper ───────────────────────────────────── */
const FadeIn = ({ children, delay = 0, className = '' }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);
    return (
        <div className={className} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
        }}>{children}</div>
    );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
const StudentEvaluationModule = ({ user }) => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedEval, setSelectedEval] = useState(null);

    const fetchEvaluations = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const { data, error } = await getUserEvaluations(user.id);
            if (error) throw error;
            setEvaluations(data || []);
        } catch (err) {
            console.error('Error fetching evaluations:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvaluations();
    }, [user?.id]);

    /* Stats */
    const stats = useMemo(() => {
        const evaluated = evaluations.filter(e => e.status === 'Evaluated');
        const pending = evaluations.filter(e => e.status === 'Pending').length;
        const avgScore = evaluated.length > 0
            ? Math.round(evaluated.reduce((a, e) => a + (e.score || 0), 0) / evaluated.length)
            : 0;
        const highestScore = evaluated.length > 0 ? Math.max(...evaluated.map(e => e.score || 0)) : 0;
        return { evaluated: evaluated.length, pending, avgScore, highestScore, total: evaluations.length };
    }, [evaluations]);

    /* Filtered */
    const filteredEvals = useMemo(() => {
        return evaluations.filter(ev => {
            const matchSearch = (ev.activity_name || ev.activity || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ev.module || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchFilter = filterStatus === 'All' || ev.status === filterStatus;
            return matchSearch && matchFilter;
        });
    }, [evaluations, searchQuery, filterStatus]);

    /* Animated counters */
    const avgScoreCount = useCountUp(stats.avgScore, 900);
    const evaluatedCount = useCountUp(stats.evaluated, 700);
    const pendingCount = useCountUp(stats.pending, 600);
    const highestCount = useCountUp(stats.highestScore, 800);

    return (
        <div className="w-full pb-20 relative">
            {/* ═══ Header ══════════════════════════════════════ */}
            <FadeIn delay={0}>
                <div className="mb-8 p-6 lg:p-10 rounded-[32px] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
                    }}
                >
                    <div className="relative z-10">
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-2">
                            Evaluation Report
                        </h1>
                        <p className="text-gray-500 font-medium">Track your performance evaluations and instructor feedback.</p>
                    </div>

                    {/* Search */}
                    <div className="relative z-10 w-full md:w-auto min-w-[300px]">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search evaluations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/40 block w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/60 transition-all border border-white/40 shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none mix-blend-multiply" />
                </div>
            </FadeIn>

            {/* ═══ KPI Summary Cards ════════════════════════════ */}
            <FadeIn delay={50}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Avg Score */}
                    <div className="relative p-6 rounded-[28px] overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300" style={glassStyle}>
                        <GlassOverlay />
                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-sm">
                                <Award size={20} className="text-emerald-500" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50/60">
                                <TrendingUp size={14} /> Good
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 relative z-10">
                            {avgScoreCount}<span className="text-base font-medium text-gray-400">/100</span>
                        </p>
                        <p className="text-xs text-gray-500 font-semibold mt-1 relative z-10">Average Score</p>
                    </div>

                    {/* Evaluated */}
                    <div className="relative p-6 rounded-[28px] overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300" style={glassStyle}>
                        <GlassOverlay />
                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
                                <CheckCircle size={20} className="text-blue-500" />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 relative z-10">
                            {evaluatedCount}<span className="text-base font-medium text-gray-400">/{stats.total}</span>
                        </p>
                        <p className="text-xs text-gray-500 font-semibold mt-1 relative z-10">Evaluated</p>
                    </div>

                    {/* Pending */}
                    <div className="relative p-6 rounded-[28px] overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300" style={glassStyle}>
                        <GlassOverlay />
                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shadow-sm">
                                <Clock size={20} className="text-orange-500" />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 relative z-10">{pendingCount}</p>
                        <p className="text-xs text-gray-500 font-semibold mt-1 relative z-10">Pending Review</p>
                    </div>

                    {/* Highest */}
                    <div className="relative p-6 rounded-[28px] overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300" style={glassStyle}>
                        <GlassOverlay />
                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center shadow-sm">
                                <Star size={20} className="text-yellow-500" />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 relative z-10">
                            {highestCount}<span className="text-base font-medium text-gray-400">/100</span>
                        </p>
                        <p className="text-xs text-gray-500 font-semibold mt-1 relative z-10">Highest Score</p>
                    </div>
                </div>
            </FadeIn>

            {/* ═══ Filter Tabs ══════════════════════════════════ */}
            <FadeIn delay={100}>
                <div className="flex gap-2 mb-6">
                    {['All', 'Evaluated', 'Pending'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterStatus(f)}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${filterStatus === f
                                ? 'bg-white/70 text-gray-900 shadow-sm border border-white/60'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-white/30'
                                }`}
                            style={filterStatus === f ? { backdropFilter: 'blur(12px)' } : {}}
                        >
                            {f} {f === 'All' ? `(${stats.total})` : f === 'Evaluated' ? `(${stats.evaluated})` : `(${stats.pending})`}
                        </button>
                    ))}
                </div>
            </FadeIn>

            {/* ═══ Evaluation Cards Grid ═════════════════════════ */}
            <FadeIn delay={150}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEvals.map((ev) => {
                        const mStyle = getModuleStyle(ev.module);
                        return (
                            <div
                                key={ev.id}
                                onClick={() => setSelectedEval(ev)}
                                className="group relative overflow-hidden rounded-[28px] p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                                style={glassStyle}
                            >
                                <GlassOverlay />

                                {/* Status chip */}
                                <div className="absolute top-5 right-5 z-10">
                                    {ev.status === 'Evaluated' ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50/80 text-emerald-600 text-[10px] font-bold">
                                            <CheckCircle size={12} /> Evaluated
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50/80 text-orange-500 text-[10px] font-bold">
                                            <Clock size={12} /> Pending
                                        </span>
                                    )}
                                </div>

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    {/* Module badge */}
                                    <div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-4 ${mStyle.bg} ${mStyle.text}`}>
                                            {ev.module}
                                        </span>

                                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                                            {ev.activity}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-medium">
                                            {new Date(ev.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Score & Instructor */}
                                    <div className="mt-6 pt-4 border-t border-gray-100/50 space-y-3">
                                        {/* Score display */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">
                                                    {ev.instructor.charAt(0)}
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium">{ev.instructor}</span>
                                            </div>
                                            <ScoreBadge score={ev.score} maxScore={ev.maxScore} />
                                        </div>

                                        {/* Mini criteria preview (only if evaluated) */}
                                        {ev.status === 'Evaluated' && (
                                            <div className="grid grid-cols-4 gap-2">
                                                {[
                                                    { label: 'DSN', val: ev.design },
                                                    { label: 'CNT', val: ev.content },
                                                    { label: 'PRS', val: ev.presentation },
                                                    { label: 'EXP', val: ev.explanation },
                                                ].map((c, i) => (
                                                    <div key={i} className="text-center py-2 rounded-xl bg-white/40 border border-white/50">
                                                        <p className="text-[10px] text-gray-400 font-bold">{c.label}</p>
                                                        <p className="text-sm font-extrabold text-gray-800">{c.val}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* View details hint */}
                                        <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400 font-semibold group-hover:text-blue-500 transition-colors">
                                            <Eye size={12} /> View Details
                                            <ChevronRight size={12} />
                                        </div>
                                    </div>
                                </div>

                                {/* Hover glow */}
                                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            </FadeIn>

            {/* Empty state */}
            {filteredEvals.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Search size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No evaluations found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filter.</p>
                </div>
            )}

            {/* ═══ Detail Modal ══════════════════════════════════ */}
            {selectedEval && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setSelectedEval(null)}
                    />

                    {/* Modal */}
                    <div
                        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[28px] overflow-hidden"
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(40px) saturate(2)',
                            WebkitBackdropFilter: 'blur(40px) saturate(2)',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
                            animation: 'modalIn 0.3s ease forwards',
                        }}
                    >
                        {/* Header */}
                        <div className="p-6 pb-4 border-b border-gray-100 relative">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-3 ${getModuleStyle(selectedEval.module).bg} ${getModuleStyle(selectedEval.module).text}`}>
                                        {selectedEval.module}
                                    </span>
                                    <h2 className="text-2xl font-extrabold text-gray-900">{selectedEval.activity}</h2>
                                    <p className="text-sm text-gray-400 font-medium mt-1">
                                        {new Date(selectedEval.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedEval(null)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Score & Instructor Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Score Card */}
                                <div className="rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                                    style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Final Score</p>
                                    <div className="text-5xl font-black text-emerald-800 tracking-tighter">
                                        {selectedEval.score ?? '--'}
                                        <span className="text-xl text-emerald-400 font-bold ml-1">/100</span>
                                    </div>
                                    {selectedEval.score !== null && (
                                        <div className="mt-3">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${selectedEval.score >= 90 ? 'bg-emerald-100 text-emerald-700' : selectedEval.score >= 80 ? 'bg-blue-100 text-blue-700' : selectedEval.score >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                {selectedEval.score >= 90 ? 'Excellent' : selectedEval.score >= 80 ? 'Very Good' : selectedEval.score >= 70 ? 'Good' : 'Needs Improvement'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Instructor Card */}
                                <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold">
                                            {selectedEval.instructor.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{selectedEval.instructor}</p>
                                            <p className="text-[11px] text-gray-400 uppercase font-semibold">{selectedEval.instructorRole}</p>
                                        </div>
                                    </div>
                                    {selectedEval.feedback && (
                                        <div className="relative pl-4 py-2">
                                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400/60 rounded-full" />
                                            <Quote size={12} className="text-yellow-500 mb-1" />
                                            <p className="text-sm text-gray-600 italic leading-relaxed">
                                                "{selectedEval.feedback}"
                                            </p>
                                        </div>
                                    )}
                                    {!selectedEval.feedback && (
                                        <p className="text-sm text-gray-400 italic">No feedback provided yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Criteria Breakdown */}
                            {selectedEval.status === 'Evaluated' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-2xl p-5 border" style={{ background: 'rgba(16,185,129,0.03)', borderColor: 'rgba(16,185,129,0.12)' }}>
                                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Target size={14} /> Development
                                        </h4>
                                        <div className="space-y-4">
                                            <CriteriaBar label="Design & Branding" value={selectedEval.design} color="#10b981" />
                                            <CriteriaBar label="Contents" value={selectedEval.content} color="#10b981" />
                                        </div>
                                    </div>
                                    <div className="rounded-2xl p-5 border" style={{ background: 'rgba(59,130,246,0.03)', borderColor: 'rgba(59,130,246,0.12)' }}>
                                        <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <BarChart3 size={14} /> Presentation
                                        </h4>
                                        <div className="space-y-4">
                                            <CriteriaBar label="Presentation" value={selectedEval.presentation} color="#3b82f6" />
                                            <CriteriaBar label="Explanation" value={selectedEval.explanation} color="#3b82f6" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Areas for Improvement */}
                            {selectedEval.improvements && selectedEval.improvements.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <AlertCircle size={14} className="text-orange-400" />
                                        Areas for Improvement
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedEval.improvements.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-3 bg-orange-50/40 rounded-xl p-3 border border-orange-100/50">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                                                <p className="text-sm text-gray-700 font-medium">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Status for Pending */}
                            {selectedEval.status === 'Pending' && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
                                        <Clock size={28} className="text-orange-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">Evaluation Pending</h3>
                                    <p className="text-sm text-gray-400 mt-1">Your instructor has not yet completed the evaluation for this activity.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal animation keyframes */}
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.96) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default StudentEvaluationModule;
