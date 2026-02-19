import { useState } from 'react';
import { createUser } from '../../services';
import {
    UserPlus, X, ChevronDown, Check, AlertCircle,
    MoreHorizontal
} from 'lucide-react';

const CreateUser = ({ onBack }) => {
    const [formData, setFormData] = useState({
        username: '',
        role: 'Intern',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const roleOptions = ['Intern', 'Admin staff'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const { error } = await createUser(formData);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'User created successfully! The intern can now sign in.' });
            setFormData({
                username: '', role: 'Intern', password: ''
            });
        }
        setLoading(false);
    };

    return (
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/10"
            style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(32px) saturate(2)',
                WebkitBackdropFilter: 'blur(32px) saturate(2)',
                border: '1px solid rgba(255,255,255,0.5)',
            }}
        >
            {/* ─── Dark Header ──────────────────────────────── */}
            <div className="relative px-7 pt-6 pb-5" style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)' }}>
                {/* Close button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Category tag */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    <span className="text-[11px] font-bold text-green-300 uppercase tracking-[0.14em]">Intern Registration</span>
                </div>

                {/* Title */}
                <h2 className="text-[22px] font-extrabold text-white leading-tight">Add New Intern</h2>
            </div>

            {/* ─── Form Body ────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">

                {/* Toast */}
                {message.text && (
                    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold ${message.type === 'error'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                        {message.type === 'error'
                            ? <AlertCircle size={16} className="shrink-0" />
                            : <Check size={16} className="shrink-0" />
                        }
                        <span className="text-[13px]">{message.text}</span>
                    </div>
                )}

                {/* Row: Username + Password */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Username</label>
                        <input
                            type="text" name="username" value={formData.username} onChange={handleChange} required
                            placeholder="jdoe2025"
                            className="w-full px-3.5 py-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Password</label>
                        <input
                            type="text" name="password" value={formData.password} onChange={handleChange} required
                            placeholder="Temp password"
                            className="w-full px-3.5 py-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Role */}
                <div className="relative">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Role</label>
                    <select
                        name="role" value={formData.role} onChange={handleChange}
                        className="w-full px-3.5 py-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all appearance-none cursor-pointer pr-9"
                    >
                        {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3 bottom-[14px] text-gray-400" />
                </div>

                {/* ─── Bottom Actions ──────────────────────────── */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#14532d] text-white rounded-xl text-sm font-bold hover:bg-[#166534] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} />
                                Create Account
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    >
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateUser;
