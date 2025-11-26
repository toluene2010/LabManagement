import React, { useState } from 'react';
import { X, Settings, BarChart3, FileText } from 'lucide-react';
import { useRDStudyStore } from '../stores/rdStudyStore';
import { StudyParametersTab } from './rd-study-tabs/StudyParametersTab';
import { DissolutionProfilesTab } from './rd-study-tabs/DissolutionProfilesTab';
import { StudyReportsTab } from './rd-study-tabs/StudyReportsTab';

interface RDStudyDetailsModalProps {
    studyId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const RDStudyDetailsModal: React.FC<RDStudyDetailsModalProps> = ({ studyId, isOpen, onClose }) => {
    const { getStudy } = useRDStudyStore();
    const study = getStudy(studyId);
    const [activeTab, setActiveTab] = useState<'parameters' | 'dissolution' | 'reports'>('parameters');

    if (!isOpen || !study) return null;

    const tabs = [
        { id: 'parameters' as const, label: 'Study Parameters', icon: Settings },
        { id: 'dissolution' as const, label: 'Dissolution Profiles', icon: BarChart3 },
        { id: 'reports' as const, label: 'Reports', icon: FileText }
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{study.studyNumber}</h2>
                        <p className="text-sm text-slate-500">{study.studyTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Study Info */}
                <div className="grid grid-cols-4 gap-4 mb-6 flex-shrink-0">
                    <div className="card bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">Product</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{study.productName}</p>
                    </div>
                    <div className="card bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">Lead Scientist</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{study.leadScientist}</p>
                    </div>
                    <div className="card bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">Status</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                            {study.status.replace('_', ' ')}
                        </p>
                    </div>
                    <div className="card bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">Start Date</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {new Date(study.startDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-slate-700 mb-6 flex-shrink-0">
                    <div className="flex gap-4">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'parameters' && <StudyParametersTab studyId={studyId} />}
                    {activeTab === 'dissolution' && <DissolutionProfilesTab studyId={studyId} />}
                    {activeTab === 'reports' && <StudyReportsTab studyId={studyId} />}
                </div>
            </div>
        </div>
    );
};
