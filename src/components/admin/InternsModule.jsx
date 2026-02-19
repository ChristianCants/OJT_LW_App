import React, { useState, useEffect } from 'react';
import { getAllInternProfiles, getDashboardStats } from '../../services';
import {
    Plus, X, Users, Calendar, GraduationCap,
    ChevronRight, Search, Filter, MoreHorizontal,
    Clock, UserCheck, UserX, Briefcase, ArrowLeft,
    Mail, Phone, MapPin, MoreVertical, Eye
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

/* ── Interns Data (State) ────────────────────────────────── */

const InternsModule = ({ onAddIntern }) => {
    const [batches, setBatches] = useState(initialBatches);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [interns, setInterns] = useState([]);
    const [stats, setStats] = useState({ totalInterns: 0, activeInterns: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedIntern, setSelectedIntern] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [form, setForm] = useState({
        name: '', department: '', startDate: '', endDate: '', totalInterns: '', description: '',
    });

    const fetchInterns = async () => {
        setLoading(true);
        const { data, error } = await import('../../services').then(m => m.getAllInternProfiles());
        if (!error && data) {
            setInterns(data.map(i => ({
                ...i,
                name: `${i.first_name} ${i.last_name}`,
                status: i.status || 'Active',
                avatar: i.avatar_url || `https://ui-avatars.com/api/?name=${i.first_name}+${i.last_name}&background=random`
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const statsRes = await import('../../services').then(m => m.getDashboardStats());
            if (statsRes.data) {
                setStats(statsRes.data);
            }
            await fetchInterns();
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleEditClick = (intern) => {
        setEditForm({
            ...intern,
            devices: intern.devices ? intern.devices.map(d => ({ ...d })) : []
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm(null);
    };

    const handleSaveEdit = async () => {
        const { updateInternProfile, updateDevice } = await import('../../services');

        // Update profile fields
        const { error: profileError } = await updateInternProfile(editForm.id, {
            first_name: editForm.name.split(' ')[0],
            last_name: editForm.name.split(' ').slice(1).join(' '),
            school: editForm.school,
            course: editForm.course,
            mobile_number: editForm.mobile_number,
            address: editForm.address,
            gender: editForm.gender,
            civil_status: editForm.civil_status,
            required_ojt_hours: editForm.required_ojt_hours
        });

        if (profileError) {
            alert('Failed to update profile: ' + profileError.message);
            return;
        }

        // Update devices
        if (editForm.devices && editForm.devices.length > 0) {
            const deviceUpdates = editForm.devices.map(device =>
                updateDevice(device.id, {
                    device_type: device.device_type,
                    serial_number: device.serial_number
                })
            );

            const results = await Promise.all(deviceUpdates);
            const deviceError = results.find(r => r.error);
            if (deviceError) {
                alert('Profile updated, but failed to update some devices: ' + deviceError.error.message);
            }
        }

        setIsEditing(false);
        setEditForm(null);
        await fetchInterns();
        // Update selectedIntern to show updated data in modal
        const updatedIntern = { ...selectedIntern, ...editForm };
        setSelectedIntern(updatedIntern);
    };

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
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-400">Loading interns...</td>
                                    </tr>
                                ) : interns.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-400">No interns found.</td>
                                    </tr>
                                ) : interns.map((intern) => (
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
                    { label: 'Total Interns', value: stats.totalInterns, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { label: 'Completed', value: 0, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
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

            {/* Batch / Interns List */}
            {batches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredBatches.map(batch => (
                        <div
                            key={batch.id}
                            onClick={() => setSelectedBatch(batch)}
                            className="p-6 hover:scale-[1.01] transition-transform cursor-pointer group relative overflow-hidden"
                            style={glassCard}
                        >
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
            ) : (
                <div style={glassCard} className="overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200/50 flex justify-between items-center bg-white/30">
                        <h3 className="font-bold text-lg text-gray-900">All Registered Interns</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200/50">
                                    <th className="px-6 py-4">Intern</th>
                                    <th className="px-6 py-4">Batch</th>
                                    <th className="px-6 py-4">School & Course</th>
                                    <th className="px-6 py-4">Devices</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/40 text-sm">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading interns...</td></tr>
                                ) : interns.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No interns found in database.</td></tr>
                                ) : interns.map((intern) => (
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
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900 font-bold">{intern.ojt_program || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-gray-900 truncate max-w-[150px]">{intern.school || 'N/A'}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[150px]">{intern.course || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {intern.devices && intern.devices.length > 0 ? (
                                                    intern.devices.map((device, idx) => (
                                                        <span key={idx} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
                                                            {device.device_type}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-[10px]">No devices</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedIntern(intern)}
                                                className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 font-bold text-xs transition-colors border border-emerald-100"
                                            >
                                                <Eye size={14} /> View more
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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

            {/* Intern Detail Modal */}
            {selectedIntern && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center p-4"
                    style={glassOverlay}
                    onClick={() => setSelectedIntern(null)}
                >
                    <div
                        className="w-full max-w-2xl overflow-hidden relative"
                        style={{
                            ...glassCard,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(32px) saturate(2)',
                            WebkitBackdropFilter: 'blur(32px) saturate(2)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative h-32 bg-gradient-to-r from-emerald-600 to-green-500 p-8 flex items-end">
                            <button
                                onClick={() => {
                                    if (isEditing) handleCancelEdit();
                                    setSelectedIntern(null);
                                }}
                                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-4 translate-y-12">
                                <img
                                    src={selectedIntern.avatar}
                                    className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl bg-gray-100"
                                    alt={selectedIntern.name}
                                />
                                <div className="pb-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            className="text-2xl font-extrabold text-gray-900 bg-white/50 border-b-2 border-emerald-500 outline-none px-2 py-0.5"
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-extrabold text-gray-900 drop-shadow-sm">{selectedIntern.name}</h2>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-emerald-700 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded inline-block">
                                            {selectedIntern.ojt_program} • {selectedIntern.status}
                                        </p>
                                        {!isEditing && (
                                            <button
                                                onClick={() => handleEditClick(selectedIntern)}
                                                className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-white shadow-sm px-2 py-1 rounded-lg border border-emerald-100 transition-all active:scale-95"
                                            >
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 pt-16">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Academic Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <GraduationCap size={18} className="text-emerald-500 mt-0.5" />
                                                <div className="flex-1">
                                                    {isEditing ? (
                                                        <div className="space-y-2">
                                                            <input
                                                                type="text"
                                                                value={editForm.school}
                                                                onChange={e => setEditForm({ ...editForm, school: e.target.value })}
                                                                className="w-full text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500"
                                                                placeholder="School Name"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editForm.course}
                                                                onChange={e => setEditForm({ ...editForm, course: e.target.value })}
                                                                className="w-full text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500"
                                                                placeholder="Course/Degree"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm font-bold text-gray-900">{selectedIntern.school}</p>
                                                            <p className="text-xs text-gray-500">{selectedIntern.course}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock size={18} className="text-blue-500" />
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={editForm.required_ojt_hours}
                                                            onChange={e => setEditForm({ ...editForm, required_ojt_hours: e.target.value })}
                                                            className="w-20 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500"
                                                        />
                                                        <span className="text-xs text-gray-400 font-bold uppercase">Hours Required</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm font-bold text-gray-900">Required: {selectedIntern.required_ojt_hours} hrs</p>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Personal Info</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                                <p className="text-[10px] font-extrabold text-gray-400 uppercase">Gender</p>
                                                {isEditing ? (
                                                    <select
                                                        value={editForm.gender}
                                                        onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                                                        className="w-full text-sm font-bold text-gray-900 bg-transparent outline-none mt-0.5"
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                ) : (
                                                    <p className="text-sm font-bold text-gray-900">{selectedIntern.gender}</p>
                                                )}
                                            </div>
                                            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                                <p className="text-[10px] font-extrabold text-gray-400 uppercase">Civil Status</p>
                                                {isEditing ? (
                                                    <select
                                                        value={editForm.civil_status}
                                                        onChange={e => setEditForm({ ...editForm, civil_status: e.target.value })}
                                                        className="w-full text-sm font-bold text-gray-900 bg-transparent outline-none mt-0.5"
                                                    >
                                                        <option value="Single">Single</option>
                                                        <option value="Married">Married</option>
                                                        <option value="Divorced">Divorced</option>
                                                        <option value="Widowed">Widowed</option>
                                                    </select>
                                                ) : (
                                                    <p className="text-sm font-bold text-gray-900">{selectedIntern.civil_status}</p>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Contact & Address</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Mail size={16} className="text-emerald-500" />
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        value={editForm.email}
                                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                        className="flex-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-gray-900">{selectedIntern.email}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone size={16} className="text-emerald-500" />
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.mobile_number}
                                                        onChange={e => setEditForm({ ...editForm, mobile_number: e.target.value })}
                                                        className="flex-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-gray-900">{selectedIntern.mobile_number}</p>
                                                )}
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin size={16} className="text-emerald-500 mt-1" />
                                                {isEditing ? (
                                                    <textarea
                                                        value={editForm.address}
                                                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                                        className="flex-1 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500 h-16 resize-none"
                                                    />
                                                ) : (
                                                    <p className="text-sm font-bold text-gray-900">{selectedIntern.address}</p>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Assigned Devices</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {isEditing ? (
                                                editForm.devices && editForm.devices.length > 0 ? (
                                                    editForm.devices.map((device, idx) => (
                                                        <div key={idx} className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100 w-full space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <Briefcase size={16} className="text-blue-500" />
                                                                <input
                                                                    type="text"
                                                                    value={device.device_type}
                                                                    onChange={e => {
                                                                        const newDevices = [...editForm.devices];
                                                                        newDevices[idx].device_type = e.target.value;
                                                                        setEditForm({ ...editForm, devices: newDevices });
                                                                    }}
                                                                    className="flex-1 text-sm font-bold text-blue-900 bg-transparent outline-none border-b border-blue-200 focus:border-blue-500"
                                                                    placeholder="Device Model (e.g. Laptop)"
                                                                />
                                                            </div>
                                                            <div className="pl-7">
                                                                <input
                                                                    type="text"
                                                                    value={device.serial_number}
                                                                    onChange={e => {
                                                                        const newDevices = [...editForm.devices];
                                                                        newDevices[idx].serial_number = e.target.value;
                                                                        setEditForm({ ...editForm, devices: newDevices });
                                                                    }}
                                                                    className="w-full text-[10px] text-blue-400 font-bold uppercase bg-transparent outline-none border-b border-blue-100 focus:border-blue-400"
                                                                    placeholder="Serial Number"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 w-full text-center">
                                                        <p className="text-xs font-bold text-gray-400 tracking-wide uppercase">No devices assigned</p>
                                                    </div>
                                                )
                                            ) : (
                                                selectedIntern.devices && selectedIntern.devices.length > 0 ? (
                                                    selectedIntern.devices.map((device, idx) => (
                                                        <div key={idx} className="p-3 rounded-2xl bg-blue-50 border border-blue-100 w-full flex items-center gap-3">
                                                            <Briefcase size={16} className="text-blue-500" />
                                                            <div>
                                                                <p className="text-sm font-bold text-blue-900">{device.device_type}</p>
                                                                <p className="text-[10px] text-blue-400 font-bold uppercase">{device.serial_number}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 w-full text-center">
                                                        <p className="text-xs font-bold text-gray-400 tracking-wide uppercase">No devices assigned</p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </section>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="flex-1 py-3 bg-[#15803d] text-white font-extrabold text-sm rounded-2xl hover:bg-[#166534] transition-colors shadow-lg shadow-green-900/15"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex-1 py-3 bg-white text-gray-600 font-extrabold text-sm rounded-2xl hover:bg-gray-50 transition-colors border border-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setSelectedIntern(null)}
                                        className="w-full py-3 rounded-2xl bg-gray-900 text-white font-extrabold text-sm hover:bg-black transition-colors"
                                    >
                                        Close Details
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternsModule;
