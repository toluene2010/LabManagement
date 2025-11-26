import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useDeviationStore } from '../stores/deviationStore';
import { useAuthStore } from '../stores/authStore';
import { CAPAType } from '../types/deviation';
import { Save, X } from 'lucide-react';

interface CAPAModalProps {
    isOpen: boolean;
    onClose: () => void;
    capaId?: string | null;
    initialDeviationId?: string;
}

export const CAPAModal: React.FC<CAPAModalProps> = ({ isOpen, onClose, capaId, initialDeviationId }) => {
    const { capas, deviations, addCAPA, updateCAPA } = useDeviationStore();
    const { user } = useAuthStore();

    const existingCAPA = capaId ? capas.find(c => c.id === capaId) : null;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'corrective' as CAPAType,
        deviationId: initialDeviationId || '',
        actionPlan: '',
        responsiblePerson: '',
        targetDate: ''
    });

    useEffect(() => {
        if (existingCAPA) {
            setFormData({
                title: existingCAPA.title,
                description: existingCAPA.description,
                type: existingCAPA.type,
                deviationId: existingCAPA.deviationId || '',
                actionPlan: existingCAPA.actionPlan,
                responsiblePerson: existingCAPA.responsiblePerson,
                targetDate: existingCAPA.targetDate.split('T')[0]
            });
        } else {
            setFormData({
                title: '',
                description: '',
                type: 'corrective',
                deviationId: initialDeviationId || '',
                actionPlan: '',
                responsiblePerson: '',
                targetDate: ''
            });
        }
    }, [existingCAPA, isOpen, initialDeviationId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (existingCAPA) {
            updateCAPA(existingCAPA.id, {
                ...formData,
                targetDate: new Date(formData.targetDate).toISOString()
            });
        } else {
            addCAPA({
                ...formData,
                targetDate: new Date(formData.targetDate).toISOString(),
                status: 'open',
                createdBy: user?.username || 'Unknown'
            });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={existingCAPA ? "Edit CAPA" : "New CAPA"} size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="label">Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="input"
                            placeholder="Brief title of the action"
                        />
                    </div>

                    <div>
                        <label className="label">Type *</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value as CAPAType })}
                            className="input"
                        >
                            <option value="corrective">Corrective Action</option>
                            <option value="preventive">Preventive Action</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Related Deviation (Optional)</label>
                        <select
                            value={formData.deviationId}
                            onChange={e => setFormData({ ...formData, deviationId: e.target.value })}
                            className="input"
                        >
                            <option value="">Select Deviation...</option>
                            {deviations.map(d => (
                                <option key={d.id} value={d.id}>{d.deviationNumber}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="label">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            rows={3}
                            placeholder="Describe the action to be taken..."
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="label">Action Plan *</label>
                        <textarea
                            required
                            value={formData.actionPlan}
                            onChange={e => setFormData({ ...formData, actionPlan: e.target.value })}
                            className="input"
                            rows={4}
                            placeholder="Step-by-step plan..."
                        />
                    </div>

                    <div>
                        <label className="label">Responsible Person *</label>
                        <input
                            type="text"
                            required
                            value={formData.responsiblePerson}
                            onChange={e => setFormData({ ...formData, responsiblePerson: e.target.value })}
                            className="input"
                            placeholder="Name of person responsible"
                        />
                    </div>

                    <div>
                        <label className="label">Target Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.targetDate}
                            onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                            className="input"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        <Save className="w-4 h-4 mr-2" />
                        {existingCAPA ? 'Update CAPA' : 'Create CAPA'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
