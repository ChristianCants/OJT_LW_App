import React from 'react';
import ProfileCard from './ProfileCard';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    PieChart,
    FileText,
    BarChart2,
    Search,
    Bell,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

const DashboardLayout = ({ children, user, activeTab, onTabChange }) => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const handleSignOut = () => {
        localStorage.removeItem('user');
        navigate('/signin');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: PieChart },
        { id: 'members', label: 'Evaluation', icon: FileText },
        { id: 'activity', label: 'Reports', icon: BarChart2 },
    ];

    return (
        <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-hidden selection:bg-[#bef264]/30 transition-colors duration-300">
            {/* ─── Sidebar ─────────────────────────────────────────── */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transition-all duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0
                `}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center gap-3 px-6 border-b border-[var(--border-color)]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#bef264] to-[#10b981] flex items-center justify-center shadow-lg shadow-[#bef264]/20">
                        <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-[var(--text-primary)]">Lifewood</span>
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] text-[10px] text-[var(--text-secondary)] font-bold border border-[var(--border-color)]">HUB</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Main Menu</p>
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                                    ${isActive
                                        ? 'bg-gradient-to-r from-[var(--bg-primary)] to-transparent text-[#bef264] shadow-inner border-l-2 border-[#bef264]'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                                    }
                                `}
                            >
                                <Icon
                                    size={20}
                                    className={`transition-colors ${isActive ? 'text-[#bef264]' : 'text-gray-500 group-hover:text-gray-300'}`}
                                />
                                {item.label}
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#bef264] rounded-l-full shadow-[0_0_10px_rgba(190,242,100,0.5)]"></div>
                                )}
                            </button>
                        );
                    })}

                    <p className="px-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-8 mb-4">Settings</p>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all">
                        <Settings size={20} className="text-[var(--text-secondary)]" />
                        Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-[var(--border-color)]">
                    <div className="mb-4">
                        <ProfileCard user={user} />
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--bg-primary)] hover:bg-red-500/10 hover:text-red-500 border border-[var(--border-color)] transition-all group text-[var(--text-secondary)] font-medium text-xs uppercase tracking-wide"
                    >
                        <LogOut size={16} className="group-hover:text-red-500 transition-colors" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ─── Main Content Wrapper ───────────────────────────── */}
            <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg-primary)] relative transition-colors duration-300">
                {/* Background Glows */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#bef264]/5 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header Removed as per user request */}

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide relative z-10 pt-8">
                    <button
                        className="lg:hidden absolute top-4 left-4 p-2 text-gray-400 z-50 bg-[#111] rounded-full border border-[#222]"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
