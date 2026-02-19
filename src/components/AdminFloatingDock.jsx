import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar, CheckSquare, BarChart3, MessageSquare, LogOut, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassSurface from './GlassSurface';

const AdminFloatingDock = ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { type: 'divider' }, // Group 1: Overview
        { id: 'interns', icon: Users, label: 'Interns' },
        { id: 'attendance', icon: Calendar, label: 'Attendance' },
        { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
        { type: 'divider' }, // Group 2: Management
        { id: 'performance', icon: BarChart3, label: 'Performance' },
        { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
        { type: 'divider' }, // Group 3: Analytics
    ];

    const handleLogout = async () => {
        const { signOut } = await import('../services');
        await signOut();
        navigate('/admin/signin');
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <GlassSurface
                className="px-2 py-2 flex items-center gap-2 shadow-2xl rounded-full border border-white/40 bg-white/10 backdrop-blur-xl !overflow-visible"
                borderRadius={9999}
                opacity={0.9}
            >
                <div className="flex items-center gap-1 px-4">
                    {navItems.map((item, index) => {
                        if (item.type === 'divider') {
                            return <div key={`divider-${index}`} className="w-[1px] h-8 bg-white/20 mx-2" />;
                        }

                        const isActive = activeTab === item.id;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative flex flex-col items-center justify-center w-12 h-12 group"
                            >
                                <div className={`
                                    transition-all duration-300
                                    ${isActive ? 'text-blue-600 scale-110' : 'text-gray-500 hover:text-gray-800 hover:scale-105'}
                                `}>
                                    <Icon size={26} strokeWidth={1.5} />
                                </div>

                                {/* Active indicator - dot below */}
                                {isActive && (
                                    <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                )}

                                {/* Tooltip */}
                                <div className={`
                                    absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/90 text-white text-xs font-medium rounded-lg 
                                    opacity-0 transition-all duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm
                                    ${hoveredIndex === index ? 'opacity-100 -translate-y-1 scale-100' : 'translate-y-2 scale-95'}
                                `}>
                                    {item.label}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-gray-900/90" />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Primary Action Button - Create User */}
                <button
                    onClick={() => onTabChange('create-user')}
                    className={`
                        w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ml-2
                        ${activeTab === 'create-user'
                            ? 'bg-gradient-to-br from-green-400 to-green-600 text-white scale-110 shadow-green-500/30'
                            : 'bg-gradient-to-br from-green-400 to-green-500 text-white hover:scale-105 hover:shadow-green-500/20'
                        }
                    `}
                >
                    <UserPlus size={28} strokeWidth={2} />
                </button>

                {/* Logout Button */}
                <div className="w-[1px] h-8 bg-white/20 mx-2" />

                <button
                    onClick={handleLogout}
                    className="w-12 h-12 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50/10 transition-colors mr-2"
                    title="Sign Out"
                >
                    <LogOut size={24} strokeWidth={1.5} />
                </button>

            </GlassSurface>
        </div>
    );
};

export default AdminFloatingDock;
