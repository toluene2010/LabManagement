import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useStabilityStore } from '../stores/stabilityStore';
import { useAuthStore } from '../stores/authStore';
import { STANDARD_TIME_POINTS } from '../types/stability';

interface NewStabilityStudyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface TestParameter {
    parameterName: string;
    specification: string;
    unit: string;
}

export const NewStabilityStudyModal: React.FC<NewStabilityStudyModalProps> = ({ isOpen, onClose }) => {
    const { products } = useMasterDataStore();
    const { addStudy } = useStabilityStore();
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        studyNumber: `STAB-${Date.now()}`,
        productId: '',
        batchNumber: '',
        studyType: 'long_term' as 'long_term' | 'intermediate' | 'accelerated' | 'stress',
        temperature: '25°C ± 2°C',
        humidity: '60% RH ± 5%',
        light: 'protected' as 'protected' | 'exposed',
        startDate: new Date().toISOString().split('T')[0],
        protocol: ''
    });

    const [testParameters, setTestParameters] = useState<TestParameter[]>([
        { parameterName: 'Assay', specification: '95.0% - 105.0%', unit: '%' },
        { parameterName: 'Dissolution', specification: 'NLT 80% in 30 min', unit: '%' }
    ]);

    const [newParameter, setNewParameter] = useState<TestParameter>({
        parameterName: '',
        specification: '',
        unit: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const product = products.find(p => p.id === formData.productId);
        if (!product) {
            alert('Please select a product');
            return;
        }

        if (!formData.batchNumber) {
            alert('Please enter a batch number');
            return;
        }

        // Create time points based on study type
        const timePointsList = STANDARD_TIME_POINTS[formData.studyType.toUpperCase() as keyof typeof STANDARD_TIME_POINTS] || [];

        const studyId = `stab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const timePoints = timePointsList.map((tp) => {
            // Calculate scheduled date based on time point
            const scheduledDate = new Date(formData.startDate);
            const match = tp.match(/(\d+)([MWH])/);
            if (match) {
                const value = parseInt(match[1]);
                const unit = match[2];
                if (unit === 'M') scheduledDate.setMonth(scheduledDate.getMonth() + value);
                if (unit === 'W') scheduledDate.setDate(scheduledDate.getDate() + (value * 7));
                if (unit === 'H') scheduledDate.setHours(scheduledDate.getHours() + value);
            }

            return {
                id: `tp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                studyId: studyId,
                timePoint: tp,
                scheduledDate: scheduledDate.toISOString(),
                status: 'pending' as const,
                testResults: []
            };
        });

        addStudy({
            id: studyId,
            studyNumber: formData.studyNumber,
            productId: formData.productId,
            productName: product.name,
            batchNumber: formData.batchNumber,
            studyType: formData.studyType,
            storageCondition: {
                temperature: formData.temperature,
                humidity: formData.humidity,
                light: formData.light
            },
            startDate: formData.startDate,
            status: 'active',
            protocol: formData.protocol,
            timePoints: timePoints,
            createdBy: user ? `${user.firstName} ${user.lastName}` : 'System'
        });

        // Reset form and close
        setFormData({
            studyNumber: `STAB-${Date.now()}`,
            productId: '',
            batchNumber: '',
            studyType: 'long_term',
            temperature: '25°C ± 2°C',
            humidity: '60% RH ± 5%',
            light: 'protected',
            startDate: new Date().toISOString().split('T')[0],
            protocol: ''
        });
        onClose();
    };

    const addTestParameter = () => {
        if (newParameter.parameterName && newParameter.specification) {
            setTestParameters([...testParameters, newParameter]);
            setNewParameter({ parameterName: '', specification: '', unit: '' });
        }
    };

    const removeTestParameter = (index: number) => {
        setTestParameters(testParameters.filter((_, i) => i !== index));
    };


    const handleStudyTypeChange = (type: typeof formData.studyType) => {
        setFormData(prev => {
            let temp = '25°C ± 2°C';
            let humidity = '60% RH ± 5%';

            if (type === 'long_term') {
                temp = '25°C ± 2°C';
                humidity = '60% RH ± 5%';
            } else if (type === 'intermediate') {
                temp = '30°C ± 2°C';
                humidity = '65% RH ± 5%';
            } else if (type === 'accelerated') {
                temp = '40°C ± 2°C';
                humidity = '75% RH ± 5%';
            } else if (type === 'stress') {
                temp = '50°C ± 2°C';
                humidity = '75% RH ± 5%';
            }

            return {
                ...prev,
                studyType: type,
                temperature: temp,
                humidity: humidity
            };
        });
    };

    if (!isOpen) return null;

    const availableTimePoints = STANDARD_TIME_POINTS[formData.studyType.toUpperCase() as keyof typeof STANDARD_TIME_POINTS] || [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Stability Study</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Study Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Study Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Study Number</label>
                                <input
                                    type="text"
                                    value={formData.studyNumber}
                                    onChange={(e) => setFormData({ ...formData, studyNumber: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Study Type</label>
                                <select
                                    value={formData.studyType}
                                    onChange={(e) => handleStudyTypeChange(e.target.value as any)}
                                    className="input"
                                    required
                                >
                                    <option value="long_term">Long-term</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="accelerated">Accelerated</option>
                                    <option value="stress">Stress</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">Product</label>
                                <select
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                    className="input"
                                    required
                                >
                                    <option value="">Select a product...</option>
                                    {products.filter(p => p.materialType === 'finished_product').map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">Batch Number</label>
                                <input
                                    type="text"
                                    value={formData.batchNumber}
                                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                    className="input"
                                    placeholder="e.g., BATCH-2024-001"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Storage Conditions */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Storage Conditions (ICH Guidelines)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="label">Temperature</label>
                                <input
                                    type="text"
                                    value={formData.temperature}
                                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Humidity</label>
                                <input
                                    type="text"
                                    value={formData.humidity}
                                    onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label">Light Condition</label>
                                <select
                                    value={formData.light}
                                    onChange={(e) => setFormData({ ...formData, light: e.target.value as any })}
                                    className="input"
                                >
                                    <option value="protected">Protected from Light</option>
                                    <option value="exposed">Exposed to Light</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Time Points */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Time Points</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Standard time points for {formData.studyType.replace('_', '-')} study: {availableTimePoints.join(', ')}
                        </p>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Time points will be automatically scheduled based on the study type and start date.
                            </p>
                        </div>
                    </div>

                    {/* Test Parameters */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Test Parameters</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Define the quality attributes to be tested at each time point
                        </p>

                        {/* Existing Parameters */}
                        {testParameters.length > 0 && (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Parameter</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Specification</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Unit</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {testParameters.map((param, index) => (
                                            <tr key={index} className="bg-white dark:bg-slate-900">
                                                <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-medium">{param.parameterName}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{param.specification}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{param.unit}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTestParameter(index)}
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
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-3">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Add New Parameter</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <input
                                        type="text"
                                        value={newParameter.parameterName}
                                        onChange={(e) => setNewParameter({ ...newParameter, parameterName: e.target.value })}
                                        className="input"
                                        placeholder="Parameter name (e.g., Assay)"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={newParameter.specification}
                                        onChange={(e) => setNewParameter({ ...newParameter, specification: e.target.value })}
                                        className="input"
                                        placeholder="Specification (e.g., 95-105%)"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={newParameter.unit}
                                        onChange={(e) => setNewParameter({ ...newParameter, unit: e.target.value })}
                                        className="input"
                                        placeholder="Unit (e.g., %)"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addTestParameter}
                                className="btn btn-secondary flex items-center gap-2"
                                disabled={!newParameter.parameterName || !newParameter.specification}
                            >
                                <Plus className="w-4 h-4" />
                                Add Parameter
                            </button>
                        </div>
                    </div>

                    {/* Protocol */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Protocol Reference</h3>
                        <div>
                            <label className="label">Protocol Number (Optional)</label>
                            <input
                                type="text"
                                value={formData.protocol}
                                onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                                className="input"
                                placeholder="e.g., PROT-STAB-001"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                        >
                            Create Study
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
