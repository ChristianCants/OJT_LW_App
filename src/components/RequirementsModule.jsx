import React, { useState } from 'react';
import {
    FileText,
    ExternalLink,
    Search,
    Clock,
    Shield,
    Smartphone,
    PenTool,
    CreditCard,
    User,
    BrainCircuit,
    BookOpen,
    Activity,
    Calendar,
    MessageCircle,
    Download
} from 'lucide-react';

const requirements = [
    { id: 1, title: "Confirmation Letter", icon: FileText, color: "text-blue-500", bg: "bg-blue-50", url: "#" },
    { id: 2, title: "Device Information", icon: Smartphone, color: "text-purple-500", bg: "bg-purple-50", url: "#" },
    { id: 3, title: "E-Signature", icon: PenTool, color: "text-indigo-500", bg: "bg-indigo-50", url: "#" },
    { id: 4, title: "Endorsement", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-50", url: "#" },
    { id: 5, title: "Grade Slip", icon: Activity, color: "text-orange-500", bg: "bg-orange-50", url: "#" },
    { id: 6, title: "ID", icon: User, color: "text-cyan-500", bg: "bg-cyan-50", url: "#" },
    { id: 7, title: "MBTI", icon: BrainCircuit, color: "text-pink-500", bg: "bg-pink-50", url: "#" },
    { id: 8, title: "Study Load", icon: BookOpen, color: "text-rose-500", bg: "bg-rose-50", url: "#" },
    { id: 9, title: "Training Activities", icon: Activity, color: "text-amber-500", bg: "bg-amber-50", url: "#" },
    { id: 10, title: "Weekly Activities", icon: Calendar, color: "text-lime-500", bg: "bg-lime-50", url: "#" },
    { id: 11, title: "WhatsApp QR ID", icon: MessageCircle, color: "text-green-500", bg: "bg-green-50", url: "#" },
];

const RequirementsModule = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRequirements = requirements.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full pb-20 relative">
            {/* Header with Search */}
            <div className="mb-8 p-6 lg:p-10 rounded-[32px] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
                }}
            >
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-2">Requirements</h1>
                    <p className="text-gray-500 font-medium">Manage and access your OJT documents seamlessly.</p>
                </div>

                {/* Search Bar */}
                <div className="relative z-10 w-full md:w-auto min-w-[300px]">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search requirements..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/40 block w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/60 transition-all border border-white/40 shadow-sm"
                            style={{
                                backdropFilter: 'blur(10px)',
                            }}
                        />
                    </div>
                </div>

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none mix-blend-multiply" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRequirements.map((item) => {
                    const Icon = item.icon;
                    return (
                        <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2"
                            style={{
                                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.6)',
                                boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.05)',
                                minHeight: '200px'
                            }}
                        >
                            {/* Card Content */}
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3.5 rounded-2xl ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-sm`}>
                                        <Icon size={28} className={item.color} strokeWidth={1.5} />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <ExternalLink size={14} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                    {item.title}
                                </h3>

                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mt-auto pt-4 border-t border-gray-100/50">
                                    <Clock size={14} />
                                    <span>Sync: Never</span>
                                </div>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </a>
                    );
                })}
            </div>

            {filteredRequirements.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center justify-center animate-fade-in">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Search size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No requirements found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
};

export default RequirementsModule;
