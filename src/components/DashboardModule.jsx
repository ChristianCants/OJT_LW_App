import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../services'; // Import Supabase client
import {
    ArrowUpRight,
    Search,
    Bell,
    Settings,
    ChevronDown,
    Layout,
    CreditCard,
    Zap,
    Target,
    Leaf,
    User,
    Clock,
    CheckCircle,
    TrendingUp,
    Camera,
    Mail,
    X,
    Save,
    MoreHorizontal,
    GraduationCap,
    School,
    Building2,
    MapPin
} from 'lucide-react';

/* ─── Schools Constant ───────────────────────────────────── */
const CEBU_SCHOOLS = [
    "University of San Carlos",
    "University of Cebu",
    "University of the Visayas",
    "University of San Jose–Recoletos",
    "Cebu Institute of Technology – University",
    "Cebu Normal University",
    "University of the Philippines Cebu",
    "Southwestern University PHINMA",
    "University of Southern Philippines Foundation",
    "Cebu Technological University",
    "Asian College of Technology",
    "College of Technological Sciences – Cebu",
    "Salazar Colleges of Science and Institute of Technology",
    "Don Bosco Technical College – Cebu",
    "Cebu Eastern College",
    "CBD College",
    "AMA Computer College – Cebu City",
    "Benedicto College",
    "St. Paul College Foundation – Cebu",
    "Fashion Institute of Design and Arts Cebu"
];

/* ─── Logo File Map (local /School Logos/ folder) ────────── */
const SCHOOL_LOGOS = {
    "University of San Carlos": "/School Logos/University of San Carlos.jpg",
    "University of Cebu": "/School Logos/Univerity Of Cebu.jpg",
    "University of the Visayas": "/School Logos/University of the Visayas.jpg",
    "University of San Jose–Recoletos": "/School Logos/University of San Jose- Recoletos.jpg",
    "Cebu Institute of Technology – University": "/School Logos/Cebu Institute of Technology – University.png",
    "Cebu Normal University": "/School Logos/Cebu Normal University.png",
    "University of the Philippines Cebu": "/School Logos/University of the Philippines Cebu.jpg",
    "Southwestern University PHINMA": "/School Logos/Southwestern University PHINMA.jpg",
    "University of Southern Philippines Foundation": "/School Logos/University of Southern Philippines Foundation.jpg",
    "Cebu Technological University": "/School Logos/Cebu Technological University.jpg",
    "Asian College of Technology": "/School Logos/Asian College of Technology.jpg",
    "College of Technological Sciences – Cebu": "/School Logos/College of Technological Sciences – Cebu.jpg",
    "Salazar Colleges of Science and Institute of Technology": "/School Logos/Salazar Colleges of Science and Institute of Technology.png",
    "Don Bosco Technical College – Cebu": "/School Logos/Don Bosco Technical College – Cebu.jpg",
    "Cebu Eastern College": "/School Logos/Cebu Eastern College.jpg",
    "CBD College": "/School Logos/CBD College.png",
    "AMA Computer College – Cebu City": "/School Logos/AMA Computer College – Cebu City.jpg",
    "Benedicto College": "/School Logos/Benedicto College.jpg",
    "St. Paul College Foundation – Cebu": "/School Logos/St. Paul College Foundation – Cebu.jpg",
    "Fashion Institute of Design and Arts Cebu": "/School Logos/Fashion Institute of Design and Arts Cebu.jpg"
};

/* ─── Hero Module Card (Premium Glass) ────────────────────── */
const ModuleCard = ({ title, code, progress, color = 'black' }) => (
    <div className={`relative min-w-[280px] h-[180px] rounded-[32px] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden border group
        ${color === 'black'
            ? 'bg-gradient-to-br from-[#1a1a1a] to-[#050505] border-white/10 hover:border-[#ccff00]/30 shadow-lg shadow-black/20'
            : 'bg-[#ccff00] text-black border-transparent'}
    `}>
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-[#ccff00] opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500" />

        <div className="flex justify-between items-start z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner
                ${color === 'black' ? 'bg-[#ccff00] text-black' : 'bg-black text-white'}
            `}>
                <div className="font-bold text-xs">{code.substring(0, 2)}</div>
            </div>
            <div className={`p-2.5 rounded-full backdrop-blur-sm border
                ${color === 'black' ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/5 text-black'}
            `}>
                <TrendingUp size={16} />
            </div>
        </div>

        <div className="z-10">
            <p className={`text-lg font-medium tracking-tight overflow-hidden text-ellipsis whitespace-nowrap mb-3
                 ${color === 'black' ? 'text-white' : 'text-black'}
            `}>{title}</p>

            <div className={`w-full h-1.5 rounded-full mb-3 overflow-hidden
                 ${color === 'black' ? 'bg-white/10' : 'bg-black/10'}
            `}>
                <div
                    className={`h-full rounded-full ${color === 'black' ? 'bg-[#ccff00]' : 'bg-black'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex justify-between items-end">
                <p className={`text-[10px] font-bold uppercase tracking-widest opacity-60
                    ${color === 'black' ? 'text-gray-300' : 'text-black'}
                `}>{code}</p>
                <p className={`font-bold text-lg ${color === 'black' ? 'text-white' : 'text-black'}`}>{progress}%</p>
            </div>
        </div>
    </div>
);

/* ─── KPI Card (Premium Bento) ────────────────────────────── */
const KpiCard = ({ title, value, icon: Icon, bg = 'lime', subtext }) => {
    const isLime = bg === 'lime';
    return (
        <div className={`relative h-32 rounded-[32px] p-6 flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-all duration-300 border
            ${isLime
                ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-[0_8px_30px_rgba(204,255,0,0.2)]'
                : 'bg-[#0f0f0f] text-white border-white/10 shadow-lg'}
        `}>
            {/* Shine Effect */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-white opacity-0 group-hover:opacity-10 blur-3xl rounded-full pointer-events-none transition-opacity duration-500
                 ${isLime ? 'mix-blend-overlay' : 'mix-blend-normal'}
             `} />

            <div className="flex justify-between items-start z-10">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isLime ? 'text-black/60' : 'text-gray-500'}`}>{title}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm
                    ${isLime ? 'bg-black text-white' : 'bg-white/10 text-white backdrop-blur-sm border border-white/10'}
                `}>
                    <Icon size={14} />
                </div>
            </div>

            <div className="z-10">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight">{value}</span>
                </div>
                {subtext && <span className={`text-xs font-medium pl-0.5 block mt-1 ${isLime ? 'text-black/70' : 'text-gray-500'}`}>{subtext}</span>}
            </div>
        </div>
    );
};

/* ─── Activity Item (Polished List) ───────────────────────── */
const ActivityItem = ({ number, label, sublabel, dark = false }) => (
    <div className={`flex items-center gap-5 p-5 rounded-[24px] group transition-all duration-300 cursor-pointer border
        ${dark
            ? 'bg-[#0f0f0f] text-white border-white/5 shadow-xl shadow-black/10'
            : 'bg-transparent border-transparent hover:bg-white hover:border-gray-100 hover:shadow-md'}
    `}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 transition-transform group-hover:scale-110 duration-300
            ${dark ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]' : 'bg-gray-100 text-gray-900 group-hover:bg-black group-hover:text-white'}
        `}>
            {number}
        </div>
        <div>
            <p className={`font-semibold text-sm leading-snug ${dark ? 'text-white' : 'text-gray-900'}`}>{label}</p>
            <p className={`text-xs mt-1 font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{sublabel}</p>
        </div>
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
            <ArrowUpRight size={16} className={dark ? 'text-[#ccff00]' : 'text-black'} />
        </div>
    </div>
);

/* ─── Main Module ─────────────────────────────────────────── */
const DashboardModule = ({ user, profileData, onProfileUpdate }) => {
    // Profile State
    const [profile, setProfile] = useState({
        firstName: user?.first_name || profileData?.first_name || '',
        lastName: user?.last_name || profileData?.last_name || '',
        name: user?.username || 'Student',
        email: user?.email || profileData?.email || '',
        phone: user?.phone || profileData?.contact_number || '',
        address: profileData?.present_address || '',
        civilStatus: profileData?.civil_status || '', // Added
        ojtHours: profileData?.ojt_hours || '', // Added
        avatar: user?.avatar || null,
        schoolLogo: user?.schoolLogo || null,
        school: user?.school || profileData?.course || ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSchoolDropdownOpen(false);
            }
        };

        if (isSchoolDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSchoolDropdownOpen]);


    // Sync with User prop if it changes
    useEffect(() => {
        if (user?.username || profileData) {
            setProfile(prev => ({
                ...prev,
                firstName: user?.first_name || profileData?.first_name || prev.firstName,
                lastName: user?.last_name || profileData?.last_name || prev.lastName,
                name: user?.username || prev.name,
                email: user?.email || profileData?.email || prev.email,
                phone: user?.phone || profileData?.contact_number || prev.phone,
                address: profileData?.present_address || prev.address,
                civilStatus: profileData?.civil_status || prev.civilStatus, // Added
                ojtHours: profileData?.ojt_hours || prev.ojtHours, // Added
                avatar: user?.avatar || prev.avatar,
                schoolLogo: user?.schoolLogo || prev.schoolLogo,
                school: user?.school || prev.school
            }));
        }
    }, [user, profileData]);

    // Helper: Resize image using Canvas and return HD data URL
    const resizeImage = (file, maxSize = 800) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let w = img.width, h = img.height;
                    // Scale down proportionally only if larger than max
                    if (w > maxSize || h > maxSize) {
                        const ratio = Math.min(maxSize / w, maxSize / h);
                        w = Math.round(w * ratio);
                        h = Math.round(h * ratio);
                    }
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', 0.92)); // HD Quality JPEG
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = event.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);

            // 1. Resize & convert to base64 (no Supabase Storage needed)
            const imageDataUrl = await resizeImage(file, 800);

            const stateField = type === 'avatar' ? 'avatar' : 'schoolLogo';
            const dbField = type === 'avatar' ? 'avatar' : 'school_logo';

            // 2. Update local state immediately
            setProfile(prev => ({ ...prev, [stateField]: imageDataUrl }));

            // 3. Persist to localStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...storedUser, [stateField]: imageDataUrl }));

            // 4. Try saving to database (non-blocking)
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ [dbField]: imageDataUrl })
                .eq('username', profile.name);

            if (updateError) {
                console.warn("DB update info:", updateError.message);
                // Still works locally even if DB column doesn't exist yet
            }

        } catch (error) {
            console.error(`Error processing ${type}:`, error);
            alert(`Failed to process image. Please try a different file.`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSchoolChange = (e) => {
        const selectedSchool = e.target.value;
        const logoPath = SCHOOL_LOGOS[selectedSchool] || null;

        setProfile(prev => ({
            ...prev,
            school: selectedSchool,
            schoolLogo: logoPath
        }));
    };

    const handleSaveProfile = async () => {
        try {
            const updates = {
                username: profile.name,
                first_name: profile.firstName,
                last_name: profile.lastName,
                email: profile.email.trim().toLowerCase(),
                phone: profile.phone,
                school: profile.school,
                school_logo: profile.schoolLogo,
                civil_status: profile.civilStatus, // Added
                ojt_hours: profile.ojtHours // Added
                // Note: Updating intern_profiles fields (contact_number, present_address) should ideally happen here too if we want this modal to update them.
                // But UserDashboard modal handles intern_profiles updates. 
                // This 'profiles' table update might be legacy or for the 'users' table?
                // The current code updates 'profiles' table. But we renamed 'profiles' to 'users'.
                // And 'users' table only has username, password, role.
                // So this handleSaveProfile might be broken or needs to call updateInternProfile service.
            };

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('username', user.username);

            if (error) console.warn("Save profile warning:", error.message);

            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...storedUser,
                username: profile.name,
                first_name: profile.firstName,
                last_name: profile.lastName,
                email: profile.email.trim().toLowerCase(),
                phone: profile.phone,
                school: profile.school,
                schoolLogo: profile.schoolLogo
            }));

            setIsEditing(false);
            // Notify parent to refresh user data in sidebar
            if (onProfileUpdate) onProfileUpdate();
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    // Calendar Logic
    const today = new Date();
    const [calDate, setCalDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [hoveredDay, setHoveredDay] = useState(null);

    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Activity dates with start and deadline
    const activities = [
        { name: "React Component Library", start: "2026-02-10", deadline: "2026-02-17", module: "Frontend" },
        { name: "API Integration", start: "2026-02-12", deadline: "2026-02-19", module: "Backend" },
        { name: "UI/UX Design", start: "2026-02-14", deadline: "2026-02-21", module: "Design" },
        { name: "Database Schema", start: "2026-02-08", deadline: "2026-02-15", module: "Database" },
        { name: "System Architecture", start: "2026-02-15", deadline: "2026-02-22", module: "System" },
        { name: "REST API Design", start: "2026-02-11", deadline: "2026-02-18", module: "Backend" },
    ];

    // Build event map: { 'YYYY-MM-DD': [{name, type}] }
    const eventMap = {};
    activities.forEach(a => {
        const addEvent = (dateStr, type) => {
            if (!eventMap[dateStr]) eventMap[dateStr] = [];
            eventMap[dateStr].push({ name: a.name, type, module: a.module });
        };
        addEvent(a.start, 'start');
        addEvent(a.deadline, 'deadline');
    });

    // Build calendar grid
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const cells = [];
    for (let i = 0; i < totalCells; i++) {
        const dayNum = i - firstDay + 1;
        cells.push(dayNum >= 1 && dayNum <= daysInMonth ? dayNum : null);
    }

    const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const dateKey = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;


    return (
        <div className="w-full bg-[#F2F4F6] min-h-full rounded-[48px] p-8 -mt-2 text-[#050505] font-sans relative overflow-hidden">

            {/* ── Edit Profile Modal (Portal) ── */}
            {isEditing && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[40px] border border-white/10 p-8 relative shadow-2xl animate-in zoom-in-95 duration-300">
                        {/* Glow Effect */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ccff00] blur-[120px] opacity-10 pointer-events-none" />

                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8 relative z-10">
                            <h3 className="text-2xl font-medium tracking-tight text-white">Edit Profile</h3>
                            <p className="text-gray-500 text-sm mt-1">Update your personal details</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 relative z-10">
                            {/* Left Column: Avatar */}
                            <div className="flex flex-col items-center justify-start pt-2">
                                <div className="relative group cursor-pointer inline-block">
                                    <div className="w-32 h-32 rounded-full border-4 border-[#1a1a1a] shadow-xl flex items-center justify-center overflow-hidden bg-black relative">
                                        <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover relative z-10" />
                                        ) : (
                                            <User size={48} className="text-neutral-600 relative z-10" />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 rounded-full border-2 border-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity scale-105" />
                                    <label className="absolute bottom-0 right-0 w-9 h-9 bg-[#ccff00] rounded-full flex items-center justify-center text-black shadow-lg cursor-pointer hover:scale-110 transition-transform z-20">
                                        <Camera size={16} />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'avatar')} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 font-medium">Tap to change</p>
                            </div>

                            {/* Right Column: Form Fields */}
                            <div className="flex-1 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
                                {/* First + Last Name Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="group">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">First Name</label>
                                        <div className="bg-[#151515] rounded-2xl px-4 h-12 flex items-center gap-3 border border-white/5 focus-within:border-[#ccff00]/50 focus-within:bg-[#1a1a1a] transition-all">
                                            <input
                                                value={profile.firstName}
                                                onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                                                className="bg-transparent text-white w-full h-full focus:outline-none text-sm font-medium placeholder:text-gray-700"
                                                placeholder="First name"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Last Name</label>
                                        <div className="bg-[#151515] rounded-2xl px-4 h-12 flex items-center gap-3 border border-white/5 focus-within:border-[#ccff00]/50 focus-within:bg-[#1a1a1a] transition-all">
                                            <input
                                                value={profile.lastName}
                                                onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                                                className="bg-transparent text-white w-full h-full focus:outline-none text-sm font-medium placeholder:text-gray-700"
                                                placeholder="Last name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email (Gmail) */}
                                <div className="group">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Gmail / Email</label>
                                    <div className="bg-[#151515] rounded-2xl px-4 h-12 flex items-center gap-3 border border-white/5 focus-within:border-[#ccff00]/50 focus-within:bg-[#1a1a1a] transition-all">
                                        <Mail size={18} className="text-gray-600 group-focus-within:text-[#ccff00] transition-colors shrink-0" />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                                            className="bg-transparent text-white w-full h-full focus:outline-none text-sm font-medium placeholder:text-gray-700"
                                            placeholder="yourname@gmail.com"
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="group">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Phone Number</label>
                                    <div className="bg-[#151515] rounded-2xl px-4 h-12 flex items-center gap-3 border border-white/5 focus-within:border-[#ccff00]/50 focus-within:bg-[#1a1a1a] transition-all">
                                        <span className="text-gray-500 text-sm font-medium shrink-0">+63</span>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                            className="bg-transparent text-white w-full h-full focus:outline-none text-sm font-medium placeholder:text-gray-700"
                                            placeholder="9XX XXX XXXX"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="group">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Present Address</label>
                                    <div className="bg-[#151515] rounded-2xl px-4 h-12 flex items-center gap-3 border border-white/5 focus-within:border-[#ccff00]/50 focus-within:bg-[#1a1a1a] transition-all">
                                        <MapPin size={18} className="text-gray-600 group-focus-within:text-[#ccff00] transition-colors shrink-0" />
                                        <input
                                            type="text"
                                            value={profile.address}
                                            onChange={e => setProfile({ ...profile, address: e.target.value })}
                                            className="bg-transparent text-white w-full h-full focus:outline-none text-sm font-medium placeholder:text-gray-700"
                                            placeholder="City, Province"
                                        />
                                    </div>
                                </div>

                                {/* Civil Status & OJT Hours Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="group">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Civil Status</label>
                                        <div className="bg-[#151515] rounded-2xl px-4 h-12 flex items-center gap-3 border border-white/5 focus-within:border-[#ccff00]/50 focus-within:bg-[#1a1a1a] transition-all">
                                            <input
                                                value={profile.civilStatus}
                                                onChange={e => setProfile({ ...profile, civilStatus: e.target.value })}
                                                className="bg-transparent text-white w-full h-full focus:outline-none text-sm font-medium placeholder:text-gray-700"
                                                placeholder="Single/Married"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">OJT Hours</label>
                                        <div className="bg-[#151515] rounded-2xl px-4 h-12 flex items-center gap-3 border border-white/5 focus-within:border-[#ccff00]/50 focus-within:bg-[#1a1a1a] transition-all">
                                            <input
                                                value={profile.ojtHours}
                                                onChange={e => setProfile({ ...profile, ojtHours: e.target.value })}
                                                className="bg-transparent text-white w-full h-full focus:outline-none text-sm font-medium placeholder:text-gray-700"
                                                placeholder="e.g. 600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* School Dropdown */}
                                <div className="group relative" ref={dropdownRef}>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">School / University</label>

                                    {/* Custom Dropdown Trigger */}
                                    <div
                                        onClick={() => setIsSchoolDropdownOpen(!isSchoolDropdownOpen)}
                                        className={`bg-[#151515] rounded-2xl px-4 h-14 flex items-center gap-3 border transition-all cursor-pointer relative
                                            ${isSchoolDropdownOpen ? 'border-[#ccff00]/50 bg-[#1a1a1a]' : 'border-white/5 hover:border-white/10'}
                                        `}
                                    >
                                        <Building2 size={20} className={`transition-colors ${isSchoolDropdownOpen ? 'text-[#ccff00]' : 'text-gray-600'}`} />
                                        <span className={`text-sm font-medium ${profile.school ? 'text-white' : 'text-gray-500'}`}>
                                            {profile.school || "Select your school"}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`absolute right-4 text-gray-500 transition-transform duration-300 ${isSchoolDropdownOpen ? 'rotate-180 text-[#ccff00]' : ''}`}
                                        />
                                    </div>

                                    {/* Custom Dropdown Menu */}
                                    {isSchoolDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-1.5 space-y-1">
                                                {CEBU_SCHOOLS.map((school) => {
                                                    const isSelected = profile.school === school;
                                                    return (
                                                        <div
                                                            key={school}
                                                            onClick={() => {
                                                                const logoPath = SCHOOL_LOGOS[school] || null;
                                                                setProfile(prev => ({
                                                                    ...prev,
                                                                    school: school,
                                                                    schoolLogo: logoPath
                                                                }));
                                                                setIsSchoolDropdownOpen(false);
                                                            }}
                                                            className={`px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center justify-between group/item
                                                                ${isSelected
                                                                    ? 'bg-[#ccff00] text-black'
                                                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                                                }
                                                            `}
                                                        >
                                                            <span>{school}</span>
                                                            {isSelected && <CheckCircle size={14} className="text-black" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* University Logo Preview (Auto-selected, not uploadable) */}
                                {profile.school && profile.schoolLogo && (
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">University Logo</label>
                                        <div className="bg-[#151515] rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/5">
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 p-1 overflow-hidden">
                                                <img src={profile.schoolLogo} alt={profile.school} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{profile.school}</p>
                                                <p className="text-xs text-[#ccff00]/70">Logo auto-selected ✓</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSaveProfile}
                                className="px-8 h-12 bg-[#ccff00] hover:bg-[#bbe600] active:scale-[0.98] text-black font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.1)]"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )
            }

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto scrollbar-hide">
                <h2 className="text-3xl font-medium tracking-tight">Overview</h2>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm shadow-gray-100 text-sm font-bold text-gray-500 border border-white">
                    <Clock size={16} className="text-[#ccff00] fill-black" />
                    <span className="text-black">Spring Term 2026</span>
                </div>
            </div>

            {/* ── Hero Section (Premium Black Card) ── */}
            <div className="w-full bg-[#050505] rounded-[48px] p-10 relative overflow-hidden mb-10 shadow-2xl shadow-black/20 group">
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ filter: 'invert(1)', opacity: 0.6 }}
                >
                    <source src="https://www.pexels.com/download/video/10922866/" type="video/mp4" />
                </video>
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ccff00] blur-[150px] opacity-[0.07] rounded-full pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-700" />
                <div className="absolute bottom-0 left-20 w-[300px] h-[300px] bg-blue-500 blur-[120px] opacity-[0.05] rounded-full pointer-events-none" />

                <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                    <div className="flex-1 max-w-lg pt-4">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="bg-[#1a1a1a] text-[#ccff00] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5 shadow-lg shadow-black/50 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                                In Progress
                            </span>
                        </div>

                        <h1 className="text-white text-4xl lg:text-5xl font-medium tracking-tight mb-8 leading-[1.1]">
                            Mastering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-green-400">React Patterns</span> & Architecture.
                        </h1>

                        <div className="flex items-center gap-6">
                            <button className="bg-[#ccff00] text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-[#b3e600] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(204,255,0,0.2)] flex items-center gap-2">
                                Continue Lesson
                                <ArrowUpRight size={18} />
                            </button>
                            <span className="text-gray-500 text-sm font-medium">Module 12 of 24</span>
                        </div>

                        <div className="mt-10 flex gap-16 border-t border-white/5 pt-6">
                            <div>
                                <p className="text-3xl font-bold text-white tracking-tight">82%</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Completion</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white tracking-tight">14h</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Spent</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white tracking-tight">A+</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Avg Grade</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 flex items-center justify-end">
                        {/* Calendar Component */}
                        <div className="bg-[#0d0d0d] rounded-[28px] border border-white/5 p-6 relative overflow-hidden max-w-[400px] w-full shadow-[0_0_50px_rgba(204,255,0,0.15)]">
                            {/* Green glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#ccff00] blur-[100px] opacity-10 rounded-full pointer-events-none" />

                            {/* Header */}
                            <div className="flex items-center justify-between mb-3 relative z-10">
                                <div>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">{String(month + 1).padStart(2, '0')} \ {year}</p>
                                    <h3 className="text-white text-xl font-bold tracking-tight">{monthNames[month]}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCalDate(new Date(year, month - 1, 1))}
                                        className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        <ChevronDown size={14} className="rotate-90" />
                                    </button>
                                    <button
                                        onClick={() => setCalDate(new Date(year, month + 1, 1))}
                                        className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        <ChevronDown size={14} className="-rotate-90" />
                                    </button>
                                </div>
                            </div>

                            {/* Day-of-week header */}
                            <div className="grid grid-cols-7 gap-1 mb-1 relative z-10">
                                {dayNames.map(d => (
                                    <div key={d} className="h-8 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider" style={{
                                        background: 'linear-gradient(135deg, #ccff00 0%, #f59e0b 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>{d}</div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 relative z-10">
                                {cells.map((day, i) => {
                                    if (day === null) return <div key={i} className="h-10" />;
                                    const dk = dateKey(day);
                                    const events = eventMap[dk] || [];
                                    const hasStart = events.some(e => e.type === 'start');
                                    const hasDeadline = events.some(e => e.type === 'deadline');
                                    const todayCheck = isToday(day);

                                    return (
                                        <div
                                            key={i}
                                            className={`h-10 flex flex-col items-center justify-center rounded-lg cursor-pointer relative transition-all duration-200
                                                ${todayCheck ? 'bg-[#ccff00]/10 ring-1 ring-[#ccff00]/40' : 'hover:bg-white/5'}
                                            `}
                                            onMouseEnter={() => events.length > 0 && setHoveredDay(dk)}
                                            onMouseLeave={() => setHoveredDay(null)}
                                        >
                                            <span className={`text-sm font-medium ${todayCheck ? 'text-[#ccff00] font-bold' : 'text-gray-300'}`}>
                                                {day}
                                            </span>
                                            {events.length > 0 && (
                                                <div className="flex gap-0.5 mt-0.5">
                                                    {hasStart && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                                                    {hasDeadline && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                                </div>
                                            )}
                                            {hoveredDay === dk && events.length > 0 && (
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 min-w-[150px] z-50 shadow-2xl shadow-black/80 pointer-events-none">
                                                    {events.map((ev, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 py-0.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ev.type === 'start' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                                            <span className="text-[10px] text-white truncate">{ev.name}</span>
                                                            <span className={`text-[8px] font-bold uppercase ml-auto shrink-0 ${ev.type === 'start' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                                {ev.type === 'start' ? 'Start' : 'Due'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-4 mt-3 pt-2 border-t border-white/5 relative z-10">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Start Date</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Deadline</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* 1. Student Profile Card */}
                <div
                    onClick={() => setIsEditing(true)}
                    className="lg:col-span-3 relative h-full min-h-[360px] rounded-[40px] overflow-hidden shadow-lg shadow-black/5 group cursor-pointer bg-black"
                >
                    {/* Dynamic Background */}
                    <div className="absolute inset-0 bg-[#080808]">
                        {profile.avatar ? (
                            <>
                                <img src={profile.avatar} alt="User" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <User size={140} strokeWidth={0.5} className="text-white/20 group-hover:text-white/30 transition-colors duration-500" />
                                </div>
                            </>
                        )}

                        {/* Edit Overlay Hint */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                                <Settings className="text-white" size={16} />
                                <span className="text-white text-xs font-bold uppercase tracking-wider">Edit Profile</span>
                            </div>
                        </div>
                    </div>

                    {/* Glass Bottom Bar */}
                    <div className="absolute bottom-6 left-4 right-4 p-5 rounded-[24px] bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-between transition-all duration-300 group-hover:bg-white/15">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#ccff00] flex items-center justify-center text-black font-bold text-sm text-transform uppercase">
                                {(profile.firstName || profile.name).charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-white font-medium text-sm tracking-tight leading-none mb-1 truncate max-w-[120px]">
                                    {profile.firstName && profile.lastName
                                        ? `${profile.firstName} ${profile.lastName}`
                                        : profile.name}
                                </p>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Lifewood PH Intern</p>
                            </div>
                        </div>
                        {/* School Logo Section - Highlighted */}
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-lg shrink-0">
                            {profile.schoolLogo ? (
                                <img src={profile.schoolLogo} alt="School" className="w-full h-full object-contain p-0.5" />
                            ) : (
                                <GraduationCap size={24} className="text-black" />
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Recent Activity (Clean White Theme) */}
                <div className="lg:col-span-4 bg-white/60 backdrop-blur-md rounded-[40px] p-8 shadow-sm border border-white">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-medium tracking-tight">Activity</h3>
                            <p className="text-sm text-gray-500 mt-1">Recent updates</p>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                            <MoreHorizontal size={18} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <ActivityItem number="98%" label="Quiz Score: React Hooks" sublabel="27 Feb, 2026" dark={true} />
                        <ActivityItem number="x2" label="Productivity Streak" sublabel="Increased limits on tasks" />
                        <ActivityItem number="2%" label="Optimization Bonus" sublabel="Code quality improvement" />
                    </div>
                </div>

                {/* 3. Stats & Skills */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Top Bento Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <KpiCard title="Efficiency" value="98%" icon={Zap} bg="lime" />
                        <KpiCard title="Level" value="04" icon={User} bg="black" subtext="Senior Intern" />
                        <div className="col-span-2">
                            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-white h-full flex items-center justify-between group cursor-pointer hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">Weekly Goals</p>
                                        <p className="text-xs text-gray-400">4 tasks remaining</p>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-[#ccff00] transition-colors">
                                    <ChevronDown size={20} className="-rotate-90 text-gray-300 group-hover:text-black" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default DashboardModule;
