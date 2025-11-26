import React, { useState } from 'react';
import { X, FlaskConical, Plus, Trash2 } from 'lucide-react';
import { useRDStudyStore } from '../stores/rdStudyStore';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useAuthStore } from '../stores/authStore';
import { StudyParameter } from '../types/rd-studies';

interface NewRDStudyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NewRDStudyModal: React.FC<NewRDStudyModalProps> = ({ isOpen, onClose }) => {
    const { addStudy } = useRDStudyStore();
    const { products } = useMasterDataStore();
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        studyNumber: '',
        studyTitle: '',
        studyType: 'dissolution_comparability' as const,
        productId: '',
        objective: '',
        startDate: new Date().toISOString().split('T')[0],
        leadScientist: user ? `${user.firstName} ${user.lastName}` : '',
        teamMembers: [] as string[]
    });

    const [teamMemberInput, setTeamMemberInput] = useState('');

    const [studyParameters, setStudyParameters] = useState<Omit<StudyParameter, 'id'>[]>([]);

    const [newParameter, setNewParameter] = useState<Omit<StudyParameter, 'id'>>({
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

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedProduct = products.find(p => p.id === formData.productId);
        if (!selectedProduct) return;

        addStudy({
            studyNumber: formData.studyNumber,
            studyTitle: formData.studyTitle,
            studyType: formData.studyType,
            productId: formData.productId,
            productName: selectedProduct.name,
            status: 'planning',
            objective: formData.objective,
            startDate: formData.startDate,
            leadScientist: formData.leadScientist,
            teamMembers: formData.teamMembers,
            parameters: studyParameters.map((param, index) => ({
                ...param,
                id: `param_${Date.now()}_${index}`
            })),
            dissolutionProfiles: [],
            createdBy: user ? `${user.firstName} ${user.lastName}` : 'System'
        });


        onClose();
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            studyNumber: '',
            studyTitle: '',
            studyType: 'dissolution_comparability',
            productId: '',
            objective: '',
            startDate: new Date().toISOString().split('T')[0],
            leadScientist: user ? `${user.firstName} ${user.lastName}` : '',
            teamMembers: []
        });
        setTeamMemberInput('');
        setStudyParameters([]);
        setNewParameter({
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

    const addTeamMember = () => {
        if (teamMemberInput.trim() && !formData.teamMembers.includes(teamMemberInput.trim())) {
            setFormData({
                ...formData,
                teamMembers: [...formData.teamMembers, teamMemberInput.trim()]
            });
            setTeamMemberInput('');
        }
    };

    const removeTeamMember = (member: string) => {
        setFormData({
            ...formData,
            teamMembers: formData.teamMembers.filter(m => m !== member)
        });
    };

    const addStudyParameter = () => {
        if (newParameter.parameterName && newParameter.category) {
            setStudyParameters([...studyParameters, newParameter]);
            setNewParameter({
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
        }
    };

    const removeStudyParameter = (index: number) => {
        setStudyParameters(studyParameters.filter((_, i) => i !== index));
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <FlaskConical className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">New R&D Study</h2>
                            <p className="text-sm text-slate-500">Create a new research and development study</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Study Number and Title */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Study Number *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.studyNumber}
                                onChange={(e) => setFormData({ ...formData, studyNumber: e.target.value })}
                                className="input"
                                placeholder="e.g., RD-2024-001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Study Type *
                            </label>
                            <select
                                required
                                value={formData.studyType}
                                onChange={(e) => setFormData({ ...formData, studyType: e.target.value as any })}
                                className="input"
                            >
                                <option value="dissolution_comparability">Dissolution Comparability</option>
                                <option value="formulation_development">Formulation Development</option>
                                <option value="process_optimization">Process Optimization</option>
                                <option value="analytical_method">Analytical Method</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Study Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.studyTitle}
                            onChange={(e) => setFormData({ ...formData, studyTitle: e.target.value })}
                            className="input"
                            placeholder="e.g., Dissolution Profile Comparability Study for Batch Scale-up"
                        />
                    </div>

                    {/* Product Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Product *
                        </label>
                        <select
                            required
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                            className="input"
                        >
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - {product.dosageForm}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Objective */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Study Objective *
                        </label>
                        <textarea
                            required
                            value={formData.objective}
                            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                            className="input min-h-[100px]"
                            placeholder="Describe the objective of this R&D study..."
                        />
                    </div>

                    {/* Lead Scientist and Start Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Lead Scientist *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.leadScientist}
                                onChange={(e) => setFormData({ ...formData, leadScientist: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="input"
                            />
                        </div>
                    </div>

                    {/* Team Members */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Team Members
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={teamMemberInput}
                                onChange={(e) => setTeamMemberInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTeamMember())}
                                className="input flex-1"
                                placeholder="Enter team member name and press Enter"
                            />
                            <button
                                type="button"
                                onClick={addTeamMember}
                                className="btn btn-secondary"
                            >
                                Add
                            </button>
                        </div>
                        {formData.teamMembers.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.teamMembers.map((member) => (
                                    <span
                                        key={member}
                                        className="badge badge-primary flex items-center gap-1"
                                    >
                                        {member}
                                        <button
                                            type="button"
                                            onClick={() => removeTeamMember(member)}
                                            className="hover:text-danger-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Study Parameters */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Study Parameters
                        </label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            Define parameters to track during this R&D study (formulation, process, analytical, etc.)
                        </p>

                        {/* Existing Parameters */}
                        {studyParameters.length > 0 && (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden mb-3">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Category</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Parameter</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Target</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Criteria</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {studyParameters.map((param, index) => (
                                            <tr key={index} className="bg-white dark:bg-slate-900">
                                                <td className="px-3 py-2 text-slate-600 dark:text-slate-400 capitalize">{param.category}</td>
                                                <td className="px-3 py-2 text-slate-900 dark:text-white font-medium">{param.parameterName}</td>
                                                <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{param.targetValue} {param.unit}</td>
                                                <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{param.acceptanceCriteria}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeStudyParameter(index)}
                                                        className="text-danger-500 hover:text-danger-700 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Add New Parameter */}
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-3">
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Add New Parameter</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <select
                                        value={newParameter.category}
                                        onChange={(e) => setNewParameter({ ...newParameter, category: e.target.value as any })}
                                        className="input text-sm"
                                    >
                                        <option value="formulation">Formulation</option>
                                        <option value="process">Process</option>
                                        <option value="analytical">Analytical</option>
                                        <option value="environmental">Environmental</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={newParameter.parameterName}
                                        onChange={(e) => setNewParameter({ ...newParameter, parameterName: e.target.value })}
                                        className="input text-sm"
                                        placeholder="Parameter name"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={newParameter.targetValue || ''}
                                        onChange={(e) => setNewParameter({ ...newParameter, targetValue: e.target.value })}
                                        className="input text-sm"
                                        placeholder="Target value"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={newParameter.unit || ''}
                                        onChange={(e) => setNewParameter({ ...newParameter, unit: e.target.value })}
                                        className="input text-sm"
                                        placeholder="Unit"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="text"
                                        value={newParameter.acceptanceCriteria || ''}
                                        onChange={(e) => setNewParameter({ ...newParameter, acceptanceCriteria: e.target.value })}
                                        className="input text-sm"
                                        placeholder="Acceptance criteria"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addStudyParameter}
                                className="btn btn-secondary btn-sm flex items-center gap-2"
                                disabled={!newParameter.parameterName || !newParameter.category}
                            >
                                <Plus className="w-4 h-4" />
                                Add Parameter
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Create Study
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
