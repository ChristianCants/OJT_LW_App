import {
    Plus,
    ArrowUpRight,
    MoreHorizontal,
    Briefcase,
    FileText,
    CheckCircle2,
    Pause,
    Target,
    Zap
} from 'lucide-react';

/* ── Reusable glass card style ──────────────────────────── */
const glassCard = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 8px 32px rgba(31,38,135,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
    borderRadius: '24px',
};

const DashboardOverview = () => {
    // ── Data ────────────────────────────────────────────────
    const stats = [
        { label: 'Total Interns', value: 0, subtitle: 'No data', trend: '0', isPrimary: true },
        { label: 'Ended Internships', value: 0, subtitle: 'No data', trend: '0', isPrimary: false },
        { label: 'Active Interns', value: 0, subtitle: 'No data', trend: '0', isPrimary: false },
        { label: 'Pending Applications', value: 0, subtitle: 'No data', trend: null, isPrimary: false },
    ];

    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const upcomingTasks = [];

    const teamMembers = [];

    const statusColor = (s) => {
        if (s === 'Completed') return 'bg-green-100 text-green-700 border-green-200';
        if (s === 'In Progress') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-red-100 text-red-700 border-red-200';
    };

    return (
        <div className="w-full pb-8 space-y-6">
            {/* ─── Header ──────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-[28px] font-extrabold text-gray-900 drop-shadow-sm">Dashboard</h1>
                    <p className="text-gray-500 mt-1 text-sm">Plan, prioritize, and accomplish your tasks with ease.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        className="px-5 py-2.5 text-sm font-bold text-gray-700 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
                        style={glassCard}
                    >
                        Import Data
                    </button>
                </div>
            </div>

            {/* ─── Stats Row ───────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((s, i) => (
                    s.isPrimary ? (
                        <div
                            key={i}
                            className="p-5 rounded-3xl relative overflow-hidden text-white hover:scale-[1.015] transition-transform bg-[#15803d]"
                        >
                            <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-sm font-semibold text-green-200">{s.label}</span>
                                <button className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors">
                                    <ArrowUpRight size={14} className="text-white" />
                                </button>
                            </div>
                            <h2 className="text-4xl font-extrabold relative z-10">{s.value}</h2>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-white/20 inline-flex items-center gap-0.5">
                                    <ArrowUpRight size={10} />{s.trend}
                                </span>
                                <span className="text-xs text-green-300">{s.subtitle}</span>
                            </div>
                        </div>
                    ) : (
                        <div
                            key={i}
                            className="p-5 hover:scale-[1.015] transition-transform"
                            style={glassCard}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-sm font-semibold text-gray-500">{s.label}</span>
                                <button className="p-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors">
                                    <ArrowUpRight size={14} className="text-gray-400" />
                                </button>
                            </div>
                            <h2 className="text-4xl font-extrabold text-gray-900">{s.value}</h2>
                            <div className="flex items-center gap-1.5 mt-2">
                                {s.trend && (
                                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-green-100 text-green-700 inline-flex items-center gap-0.5">
                                        <ArrowUpRight size={10} />{s.trend}
                                    </span>
                                )}
                                <span className="text-xs text-gray-400">{s.subtitle}</span>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* ─── Mid Section ──────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Intern Analytics */}
                <div className="lg:col-span-5 p-6" style={glassCard}>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-lg text-gray-900">Intern Analytics</h3>
                        <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal size={20} /></button>
                    </div>
                    <div className="h-44 flex items-end gap-3 px-1">
                        {weeklyData.map((v, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-white/30 rounded-2xl relative h-full overflow-hidden">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 rounded-2xl transition-all duration-500"
                                        style={{
                                            height: `${v}%`,
                                            background: v === 90
                                                ? 'linear-gradient(to top, #14532d, #15803d)'
                                                : '#14532d',
                                        }}
                                    >
                                        {v === 90 && (
                                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 bg-white text-[#14532d] text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow">
                                                74%
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 opacity-[0.07] rounded-2xl pointer-events-none"
                                        style={{ backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,0.4) 4px, rgba(0,0,0,0.4) 5px)` }} />
                                </div>
                                <span className="text-[11px] font-semibold text-gray-400">{dayLabels[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reminders */}
                <div className="lg:col-span-4 p-6 flex flex-col" style={glassCard}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-900">Reminders</h3>
                        <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal size={20} /></button>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h4 className="font-bold text-gray-900 text-xl leading-tight">Meeting with Arc<br />Company</h4>
                            <p className="text-sm text-gray-400 mt-2">Time : 02.00 pm - 04.00 pm</p>
                        </div>
                        <button className="mt-6 w-full py-3.5 bg-[#14532d] text-white rounded-2xl font-bold text-sm hover:bg-[#166534] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/10">
                            <Briefcase size={16} />
                            Start Meeting
                        </button>
                    </div>
                </div>

                {/* Project (Tasks) */}
                <div className="lg:col-span-3 p-6" style={glassCard}>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="font-bold text-lg text-gray-900">Project</h3>
                        <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-500 bg-white/40 rounded-lg hover:bg-white/60 transition-colors border border-white/30">
                            <Plus size={12} /> New
                        </button>
                    </div>
                    <div className="space-y-5">
                        {upcomingTasks.map((t, i) => (
                            <div key={i} className="flex items-start gap-3 group cursor-pointer">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.bg} ${t.color} group-hover:scale-105 transition-transform`}>
                                    <t.icon size={16} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[13px] font-bold text-gray-900 truncate">{t.title}</h4>
                                    <p className="text-[11px] text-gray-400">Due date: {t.due}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Bottom Section ───────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Team Collaboration */}
                <div className="lg:col-span-5 p-6" style={glassCard}>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="font-bold text-lg text-gray-900">Team Collaboration</h3>
                        <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-500 bg-white/40 rounded-lg hover:bg-white/60 transition-colors border border-white/30">
                            <Plus size={12} /> Add Member
                        </button>
                    </div>
                    <div className="space-y-5">
                        {teamMembers.map((m, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <img src={m.img} alt={m.name} className="w-10 h-10 rounded-full border-2 border-white shadow" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900 truncate">{m.name}</h4>
                                    <p className="text-xs text-gray-400 truncate">Working on <span className="font-semibold text-gray-600">{m.task}</span></p>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap ${statusColor(m.status)}`}>
                                    {m.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Batch Progress */}
                <div className="lg:col-span-4 p-6 flex flex-col items-center" style={glassCard}>
                    <div className="w-full mb-4">
                        <h3 className="font-bold text-lg text-gray-900">Batch Progress</h3>
                    </div>
                    <div className="relative w-44 h-44 flex items-center justify-center my-2">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="88" cy="88" r="76" strokeWidth="18" fill="none" stroke="rgba(255,255,255,0.3)" />
                            <circle cx="88" cy="88" r="76" strokeWidth="18" fill="none" stroke="#14532d"
                                strokeDasharray={`${0.41 * 2 * Math.PI * 76} ${2 * Math.PI * 76}`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[38px] font-extrabold text-gray-900 leading-none">41%</span>
                            <span className="text-xs text-gray-400 font-medium mt-1">Project Ended</span>
                        </div>
                    </div>
                    <div className="flex gap-5 mt-4">
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#14532d]" /><span className="text-[11px] font-semibold text-gray-500">Completed</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-gray-700" /><span className="text-[11px] font-semibold text-gray-500">In Progress</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-gray-300" /><span className="text-[11px] font-semibold text-gray-500">Pending</span></div>
                    </div>
                </div>

                {/* Time Tracker */}
                <div className="lg:col-span-3 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[280px]"
                    style={{ background: 'linear-gradient(145deg, #052e16 0%, #14532d 50%, #15803d 100%)' }}
                >
                    <div className="absolute top-0 right-0 w-56 h-56 bg-[#15803d] rounded-full -mr-20 -mt-20 blur-3xl opacity-40" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#166534] rounded-full -ml-16 -mb-16 blur-3xl opacity-30" />
                    <div className="absolute top-8 right-6 w-28 h-28 border-4 border-white/5 rounded-full" />
                    <div className="absolute bottom-12 left-4 w-20 h-20 border-4 border-white/5 rounded-full" />

                    <div className="relative z-10">
                        <h3 className="font-bold text-xl">Time Tracker</h3>
                    </div>
                    <div className="relative z-10 text-center my-4">
                        <span className="text-5xl font-mono font-bold tracking-widest">01:24:08</span>
                    </div>
                    <div className="relative z-10 flex justify-center gap-4">
                        <button className="w-14 h-14 rounded-full bg-white text-[#052e16] flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                            <Pause size={22} fill="currentColor" />
                        </button>
                        <button className="w-14 h-14 rounded-full bg-[#ef4444] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-red-500/30">
                            <div className="w-5 h-5 rounded-sm bg-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
