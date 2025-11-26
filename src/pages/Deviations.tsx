import React, { useState } from 'react';
import { useDeviationStore } from '../stores/deviationStore';
import { useAuthStore } from '../stores/authStore';
import { DeviationModal } from '../components/DeviationModal';
import { CAPAModal } from '../components/CAPAModal';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    FileText,
    Plus,
    Search,
    TrendingUp,
    XCircle,
    Calendar,
    User,
    Download
} from 'lucide-react';
import { format } from 'date-fns';
import type { DeviationStatus, DeviationSeverity, CAPAStatus } from '../types/deviation';
import { generateDeviationReport, generateCAPAReport } from '../utils/reportGenerator';

export const Deviations: React.FC = () => {
    const { deviations, capas, updateDeviationStatus, updateCAPAStatus } = useDeviationStore();
    const { user } = useAuthStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<DeviationStatus | 'all'>('all');
    const [filterSeverity, setFilterSeverity] = useState<DeviationSeverity | 'all'>('all');
    const [activeTab, setActiveTab] = useState<'deviations' | 'capas'>('deviations');

    // Modal State
    const [isDeviationModalOpen, setIsDeviationModalOpen] = useState(false);
    const [isCAPAModalOpen, setIsCAPAModalOpen] = useState(false);
    const [selectedDeviationId, setSelectedDeviationId] = useState<string | null>(null);
    const [selectedCAPAId, setSelectedCAPAId] = useState<string | null>(null);

    // Filter deviations
    const filteredDeviations = deviations.filter(dev => {
        const matchesSearch = dev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dev.deviationNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || dev.status === filterStatus;
        const matchesSeverity = filterSeverity === 'all' || dev.severity === filterSeverity;
        return matchesSearch && matchesStatus && matchesSeverity;
    });

    // Statistics
    const stats = {
        total: deviations.length,
        open: deviations.filter(d => d.status === 'open' || d.status === 'under_investigation').length,
        critical: deviations.filter(d => d.severity === 'critical').length,
        closed: deviations.filter(d => d.status === 'closed').length,
        totalCAPAs: capas.length,
        openCAPAs: capas.filter(c => c.status === 'open' || c.status === 'in_progress').length
    };

    const getSeverityColor = (severity: DeviationSeverity) => {
        switch (severity) {
            case 'critical': return 'bg-danger-100 text-danger-700 border-danger-200';
            case 'major': return 'bg-warning-100 text-warning-700 border-warning-200';
            case 'minor': return 'bg-primary-100 text-primary-700 border-primary-200';
        }
    };

    const getStatusColor = (status: DeviationStatus | CAPAStatus) => {
        switch (status) {
            case 'open': return 'bg-slate-100 text-slate-700';
            case 'under_investigation':
            case 'in_progress': return 'bg-primary-100 text-primary-700';
            case 'pending_approval':
            case 'pending_verification': return 'bg-warning-100 text-warning-700';
            case 'approved':
            case 'verified': return 'bg-success-100 text-success-700';
            case 'closed': return 'bg-slate-200 text-slate-600';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status: DeviationStatus | CAPAStatus) => {
        switch (status) {
            case 'open': return Clock;
            case 'under_investigation':
            case 'in_progress': return TrendingUp;
            case 'pending_approval':
            case 'pending_verification': return AlertTriangle;
            case 'approved':
            case 'verified': return CheckCircle2;
            case 'closed': return XCircle;
            default: return FileText;
        }
    };

    const handleNewDeviation = () => {
        setSelectedDeviationId(null);
        setIsDeviationModalOpen(true);
    };

    const handleEditDeviation = (id: string) => {
        setSelectedDeviationId(id);
        setIsDeviationModalOpen(true);
    };

    const handleNewCAPA = () => {
        setSelectedCAPAId(null);
        setIsCAPAModalOpen(true);
    };

    const handleEditCAPA = (id: string) => {
        setSelectedCAPAId(id);
        setIsCAPAModalOpen(true);
    };

    const handleStatusChange = (id: string, newStatus: DeviationStatus, type: 'deviation') => {
        if (type === 'deviation') {
            updateDeviationStatus(id, newStatus, user?.id || 'unknown');
        }
    };

    const handleCAPAStatusChange = (id: string, newStatus: CAPAStatus) => {
        updateCAPAStatus(id, newStatus, user?.id || 'unknown');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Deviations & CAPA</h1>
                    <p className="text-slate-500">Manage quality deviations and corrective/preventive actions</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (activeTab === 'deviations') {
                                generateDeviationReport(filteredDeviations, user?.username || 'Unknown');
                            } else {
                                generateCAPAReport(capas, user?.username || 'Unknown');
                            }
                        }}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Generate Report
                    </button>
                    {activeTab === 'deviations' ? (
                        <button onClick={handleNewDeviation} className="btn btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Deviation
                        </button>
                    ) : (
                        <button onClick={handleNewCAPA} className="btn btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New CAPA
                        </button>
                    )}
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500">Total Deviations</span>
                        <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500">Open</span>
                        <Clock className="w-5 h-5 text-warning-500" />
                    </div>
                    <p className="text-3xl font-bold text-warning-600">{stats.open}</p>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500">Critical</span>
                        <AlertTriangle className="w-5 h-5 text-danger-500" />
                    </div>
                    <p className="text-3xl font-bold text-danger-600">{stats.critical}</p>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500">Open CAPAs</span>
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                    </div>
                    <p className="text-3xl font-bold text-primary-600">{stats.openCAPAs}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="card p-0">
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('deviations')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'deviations'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Deviations ({deviations.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('capas')}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'capas'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            CAPAs ({capas.length})
                        </button>
                    </div>
                </div>

                {/* Filters */}
                {activeTab === 'deviations' && (
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search deviations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input pl-10"
                                />
                            </div>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as DeviationStatus | 'all')}
                                className="input"
                            >
                                <option value="all">All Statuses</option>
                                <option value="open">Open</option>
                                <option value="under_investigation">Under Investigation</option>
                                <option value="pending_approval">Pending Approval</option>
                                <option value="approved">Approved</option>
                                <option value="closed">Closed</option>
                            </select>

                            <select
                                value={filterSeverity}
                                onChange={(e) => setFilterSeverity(e.target.value as DeviationSeverity | 'all')}
                                className="input"
                            >
                                <option value="all">All Severities</option>
                                <option value="critical">Critical</option>
                                <option value="major">Major</option>
                                <option value="minor">Minor</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'deviations' ? (
                        <div className="space-y-4">
                            {filteredDeviations.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">No deviations found</p>
                                </div>
                            ) : (
                                filteredDeviations.map((deviation) => {
                                    const StatusIcon = getStatusIcon(deviation.status);
                                    const linkedCAPAs = capas.filter(c => deviation.capaIds.includes(c.id));

                                    return (
                                        <div key={deviation.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-bold text-slate-900 dark:text-white">
                                                            {deviation.deviationNumber}
                                                        </h3>
                                                        <span className={`badge ${getSeverityColor(deviation.severity)} border`}>
                                                            {deviation.severity.toUpperCase()}
                                                        </span>
                                                        <span className={`badge ${getStatusColor(deviation.status)}`}>
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {deviation.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {deviation.title}
                                                    </p>
                                                    <p className="text-sm text-slate-500 mb-3">
                                                        {deviation.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                                        {deviation.batchNumber && (
                                                            <span className="flex items-center gap-1">
                                                                <FileText className="w-4 h-4" />
                                                                Batch: {deviation.batchNumber}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {format(new Date(deviation.reportedDate), 'MMM dd, yyyy')}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-4 h-4" />
                                                            {deviation.reportedBy}
                                                        </span>
                                                    </div>

                                                    {linkedCAPAs.length > 0 && (
                                                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                            <p className="text-sm font-medium text-slate-600 mb-2">
                                                                Linked CAPAs ({linkedCAPAs.length}):
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {linkedCAPAs.map(capa => (
                                                                    <span key={capa.id} className="badge badge-info">
                                                                        {capa.capaNumber}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleEditDeviation(deviation.id)}
                                                        className="btn btn-secondary text-sm"
                                                    >
                                                        Edit / View
                                                    </button>
                                                    {deviation.status === 'open' && (
                                                        <button
                                                            onClick={() => handleStatusChange(deviation.id, 'under_investigation', 'deviation')}
                                                            className="btn btn-primary text-sm"
                                                        >
                                                            Start Investigation
                                                        </button>
                                                    )}
                                                    {deviation.status === 'under_investigation' && (
                                                        <button
                                                            onClick={() => handleStatusChange(deviation.id, 'closed', 'deviation')}
                                                            className="btn btn-success text-sm"
                                                        >
                                                            Close Deviation
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {capas.length === 0 ? (
                                <div className="text-center py-12">
                                    <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">No CAPAs found</p>
                                </div>
                            ) : (
                                capas.map((capa) => {
                                    const StatusIcon = getStatusIcon(capa.status);
                                    const linkedDeviation = capa.deviationId ? deviations.find(d => d.id === capa.deviationId) : null;

                                    return (
                                        <div key={capa.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-bold text-slate-900 dark:text-white">
                                                            {capa.capaNumber}
                                                        </h3>
                                                        <span className={`badge ${capa.type === 'corrective' ? 'badge-warning' : 'badge-info'}`}>
                                                            {capa.type.toUpperCase()}
                                                        </span>
                                                        <span className={`badge ${getStatusColor(capa.status)}`}>
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {capa.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        {capa.title}
                                                    </p>
                                                    <p className="text-sm text-slate-500 mb-3">
                                                        {capa.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-4 h-4" />
                                                            Responsible: {capa.responsiblePerson}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            Target: {format(new Date(capa.targetDate), 'MMM dd, yyyy')}
                                                        </span>
                                                    </div>

                                                    {linkedDeviation && (
                                                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                            <p className="text-sm text-slate-600">
                                                                Related to: <span className="font-medium">{linkedDeviation.deviationNumber}</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleEditCAPA(capa.id)}
                                                        className="btn btn-secondary text-sm"
                                                    >
                                                        Edit / View
                                                    </button>
                                                    {capa.status === 'open' && (
                                                        <button
                                                            onClick={() => handleCAPAStatusChange(capa.id, 'in_progress')}
                                                            className="btn btn-primary text-sm"
                                                        >
                                                            Start Implementation
                                                        </button>
                                                    )}
                                                    {capa.status === 'in_progress' && (
                                                        <button
                                                            onClick={() => handleCAPAStatusChange(capa.id, 'verified')}
                                                            className="btn btn-success text-sm"
                                                        >
                                                            Verify & Close
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>

            <DeviationModal
                isOpen={isDeviationModalOpen}
                onClose={() => setIsDeviationModalOpen(false)}
                deviationId={selectedDeviationId}
            />

            <CAPAModal
                isOpen={isCAPAModalOpen}
                onClose={() => setIsCAPAModalOpen(false)}
                capaId={selectedCAPAId}
            />
        </div>
    );
};
