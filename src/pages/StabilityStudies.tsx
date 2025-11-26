import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStabilityStore } from '../stores/stabilityStore';

import { Plus, Search, Filter, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { NewStabilityStudyModal } from '../components/NewStabilityStudyModal';
import { StabilityStudyDetailsModal } from '../components/StabilityStudyDetailsModal';

export const StabilityStudies: React.FC = () => {
    const navigate = useNavigate();
    const { studies } = useStabilityStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Filter studies
    const filteredStudies = studies.filter(study => {
        const matchesSearch =
            study.studyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            study.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            study.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || study.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <Clock className="w-4 h-4 text-primary-500" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-success-500" />;
            case 'discontinued':
                return <AlertCircle className="w-4 h-4 text-danger-500" />;
            default:
                return null;
        }
    };

    const getStudyTypeLabel = (type: string) => {
        switch (type) {
            case 'long_term':
                return 'Long-term';
            case 'intermediate':
                return 'Intermediate';
            case 'accelerated':
                return 'Accelerated';
            case 'stress':
                return 'Stress';
            default:
                return type;
        }
    };

    const getCompletionPercentage = (study: any) => {
        if (!study.timePoints || study.timePoints.length === 0) return 0;
        const completed = study.timePoints.filter((tp: any) => tp.status === 'completed').length;
        return Math.round((completed / study.timePoints.length) * 100);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stability Studies</h1>
                    <p className="text-slate-500">Monitor drug stability over time under various storage conditions</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/analytics')}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <TrendingUp className="w-5 h-5" />
                        Analytics
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Study
                    </button>
                </div>
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
                            <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Active Studies</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                {studies.filter(s => s.status === 'active').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-success-600 dark:text-success-400" />
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
                        <div className="w-12 h-12 bg-info-100 dark:bg-info-900/30 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-info-600 dark:text-info-400" />
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Products Monitored</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                {new Set(studies.map(s => s.productId)).size}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-warning-600 dark:text-warning-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="card">
                <div className="flex gap-4 items-center">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by study number, product, or batch..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="input w-48"
                    >
                        <option value="all">All Studies</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? 'Hide Filters' : 'More Filters'}
                    </button>
                </div>
            </div>

            {/* Studies List */}
            {filteredStudies.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Stability Studies</h3>
                    <p className="text-slate-500 mb-4">
                        {searchTerm || filterStatus !== 'all'
                            ? 'No studies match your search criteria.'
                            : 'Get started by creating your first stability study.'}
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary inline-flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Stability Study
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredStudies.map((study) => {
                        const completion = getCompletionPercentage(study);

                        return (
                            <div
                                key={study.id}
                                onClick={() => setSelectedStudyId(study.id)}
                                className="card hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {study.studyNumber}
                                            </h3>
                                            <span className={`badge ${study.status === 'active' ? 'badge-success' :
                                                study.status === 'completed' ? 'badge-info' :
                                                    'badge-warning'
                                                }`}>
                                                {getStatusIcon(study.status)}
                                                <span className="ml-1 capitalize">{study.status}</span>
                                            </span>
                                            <span className="badge badge-info">
                                                {getStudyTypeLabel(study.studyType)}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                                            {study.productName}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            Batch: {study.batchNumber}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">Storage Condition</p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {study.storageCondition.temperature}
                                        </p>
                                        {study.storageCondition.humidity && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {study.storageCondition.humidity}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                                        <span className="font-medium text-slate-900 dark:text-white">{completion}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${completion}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Study Details */}
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Start Date</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {new Date(study.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Time Points</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {study.timePoints?.length || 0} scheduled
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Created By</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {study.createdBy}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <NewStabilityStudyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {selectedStudyId && (
                <StabilityStudyDetailsModal
                    studyId={selectedStudyId}
                    isOpen={!!selectedStudyId}
                    onClose={() => setSelectedStudyId(null)}
                />
            )}
        </div>
    );
};
