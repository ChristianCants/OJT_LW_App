import React, { useState } from 'react';
import { Home, LogOut, BarChart3, Users, Activity } from 'lucide-react';
import GlassSurface from './GlassSurface';
import { useNavigate } from 'react-router-dom';

const FloatingDock = ({ activeTab, onTabChange }) => {
    const navigate = useNavigate();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'members', icon: Users, label: 'Faculty Evaluation' },
        { id: 'activity', icon: Activity, label: 'Activity' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/signin');
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div
                className="px-8 py-4 flex items-center gap-6 shadow-2xl liquid-glass-dark"
            >
                {navItems.map((item, index) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="relative flex flex-col items-center gap-2 transition-all duration-300 group"
                        >
                            <div className={`
                                p-2.5 rounded-xl transition-all duration-300
                                ${isActive
                                    ? 'text-[#c8ff00]'
                                    : 'text-gray-500 hover:text-gray-300'
                                }
                            `}>
                                <Icon
                                    size={22}
                                    strokeWidth={1.5}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>

                            {/* Active indicator - neon green dot */}
                            {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] absolute -bottom-1" style={{ boxShadow: '0 0 6px rgba(200,255,0,0.5)' }} />
                            )}

                            {/* Tooltip */}
                            <div className={`
                                absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white text-gray-900 text-[10px] font-medium rounded-lg opacity-0 transition-all duration-200 pointer-events-none whitespace-nowrap
                                ${hoveredIndex === index ? 'opacity-100 -translate-y-1' : 'translate-y-1'}
                            `}>
                                {item.label}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-white" />
                            </div>
                        </button>
                    );
                })}

                <div className="w-[1px] h-8 bg-white/10" />

                <button
                    onClick={handleLogout}
                    className="p-2.5 text-gray-500 hover:text-red-400 transition-all duration-300 group relative"
                >
                    <LogOut size={22} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-red-500 text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap -translate-y-1">
                        Sign Out
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-red-500" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default FloatingDock;
