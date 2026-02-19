import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
    Search,
    Download,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Calendar,
    ChevronDown,
    Leaf,
    Edit2,
    Trash,
    ChevronLeft,
    ChevronRight,
    User,
    Sun,
    Moon,
    HelpCircle
} from 'lucide-react';

// Mock Data
const initialInterns = [];

const AttendanceModule = () => {
    const { theme, toggleTheme } = useTheme();
    const [interns, setInterns] = useState(initialInterns);
    const [stats, setStats] = useState([
        { title: 'Present Today', value: '0', subtext: '0 People Remaining', icon: CheckCircle2, color: 'text-gray-900', bgIcon: 'bg-black/5' },
        { title: 'Late Entry', value: '0', subtext: '0 People are on Time', icon: Clock, color: 'text-gray-900', bgIcon: 'bg-black/5' },
        { title: 'On Leave', value: '0', subtext: 'Approved Leave', icon: Leaf, color: 'text-gray-900', bgIcon: 'bg-black/5' },
        { title: 'Absent', value: '0', subtext: 'Without Informing', icon: XCircle, color: 'text-gray-900', bgIcon: 'bg-black/5' },
    ]);

    // View State
    const [selectedInternId, setSelectedInternId] = useState('all');
    const [viewDate, setViewDate] = useState(new Date());

    // Popup State
    const [popup, setPopup] = useState({ show: false, x: 0, y: 0, internId: null, dayIndex: null });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    const handleCellClick = (e, internId, dayIndex) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopup({
            show: true,
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY,
            internId,
            dayIndex
        });
    };

    const handleStatusSelect = (status, label = '') => {
        if (popup.internId === null || popup.dayIndex === null) return;

        setInterns(prev => prev.map(emp => {
            if (emp.id === popup.internId) {
                const newSchedule = [...emp.schedule];
                newSchedule[popup.dayIndex] = {
                    status,
                    label: label || (status === 'present' ? '8 Hours' : status === 'late' ? 'Late' : status === 'leave' ? 'Leave' : 'Absent'),
                    time: status === 'present' ? '8 Hours' : undefined
                };
                return { ...emp, schedule: newSchedule };
            }
            return emp;
        }));
        setPopup({ ...popup, show: false });
    };

    // Calendar Helpers
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const changeMonth = (delta) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setViewDate(newDate);
    };

    // Close popup on click outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (popup.show && !event.target.closest('.attendance-popup') && !event.target.closest('td')) {
                setPopup({ ...popup, show: false });
            }
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [popup.show, isDropdownOpen]);

    const selectedIntern = interns.find(emp => emp.id === parseInt(selectedInternId));

    return (
        <div className="w-full pb-10 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Intern Attendance</h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Analyse attendance records of interns</p>
                </div>
                <div className="flex gap-3">
                </div>
            </div>

            {/* Stats Grid - Show aggregate stats or specific intern stats could go here */}
            {selectedInternId === 'all' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="p-5 rounded-[20px] border border-[var(--glass-border)] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300"
                            style={{
                                background: 'var(--glass-bg)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                            }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-white/10' : stat.bgIcon}`}>
                                    <stat.icon className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : stat.color}`} />
                                </div>
                                <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                            <h3 className="text-sm font-semibold text-[var(--text-secondary)]">{stat.title}</h3>
                            <div className="mt-2">
                                <span className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">{stat.subtext}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search anything ..."
                        className="w-full pl-11 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] font-medium transition-colors"
                        style={{ backdropFilter: 'blur(10px)' }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/50 border border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
                            ⌘ + S
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-3 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all"
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>

                    {/* Intern Selector Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl text-sm font-semibold text-[var(--text-primary)] shadow-sm hover:bg-[var(--hover-bg)] transition-all min-w-[160px] justify-between whitespace-nowrap"
                            style={{ backdropFilter: 'blur(10px)' }}
                        >
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-[var(--text-secondary)]" />
                                <span className="truncate max-w-[100px]">{selectedIntern ? selectedIntern.name : 'All Interns'}</span>
                            </div>
                            <ChevronDown size={14} className={`text-[var(--text-secondary)] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full mt-2 right-0 w-full min-w-[200px] bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-1">
                                    <button
                                        onClick={() => { setSelectedInternId('all'); setIsDropdownOpen(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedInternId === 'all' ? 'bg-blue-50/50 text-blue-600' : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'}`}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600">
                                            <User size={12} />
                                        </div>
                                        All Interns
                                    </button>
                                    {interns.map((emp) => (
                                        <button
                                            key={emp.id}
                                            onClick={() => { setSelectedInternId(emp.id); setIsDropdownOpen(false); }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${parseInt(selectedInternId) === emp.id ? 'bg-blue-50/50 text-blue-600' : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'}`}
                                        >
                                            <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover" />
                                            {emp.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                        Download <Download size={16} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all whitespace-nowrap">
                        <Filter size={16} /> Filter 03
                    </button>
                    {/* Date Picker / Month Selector */}
                    <div className="flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl p-1">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors text-[var(--text-secondary)]">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-bold text-[var(--text-primary)] min-w-[120px] text-center">
                            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors text-[var(--text-secondary)]">
                            <ChevronRight size={16} />
                        </button>
                        <div className="w-px h-4 bg-[var(--border-color)] mx-1"></div>
                        <button
                            onClick={() => setViewDate(new Date())}
                            className="text-xs font-bold text-blue-600 px-2 py-1.5 hover:bg-blue-50/50 rounded-md transition-colors"
                        >
                            Today
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Switcher */}
            {selectedInternId === 'all' ? (
                /* Weekly Table View */
                <>
                    {/* Filter Pills */}
                    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        {['Leave', 'Absent', 'Active'].map((filter) => (
                            <button key={filter} className="flex items-center gap-2 px-4 py-2 bg-gray-100/80 hover:bg-gray-200/80 rounded-lg text-xs font-bold text-gray-600 transition-colors whitespace-nowrap">
                                {filter} <XCircle size={12} className="text-gray-400" />
                            </button>
                        ))}
                    </div>

                    <div
                        className="w-full overflow-hidden rounded-[24px] border border-[var(--glass-border)] shadow-sm"
                        style={{
                            background: 'var(--glass-bg)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="overflow-x-auto pb-4">
                            <table className="w-full min-w-[900px]">
                                <thead className="sticky top-0 z-10">
                                    <tr className="border-b border-[var(--border-color)]" style={{ background: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider first:rounded-tl-[24px]">Intern</th>
                                        {Array.from({ length: 7 }).map((_, i) => {
                                            const curr = new Date(viewDate);
                                            const first = curr.getDate() - curr.getDay();
                                            const dayDate = new Date(curr.setDate(first + i));
                                            const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
                                            const dayNumber = dayDate.getDate();

                                            return (
                                                <th key={i} className="px-4 py-5 text-left text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider w-[12%] last:rounded-tr-[24px]">
                                                    <div className="flex flex-col">
                                                        <span>{dayName}</span>
                                                        <span className="text-[var(--text-secondary)] text-[10px]">{dayNumber}</span>
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {interns.map((intern) => (
                                        <tr key={intern.id} className="hover:bg-[var(--hover-bg)] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={intern.avatar} alt={intern.name} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--border-color)] shadow-sm" />
                                                    <div>
                                                        <p className="text-sm font-bold text-[var(--text-primary)]">{intern.name}</p>
                                                        <p className="text-xs text-[var(--text-secondary)] font-medium">{intern.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {intern.schedule.map((slot, index) => (
                                                <td
                                                    key={index}
                                                    className="px-4 py-4 align-top cursor-pointer relative transition-all duration-200 group/cell"
                                                    onClick={(e) => handleCellClick(e, intern.id, index)}
                                                >
                                                    <div className="min-h-[50px] flex items-center">
                                                        {slot.status !== 'off' ? (
                                                            <div className={`
                                                                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border shadow-sm
                                                                ${getStatusStyles(slot.status)}
                                                            `}>
                                                                {getStatusIcon(slot.status)}
                                                                {slot.type || slot.time || slot.label}
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-start group-hover/cell:justify-center">
                                                                <span className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 group-hover/cell:bg-blue-50 group-hover/cell:text-blue-500 transition-all">
                                                                    <div className="opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                                                        <Edit2 size={14} />
                                                                    </div>
                                                                    <div className="opacity-100 group-hover/cell:opacity-0 absolute">
                                                                        -
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                /* Calendar View */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 mb-6">
                        <img src={selectedIntern?.avatar} alt={selectedIntern?.name} className="w-16 h-16 rounded-full border-4 border-white shadow-md" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{selectedIntern?.name}</h2>
                            <p className="text-gray-500">{selectedIntern?.role} • Attendance Record</p>
                        </div>
                    </div>

                    <div
                        className="w-full p-6 rounded-[24px] border border-white/40 shadow-sm"
                        style={{
                            background: 'rgba(255, 255, 255, 0.65)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="grid grid-cols-7 gap-4 mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider py-2">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2 sm:gap-4">
                            {Array.from({ length: getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square"></div>
                            ))}
                            {Array.from({ length: getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                                const day = i + 1;
                                // Mock random status for demonstration in calendar view since we only have weekly mock data
                                // In a real app, you'd fetch monthly data here.
                                const mockStatusIdx = (day + selectedIntern?.id) % 5;
                                const statuses = ['present', 'present', 'present', 'late', 'absent'];
                                const status = statuses[mockStatusIdx] || 'off';
                                const isWeekend = new Date(viewDate.getFullYear(), viewDate.getMonth(), day).getDay() === 0 || new Date(viewDate.getFullYear(), viewDate.getMonth(), day).getDay() === 6;

                                return (
                                    <div
                                        key={day}
                                        className={`
                                            aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer relative group
                                            ${isWeekend ? 'bg-[var(--bg-primary)]/50 border-[var(--border-color)]' : 'bg-[var(--input-bg)] border-[var(--glass-border)] hover:bg-[var(--hover-bg)]'}
                                        `}
                                    >
                                        <span className={`text-sm font-bold mb-1 ${isWeekend ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>{day}</span>
                                        {!isWeekend && (
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center
                                                ${status === 'present' ? 'bg-emerald-100 text-emerald-600' :
                                                    status === 'late' ? 'bg-amber-100 text-amber-600' :
                                                        status === 'absent' ? 'bg-red-100 text-red-600' :
                                                            'bg-gray-100 text-gray-400'}
                                            `}>
                                                {getStatusIcon(status)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Legend Section */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-6 p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <HelpCircle size={16} className="text-[var(--text-secondary)]" />
                            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Legend:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={14} /></div>
                            <span className="text-sm font-medium text-[var(--text-primary)]">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><Clock size={14} /></div>
                            <span className="text-sm font-medium text-[var(--text-primary)]">Late</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Leaf size={14} /></div>
                            <span className="text-sm font-medium text-[var(--text-primary)]">Leave</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><XCircle size={14} /></div>
                            <span className="text-sm font-medium text-[var(--text-primary)]">Absent</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Selector Popup (Only use in Table View for now) */}
            {popup.show && selectedInternId === 'all' && (
                <div
                    className="attendance-popup fixed z-[100] bg-white rounded-xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-100"
                    style={{
                        left: Math.min(popup.x, window.innerWidth - 160), // Keep within viewport
                        top: popup.y + 8
                    }}
                >
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Set Status</p>
                    <button onClick={() => handleStatusSelect('present')} className="flex items-center gap-2 px-3 py-2 hover:bg-green-50 rounded-lg text-sm text-gray-700 hover:text-green-700 transition-colors">
                        <CheckCircle2 size={14} className="text-green-600" /> Present
                    </button>
                    <button onClick={() => handleStatusSelect('late')} className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 rounded-lg text-sm text-gray-700 hover:text-orange-700 transition-colors">
                        <Clock size={14} className="text-orange-600" /> Late
                    </button>
                    <button onClick={() => handleStatusSelect('leave', 'Leave')} className="flex items-center gap-2 px-3 py-2 hover:bg-purple-50 rounded-lg text-sm text-gray-700 hover:text-purple-700 transition-colors">
                        <Leaf size={14} className="text-purple-600" /> Leave
                    </button>
                    <button onClick={() => handleStatusSelect('absent', 'Absent')} className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-gray-700 hover:text-red-700 transition-colors">
                        <XCircle size={14} className="text-red-600" /> Absent
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button onClick={() => handleStatusSelect('off', '')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 hover:text-gray-900 transition-colors">
                        <Trash size={14} className="text-gray-400" /> Clear
                    </button>
                </div>
            )}
        </div>
    );
};

// Helper for Styles
const getStatusStyles = (status) => {
    switch (status) {
        case 'present': return 'bg-emerald-50 border-emerald-100 text-emerald-600';
        case 'late': return 'bg-amber-50 border-amber-100 text-amber-600';
        case 'leave': return 'bg-purple-50 border-purple-100 text-purple-600';
        case 'absent': return 'bg-red-50 border-red-100 text-red-600';
        case 'active': return 'bg-green-50 border-green-100 text-green-700';
        default: return 'bg-gray-50 text-gray-500';
    }
};

const getStatusIcon = (status) => {
    const size = 12;
    switch (status) {
        case 'present': return <CheckCircle2 size={size} />;
        case 'late': return <Clock size={size} />;
        case 'leave': return <Leaf size={size} />;
        case 'absent': return <XCircle size={size} />;
        case 'active': return null;
        default: return null;
    }
};

export default AttendanceModule;
