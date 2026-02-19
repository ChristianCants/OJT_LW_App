import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Calendar,
    User,
    Clock,
    AlertCircle,
    CheckCircle2,
    Circle,
    MoreVertical,
    Edit,
    Trash2
} from 'lucide-react';

// Mock tasks data
const mockTasksData = [
    { id: 1, title: "React Component Library", description: "Build reusable UI components", assignee: "Sarah Johnson", priority: "high", deadline: "2026-02-15", status: "pending", category: "Development" },
    { id: 2, title: "API Integration", description: "Connect frontend to backend APIs", assignee: "Michael Chen", priority: "high", deadline: "2026-02-14", status: "in-progress", category: "Development" },
    { id: 3, title: "UI/UX Design", description: "Create mockups for dashboard", assignee: "Emma Davis", priority: "medium", deadline: "2026-02-16", status: "in-progress", category: "Design" },
    { id: 4, title: "Database Schema", description: "Design database structure", assignee: "John Smith", priority: "high", deadline: "2026-02-13", status: "completed", category: "Backend" },
    { id: 5, title: "User Testing", description: "Conduct usability tests", assignee: "Lisa Brown", priority: "low", deadline: "2026-02-20", status: "pending", category: "QA" },
    { id: 6, title: "Documentation", description: "Write API documentation", assignee: "David Wilson", priority: "medium", deadline: "2026-02-18", status: "completed", category: "Documentation" },
];

const TaskManagement = () => {
    const [tasks, setTasks] = useState(mockTasksData);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tasksByStatus = {
        pending: filteredTasks.filter(t => t.status === 'pending'),
        'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
        completed: filteredTasks.filter(t => t.status === 'completed'),
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-50';
            case 'medium': return 'text-orange-500 bg-orange-50';
            case 'low': return 'text-blue-500 bg-blue-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={16} className="text-green-500" />;
            case 'in-progress': return <Circle size={16} className="text-blue-500" />;
            case 'pending': return <AlertCircle size={16} className="text-gray-400" />;
            default: return null;
        }
    };

    const TaskCard = ({ task }) => (
        <div
            className="p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                    </span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity">
                    <MoreVertical size={16} className="text-gray-400" />
                </button>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-gray-500">
                    <User size={14} />
                    <span>{task.assignee.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                    <Calendar size={14} />
                    <span>{new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
            </div>
        </div>
    );

    const KanbanColumn = ({ title, status, tasks, color }) => (
        <div className="flex-1 min-w-[280px]">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                        {tasks.length}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="h-full overflow-y-auto pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Create, assign, and track tasks</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowNewTaskModal(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        New Task
                    </button>
                </div>
            </div>

            {/* Stats & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div
                    className="p-4 rounded-2xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                >
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>

                <div
                    className="p-4 rounded-2xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                >
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-blue-500">{tasksByStatus['in-progress'].length}</p>
                </div>

                <div
                    className="p-4 rounded-2xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                >
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-500">{tasksByStatus.completed.length}</p>
                </div>

                <div
                    className="p-4 rounded-2xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                >
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Pending</p>
                    <p className="text-2xl font-bold text-gray-400">{tasksByStatus.pending.length}</p>
                </div>
            </div>

            {/* Search & View Toggle */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-gray-200">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks or assignees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent outline-none text-sm w-full"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${viewMode === 'kanban'
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        Kanban
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${viewMode === 'list'
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        List
                    </button>
                    <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            {viewMode === 'kanban' && (
                <div className="flex gap-6 overflow-x-auto pb-4">
                    <KanbanColumn
                        title="Pending"
                        status="pending"
                        tasks={tasksByStatus.pending}
                        color="bg-gray-400"
                    />
                    <KanbanColumn
                        title="In Progress"
                        status="in-progress"
                        tasks={tasksByStatus['in-progress']}
                        color="bg-blue-500"
                    />
                    <KanbanColumn
                        title="Completed"
                        status="completed"
                        tasks={tasksByStatus.completed}
                        color="bg-green-500"
                    />
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                >
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Task</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assignee</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deadline</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTasks.map(task => (
                                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">{task.title}</p>
                                            <p className="text-xs text-gray-500">{task.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{task.assignee}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getPriorityColor(task.priority)}`}>
                                            {task.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(task.status)}
                                            <span className="text-sm text-gray-700 capitalize">{task.status.replace('-', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <Edit size={16} className="text-gray-600" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} className="text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TaskManagement;
