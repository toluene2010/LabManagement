import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useMasterDataStore } from '../stores/masterDataStore';
import { TestMethod } from '../types';
import { Save, X } from 'lucide-react';

interface TestMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    methodToEdit?: TestMethod | null;
}

export const TestMethodModal: React.FC<TestMethodModalProps> = ({ isOpen, onClose, methodToEdit }) => {
    const { addTestMethod, updateTestMethod } = useMasterDataStore();

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        category: '',
        version: '1.0',
        procedure: '',
        equipment: '',
        reagents: '',
    });

    useEffect(() => {
        if (methodToEdit) {
            setFormData({
                code: methodToEdit.code,
                name: methodToEdit.name,
                description: methodToEdit.description,
                category: methodToEdit.category,
                version: methodToEdit.version,
                procedure: methodToEdit.procedure || '',
                equipment: methodToEdit.equipment?.join(', ') || '',
                reagents: methodToEdit.reagents?.join(', ') || '',
            });
        } else {
            setFormData({
                code: '',
                name: '',
                description: '',
                category: '',
                version: '1.0',
                procedure: '',
                equipment: '',
                reagents: '',
            });
        }
    }, [methodToEdit, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const methodData = {
            code: formData.code,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            version: formData.version,
            procedure: formData.procedure,
            equipment: formData.equipment.split(',').map(e => e.trim()).filter(Boolean),
            reagents: formData.reagents.split(',').map(r => r.trim()).filter(Boolean),
            status: 'active' as const,
            resultSchemaId: 'default-schema'
        };

        if (methodToEdit) {
            updateTestMethod(methodToEdit.id, methodData);
        } else {
            addTestMethod({
                ...methodData,
                createdBy: 'current-user'
            });
        }

        onClose();
    };

    const categories = [
        'Physical',
        'Chemical',
        'Microbiological',
        'Identification',
        'Assay',
        'Impurities',
        'Dissolution',
        'Content Uniformity'
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={methodToEdit ? "Edit Test Method" : "Create New Test Method"} size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Method Code */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Method Code *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="input"
                            placeholder="e.g., TM-001"
                        />
                    </div>

                    {/* Method Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Method Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            placeholder="e.g., HPLC Assay"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Category *
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="input"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Version */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Version *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.version}
                            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                            className="input"
                            placeholder="e.g., 1.0"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description *
                    </label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input"
                        rows={2}
                        placeholder="Brief description of the test method..."
                    />
                </div>

                {/* Procedure */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Procedure *
                    </label>
                    <textarea
                        required
                        value={formData.procedure}
                        onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
                        className="input"
                        rows={4}
                        placeholder="Detailed step-by-step procedure..."
                    />
                </div>

                {/* Equipment */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Equipment (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={formData.equipment}
                        onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                        className="input"
                        placeholder="e.g., HPLC System, Balance, pH Meter"
                    />
                </div>

                {/* Reagents */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Reagents (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={formData.reagents}
                        onChange={(e) => setFormData({ ...formData, reagents: e.target.value })}
                        className="input"
                        placeholder="e.g., Acetonitrile, Phosphate Buffer, Standard Solution"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {methodToEdit ? 'Update Method' : 'Create Method'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
