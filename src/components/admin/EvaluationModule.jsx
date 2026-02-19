import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    FileText,
    CheckCircle2,
    X,
    Download,
    User,
    ChevronRight,
    Award,
    Quote,
    Plus
} from 'lucide-react';
import EvaluationFormModal from './EvaluationFormModal';

/* ── Reusable glass style ────────────────────────────────── */
const glass = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 8px 32px rgba(31,38,135,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
};

const modalGlass = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(40px) saturate(2)',
    WebkitBackdropFilter: 'blur(40px) saturate(2)',
    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
};

// Mock Data
const mockEvaluations = [];

const EvaluationModule = () => {
    const [selectedEval, setSelectedEval] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [evaluations, setEvaluations] = useState(mockEvaluations);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Mock interns data for the dropdown
    const mockInterns = [];

    const filteredEvals = evaluations.filter(ev =>
        ev.internName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.activity.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateEvaluation = (newEval) => {
        const evaluation = {
            id: evaluations.length + 1,
            ...newEval
        };
        setEvaluations([evaluation, ...evaluations]);
        setShowCreateModal(false);
    };

    return (
        <div className="h-full overflow-y-auto pb-8 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Evaluations</h1>
                    <p className="text-sm text-gray-500 mt-1">Review performance and provide detailed feedback</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-[#15803d] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 hover:bg-[#166534] transition-all"
                    >
                        <Plus size={18} />
                        Evaluate Intern
                    </button>
                    <div className="flex-1 max-w-lg flex items-center gap-2 bg-white/40 backdrop-blur-sm border border-white/40 px-4 py-2.5 rounded-xl shadow-sm">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search interns by name or activity..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none text-sm w-full font-medium text-gray-700 placeholder:text-gray-400"
                        />
                    </div>
                    <button className="p-2 bg-white/40 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/60 transition-colors">
                        <Filter size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvals.map(ev => (
                    <div
                        key={ev.id}
                        onClick={() => setSelectedEval(ev)}
                        className="group relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                        style={glass}
                    >
                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold
                            ${ev.status === 'Evaluated' ? 'bg-green-100/80 text-green-700' : 'bg-orange-100/80 text-orange-700'}`}>
                            {ev.status}
                        </div>

                        <div className="flex flex-col h-full justify-between">
                            <div className="mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-black text-white flex items-center justify-center text-xl font-bold shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                    {ev.avatar}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{ev.internName}</h3>
                                <p className="text-sm text-gray-500 font-medium">ID: {ev.internId}</p>
                            </div>

                            <div className="bg-white/40 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Latest Activity</p>
                                <p className="text-sm font-bold text-gray-800 line-clamp-1">{ev.activity}</p>
                                {ev.score !== null && (
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-500">Score</span>
                                        <span className={`text-lg font-extrabold ${ev.score >= 90 ? 'text-green-600' : 'text-blue-600'}`}>
                                            {ev.score}/100
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Modal */}
            {selectedEval && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedEval(null)}
                    />

                    <div
                        className="relative w-full max-w-6xl rounded-3xl overflow-hidden animate-in fade-in duration-200"
                        style={modalGlass}
                    >
                        {/* Modal Header (Dark) */}
                        <div className="bg-[#1a2e25] p-6 text-white relative overflow-hidden">
                            {/* Decorative Pattern */}
                            <div className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.4) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.4) 0%, transparent 20%)'
                                }}
                            />

                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400 mb-2">
                                        {selectedEval.internName}
                                    </p>
                                    <h2 className="text-3xl font-bold leading-tight">
                                        {selectedEval.activity}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedEval(null)}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                                >
                                    <X size={20} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Score Card */}
                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Final Score</p>
                                    <div className="text-6xl font-black text-emerald-800 tracking-tighter">
                                        {selectedEval.score ?? '--'}
                                        <span className="text-2xl text-emerald-400 font-bold ml-1">/100</span>
                                    </div>
                                </div>

                                {/* Instructor Card */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold">
                                            {selectedEval.instructor.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{selectedEval.instructor}</p>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">{selectedEval.instructorRole}</p>
                                        </div>
                                    </div>
                                    <div className="relative pl-6 py-2">
                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-yellow-400/50 rounded-full" />
                                        <Quote size={12} className="text-yellow-500 mb-1" />
                                        <p className="text-sm text-gray-600 italic leading-relaxed">
                                            "{selectedEval.feedback || 'No feedback provided yet.'}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Criteria Breakdown */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">Development</h4>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600 font-medium">Design & Branding</span>
                                                <span className="text-xs font-bold text-emerald-700">{selectedEval.design !== undefined ? selectedEval.design : '--'}/25</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(((selectedEval.design || 0) / 25) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600 font-medium">Contents</span>
                                                <span className="text-xs font-bold text-emerald-700">{selectedEval.content !== undefined ? selectedEval.content : '--'}/25</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(((selectedEval.content || 0) / 25) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Presentation</h4>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600 font-medium">Presentation</span>
                                                <span className="text-xs font-bold text-blue-700">{selectedEval.presentation !== undefined ? selectedEval.presentation : '--'}/25</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(((selectedEval.presentation || 0) / 25) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600 font-medium">Explanation</span>
                                                <span className="text-xs font-bold text-blue-700">{selectedEval.explanation !== undefined ? selectedEval.explanation : '--'}/25</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(((selectedEval.explanation || 0) / 25) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Areas for Improvement */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-orange-400 rounded-full" />
                                    Areas for Improvement
                                </h3>
                                <div className="space-y-3">
                                    {selectedEval.improvements && selectedEval.improvements.length > 0 ? (
                                        selectedEval.improvements.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                                                <p className="text-sm text-gray-700 font-medium">{item}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic pl-4">None listed.</p>
                                    )}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex gap-3">
                                <button className="flex-1 bg-[#1a2e25] text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-green-900/20 hover:bg-[#233d31] transition-all flex items-center justify-center gap-2">
                                    <Download size={18} />
                                    Download Detailed Report
                                </button>
                                <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Create Evaluation Modal */}
            {
                showCreateModal && (
                    <EvaluationFormModal
                        onClose={() => setShowCreateModal(false)}
                        onSubmit={handleCreateEvaluation}
                        interns={mockInterns}
                    />
                )
            }
        </div >
    );
};

export default EvaluationModule;
