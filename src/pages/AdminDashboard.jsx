import React, { useEffect, useState } from 'react';
import { supabase, getDashboardStats } from '../services';
import { useNavigate } from 'react-router-dom';
import {
    Bell, Search, Mail,
    LayoutDashboard, Users, Calendar, PieChart, BarChart3,
    Settings, LogOut, HelpCircle, UserCheck,
    Menu, X, CheckCircle, ClipboardList, FileText,
    Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import DashboardOverview from '../components/admin/DashboardOverview';
import AttendanceModule from '../components/admin/AttendanceModule';
import TaskManagement from '../components/admin/TaskManagement';
import CreateUser from '../components/admin/CreateUser';
import InternsModule from '../components/admin/InternsModule';
import ActivitiesModule from '../components/admin/ActivitiesModule';
import ScoringMetricsModule from '../components/admin/ScoringMetricsModule';
import EvaluationModule from '../components/admin/EvaluationModule';
import AnalyticsModule from '../components/admin/AnalyticsModule';

/* ── Reusable glass style ────────────────────────────────── */
const glass = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 8px 32px rgba(31,38,135,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [showAddInternModal, setShowAddInternModal] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [internCount, setInternCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await getDashboardStats();
            if (data) setInternCount(data.totalInterns);
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/admin/signin');
            } else {
                setAdmin(user);
            }
        }
        checkAdmin();
    }, [navigate]);

    const handleSignOut = async () => {
        const { signOut } = await import('../services');
        await signOut();
        navigate('/admin/signin');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'interns', label: 'Interns', icon: Users, badge: internCount > 0 ? `${internCount}+` : null },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'activities', label: 'Activities', icon: ClipboardList },
        { id: 'metrics', label: 'Scoring Metrics', icon: BarChart3 },
        { id: 'evaluations', label: 'Evaluations', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: PieChart },
    ];

    const generalItems = [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'help', label: 'Help', icon: HelpCircle },
    ];

    if (!admin) return (
        <div className="flex justify-center items-center h-screen bg-[var(--bg-primary)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* ─── Video Background ──────────────────────────── */}
            <div className="fixed inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="https://www.pexels.com/download/video/10922866/" type="video/mp4" />
                </video>
                {/* Soft overlay */}
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/60' : 'bg-white/10'}`} />
            </div>

            {/* ─── App Shell ─────────────────────────────────── */}
            <div className="relative z-10 flex h-screen">

                {/* ══════════════ SIDEBAR ══════════════ */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col
                        transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        lg:relative lg:translate-x-0
                    `}
                    style={{
                        background: theme === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.45)',
                        backdropFilter: 'blur(24px) saturate(1.8)',
                        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
                        borderRight: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                    }}
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-6 shrink-0">
                        <div className="w-11 h-11 rounded-full bg-[#15803d] flex items-center justify-center shadow-lg shadow-green-500/20">
                            <CheckCircle size={22} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-extrabold text-xl text-gray-900 tracking-tight">Lifewood</span>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-3 overflow-y-auto custom-scrollbar">
                        <p className="px-4 pt-2 pb-3 text-[11px] font-bold text-gray-500/70 uppercase tracking-[0.12em]">Menu</p>
                        <div className="space-y-0.5">
                            {menuItems.map(item => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`
                                            w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 relative
                                            ${isActive
                                                ? 'bg-[#15803d]/15 text-[#15803d]'
                                                : 'text-gray-600 hover:bg-white/40 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-7 bg-[#15803d] rounded-r-full"></div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8}
                                                className={isActive ? 'text-[#15803d]' : 'text-gray-500'} />
                                            {item.label}
                                        </div>
                                        {item.badge && (
                                            <span className={`
                                                text-[11px] font-bold px-2 py-0.5 rounded-md
                                                ${isActive ? 'bg-[#15803d] text-white' : 'bg-black/10 text-gray-600'}
                                            `}>{item.badge}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <p className="px-4 pt-8 pb-3 text-[11px] font-bold text-gray-500/70 uppercase tracking-[0.12em]">General</p>
                        <div className="space-y-0.5">
                            {generalItems.map(item => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-gray-600 hover:bg-white/40 hover:text-gray-900 transition-all"
                                    >
                                        <Icon size={20} strokeWidth={1.8} className="text-gray-500" />
                                        {item.label}
                                    </button>
                                );
                            })}
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-gray-600 hover:bg-red-500/10 hover:text-red-600 transition-all"
                            >
                                <LogOut size={20} strokeWidth={1.8} className="text-gray-500" />
                                Logout
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-gray-600 hover:bg-white/40 hover:text-gray-900 transition-all"
                            >
                                {theme === 'light' ?
                                    <Moon size={20} strokeWidth={1.8} className="text-gray-500" /> :
                                    <Sun size={20} strokeWidth={1.8} className="text-gray-500" />
                                }
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </button>
                        </div>
                    </nav>

                </aside>

                {/* ══════════════ MAIN CONTENT ══════════════ */}
                <div className="flex-1 flex flex-col min-w-0 relative">

                    {/* Mobile toggle */}
                    <div className="lg:hidden absolute top-5 left-4 z-40">
                        <button
                            className="p-2 text-gray-700 bg-white/60 backdrop-blur-md rounded-lg shadow-sm"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>



                    {/* ─── Content Area ────────────────────────────── */}
                    <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-8 pt-4 scrollbar-hide">
                        {activeTab === 'dashboard' && <DashboardOverview />}
                        {activeTab === 'interns' && <InternsModule onAddIntern={() => setShowAddInternModal(true)} />}
                        {activeTab === 'attendance' && <AttendanceModule />}
                        {activeTab === 'activities' && <ActivitiesModule />}
                        {activeTab === 'metrics' && <ScoringMetricsModule />}
                        {activeTab === 'evaluations' && <EvaluationModule />}
                        {activeTab === 'analytics' && <AnalyticsModule />}

                        {/* ─── Add Intern Modal Overlay ─────────────────── */}
                        {showAddInternModal && (
                            <div
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                                style={{
                                    background: 'rgba(0,0,0,0.4)',
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                }}
                                onClick={() => setShowAddInternModal(false)}
                            >
                                <div onClick={e => e.stopPropagation()} className="w-full max-w-[550px]">
                                    <CreateUser onBack={() => setShowAddInternModal(false)} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PlaceholderModule = ({ title }) => {
    const { theme } = useTheme();
    return (
        <div
            className="h-full min-h-[60vh] flex items-center justify-center rounded-3xl"
            style={{
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(24px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
                border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255,255,255,0.35)',
            }}
        >
            <div className="text-center">
                <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>This module is coming soon...</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
