import React, { useState } from 'react';
import { useRDStudyStore } from '../stores/rdStudyStore';
import { Plus, Search, FlaskConical, TrendingUp, FileText, BarChart3, CheckCircle, Clock, Pause, XCircle } from 'lucide-react';
import { NewRDStudyModal } from '../components/NewRDStudyModal';
import { RDStudyDetailsModal } from '../components/RDStudyDetailsModal';

export const RDStudies: React.FC = () => {
    const { studies } = useRDStudyStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'dissolution_comparability' | 'formulation_development' | 'process_optimization' | 'analytical_method' | 'other'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'>('all');
    const [isNewStudyModalOpen, setIsNewStudyModalOpen] = useState(false);
    const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);

    // Filter studies
    const filteredStudies = studies.filter(study => {
        const matchesSearch =
            study.studyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            study.studyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            study.productName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' || study.studyType === filterType;
        const matchesStatus = filterStatus === 'all' || study.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'planning':
                return <Clock className="w-4 h-4 text-info-500" />;
            case 'in_progress':
                return <TrendingUp className="w-4 h-4 text-primary-500" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-success-500" />;
            case 'on_hold':
                return <Pause className="w-4 h-4 text-warning-500" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-danger-500" />;
            default:
                return null;
        }
    };

    const getStudyTypeLabel = (type: string) => {
        switch (type) {
            case 'dissolution_comparability':
                return 'Dissolution Comparability';
            case 'formulation_development':
                return 'Formulation Development';
            case 'process_optimization':
                return 'Process Optimization';
            case 'analytical_method':
                return 'Analytical Method';
            case 'other':
                return 'Other';
            default:
                return type;
        }
    };

    const getStudyTypeIcon = (type: string) => {
        switch (type) {
            case 'dissolution_comparability':
                return <BarChart3 className="w-5 h-5" />;
            case 'formulation_development':
                return <FlaskConical className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Research & Development Studies</h1>
                    <p className="text-slate-500">Manage R&D studies, dissolution profiles, and comparability analyses</p>
                </div>
                <button
                    onClick={() => setIsNewStudyModalOpen(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New R&D Study
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Studies</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{studies.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <FlaskConical className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                {studies.filter(s => s.status === 'in_progress').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-info-100 dark:bg-info-900/30 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-info-600 dark:text-info-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                {studies.filter(s => s.status === 'completed').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Dissolution Studies</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                {studies.filter(s => s.studyType === 'dissolution_comparability').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-warning-600 dark:text-warning-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="card">
                <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by study number, title, or product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="input w-64"
                    >
                        <option value="all">All Study Types</option>
                        <option value="dissolution_comparability">Dissolution Comparability</option>
                        <option value="formulation_development">Formulation Development</option>
                        <option value="process_optimization">Process Optimization</option>
                        <option value="analytical_method">Analytical Method</option>
                        <option value="other">Other</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="input w-48"
                    >
                        <option value="all">All Status</option>
                        <option value="planning">Planning</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Studies List */}
            {filteredStudies.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FlaskConical className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No R&D Studies</h3>
                    <p className="text-slate-500 mb-4">
                        {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                            ? 'No studies match your search criteria.'
                            : 'Get started by creating your first R&D study.'}
                    </p>
                    <button
                        onClick={() => setIsNewStudyModalOpen(true)}
                        className="btn btn-primary inline-flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create R&D Study
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredStudies.map((study) => (
                        <div
                            key={study.id}
                            onClick={() => setSelectedStudyId(study.id)}
                            className="card hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                            {getStudyTypeIcon(study.studyType)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {study.studyNumber}
                                            </h3>
                                            <p className="text-sm text-slate-500">{study.studyTitle}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`badge ${study.status === 'completed' ? 'badge-success' :
                                        study.status === 'in_progress' ? 'badge-primary' :
                                            study.status === 'on_hold' ? 'badge-warning' :
                                                study.status === 'cancelled' ? 'badge-danger' :
                                                    'badge-info'
                                        }`}>
                                        {getStatusIcon(study.status)}
                                        <span className="ml-1 capitalize">{study.status.replace('_', ' ')}</span>
                                    </span>
                                    <span className="badge badge-info">
                                        {getStudyTypeLabel(study.studyType)}
                                    </span>
                                </div>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                <span className="font-medium">Product:</span> {study.productName}
                            </p>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                <span className="font-medium">Objective:</span> {study.objective}
                            </p>

                            {/* Study Metrics */}
                            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Lead Scientist</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {study.leadScientist}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Start Date</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {new Date(study.startDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Parameters</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {study.parameters.length} defined
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Dissolution Profiles</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {study.dissolutionProfiles?.length || 0} profiles
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <NewRDStudyModal
                isOpen={isNewStudyModalOpen}
                onClose={() => setIsNewStudyModalOpen(false)}
            />

            {selectedStudyId && (
                <RDStudyDetailsModal
                    studyId={selectedStudyId}
                    isOpen={!!selectedStudyId}
                    onClose={() => setSelectedStudyId(null)}
                />
            )}
        </div>
    );
};
