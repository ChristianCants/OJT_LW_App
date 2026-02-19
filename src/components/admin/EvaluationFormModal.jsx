import React, { useState } from 'react';
import { X, User, ChevronDown, Plus, Minus, Check } from 'lucide-react';

const modalGlass = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(40px) saturate(2)',
    WebkitBackdropFilter: 'blur(40px) saturate(2)',
    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
};

const EvaluationFormModal = ({ onClose, onSubmit, interns }) => {
    const [formData, setFormData] = useState({
        internId: '',
        activity: '',
        score: 0,
        design: 20,
        content: 20,
        presentation: 20,
        explanation: 20,
        feedback: '',
        improvements: []
    });

    const [improvementInput, setImprovementInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-calculate final score (Sum of 4 criteria, max 100)
    React.useEffect(() => {
        const total = formData.design + formData.content + formData.presentation + formData.explanation;
        setFormData(prev => ({ ...prev, score: total }));
    }, [formData.design, formData.content, formData.presentation, formData.explanation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            const selectedIntern = interns.find(i => i.id.toString() === formData.internId) || { name: 'Unknown', id: '000', avatar: '?' };

            onSubmit({
                ...formData,
                internName: selectedIntern.name || "Selected Intern",
                instructor: "Admin User", // Mock current user
                instructorRole: "Administrator",
                avatar: selectedIntern.avatar || "SI",
                status: "Evaluated"
            });
            setIsSubmitting(false);
            onClose();
        }, 800);
    };

    const addImprovement = () => {
        if (improvementInput.trim()) {
            setFormData(prev => ({
                ...prev,
                improvements: [...prev.improvements, improvementInput.trim()]
            }));
            setImprovementInput('');
        }
    };

    const removeImprovement = (index) => {
        setFormData(prev => ({
            ...prev,
            improvements: prev.improvements.filter((_, i) => i !== index)
        }));
    };

    // Calculate score color
    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div
                className="relative w-full max-w-6xl rounded-3xl overflow-hidden animate-in fade-in duration-200 flex flex-col max-h-[90vh]"
                style={modalGlass}
            >
                {/* Header */}
                <div className="bg-[#1a2e25] p-6 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold">New Evaluation</h2>
                        <p className="text-emerald-400 text-sm font-medium tracking-wide">ASSESS PERFORMANCE</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="overflow-y-auto p-8 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* 1. Select Intern & Activity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-base font-bold text-gray-700 uppercase tracking-wider">Select Intern</label>
                                <div className="relative">
                                    <select
                                        required
                                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#15803d] focus:border-[#15803d] block w-full p-3.5 pr-10 font-medium"
                                        value={formData.internId}
                                        onChange={e => setFormData({ ...formData, internId: e.target.value })}
                                    >
                                        <option value="">Choose an intern...</option>
                                        {interns.map(intern => (
                                            <option key={intern.id} value={intern.id}>
                                                {intern.name} ({intern.id})
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Project / Activity</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. React API Integration"
                                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#15803d] focus:border-[#15803d] block w-full p-3.5 font-medium"
                                    value={formData.activity}
                                    onChange={e => setFormData({ ...formData, activity: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* 2. Weighted Scores */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Development Section */}
                            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                                <h3 className="text-lg font-bold text-emerald-800 uppercase tracking-wider mb-6 border-b border-emerald-200 pb-3">Development</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-bold text-gray-700">Design & Branding (25 pts)</label>
                                            <span className="text-sm font-bold text-emerald-700">{formData.design} / 25</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="25"
                                            value={formData.design}
                                            onChange={(e) => setFormData({ ...formData, design: parseInt(e.target.value) })}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-bold text-gray-700">Contents (25 pts)</label>
                                            <span className="text-sm font-bold text-emerald-700">{formData.content} / 25</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="25"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: parseInt(e.target.value) })}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Presentation Section */}
                            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                                <h3 className="text-lg font-bold text-blue-800 uppercase tracking-wider mb-6 border-b border-blue-200 pb-3">Presentation & Experience</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-bold text-gray-700">Presentation (25 pts)</label>
                                            <span className="text-sm font-bold text-blue-700">{formData.presentation} / 25</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="25"
                                            value={formData.presentation}
                                            onChange={(e) => setFormData({ ...formData, presentation: parseInt(e.target.value) })}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-bold text-gray-700">Explanation (25 pts)</label>
                                            <span className="text-sm font-bold text-blue-700">{formData.explanation} / 25</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="25"
                                            value={formData.explanation}
                                            onChange={(e) => setFormData({ ...formData, explanation: parseInt(e.target.value) })}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Score Display */}
                        <div className="flex items-center justify-between bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
                            <div>
                                <p className="text-sm font-bold opacity-70 uppercase tracking-wider">Final Grade</p>
                                <p className="text-base opacity-50">Sum of all 4 component scores</p>
                            </div>
                            <div className={`text-6xl font-black ${getScoreColor(formData.score)}`}>
                                {formData.score}
                            </div>
                        </div>

                        {/* 3. Feedback */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Instructor Feedback</label>
                            <textarea
                                required
                                rows="3"
                                placeholder="Detailed feedback on performance..."
                                className="block p-3.5 w-full text-sm text-gray-900 bg-gray-50 rounded-xl border border-gray-200 focus:ring-[#15803d] focus:border-[#15803d] font-medium resize-none"
                                value={formData.feedback}
                                onChange={e => setFormData({ ...formData, feedback: e.target.value })}
                            ></textarea>
                        </div>

                        {/* 4. Improvements */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Areas for Improvement</label>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add an improvement point..."
                                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#15803d] focus:border-[#15803d] block w-full p-3.5 font-medium"
                                    value={improvementInput}
                                    onChange={e => setImprovementInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImprovement())}
                                />
                                <button
                                    type="button"
                                    onClick={addImprovement}
                                    className="p-3.5 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-700 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {formData.improvements.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.improvements.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-orange-50 text-orange-800 px-3 py-1.5 rounded-lg border border-orange-100 text-sm font-bold">
                                            <span>{item}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeImprovement(idx)}
                                                className="hover:text-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] px-6 py-3.5 bg-[#15803d] text-white font-bold rounded-xl hover:bg-[#166534] transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                ) : (
                                    <>
                                        <Check size={20} />
                                        Submit Evaluation
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EvaluationFormModal;
