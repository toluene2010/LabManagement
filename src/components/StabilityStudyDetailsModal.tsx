import React, { useState } from 'react';
import { X, CheckCircle, Clock, AlertCircle, Plus, Download } from 'lucide-react';
import { useStabilityStore } from '../stores/stabilityStore';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useAuthStore } from '../stores/authStore';
import { generateStabilityReport } from '../utils/stabilityReportGenerator';
import { TimePoint, StabilityTestResult } from '../types/stability';

interface StabilityStudyDetailsModalProps {
    studyId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const StabilityStudyDetailsModal: React.FC<StabilityStudyDetailsModalProps> = ({ studyId, isOpen, onClose }) => {
    const { studies, updateStudy } = useStabilityStore();
    const { testMethods } = useMasterDataStore();
    const { user } = useAuthStore();
    const study = studies.find(s => s.id === studyId);
    const [selectedTimePoint, setSelectedTimePoint] = useState<TimePoint | null>(null);
    const [isAddingResult, setIsAddingResult] = useState(false);

    const [resultForm, setResultForm] = useState({
        testMethodId: '',
        testMethodName: '',
        parameter: '',
        result: '',
        unit: '',
        specification: '',
        lsl: '',
        usl: '',
        status: 'pass' as 'pass' | 'fail' | 'ooc' | 'oos',
        remarks: '',
        testedBy: '',
        testedDate: new Date().toISOString().split('T')[0]
    });

    if (!isOpen || !study) return null;

    const handleDownloadReport = () => {
        try {
            generateStabilityReport(study, user?.username || 'Unknown User');
        } catch (error) {
            console.error('Failed to generate report:', error);
            alert('Failed to generate report. Please try again.');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-success-500" />;
            case 'in_progress':
                return <Clock className="w-4 h-4 text-warning-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-slate-400" />;
            case 'missed':
                return <AlertCircle className="w-4 h-4 text-danger-500" />;
            default:
                return null;
        }
    };

    const handleAddResult = () => {
        if (!selectedTimePoint) return;

        const testMethod = testMethods.find(tm => tm.id === resultForm.testMethodId);
        if (!testMethod) return;

        const newResult: StabilityTestResult = {
            id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timePointId: selectedTimePoint.id,
            testMethodId: resultForm.testMethodId,
            testMethodName: testMethod.name,
            parameter: resultForm.parameter,
            result: resultForm.result,
            unit: resultForm.unit,
            specification: resultForm.specification,
            lsl: resultForm.lsl ? parseFloat(resultForm.lsl) : undefined,
            usl: resultForm.usl ? parseFloat(resultForm.usl) : undefined,
            status: resultForm.status,
            remarks: resultForm.remarks,
            testedBy: resultForm.testedBy,
            testedDate: resultForm.testedDate
        };

        // Update the time point with the new result
        const updatedTimePoints = study.timePoints.map(tp => {
            if (tp.id === selectedTimePoint.id) {
                const updatedResults = [...tp.testResults, newResult];
                return {
                    ...tp,
                    testResults: updatedResults,
                    status: 'completed' as const,
                    actualDate: new Date().toISOString()
                };
            }
            return tp;
        });

        updateStudy(study.id, { timePoints: updatedTimePoints });

        // Reset form
        setResultForm({
            testMethodId: '',
            testMethodName: '',
            parameter: '',
            result: '',
            unit: '',
            specification: '',
            lsl: '',
            usl: '',
            status: 'pass',
            remarks: '',
            testedBy: '',
            testedDate: new Date().toISOString().split('T')[0]
        });
        setIsAddingResult(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{study.studyNumber}</h2>
                        <p className="text-sm text-slate-500">{study.productName} - Batch: {study.batchNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownloadReport}
                            className="btn btn-secondary flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download Report
                        </button>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Study Info */}
                <div className="grid grid-cols-4 gap-4 mb-6 flex-shrink-0">
                    <div className="card bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">Study Type</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                            {study.studyType.replace('_', '-')}
                        </p>
                    </div>
                    <div className="card bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">Storage Condition</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {study.storageCondition.temperature}
                        </p>
                    </div>
                    <div className="card bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">Start Date</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {new Date(study.startDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="card bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 mb-1">Status</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                            {study.status}
                        </p>
                    </div>
                </div>

                {/* Time Points List */}
                <div className="flex-1 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Time Points</h3>
                    <div className="space-y-3">
                        {study.timePoints.map((timePoint) => (
                            <div key={timePoint.id} className="card">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(timePoint.status)}
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white">
                                                Time Point: {timePoint.timePoint}
                                            </h4>
                                            <p className="text-sm text-slate-500">
                                                Scheduled: {new Date(timePoint.scheduledDate).toLocaleDateString()}
                                                {timePoint.actualDate && ` | Tested: ${new Date(timePoint.actualDate).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`badge ${timePoint.status === 'completed' ? 'badge-success' :
                                            timePoint.status === 'in_progress' ? 'badge-warning' :
                                                timePoint.status === 'missed' ? 'badge-danger' :
                                                    'badge-secondary'
                                            }`}>
                                            {timePoint.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <button
                                            onClick={() => {
                                                setSelectedTimePoint(timePoint);
                                                setIsAddingResult(true);
                                            }}
                                            className="btn btn-primary btn-sm flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Result
                                        </button>
                                    </div>
                                </div>

                                {/* Test Results */}
                                {timePoint.testResults.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Test Results:</p>
                                        <div className="space-y-2">
                                            {timePoint.testResults.map((result) => (
                                                <div key={result.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                                                    <div className="grid grid-cols-5 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-xs text-slate-500">Parameter</p>
                                                            <p className="font-medium text-slate-900 dark:text-white">{result.parameter}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-500">Result</p>
                                                            <p className="font-medium text-slate-900 dark:text-white">
                                                                {result.result} {result.unit}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-500">Specification</p>
                                                            <p className="font-medium text-slate-900 dark:text-white">{result.specification}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-500">Status</p>
                                                            <span className={`badge badge-sm ${result.status === 'pass' ? 'badge-success' :
                                                                result.status === 'fail' ? 'badge-danger' :
                                                                    'badge-warning'
                                                                }`}>
                                                                {result.status.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-500">Tested By</p>
                                                            <p className="font-medium text-slate-900 dark:text-white">{result.testedBy}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {timePoint.observations && (
                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <p className="text-xs text-slate-500 mb-1">Observations:</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{timePoint.observations}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Result Modal */}
                {isAddingResult && selectedTimePoint && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Add Test Result - {selectedTimePoint.timePoint}
                                </h3>
                                <button
                                    onClick={() => setIsAddingResult(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Test Method *</label>
                                        <select
                                            value={resultForm.testMethodId}
                                            onChange={(e) => {
                                                const tm = testMethods.find(t => t.id === e.target.value);
                                                setResultForm({
                                                    ...resultForm,
                                                    testMethodId: e.target.value,
                                                    testMethodName: tm?.name || ''
                                                });
                                            }}
                                            className="input"
                                            required
                                        >
                                            <option value="">Select test method...</option>
                                            {testMethods.map(tm => (
                                                <option key={tm.id} value={tm.id}>{tm.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="label">Parameter *</label>
                                        <input
                                            type="text"
                                            value={resultForm.parameter}
                                            onChange={(e) => setResultForm({ ...resultForm, parameter: e.target.value })}
                                            className="input"
                                            placeholder="e.g., Assay, Dissolution"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Result *</label>
                                        <input
                                            type="text"
                                            value={resultForm.result}
                                            onChange={(e) => setResultForm({ ...resultForm, result: e.target.value })}
                                            className="input"
                                            placeholder="e.g., 98.5"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Unit</label>
                                        <input
                                            type="text"
                                            value={resultForm.unit}
                                            onChange={(e) => setResultForm({ ...resultForm, unit: e.target.value })}
                                            className="input"
                                            placeholder="e.g., %"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="label">Specification *</label>
                                        <input
                                            type="text"
                                            value={resultForm.specification}
                                            onChange={(e) => setResultForm({ ...resultForm, specification: e.target.value })}
                                            className="input"
                                            placeholder="e.g., 95.0% - 105.0%"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label">LSL (Lower Spec Limit)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={resultForm.lsl}
                                            onChange={(e) => setResultForm({ ...resultForm, lsl: e.target.value })}
                                            className="input"
                                            placeholder="e.g., 95.0"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">USL (Upper Spec Limit)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={resultForm.usl}
                                            onChange={(e) => setResultForm({ ...resultForm, usl: e.target.value })}
                                            className="input"
                                            placeholder="e.g., 105.0"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Status *</label>
                                        <select
                                            value={resultForm.status}
                                            onChange={(e) => setResultForm({ ...resultForm, status: e.target.value as any })}
                                            className="input"
                                            required
                                        >
                                            <option value="pass">Pass</option>
                                            <option value="fail">Fail</option>
                                            <option value="ooc">Out of Control (OOC)</option>
                                            <option value="oos">Out of Specification (OOS)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="label">Tested By *</label>
                                        <input
                                            type="text"
                                            value={resultForm.testedBy}
                                            onChange={(e) => setResultForm({ ...resultForm, testedBy: e.target.value })}
                                            className="input"
                                            placeholder="Analyst name"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="label">Remarks</label>
                                        <textarea
                                            value={resultForm.remarks}
                                            onChange={(e) => setResultForm({ ...resultForm, remarks: e.target.value })}
                                            className="input min-h-[60px]"
                                            placeholder="Any observations or notes..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setIsAddingResult(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddResult}
                                        className="btn btn-primary"
                                        disabled={!resultForm.testMethodId || !resultForm.parameter || !resultForm.result}
                                    >
                                        Add Result
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
