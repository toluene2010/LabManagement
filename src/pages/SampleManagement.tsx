import React, { useState } from 'react';
import { useSampleStore } from '../stores/sampleStore';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Microscope, CheckCircle2, AlertTriangle, Clock, MoreVertical, Trash2, Eye } from 'lucide-react';
import { SampleModal } from '../components/SampleModal';

export const SampleManagement: React.FC = () => {
    const { samples, deleteSample } = useSampleStore();
    const { products } = useMasterDataStore();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const handleDeleteSample = async (sampleId: string, sampleNumber: string) => {
        if (confirm(`Are you sure you want to delete sample "${sampleNumber}"? This will also delete all associated test results. This action cannot be undone.`)) {
            await deleteSample(sampleId);
            setActiveDropdown(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'received': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'in_analysis': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'under_review': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'approved': return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'in_analysis': return Microscope;
            case 'approved': return CheckCircle2;
            case 'rejected': return AlertTriangle;
            default: return Clock;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sample Management</h1>
                    <p className="text-slate-500">Track and manage laboratory samples</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Register Sample
                </button>
            </div>

            <div className="flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by sample ID, batch, or product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-10"
                    />
                </div>
                <button className="btn btn-secondary flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            <div className="grid gap-4">
                {samples.map((sample) => {
                    const product = products.find(p => p.id === sample.productId);
                    const StatusIcon = getStatusIcon(sample.status);
                    const progress = sample.results.length > 0
                        ? (sample.results.filter(r => r.status === 'completed' || r.status === 'approved').length / sample.results.length) * 100
                        : 0;

                    return (
                        <div
                            key={sample.id}
                            onClick={() => navigate(`/results/${sample.id}`)}
                            className="card hover:border-primary-300 cursor-pointer group transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(sample.status)} border`}>
                                        <StatusIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                                {sample.sampleNumber}
                                            </h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(sample.status)}`}>
                                                {sample.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 font-medium">{product?.name}</p>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                                            <span>Batch: {sample.batchNumber}</span>
                                            <span>•</span>
                                            <span>Received: {new Date(sample.receivedDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Analysis Progress
                                        </div>
                                        <div className="w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-500 transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {Math.round(progress)}% Complete
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveDropdown(activeDropdown === sample.id ? null : sample.id);
                                            }}
                                            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                        {activeDropdown === sample.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/results/${sample.id}`);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-t-lg flex items-center gap-2 text-slate-700 dark:text-slate-300"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View Results
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSample(sample.id, sample.sampleNumber);
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-b-lg flex items-center gap-2 text-danger-600 dark:text-danger-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete Sample
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sample Modal */}
            <SampleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
