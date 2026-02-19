import React from 'react';
import {
    Trophy,
    CheckCircle2,
    FileText,
    ClipboardList,
    BarChart3,
    Award,
    Users
} from 'lucide-react';

const glass = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 8px 32px rgba(31,38,135,0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
};

const performanceData = [
    { id: 1, lastName: 'Antopina', firstName: 'John Wrexel', gamma: 90, mindmap: 93.66, prompt: null, planning: 88.93, avatars: null, chatbotUI: 88.74, chatbotDocs: 95.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.7 },
    { id: 2, lastName: 'Barluado', firstName: 'Francis Merc', gamma: 92, mindmap: 93.6, prompt: null, planning: 89, avatars: null, chatbotUI: 91.58, chatbotDocs: 96.67, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 92.7 },
    { id: 3, lastName: 'Cabrillos', firstName: 'Dane Kiev', gamma: 88, mindmap: 93.78, prompt: null, planning: 88.96, avatars: null, chatbotUI: null, chatbotDocs: null, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.4 },
    { id: 4, lastName: 'Cagampang', firstName: 'Emmanuel Jr.', gamma: 88, mindmap: 93.8, prompt: null, planning: 89.09, avatars: null, chatbotUI: 88.74, chatbotDocs: 93.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.2 },
    { id: 5, lastName: 'Casidsid', firstName: 'Twinky', gamma: 100, mindmap: 93.79, prompt: null, planning: 89.04, avatars: null, chatbotUI: 91.96, chatbotDocs: 98, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 93.2 },
    { id: 6, lastName: 'Castrodes', firstName: 'Atilla Hadrian', gamma: 97, mindmap: 93.55, prompt: null, planning: 89.07, avatars: null, chatbotUI: 91.04, chatbotDocs: 99.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 93.2 },
    { id: 7, lastName: 'Damayo', firstName: 'Jholmer', gamma: 95, mindmap: 93.47, prompt: null, planning: 88.68, avatars: null, chatbotUI: 88.81, chatbotDocs: 92.67, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 90.9 },
    { id: 8, lastName: 'Francisco', firstName: 'Ezzel Jan', gamma: 97, mindmap: 93.67, prompt: null, planning: 88.7, avatars: null, chatbotUI: 93.91, chatbotDocs: 98, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 93.6 },
    { id: 9, lastName: 'Gelborion', firstName: 'Francis Dave', gamma: 93, mindmap: 93.53, prompt: null, planning: 88.64, avatars: null, chatbotUI: 89.76, chatbotDocs: 93, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.2 },
    { id: 10, lastName: 'Inocentes', firstName: 'Jose Danielle', gamma: 94, mindmap: 93.63, prompt: null, planning: 89.02, avatars: null, chatbotUI: 90.13, chatbotDocs: 92.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.3 },
    { id: 11, lastName: 'Jumao-as', firstName: 'Andre Daniel', gamma: 94, mindmap: 93.47, prompt: null, planning: 89.15, avatars: null, chatbotUI: 90.58, chatbotDocs: 92.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.4 },
    { id: 12, lastName: 'Lico', firstName: 'Trixie Sandra', gamma: 93, mindmap: 93.29, prompt: null, planning: 89.63, avatars: null, chatbotUI: null, chatbotDocs: null, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.5 },
    { id: 13, lastName: 'Mahasol', firstName: 'Jayred Deil', gamma: 94, mindmap: 93.38, prompt: null, planning: 89.84, avatars: null, chatbotUI: 90.58, chatbotDocs: 92.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.5 },
    { id: 14, lastName: 'Mandado', firstName: 'Gerard Luis', gamma: 92, mindmap: 93.5, prompt: 90.43, planning: null, avatars: null, chatbotUI: 91.58, chatbotDocs: 99, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 93.6 },
    { id: 15, lastName: 'Mumar', firstName: 'Justine Mhars', gamma: 91, mindmap: 93.27, prompt: null, planning: 90.58, avatars: null, chatbotUI: 88.98, chatbotDocs: 94.67, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.9 },
    { id: 16, lastName: 'Nillama', firstName: 'Francis Garry', gamma: 94, mindmap: 93, prompt: null, planning: 90.5, avatars: null, chatbotUI: null, chatbotDocs: null, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.8 },
    { id: 17, lastName: 'Paug', firstName: 'Mart Francesfil', gamma: 96, mindmap: 94, prompt: null, planning: 90.56, avatars: null, chatbotUI: null, chatbotDocs: null, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 92.3 },
    { id: 18, lastName: 'Pegarido', firstName: 'Sol Andrew', gamma: 100, mindmap: 92, prompt: null, planning: 89.94, avatars: null, chatbotUI: null, chatbotDocs: null, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.0 },
    { id: 19, lastName: 'Prandas', firstName: 'Jumar', gamma: 95, mindmap: 93.3, prompt: null, planning: 89.61, avatars: null, chatbotUI: null, chatbotDocs: null, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.5 },
    { id: 20, lastName: 'Quitco', firstName: 'Kyle Matthew', gamma: 98, mindmap: 93.06, prompt: null, planning: 89.73, avatars: null, chatbotUI: 92.93, chatbotDocs: 97.67, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 93.3 },
    { id: 21, lastName: 'Soriano', firstName: 'Darin Jan', gamma: 90, mindmap: 92.44, prompt: null, planning: 89.7, avatars: null, chatbotUI: 89.18, chatbotDocs: 94.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.4 },
    { id: 22, lastName: 'Sungahid', firstName: 'Raily', gamma: 93, mindmap: 92.64, prompt: null, planning: 89.96, avatars: null, chatbotUI: 89.42, chatbotDocs: 94, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.5 },
    { id: 23, lastName: 'Tacatani', firstName: 'Dominic', gamma: 97, mindmap: 93.08, prompt: null, planning: 90.33, avatars: null, chatbotUI: 92.44, chatbotDocs: 97.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 93.3 },
    { id: 24, lastName: 'Tampepe', firstName: 'Prince Christian', gamma: 96, mindmap: 93.5, prompt: null, planning: 90.72, avatars: null, chatbotUI: 90.76, chatbotDocs: 92.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.8 },
    { id: 25, lastName: 'Tumungha', firstName: 'Hara Alexa', gamma: 93, mindmap: 93.38, prompt: null, planning: 89.13, avatars: null, chatbotUI: 89.42, chatbotDocs: 93.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 91.3 },
    { id: 26, lastName: 'Ugdamin', firstName: 'Willa Mae', gamma: 94, mindmap: 92.33, prompt: null, planning: 89.75, avatars: null, chatbotUI: 91.36, chatbotDocs: 97.33, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 92.7 },
    { id: 27, lastName: 'Vargas', firstName: 'Harvey', gamma: 92, mindmap: 90.75, prompt: null, planning: 89, avatars: null, chatbotUI: null, chatbotDocs: null, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 89.9 },
    { id: 28, lastName: 'Vergara', firstName: 'Aleah June', gamma: 91, mindmap: 89.5, prompt: null, planning: 90, avatars: null, chatbotUI: null, chatbotDocs: null, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 89.8 },
    { id: 29, lastName: 'Villaflor', firstName: 'Philip Vincent', gamma: 94, mindmap: 92, prompt: 98.67, planning: null, avatars: null, chatbotUI: null, chatbotDocs: null, webFE: null, webBE: null, gameDev: null, aiModel: null, aiResearch: null, dataAnalytics: null, hakathon: null, finalGrade: 95.3 },
];

const ScoringMetricsModule = () => {
    // Calculate Stats
    const totalInterns = performanceData.length;
    const avgScore = (performanceData.reduce((acc, curr) => acc + curr.finalGrade, 0) / totalInterns).toFixed(1);
    const passingRate = ((performanceData.filter(i => i.finalGrade >= 75).length / totalInterns) * 100).toFixed(1);

    // Get Top 3
    const topPerformers = [...performanceData]
        .sort((a, b) => b.finalGrade - a.finalGrade)
        .slice(0, 3)
        .map((p, i) => ({
            name: `${p.firstName} ${p.lastName}`,
            score: p.finalGrade,
            rank: i + 1,
            color: i === 0 ? 'from-yellow-400 to-yellow-600' : i === 1 ? 'from-slate-300 to-slate-500' : 'from-orange-400 to-orange-600'
        }));

    return (
        <div className="h-full overflow-y-auto pb-8 animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Scoring Metrics</h1>
                <p className="text-sm text-gray-500 mt-1">Detailed performance analytics for Batch 8 Interns</p>
            </div>

            <div className="space-y-6">
                {/* Metrics Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Avg. Final Grade', value: `${avgScore}%`, icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                        { label: 'Passing Rate', value: `${passingRate}%`, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
                        { label: 'Total Interns', value: totalInterns, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                        { label: 'Highest Grade', value: `${Math.max(...performanceData.map(p => p.finalGrade))}%`, icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
                    ].map((stat, i) => (
                        <div key={i} className="p-5 rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.02]" style={glass}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xl font-black text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Performance Breakdown by Range */}
                    <div className="p-6 rounded-2xl flex flex-col min-h-[320px] lg:col-span-2" style={glass}>
                        <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BarChart3 size={18} className="text-blue-500" />
                            Grade Distribution
                        </h3>
                        <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2">
                            {[
                                { range: '85-90', count: performanceData.filter(p => p.finalGrade >= 85 && p.finalGrade < 90).length },
                                { range: '90-91', count: performanceData.filter(p => p.finalGrade >= 90 && p.finalGrade < 91).length },
                                { range: '91-92', count: performanceData.filter(p => p.finalGrade >= 91 && p.finalGrade < 92).length },
                                { range: '92-93', count: performanceData.filter(p => p.finalGrade >= 92 && p.finalGrade < 93).length },
                                { range: '93-94', count: performanceData.filter(p => p.finalGrade >= 93 && p.finalGrade < 94).length },
                                { range: '94-96', count: performanceData.filter(p => p.finalGrade >= 94).length },
                            ].map((bar, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                    <div className="w-full bg-blue-500/10 rounded-t-lg relative group-hover:bg-blue-500/20 transition-all flex flex-col justify-end" style={{ height: '100%' }}>
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out animate-grow"
                                            style={{ height: `${(bar.count / totalInterns) * 400}%` }}
                                        />
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                            {bar.count} Interns
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{bar.range}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div className="p-6 rounded-2xl" style={glass}>
                        <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-500" />
                            Top Performers
                        </h3>
                        <div className="space-y-4">
                            {topPerformers.map((person, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-white/60">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${person.color} flex items-center justify-center text-white font-black text-sm shadow-md italic`}>
                                        #{person.rank}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900">{person.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="h-1 flex-1 bg-black/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gray-900 rounded-full" style={{ width: `${person.score}%` }} />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-900">{person.score}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Data Table */}
                <div className="p-0 rounded-2xl overflow-hidden" style={glass}>
                    <div className="p-6 border-b border-white/40">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <ClipboardList size={18} className="text-blue-500" />
                            Training Activities Matrix (Batch 8)
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/40 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 sticky left-0 bg-white/40 backdrop-blur-md z-10 border-r border-white/20 whitespace-nowrap">Name</th>
                                    <th className="px-4 py-4 text-center">Gamma</th>
                                    <th className="px-4 py-4 text-center">Mindmap</th>
                                    <th className="px-4 py-4 text-center">Prompt Eng.</th>
                                    <th className="px-4 py-4 text-center">Planning</th>
                                    <th className="px-4 py-4 text-center">Chatbot UI</th>
                                    <th className="px-4 py-4 text-center">Chatbot Doc</th>
                                    <th className="px-4 py-4 text-center bg-blue-50/50">Final Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/20">
                                {performanceData.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/60 transition-colors group">
                                        <td className="px-6 py-4 sticky left-0 bg-white/10 backdrop-blur-sm z-10 border-r border-white/20 font-bold text-sm text-gray-900 whitespace-nowrap">
                                            {p.lastName}, {p.firstName}
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm font-medium text-gray-600">{p.gamma || '-'}</td>
                                        <td className="px-4 py-4 text-center text-sm font-medium text-gray-600">{p.mindmap || '-'}</td>
                                        <td className="px-4 py-4 text-center text-sm font-medium text-gray-600">{p.prompt || '-'}</td>
                                        <td className="px-4 py-4 text-center text-sm font-medium text-gray-600">{p.planning || '-'}</td>
                                        <td className="px-4 py-4 text-center text-sm font-medium text-gray-600">{p.chatbotUI || '-'}</td>
                                        <td className="px-4 py-4 text-center text-sm font-medium text-gray-600">{p.chatbotDocs || '-'}</td>
                                        <td className="px-4 py-4 text-center bg-blue-50/30">
                                            <span className={`inline-flex px-2 py-1 rounded-lg font-black text-xs ${p.finalGrade >= 93 ? 'text-green-600 bg-green-100' : p.finalGrade >= 91 ? 'text-blue-600 bg-blue-100' : 'text-gray-700 bg-gray-100'}`}>
                                                {p.finalGrade}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoringMetricsModule;
