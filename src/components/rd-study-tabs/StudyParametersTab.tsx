import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useRDStudyStore } from '../../stores/rdStudyStore';
import { StudyParameter } from '../../types/rd-studies';

interface StudyParametersTabProps {
    studyId: string;
}

export const StudyParametersTab: React.FC<StudyParametersTabProps> = ({ studyId }) => {
    const { getStudy, addParameter, updateParameter, deleteParameter } = useRDStudyStore();
    const study = getStudy(studyId);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<StudyParameter, 'id'>>({
        category: 'formulation',
        parameterName: '',
        description: '',
        targetValue: '',
        actualValue: '',
        unit: '',
        acceptanceCriteria: '',
        status: 'pending',
        remarks: ''
    });

    if (!study) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            updateParameter(studyId, editingId, formData);
            setEditingId(null);
        } else {
            addParameter(studyId, formData);
        }

        resetForm();
        setIsAdding(false);
    };

    const resetForm = () => {
        setFormData({
            category: 'formulation',
            parameterName: '',
            description: '',
            targetValue: '',
            actualValue: '',
            unit: '',
            acceptanceCriteria: '',
            status: 'pending',
            remarks: ''
        });
    };

    const handleEdit = (parameter: StudyParameter) => {
        setFormData(parameter);
        setEditingId(parameter.id);
        setIsAdding(true);
    };

    const handleDelete = (parameterId: string) => {
        if (confirm('Are you sure you want to delete this parameter?')) {
            deleteParameter(studyId, parameterId);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Completed</span>;
            case 'in_progress':
                return <span className="badge badge-primary"><Clock className="w-3 h-3" /> In Progress</span>;
            default:
                return <span className="badge badge-secondary"><Clock className="w-3 h-3" /> Pending</span>;
        }
    };

    const getCategoryLabel = (category: string) => {
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <div className="space-y-4">
            {/* Add Parameter Button */}
            {!isAdding && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Parameter
                </button>
            )}

            {/* Add/Edit Form */}
            {isAdding && (
                <div className="card bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        {editingId ? 'Edit Parameter' : 'Add New Parameter'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="input"
                                >
                                    <option value="formulation">Formulation</option>
                                    <option value="process">Process</option>
                                    <option value="analytical">Analytical</option>
                                    <option value="environmental">Environmental</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Parameter Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.parameterName}
                                    onChange={(e) => setFormData({ ...formData, parameterName: e.target.value })}
                                    className="input"
                                    placeholder="e.g., API Particle Size"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input min-h-[80px]"
                                placeholder="Describe the parameter..."
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Target Value
                                </label>
                                <input
                                    type="text"
                                    value={formData.targetValue}
                                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                                    className="input"
                                    placeholder="e.g., 50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Actual Value
                                </label>
                                <input
                                    type="text"
                                    value={formData.actualValue}
                                    onChange={(e) => setFormData({ ...formData, actualValue: e.target.value })}
                                    className="input"
                                    placeholder="e.g., 48.5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Unit
                                </label>
                                <input
                                    type="text"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="input"
                                    placeholder="e.g., μm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Acceptance Criteria
                                </label>
                                <input
                                    type="text"
                                    value={formData.acceptanceCriteria}
                                    onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                                    className="input"
                                    placeholder="e.g., 40-60 μm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    className="input"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Remarks
                            </label>
                            <textarea
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                className="input min-h-[60px]"
                                placeholder="Any additional notes..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingId(null);
                                    resetForm();
                                }}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update Parameter' : 'Add Parameter'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Parameters List */}
            {study.parameters.length === 0 ? (
                <div className="card text-center py-8">
                    <p className="text-slate-500">No parameters defined yet. Add your first parameter to get started.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {study.parameters.map((parameter) => (
                        <div key={parameter.id} className="card hover:border-primary-300 dark:hover:border-primary-700 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="badge badge-info">{getCategoryLabel(parameter.category)}</span>
                                        {getStatusBadge(parameter.status)}
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                        {parameter.parameterName}
                                    </h4>
                                    {parameter.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                            {parameter.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(parameter)}
                                        className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(parameter.id)}
                                        className="p-2 text-slate-400 hover:text-danger-600 dark:hover:text-danger-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Target Value</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {parameter.targetValue || '-'} {parameter.unit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Actual Value</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {parameter.actualValue || '-'} {parameter.unit}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-slate-500 mb-1">Acceptance Criteria</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {parameter.acceptanceCriteria || '-'}
                                    </p>
                                </div>
                            </div>

                            {parameter.remarks && (
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-xs text-slate-500 mb-1">Remarks</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{parameter.remarks}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
