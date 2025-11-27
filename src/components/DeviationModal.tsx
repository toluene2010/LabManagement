import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useDeviationStore } from '../stores/deviationStore';
import { useSampleStore } from '../stores/sampleStore';
import { useAuthStore } from '../stores/authStore';
import { DeviationSeverity } from '../types/deviation';
import { Save, X } from 'lucide-react';

interface DeviationModalProps {
    isOpen: boolean;
    onClose: () => void;
    deviationId?: string | null;
}

export const DeviationModal: React.FC<DeviationModalProps> = ({ isOpen, onClose, deviationId }) => {
    const { deviations, addDeviation, updateDeviation } = useDeviationStore();
    const { samples } = useSampleStore();
    const { user } = useAuthStore();

    const existingDeviation = deviationId ? deviations.find(d => d.id === deviationId) : null;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        severity: 'minor' as DeviationSeverity,
        sampleId: '',
        batchNumber: '',
        immediateAction: '',
        rootCause: '',
        impactAssessment: ''
    });

    useEffect(() => {
        if (existingDeviation) {
            setFormData({
                title: existingDeviation.title,
                description: existingDeviation.description,
                severity: existingDeviation.severity,
                sampleId: existingDeviation.sampleId || '',
                batchNumber: existingDeviation.batchNumber || '',
                immediateAction: existingDeviation.immediateAction || '',
                rootCause: existingDeviation.rootCause || '',
                impactAssessment: existingDeviation.impactAssessment || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                severity: 'minor',
                sampleId: '',
                batchNumber: '',
                immediateAction: '',
                rootCause: '',
                impactAssessment: ''
            });
        }
    }, [existingDeviation, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (existingDeviation) {
            updateDeviation(existingDeviation.id, formData);
        } else {
            addDeviation({
                ...formData,
                status: 'open',
                reportedBy: user?.id || 'unknown',
                investigation: ''
            });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={existingDeviation ? "Edit Deviation" : "New Deviation"} size="lg">
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
                            placeholder="Brief description of the deviation"
                        />
                    </div>

                    <div>
                        <label className="label">Severity *</label>
                        <select
                            value={formData.severity}
                            onChange={e => setFormData({ ...formData, severity: e.target.value as DeviationSeverity })}
                            className="input"
                        >
                            <option value="minor">Minor</option>
                            <option value="major">Major</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Related Sample (Optional)</label>
                        <select
                            value={formData.sampleId}
                            onChange={e => {
                                const sample = samples.find(s => s.id === e.target.value);
                                setFormData({
                                    ...formData,
                                    sampleId: e.target.value,
                                    batchNumber: sample?.batchNumber || ''
                                });
                            }}
                            className="input"
                        >
                            <option value="">Select Sample...</option>
                            {samples.map(s => (
                                <option key={s.id} value={s.id}>{s.sampleNumber} ({s.batchNumber})</option>
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
                            rows={4}
                            placeholder="Detailed description of what happened..."
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="label">Immediate Action Taken</label>
                        <textarea
                            value={formData.immediateAction}
                            onChange={e => setFormData({ ...formData, immediateAction: e.target.value })}
                            className="input"
                            rows={2}
                            placeholder="What was done immediately to contain the issue?"
                        />
                    </div>

                    {existingDeviation && (
                        <>
                            <div className="col-span-2">
                                <label className="label">Root Cause Analysis</label>
                                <textarea
                                    value={formData.rootCause}
                                    onChange={e => setFormData({ ...formData, rootCause: e.target.value })}
                                    className="input"
                                    rows={3}
                                    placeholder="Why did this happen?"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="label">Impact Assessment</label>
                                <textarea
                                    value={formData.impactAssessment}
                                    onChange={e => setFormData({ ...formData, impactAssessment: e.target.value })}
                                    className="input"
                                    rows={3}
                                    placeholder="Impact on product quality, safety, or efficacy..."
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        <Save className="w-4 h-4 mr-2" />
                        {existingDeviation ? 'Update Deviation' : 'Create Deviation'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
