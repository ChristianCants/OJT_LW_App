import React, { useState } from 'react';
import {
    Plus, X, Users, Calendar, GraduationCap,
    ChevronRight, Search, Filter, MoreHorizontal,
    Clock, UserCheck, UserX, Briefcase, ArrowLeft,
    Mail, Phone, MapPin, MoreVertical
} from 'lucide-react';

/* ── Glass style ─────────────────────────────────────────── */
const glassCard = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 8px 32px rgba(31,38,135,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
    borderRadius: '24px',
};

const glassOverlay = {
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
};

/* ── Initial mock batches ────────────────────────────────── */
const initialBatches = [];

/* ── Mock Interns Data ───────────────────────────────────── */
const mockInterns = [];

const InternsModule = ({ onAddIntern }) => {
    const [batches, setBatches] = useState(initialBatches);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [form, setForm] = useState({
        name: '', department: '', startDate: '', endDate: '', totalInterns: '', description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBatch = {
            id: Date.now(),
            name: form.name,
            department: form.department,
            startDate: form.startDate,
            endDate: form.endDate,
            totalInterns: parseInt(form.totalInterns) || 0,
            activeInterns: parseInt(form.totalInterns) || 0,
            completedInterns: 0,
            status: 'Active',
        };
        setBatches([newBatch, ...batches]);
        setForm({ name: '', department: '', startDate: '', endDate: '', totalInterns: '', description: '' });
        setShowModal(false);
    };

    const filteredBatches = batches.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'All' || b.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const activeBatches = batches.filter(b => b.status === 'Active').length;
    const activeInterns = batches.reduce((sum, b) => sum + b.activeInterns, 0);
    const completedInternsCount = batches.reduce((sum, b) => sum + b.completedInterns, 0);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const statusBadge = (status) => {
        if (status === 'Active') return 'bg-green-100 text-green-700 border-green-200';
        if (status === 'Completed') return 'bg-blue-100 text-blue-700 border-blue-200';
        if (status === 'On Leave') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-gray-100 text-gray-600 border-gray-200';
    };

    // ─── Render Batch Detail View ─────────────────────────
    if (selectedBatch) {
        return (
            <div className="w-full pb-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedBatch(null)}
                            className="w-10 h-10 rounded-xl bg-white/40 border border-white/30 flex items-center justify-center hover:bg-white/60 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-[24px] font-extrabold text-gray-900">{selectedBatch.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge(selectedBatch.status)}`}>
                                    {selectedBatch.status}
                                </span>
                                <span>•</span>
                                <span>{selectedBatch.department}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2.5 rounded-xl bg-white/40 border border-white/30 text-gray-600 hover:bg-white/60 transition-colors">
                            <MoreVertical size={20} />
                        </button>
                        <button
                            onClick={onAddIntern}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#15803d] text-white rounded-xl text-sm font-bold hover:bg-[#166534] transition-colors shadow-lg shadow-green-900/15"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            Add Intern
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 flex items-center gap-4" style={glassCard}>
                        <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                            <Users size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total Interns</p>
                            <p className="text-2xl font-extrabold text-gray-900">{selectedBatch.totalInterns}</p>
                        </div>
                    </div>
                    <div className="p-5 flex items-center gap-4" style={glassCard}>
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Calendar size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Timeline</p>
                            <p className="text-sm font-bold text-gray-900">{formatDate(selectedBatch.startDate)}</p>
                            <p className="text-xs text-gray-500">to {formatDate(selectedBatch.endDate)}</p>
                        </div>
                    </div>
                    <div className="p-5 flex items-center gap-4" style={glassCard}>
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                            <Briefcase size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Department</p>
                            <p className="text-base font-bold text-gray-900 truncate">{selectedBatch.department}</p>
                        </div>
                    </div>
                </div>

                {/* Interns List */}
                <div style={glassCard} className="overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200/50 flex justify-between items-center bg-white/30">
                        <h3 className="font-bold text-lg text-gray-900">Enrolled Interns</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search interns..."
                                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-gray-700 bg-white/50 border border-white/40 outline-none focus:ring-1 focus:ring-green-500/30"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200/50">
                                    <th className="px-6 py-4">Intern</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Address</th>
                                    <th className="px-6 py-4">OJT Hours</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/40 text-sm">
                                {mockInterns.map((intern) => (
                                    <tr key={intern.id} className="hover:bg-white/40 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={intern.avatar} alt={intern.name} className="w-9 h-9 rounded-full bg-gray-200" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{intern.name}</p>
                                                    <p className="text-xs text-gray-400">{intern.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{intern.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusBadge(intern.status)}`}>
                                                {intern.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">
                                            {intern.contact_number || intern.phone || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium truncate max-w-[150px]">
                                            {intern.present_address || intern.address || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">
                                            {intern.ojt_hours || '0'} / 600
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200/50 flex justify-between items-center text-xs text-gray-500 bg-white/20">
                        <span>Showing 1-5 of 8 interns</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded-lg bg-white/50 border border-white/40 hover:bg-white/80 transition-colors disabled:opacity-50">Previous</button>
                            <button className="px-3 py-1.5 rounded-lg bg-white/50 border border-white/40 hover:bg-white/80 transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Render Batches Grid (Default) ─────────────────────
    return (
        <div className="w-full pb-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-[28px] font-extrabold text-gray-900 drop-shadow-sm">Interns</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage internship batches and track intern progress.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onAddIntern}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#15803d] text-white rounded-xl text-sm font-bold hover:bg-[#166534] transition-colors shadow-lg shadow-green-900/15"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Add Intern
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm ring-1 ring-gray-200"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Add Batch
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Batches', value: batches.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Active Batches', value: activeBatches, icon: Clock, color: 'text-green-600', bg: 'bg-green-100' },
                    { label: 'Active Interns', value: activeInterns, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { label: 'Completed', value: completedInternsCount, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
                ].map((stat, i) => (
                    <div key={i} className="p-5 flex items-center gap-4" style={glassCard}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search batches..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-400"
                        style={{
                            background: 'rgba(255,255,255,0.5)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255,255,255,0.35)',
                        }}
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Active', 'Completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${filterStatus === status
                                ? 'bg-[#15803d] text-white shadow-lg shadow-green-900/15'
                                : 'text-gray-600 hover:bg-white/50'
                                }`}
                            style={filterStatus !== status ? {
                                background: 'rgba(255,255,255,0.4)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                            } : {}}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Batch Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredBatches.map(batch => (
                    <div
                        key={batch.id}
                        onClick={() => setSelectedBatch(batch)}
                        className="p-6 hover:scale-[1.01] transition-transform cursor-pointer group relative overflow-hidden"
                        style={glassCard}
                    >
                        {/* Hover Highlight */}
                        <div className="absolute inset-0 bg-[#15803d]/0 group-hover:bg-[#15803d]/5 transition-colors duration-300" />

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#15803d] transition-colors">{batch.name}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">{batch.department}</p>
                            </div>
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-lg border ${statusBadge(batch.status)}`}>
                                {batch.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 relative z-10">
                            <Calendar size={14} />
                            <span>{formatDate(batch.startDate)} — {formatDate(batch.endDate)}</span>
                        </div>

                        <div className="mb-4 relative z-10">
                            <div className="flex justify-between text-xs font-semibold mb-2">
                                <span className="text-gray-500">Completion</span>
                                <span className="text-gray-900">
                                    {batch.totalInterns > 0 ? Math.round((batch.completedInterns / batch.totalInterns) * 100) : 0}%
                                </span>
                            </div>
                            <div className="w-full h-2.5 bg-white/40 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#15803d] rounded-full transition-all duration-500"
                                    style={{ width: `${batch.totalInterns > 0 ? (batch.completedInterns / batch.totalInterns) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center relative z-10">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <Users size={14} className="text-gray-400" />
                                    <span className="text-sm font-bold text-gray-900">{batch.totalInterns}</span>
                                    <span className="text-xs text-gray-400">total</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <UserCheck size={14} className="text-green-500" />
                                    <span className="text-sm font-bold text-green-700">{batch.activeInterns}</span>
                                    <span className="text-xs text-gray-400">active</span>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#15803d] transition-colors" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Batch Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    style={glassOverlay}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="w-full max-w-lg p-8 relative"
                        style={{
                            ...glassCard,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(32px) saturate(2)',
                            WebkitBackdropFilter: 'blur(32px) saturate(2)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-extrabold text-gray-900">Add New Batch</h2>
                            <p className="text-sm text-gray-400 mt-1">Create a new internship batch at Lifewood.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* ... (Existing form fields - reused) ... */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Batch Name</label>
                                <input
                                    type="text" required placeholder="e.g. Batch 2025-A"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-green-500/30 transition-all placeholder:text-gray-400 bg-white/60 border border-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Department</label>
                                <input
                                    type="text" required placeholder="e.g. Software Engineering"
                                    value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-green-500/30 transition-all placeholder:text-gray-400 bg-white/60 border border-gray-200"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Start Date</label>
                                    <input
                                        type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-green-500/30 transition-all bg-white/60 border border-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">End Date</label>
                                    <input
                                        type="date" required value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-green-500/30 transition-all bg-white/60 border border-gray-200"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Intern Count</label>
                                <input
                                    type="number" required min="1" placeholder="e.g. 10" value={form.totalInterns} onChange={e => setForm({ ...form, totalInterns: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-green-500/30 transition-all placeholder:text-gray-400 bg-white/60 border border-gray-200"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 py-3 bg-[#15803d] text-white rounded-xl font-bold text-sm hover:bg-[#166534] transition-colors shadow-lg shadow-green-900/15 flex items-center justify-center gap-2">
                                    <Plus size={16} /> Create Batch
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-white/60 transition-colors border border-gray-200">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternsModule;
