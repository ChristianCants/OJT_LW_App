import React from 'react';
import { MoreHorizontal, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const StatsCard = ({ title, value, change, icon: Icon, color = 'green' }) => (
    <div className="glass-card p-6 flex flex-col justify-between h-full hover:translate-y-[-4px] transition-transform duration-300">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            {Icon && <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}><Icon size={20} /></div>}
        </div>
        {change && (
            <div className={`text-${change >= 0 ? 'green' : 'red'}-400 text-sm flex items-center gap-1`}>
                {change > 0 ? '+' : ''}{change}% <span className="text-gray-500">from last week</span>
            </div>
        )}
    </div>
);

export const PerformanceChart = () => (
    <div className="glass-card p-6 col-span-1 md:col-span-2 lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Performance</h3>
            <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-green-500/50">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
            </select>
        </div>
        <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
                <div key={i} className="w-full bg-green-500/10 rounded-t-lg relative group transition-all duration-300 hover:bg-green-500/20" style={{ height: `${height}%` }}>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-green-500/40 to-transparent h-full rounded-t-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {height}%
                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-500 px-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span key={day}>{day}</span>
            ))}
        </div>
    </div>
);

export const TaskList = () => (
    <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Current Tasks</h3>
            <span className="text-xs text-gray-400">Done 30%</span>
        </div>
        <div className="space-y-4">
            {[
                { title: 'Product Review for UI8 Market', status: 'In Progress', time: '4h', color: 'orange' },
                { title: 'UX Research for Product', status: 'On Hold', time: '8h', color: 'blue' },
                { title: 'App design and development', status: 'Done', time: '32h', color: 'green' },
            ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${task.color}-500/10 flex items-center justify-center text-${task.color}-400`}>
                            {task.status === 'Done' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">{task.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full bg-${task.color}-500`}></span>
                                <span className="text-xs text-gray-400">{task.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                        <span className="text-xs font-medium">{task.time}</span>
                        <button className="hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const ActivityFeed = () => (
    <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
        <div className="space-y-6 relative before:absolute before:left-4 before:top-10 before:bottom-0 before:w-0.5 before:bg-white/10">
            {[
                { user: 'Floyd Miles', action: 'Commented on', target: 'Stark Project', time: '10:15 AM', img: 'https://i.pravatar.cc/150?u=1' },
                { user: 'Guy Hawkins', action: 'Added a file to', target: '7Heros Project', time: '10:15 AM', img: 'https://i.pravatar.cc/150?u=2' },
                { user: 'Kristin Watson', action: 'Commented on', target: '7Heros Project', time: '10:15 AM', img: 'https://i.pravatar.cc/150?u=3' },
            ].map((activity, i) => (
                <div key={i} className="relative flex gap-4 pl-0">
                    <div className="relative z-10 w-9 h-9 rounded-full border-2 border-[#0a0a0a] overflow-hidden flex-shrink-0">
                        <img src={activity.img} alt={activity.user} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="text-sm font-medium text-white">{activity.user}</h4>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            {activity.action} <span className="text-green-400">{activity.target}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const ProfileWidget = ({ user }) => (
    <div className="glass-card p-6 text-center">
        <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 p-1">
                <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm overflow-hidden flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{user?.username?.charAt(0).toUpperCase()}</span>
                </div>
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#0a0a0a] rounded-full"></span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">{user?.username}</h2>
        <p className="text-sm text-gray-400 mb-6">@{user?.username?.toLowerCase()}</p>

        <div className="flex justify-center gap-4 mb-6">
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"><div className="w-5 h-5" /></button> {/* Placeholder icons */}
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"><div className="w-5 h-5" /></button>
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"><div className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            <div>
                <p className="text-xs text-gray-500">PROJECTS</p>
                <p className="text-lg font-bold text-white">12</p>
            </div>
            <div>
                <p className="text-xs text-gray-500">RANK</p>
                <p className="text-lg font-bold text-white">#4</p>
            </div>
        </div>
    </div>
);
