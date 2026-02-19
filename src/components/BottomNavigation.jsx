import React from 'react';
import { Home, BarChart2, Users, Edit, Layout, Calendar, Settings } from 'lucide-react';

const BottomNavigation = ({ activeTab, onTabChange }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'start', icon: BarChart2, label: 'In Progress' }, // Changed to BarChart for a more general activity icon
        { id: 'users', icon: Users, label: 'Users' },
        { id: 'edit', icon: Edit, label: 'Edit' },
        { id: 'layout', icon: Layout, label: 'Layout' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center gap-6 shadow-lg z-50">
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`relative p-2 rounded-full transition-all duration-300 group ${isActive ? 'text-green-400 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />

                        {/* Active Indicator Dot */}
                        {isActive && (
                            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
                        )}

                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNavigation;
