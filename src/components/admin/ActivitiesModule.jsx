import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    FileText,
    X,
    Pencil,
    Trash2,
    ChevronDown,
    Upload,
    Tag,
    Users,
    Sparkles,
} from 'lucide-react';

/* ── Status Badge Config ─────────────────────────────────── */
const statusBadgeConfig = {
    Active: {
        label: 'Active',
        bg: 'rgba(0, 180, 80, 0.85)',
        border: 'rgba(0, 220, 100, 0.9)',
        text: '#ffffff',
        shadow: '0 0 14px rgba(0, 255, 100, 0.5)',
    },
    Pending: {
        label: 'Pending',
        bg: 'rgba(230, 140, 0, 0.85)',
        border: 'rgba(255, 165, 0, 0.9)',
        text: '#ffffff',
        shadow: '0 0 14px rgba(255, 165, 0, 0.5)',
    },
    Upcoming: {
        label: 'Upcoming',
        bg: 'rgba(220, 40, 40, 0.85)',
        border: 'rgba(255, 60, 60, 0.9)',
        text: '#ffffff',
        shadow: '0 0 14px rgba(255, 60, 60, 0.5)',
    },
    Completed: {
        label: 'Completed',
        bg: 'rgba(0, 100, 50, 0.85)',
        border: 'rgba(0, 140, 70, 0.9)',
        text: '#ffffff',
        shadow: '0 0 14px rgba(0, 128, 60, 0.45)',
    },
    Paused: {
        label: 'Paused',
        bg: 'rgba(230, 140, 0, 0.85)',
        border: 'rgba(255, 165, 0, 0.9)',
        text: '#ffffff',
        shadow: '0 0 14px rgba(255, 165, 0, 0.5)',
    },
};

/* ── Gradient Presets (Aesthetic Palettes) ─────────────────── */
const gradientPresets = [
    { label: 'Midnight Iris', from: '#262B42', to: '#816EC7' },
    { label: 'Dusty Rose', from: '#E5989B', to: '#FFCDB2' },
    { label: 'Deep Ocean', from: '#006078', to: '#82BAC4' },
    { label: 'Warm Coral', from: '#E37C78', to: '#FFC5A6' },
    { label: 'Lavender Mist', from: '#A27CB8', to: '#E3E4FA' },
    { label: 'Sage & Sand', from: '#82BAC4', to: '#DCBE90' },
    { label: 'Berry Wine', from: '#800000', to: '#F98B68' },
    { label: 'Forest Depths', from: '#137054', to: '#54A7A2' },
    { label: 'Mauve Twilight', from: '#5B545F', to: '#A97B82' },
    { label: 'Sunset Glow', from: '#F98B68', to: '#FCDDD3' },
    { label: 'Frosted Sage', from: '#8BA9B3', to: '#E8F3F2' },
    { label: 'Blush Peony', from: '#FFB4A2', to: '#E3E4FA' },
];

function buildGradient(colors) {
    return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
}

/* ── Mock Avatars ────────────────────────────────────────── */
const avatarColors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

/* ── Reusable Glass Styles ──────────────────────────────── */
const glassPanel = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
};

const glassCard = {
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
};

const glassCardBody = {
    background: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
};

const glassModal = {
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
};

/* ── Initial Data ─────────────────────────────────────────── */
const initialActivities = [
    {
        id: 1,
        title: 'Instagram Marketing Hacks',
        type: 'Activity',
        status: 'Active',
        points: 100,
        description: 'Enhancing Learning Engagement through thoughtful UI/UX',
        tags: ['Prototyping', 'Not Urgent'],
        colors: ['#262B42', '#816EC7'],
        progress: 0,
        assignedUsers: ['Alice R.', 'Bob T.', 'Carol S.']
    },
    {
        id: 2,
        title: 'Google Adsense Hacks',
        type: 'Activity',
        status: 'Active',
        points: 150,
        description: 'Mastering the art of monetization and ad placement strategies.',
        tags: ['Marketing', 'Urgent'],
        colors: ['#E37C78', '#FFC5A6'],
        progress: 15,
        assignedUsers: ['Dave M.', 'Eve L.']
    },
    {
        id: 3,
        title: 'Hit A Backhand Like Pro',
        type: 'Activity',
        status: 'Active',
        points: 200,
        description: 'Sports analytics and mechanics breakdown for interns.',
        tags: ['Sports', 'Recreation'],
        colors: ['#E5989B', '#FFCDB2'],
        progress: 0,
        assignedUsers: ['Frank P.', 'Grace K.', 'Hank J.', 'Ivy N.']
    },
    {
        id: 4,
        title: 'Digital Marketing Skills',
        type: 'Activity',
        status: 'Active',
        points: 120,
        description: 'Comprehensive guide to modern digital marketing tools.',
        tags: ['SEO', 'Content'],
        colors: ['#137054', '#54A7A2'],
        progress: 5,
        assignedUsers: ['Jack W.', 'Karen Z.']
    },
    {
        id: 5,
        title: 'Planet Orbit around the world',
        type: 'Activity',
        status: 'Completed',
        points: 300,
        description: 'Physics simulation and orbital mechanics fundamentals.',
        tags: ['Physics', 'Science'],
        colors: ['#A27CB8', '#E3E4FA'],
        progress: 100,
        assignedUsers: ['Leo B.', 'Mia C.', 'Noah D.', 'Olivia E.', 'Paul F.']
    },
    {
        id: 6,
        title: 'Newton\'s Law of Gravitation',
        type: 'Activity',
        status: 'Completed',
        points: 250,
        description: 'Understanding the core forces that govern our universe.',
        tags: ['Physics', 'Math'],
        colors: ['#800000', '#F98B68'],
        progress: 100,
        assignedUsers: ['Quinn G.', 'Rosa H.', 'Sam I.']
    },
    {
        id: 7,
        title: 'Visibility of system status',
        type: 'Activity',
        status: 'Upcoming',
        points: 100,
        description: 'Heuristic evaluation principles for UI/UX designers.',
        tags: ['UX', 'Heuristics'],
        colors: ['#5B545F', '#A97B82'],
        progress: 0,
        assignedUsers: ['Uma Q.']
    },
    {
        id: 8,
        title: 'Einstein\'s General Relativity',
        type: 'Activity',
        status: 'Paused',
        points: 500,
        description: 'Advanced concepts in space-time and gravity.',
        tags: ['Advanced', 'Physics'],
        colors: ['#006078', '#82BAC4'],
        progress: 45,
        assignedUsers: ['Vera R.', 'Will S.', 'Xena T.', 'Yuri U.', 'Zoe V.', 'Amy W.']
    },
];

/* ── Empty Form State ─────────────────────────────────────── */
const emptyForm = {
    title: '',
    type: 'Activity',
    status: 'Active',
    points: 100,
    description: '',
    tags: '',
    colorIndex: 0,
    assignedUsers: '',
};

/* ── Card Context Menu ────────────────────────────────────── */
function CardMenu({ onEdit, onDelete }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors text-white"
            >
                <MoreVertical size={16} />
            </button>
            {open && (
                <div
                    className="absolute left-0 top-10 z-50 min-w-[140px] rounded-2xl overflow-hidden animate-fade-in-up"
                    style={glassModal}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-purple-50/60 transition-colors"
                    >
                        <Pencil size={14} /> Edit
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50/60 transition-colors"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            )}
        </div>
    );
}

/* ── Activity Form Modal (Dark Two-Column Layout) ─────────── */
function ActivityFormModal({ isOpen, mode, initialData, onClose, onSave }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        if (mode === 'edit' && initialData) {
            const matchIdx = gradientPresets.findIndex(
                g => g.from === initialData.colors?.[0] && g.to === initialData.colors?.[1]
            );
            setForm({
                title: initialData.title,
                type: initialData.type,
                status: initialData.status,
                points: initialData.points,
                description: initialData.description,
                tags: initialData.tags.join(', '),
                colorIndex: matchIdx >= 0 ? matchIdx : 0,
                assignedUsers: (initialData.assignedUsers || []).join(', '),
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
        setFileName('');
    }, [isOpen, mode, initialData]);

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.description.trim()) e.description = 'Description is required';
        if (!form.points || form.points < 0) e.points = 'Points must be positive';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        const preset = gradientPresets[form.colorIndex] || gradientPresets[0];
        onSave({
            title: form.title.trim(),
            type: form.type,
            status: form.status,
            points: Number(form.points),
            description: form.description.trim(),
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            colors: [preset.from, preset.to],
            progress: mode === 'edit' ? (initialData?.progress ?? 0) : 0,
            assignedUsers: form.assignedUsers.split(',').map(u => u.trim()).filter(Boolean),
            fileName: fileName || null,
        });
    };

    if (!isOpen) return null;

    const preset = gradientPresets[form.colorIndex] || gradientPresets[0];
    const previewGradient = `linear-gradient(135deg, ${preset.from}, ${preset.to})`;
    const previewTags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const darkCard = {
        background: 'rgba(20, 22, 30, 0.92)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
    };
    const darkInput = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white outline-none placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all';
    const darkSelect = 'w-full px-4 py-3 rounded-xl bg-[#1a1c26] border border-white/10 text-sm font-medium text-white outline-none appearance-none cursor-pointer focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all [&>option]:bg-[#1a1c26] [&>option]:text-white';
    const labelClass = 'block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-[960px] max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in-up rounded-[28px] p-6"
                style={{ background: 'rgba(12, 13, 20, 0.96)', border: '1px solid rgba(255,255,255,0.06)' }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: previewGradient }}>
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight">
                            {mode === 'edit' ? 'Edit Activity' : 'Create New Activity'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                        {/* ═══ LEFT COLUMN ═══ */}
                        <div className="lg:col-span-2 flex flex-col gap-5">

                            {/* Live Card Preview */}
                            <div style={darkCard} className="p-5 flex flex-col gap-4">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Card Preview</p>
                                <div className="rounded-2xl overflow-hidden" style={{ background: previewGradient }}>
                                    <div className="p-5 min-h-[130px] flex flex-col justify-between relative">
                                        <div className="flex justify-between items-start">
                                            <div className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase"
                                                style={{
                                                    background: (statusBadgeConfig[form.status] || statusBadgeConfig.Active).bg,
                                                    color: '#fff',
                                                    border: `1px solid ${(statusBadgeConfig[form.status] || statusBadgeConfig.Active).border}`,
                                                }}>
                                                {form.status}
                                            </div>
                                            <span className="text-[10px] font-bold text-white/70">{form.points} pts</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white leading-tight drop-shadow-md">
                                                {form.title || 'Activity Title'}
                                            </h4>
                                            {previewTags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {previewTags.slice(0, 3).map(t => (
                                                        <span key={t} className="px-2 py-0.5 rounded-md bg-black/20 text-white/80 text-[9px] font-bold">{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Color Swatches */}
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Choose Color</p>
                                    <div className="flex flex-wrap gap-2">
                                        {gradientPresets.map((g, i) => (
                                            <button
                                                key={g.label}
                                                type="button"
                                                onClick={() => setForm(f => ({ ...f, colorIndex: i }))}
                                                title={g.label}
                                                className={`w-8 h-8 rounded-lg transition-all duration-200 ${form.colorIndex === i ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#0c0d14] scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'}`}
                                                style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Type, Status, Tags, Points */}
                            <div style={darkCard} className="p-5 flex flex-col gap-4">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Configuration</p>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Type</label>
                                        <div className="relative">
                                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={darkSelect}>
                                                <option value="Activity">Activity</option>
                                                <option value="Workshop">Workshop</option>
                                                <option value="Project">Project</option>
                                                <option value="Assessment">Assessment</option>
                                                <option value="Task">Task</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Status</label>
                                        <div className="relative">
                                            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={darkSelect}>
                                                {Object.keys(statusBadgeConfig).map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Points</label>
                                    <input
                                        type="number" min={0}
                                        value={form.points}
                                        onChange={e => setForm(f => ({ ...f, points: e.target.value }))}
                                        className={`${darkInput} ${errors.points ? '!border-red-500/50' : ''}`}
                                    />
                                    {errors.points && <p className="text-xs text-red-400 mt-1 font-semibold">{errors.points}</p>}
                                </div>

                                <div>
                                    <label className={labelClass}>Tags</label>
                                    <div className="relative">
                                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="text"
                                            value={form.tags}
                                            onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                                            placeholder="Marketing, Urgent"
                                            className={`${darkInput} pl-9`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ═══ RIGHT COLUMN (Big Box) ═══ */}
                        <div className="lg:col-span-3" style={darkCard}>
                            <div className="p-6 flex flex-col gap-5 h-full">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Activity Details</p>

                                {/* Title */}
                                <div>
                                    <label className={labelClass}>Title</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="e.g. Advanced React Patterns"
                                        className={`${darkInput} text-base ${errors.title ? '!border-red-500/50' : ''}`}
                                    />
                                    {errors.title && <p className="text-xs text-red-400 mt-1 font-semibold">{errors.title}</p>}
                                </div>

                                {/* Description */}
                                <div className="flex-1">
                                    <label className={labelClass}>Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Describe the activity, objectives, and what users will see..."
                                        rows={5}
                                        className={`${darkInput} resize-none ${errors.description ? '!border-red-500/50' : ''}`}
                                    />
                                    {errors.description && <p className="text-xs text-red-400 mt-1 font-semibold">{errors.description}</p>}
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className={labelClass}>File / Attachment</label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setFileName(file.name);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed border-white/10 hover:border-indigo-500/40 bg-white/[0.02] hover:bg-indigo-500/5 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-indigo-500/10 flex items-center justify-center transition-colors">
                                            <Upload size={18} className="text-gray-500 group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                        <div className="text-left">
                                            {fileName ? (
                                                <p className="text-sm font-semibold text-indigo-300">{fileName}</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-semibold text-gray-400 group-hover:text-gray-300 transition-colors">
                                                        Click to upload a file
                                                    </p>
                                                    <p className="text-[11px] text-gray-600">PDF, DOC, images, or video</p>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>

                                {/* Assigned Users */}
                                <div>
                                    <label className={labelClass}>Assign Users</label>
                                    <div className="relative">
                                        <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="text"
                                            value={form.assignedUsers}
                                            onChange={e => setForm(f => ({ ...f, assignedUsers: e.target.value }))}
                                            placeholder="Alice R., Bob T., Carol S."
                                            className={`${darkInput} pl-9`}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-2 mt-auto">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg hover:shadow-xl hover:brightness-110"
                                        style={{ background: previewGradient }}
                                    >
                                        {mode === 'edit' ? 'Save Changes' : 'Create Activity'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Delete Confirmation Modal ────────────────────────────── */
function DeleteConfirmModal({ isOpen, activityTitle, onClose, onConfirm }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-[28px] p-8 animate-fade-in-up text-center" style={glassModal}>
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg font-black text-gray-800 mb-2">Delete Activity?</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">
                    Are you sure you want to delete <span className="font-bold text-gray-700">"{activityTitle}"</span>? This action cannot be undone.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-8 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════ */
/* ── Main Component ───────────────────────────────────────── */
/* ══════════════════════════════════════════════════════════ */
const ActivitiesModule = () => {
    const [activities, setActivities] = useState(initialActivities);
    const [activeTab, setActiveTab] = useState('Active');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [editingActivity, setEditingActivity] = useState(null);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState(null);

    /* Filter Logic */
    const filteredActivities = useMemo(() => {
        let filtered = activities;
        if (activeTab === 'Active') filtered = filtered.filter(a => a.status === 'Active');
        if (activeTab === 'Completed') filtered = filtered.filter(a => a.status === 'Completed');
        if (activeTab === 'Upcoming') filtered = filtered.filter(a => a.status === 'Upcoming');
        if (activeTab === 'Paused') filtered = filtered.filter(a => a.status === 'Paused');

        if (searchQuery) {
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    }, [activities, activeTab, searchQuery]);

    /* Stats for Tabs */
    const counts = useMemo(() => ({
        Active: activities.filter(a => a.status === 'Active').length,
        Completed: activities.filter(a => a.status === 'Completed').length,
        Upcoming: activities.filter(a => a.status === 'Upcoming').length,
        Paused: activities.filter(a => a.status === 'Paused').length,
    }), [activities]);

    /* ── Handlers ──────────────────────────────────── */
    const openCreate = () => {
        setEditingActivity(null);
        setModalMode('create');
        setModalOpen(true);
    };

    const openEdit = (activity) => {
        setEditingActivity(activity);
        setModalMode('edit');
        setModalOpen(true);
    };

    const handleSave = (data) => {
        if (modalMode === 'create') {
            const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
            setActivities(prev => [...prev, { ...data, id: newId }]);
        } else if (modalMode === 'edit' && editingActivity) {
            setActivities(prev =>
                prev.map(a => a.id === editingActivity.id ? { ...a, ...data } : a)
            );
        }
        setModalOpen(false);
    };

    const requestDelete = (activity) => setDeleteTarget(activity);

    const confirmDelete = () => {
        if (deleteTarget) {
            setActivities(prev => prev.filter(a => a.id !== deleteTarget.id));
            setDeleteTarget(null);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* ─── Header Section ───────────────────────────── */}
            <div className="flex-none px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-20">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-1.5 rounded-2xl transition-all" style={glassPanel}>
                    {['Active', 'Completed', 'Upcoming', 'Paused'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 bg-transparent flex items-center gap-2 relative overflow-hidden group
                                ${activeTab === tab
                                    ? 'text-gray-900 shadow-sm bg-white/60'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
                                }`}
                        >
                            <span className="relative z-10">{tab} Activities</span>
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] bg-gray-200/50 group-hover:bg-gray-200 transition-colors ${activeTab === tab ? 'text-gray-900 font-black' : 'text-gray-500'}`}>
                                {String(counts[tab]).padStart(2, '0')}
                            </span>
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/40 border border-white/50 focus:bg-white/60 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* ─── Content Grid ─────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 animate-fade-in-up">
                    {filteredActivities.map((activity, index) => (
                        <div
                            key={activity.id}
                            className="relative group rounded-[32px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full"
                            style={{
                                ...glassCard,
                                animationDelay: `${index * 50}ms`
                            }}
                        >
                            {/* Card Header (Gradient) */}
                            <div
                                className="h-40 p-6 relative flex flex-col justify-between overflow-hidden"
                                style={{
                                    background: buildGradient(activity.colors),
                                }}
                            >

                                <div className="flex justify-between items-start relative z-10">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                                        <CardMenu
                                            onEdit={() => openEdit(activity)}
                                            onDelete={() => requestDelete(activity)}
                                        />
                                    </div>
                                    <div
                                        className="px-3 py-1 rounded-full backdrop-blur-md text-[10px] font-bold tracking-wider uppercase"
                                        style={{
                                            background: (statusBadgeConfig[activity.status] || statusBadgeConfig.Active).bg,
                                            border: `1px solid ${(statusBadgeConfig[activity.status] || statusBadgeConfig.Active).border}`,
                                            color: (statusBadgeConfig[activity.status] || statusBadgeConfig.Active).text,
                                            boxShadow: (statusBadgeConfig[activity.status] || statusBadgeConfig.Active).shadow,
                                        }}
                                    >
                                        {(statusBadgeConfig[activity.status] || statusBadgeConfig.Active).label}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-white leading-tight drop-shadow-md relative z-10 pr-4">
                                    {activity.title}
                                </h3>

                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex-1 flex flex-col" style={glassCardBody}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                                        <FileText size={14} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{activity.type}</span>
                                </div>

                                <p className="text-sm font-medium text-gray-700 leading-relaxed mb-6 flex-1">
                                    {activity.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {activity.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-xl bg-gray-100/80 text-gray-500 text-[11px] font-bold border border-gray-200/50">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Assigned Users */}
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100/50">
                                    <div className="flex items-center -space-x-2">
                                        {(activity.assignedUsers || []).slice(0, 4).map((user, i) => (
                                            <div
                                                key={i}
                                                title={user}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-sm hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                                                style={{ background: avatarColors[i % avatarColors.length], zIndex: 4 - i }}
                                            >
                                                {user.split(' ').map(n => n[0]).join('')}
                                            </div>
                                        ))}
                                        {(activity.assignedUsers || []).length > 4 && (
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 text-[10px] font-bold border-2 border-white shadow-sm">
                                                +{activity.assignedUsers.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-semibold text-gray-400">
                                        {(activity.assignedUsers || []).length} assigned
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Create New Activity Card */}
                    <button
                        onClick={openCreate}
                        className="group relative rounded-[32px] border-2 border-dashed border-gray-300 hover:border-purple-400 bg-white/20 hover:bg-purple-50/30 transition-all duration-300 flex flex-col items-center justify-center min-h-[350px] gap-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center text-gray-400 group-hover:text-purple-600 transition-colors shadow-sm">
                            <Plus size={32} />
                        </div>
                        <span className="text-gray-500 font-bold group-hover:text-purple-600 transition-colors">Create New Activity</span>
                    </button>
                </div>
            </div>

            {/* ─── Modals ──────────────────────────────────── */}
            <ActivityFormModal
                isOpen={modalOpen}
                mode={modalMode}
                initialData={editingActivity}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                activityTitle={deleteTarget?.title || ''}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default ActivitiesModule;
