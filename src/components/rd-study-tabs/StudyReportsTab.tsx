import React from 'react';
import { Download, FileText, BarChart3, ClipboardList, TrendingUp } from 'lucide-react';
import { useRDStudyStore } from '../../stores/rdStudyStore';
import { generateRDStudyReport } from '../../utils/rdReportGenerator';

interface StudyReportsTabProps {
    studyId: string;
}

export const StudyReportsTab: React.FC<StudyReportsTabProps> = ({ studyId }) => {
    const { getStudy, getComparabilityAnalysesByStudy } = useRDStudyStore();
    const study = getStudy(studyId);
    const comparabilityAnalyses = getComparabilityAnalysesByStudy(studyId);

    if (!study) return null;

    const handleGenerateReport = (reportType: string) => {
        generateRDStudyReport(study, reportType, comparabilityAnalyses);
    };

    const reports = [
        {
            id: 'full_study',
            title: 'Complete Study Report',
            description: 'Comprehensive report including all study parameters, dissolution profiles, and analyses',
            icon: FileText,
            color: 'primary'
        },
        {
            id: 'parameters',
            title: 'Study Parameters Report',
            description: 'Detailed report of all study parameters and their values',
            icon: ClipboardList,
            color: 'info'
        },
        {
            id: 'dissolution',
            title: 'Dissolution Profiles Report',
            description: 'Report with dissolution data, charts, and tabulated results',
            icon: BarChart3,
            color: 'success'
        },
        {
            id: 'comparability',
            title: 'Comparability Analysis Report',
            description: 'F1/F2 analysis results and similarity assessments',
            icon: TrendingUp,
            color: 'warning',
            disabled: comparabilityAnalyses.length === 0
        }
    ];

    return (
        <div className="space-y-4">
            <div className="bg-info-50 dark:bg-info-900/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-info-900 dark:text-info-300 mb-2">
                    Report Generation
                </h3>
                <p className="text-sm text-info-800 dark:text-info-400">
                    Generate comprehensive PDF reports for regulatory submissions, internal documentation,
                    and study archival. All reports are automatically formatted according to pharmaceutical
                    industry standards.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => {
                    const Icon = report.icon;
                    return (
                        <div
                            key={report.id}
                            className={`card ${report.disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:border-primary-300 dark:hover:border-primary-700'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 bg-${report.color}-100 dark:bg-${report.color}-900/30 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-6 h-6 text-${report.color}-600 dark:text-${report.color}-400`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                        {report.title}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                        {report.description}
                                    </p>
                                    <button
                                        onClick={() => handleGenerateReport(report.id)}
                                        disabled={report.disabled}
                                        className={`btn btn-${report.color} btn-sm flex items-center gap-2`}
                                    >
                                        <Download className="w-4 h-4" />
                                        Generate PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Study Summary */}
            <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Study Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Study Number</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {study.studyNumber}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Study Type</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                            {study.studyType.replace('_', ' ')}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Parameters Defined</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {study.parameters.length}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Dissolution Profiles</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {study.dissolutionProfiles?.length || 0}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Comparability Analyses</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {comparabilityAnalyses.length}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Lead Scientist</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {study.leadScientist}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Status</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                            {study.status.replace('_', ' ')}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Created</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {new Date(study.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Study Objective */}
            <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Study Objective
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    {study.objective}
                </p>
            </div>

            {/* Conclusions and Recommendations */}
            {(study.conclusions || study.recommendations) && (
                <div className="card">
                    {study.conclusions && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                Conclusions
                            </h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                {study.conclusions}
                            </p>
                        </div>
                    )}
                    {study.recommendations && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                Recommendations
                            </h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                {study.recommendations}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Team Members */}
            {study.teamMembers.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Team Members
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {study.teamMembers.map((member) => (
                            <span key={member} className="badge badge-primary">
                                {member}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
