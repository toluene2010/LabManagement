import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSampleStore } from '../stores/sampleStore';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useSchemaStore } from '../stores/schemaStore';
import { useAuthStore } from '../stores/authStore';
import {
    ArrowLeft,
    Save,
    CheckCircle2,
    AlertTriangle,
    History
} from 'lucide-react';

export const ResultEntry: React.FC = () => {
    const { sampleId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { samples, saveResult, submitResult, reviewResult, approveResult } = useSampleStore();
    const { products, testMethods } = useMasterDataStore();
    const { schemas } = useSchemaStore();

    const sample = samples.find(s => s.id === sampleId);
    const product = products.find(p => p.id === sample?.productId);

    const [activeTestId, setActiveTestId] = useState<string | null>(
        sample?.testMethodIds[0] || null
    );

    // Local state for form data
    const [resultData, setResultData] = useState<Record<string, any>>({});

    if (!sample || !product) return <div>Sample not found</div>;

    const activeTest = testMethods.find(tm => tm.id === activeTestId);
    const resultSchema = activeTest ? schemas[activeTest.resultSchemaId] : null;
    const currentResult = sample.results.find(r => r.testMethodId === activeTestId);
    const specification = product.specifications.find(s => s.testMethodId === activeTestId);

    // Initialize form data when switching tests
    React.useEffect(() => {
        if (currentResult) {
            setResultData(currentResult.results || {});
        }
    }, [activeTestId, currentResult]);

    const handleInputChange = (fieldId: string, value: any) => {
        setResultData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const handleSave = () => {
        if (activeTestId && user) {
            saveResult(sample.id, activeTestId, resultData, user.id);
        }
    };

    const handleSubmit = () => {
        if (activeTestId && user) {
            submitResult(sample.id, activeTestId, user.id);
        }
    };

    const handleReview = () => {
        if (activeTestId && user) {
            reviewResult(sample.id, activeTestId, user.id);
        }
    };

    const handleApprove = () => {
        if (activeTestId && user) {
            approveResult(sample.id, activeTestId, user.id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/samples')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        {sample.sampleNumber}
                        <span className="text-lg font-normal text-slate-400">|</span>
                        <span className="text-lg font-medium text-slate-500">{product.name}</span>
                    </h1>
                    <p className="text-slate-500 text-sm">Batch: {sample.batchNumber} • Received: {new Date(sample.receivedDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Test Method Sidebar */}
                <div className="col-span-3 space-y-2">
                    {sample.testMethodIds.map(tmId => {
                        const method = testMethods.find(m => m.id === tmId);
                        const result = sample.results.find(r => r.testMethodId === tmId);
                        const isActive = activeTestId === tmId;

                        return (
                            <button
                                key={tmId}
                                onClick={() => setActiveTestId(tmId)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${isActive
                                    ? 'bg-white dark:bg-slate-800 border-primary-500 shadow-md ring-1 ring-primary-500'
                                    : 'bg-slate-50 dark:bg-slate-900/50 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`font-semibold ${isActive ? 'text-primary-700' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {method?.name}
                                    </span>
                                    {result?.status === 'approved' && <CheckCircle2 className="w-4 h-4 text-success-500" />}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">{method?.code}</span>
                                    <span className={`px-2 py-0.5 rounded-full ${result?.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                        result?.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            'bg-slate-200 text-slate-600'
                                        }`}>
                                        {result?.status}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Main Entry Area */}
                <div className="col-span-9">
                    <div className="card min-h-[600px] flex flex-col">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Result Entry</h2>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                    <span className="font-medium">Specification:</span>
                                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                                        {specification?.spec} {specification?.unit}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="btn btn-secondary flex items-center gap-2">
                                    <History className="w-4 h-4" />
                                    Audit Trail
                                </button>
                                {currentResult?.status !== 'approved' && (
                                    <>
                                        <button onClick={handleSave} className="btn btn-secondary flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Save Draft
                                        </button>
                                        {/* Review Button for Reviewers */}
                                        {(user?.role === 'reviewer' || user?.role === 'admin') && currentResult?.status === 'completed' && (
                                            <button onClick={handleReview} className="btn btn-warning flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Review Result
                                            </button>
                                        )}

                                        {/* Approve Button for QA Managers */}
                                        {(user?.role === 'qa_manager' || user?.role === 'admin') && (currentResult?.status === 'reviewed' || currentResult?.status === 'completed') && (
                                            <button onClick={handleApprove} className="btn btn-success flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Approve Result
                                            </button>
                                        )}

                                        {/* Submit Button for Analysts */}
                                        {(currentResult?.status === 'pending' || currentResult?.status === 'in_progress' || !currentResult?.status) && (
                                            <button onClick={handleSubmit} className="btn btn-primary flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Submit Result
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Dynamic Form */}
                        <div className="flex-1 max-w-2xl">
                            {resultSchema ? (
                                <div className="space-y-6">
                                    {resultSchema.fields.map(field => (
                                        <div key={field.id} className="space-y-2">
                                            <label className="label flex items-center justify-between">
                                                <span>{field.label} {field.required && <span className="text-danger-500">*</span>}</span>
                                                {field.unit && <span className="text-xs text-slate-400">({field.unit})</span>}
                                            </label>

                                            {field.type === 'text' && (
                                                <input
                                                    id={`result-${field.id}`}
                                                    name={field.name}
                                                    type="text"
                                                    value={resultData[field.name] || ''}
                                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                    className="input"
                                                    disabled={currentResult?.status === 'approved'}
                                                />
                                            )}

                                            {field.type === 'number' && (
                                                <input
                                                    id={`result-${field.id}`}
                                                    name={field.name}
                                                    type="number"
                                                    value={resultData[field.name] || ''}
                                                    onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value))}
                                                    className="input"
                                                    disabled={currentResult?.status === 'approved'}
                                                />
                                            )}

                                            {field.type === 'select' && (
                                                <select
                                                    value={resultData[field.name] || ''}
                                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                    className="input"
                                                    disabled={currentResult?.status === 'approved'}
                                                >
                                                    <option value="">Select...</option>
                                                    {field.validation?.options?.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            )}

                                            {field.helpText && (
                                                <p className="text-xs text-slate-400">{field.helpText}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <AlertTriangle className="w-12 h-12 mb-4" />
                                    <p>No result schema defined for this test method.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-500">Compliance Notice</h4>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-600 mt-1">
                                        All data entries are logged in the audit trail. By clicking "Submit", you certify that these results are accurate and true representations of the analysis performed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
