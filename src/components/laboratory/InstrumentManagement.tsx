import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react';
import { useLaboratoryStore } from '../../stores/laboratoryStore';
import { Instrument, InstrumentStatus, CalibrationType } from '../../types/laboratory';

export const InstrumentManagement: React.FC = () => {
    const { instruments, addInstrument, updateInstrument, deleteInstrument } = useLaboratoryStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingInstrument, setEditingInstrument] = useState<Instrument | null>(null);
    const [formData, setFormData] = useState<Partial<Instrument>>({
        instrumentNumber: '',
        name: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        status: 'active',
        location: '',
        calibrationType: 'calibration',
        lastCalibrationDate: '',
        nextCalibrationDate: '',
        calibrationFrequency: 365,
        responsiblePerson: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingInstrument) {
            updateInstrument(editingInstrument.id, formData);
        } else {
            addInstrument(formData as Omit<Instrument, 'id' | 'createdAt' | 'updatedAt'>);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            instrumentNumber: '',
            name: '',
            manufacturer: '',
            model: '',
            serialNumber: '',
            status: 'active',
            location: '',
            calibrationType: 'calibration',
            lastCalibrationDate: '',
            nextCalibrationDate: '',
            calibrationFrequency: 365,
            responsiblePerson: '',
            notes: '',
        });
        setEditingInstrument(null);
        setShowModal(false);
    };

    const handleEdit = (instrument: Instrument) => {
        setEditingInstrument(instrument);
        setFormData(instrument);
        setShowModal(true);
    };

    const getStatusIcon = (status: InstrumentStatus) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-success-600" />;
            case 'inactive':
                return <AlertCircle className="w-4 h-4 text-slate-400" />;
            case 'maintenance':
                return <Wrench className="w-4 h-4 text-warning-600" />;
            case 'calibration_due':
                return <Clock className="w-4 h-4 text-danger-600" />;
        }
    };

    const getStatusBadge = (status: InstrumentStatus) => {
        const colors = {
            active: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
            inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400',
            maintenance: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
            calibration_due: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
        };
        return colors[status];
    };

    const isCalibrationDue = (nextDate: string) => {
        const today = new Date();
        const next = new Date(nextDate);
        const daysUntil = Math.floor((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 30;
    };

    const filteredInstruments = instruments.filter((inst) =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.instrumentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search instruments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Instrument
                </button>
            </div>

            {/* Instruments Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Instrument #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Manufacturer
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Calibration Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Last Calibration
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Next Calibration
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredInstruments.map((instrument) => (
                            <tr key={instrument.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                    {instrument.instrumentNumber}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white">
                                            {instrument.name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {instrument.model}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                    {instrument.manufacturer}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(instrument.status)}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(instrument.status)}`}>
                                            {instrument.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 capitalize">
                                    {instrument.calibrationType}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                    {new Date(instrument.lastCalibrationDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <div className={isCalibrationDue(instrument.nextCalibrationDate) ? 'text-danger-600 font-medium' : 'text-slate-600 dark:text-slate-400'}>
                                        {new Date(instrument.nextCalibrationDate).toLocaleDateString()}
                                        {isCalibrationDue(instrument.nextCalibrationDate) && (
                                            <div className="text-xs">Due soon!</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(instrument)}
                                            className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteInstrument(instrument.id)}
                                            className="p-1 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingInstrument ? 'Edit Instrument' : 'Add New Instrument'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Instrument Number *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.instrumentNumber}
                                        onChange={(e) => setFormData({ ...formData, instrumentNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Instrument Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Manufacturer *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.manufacturer}
                                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Model *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Serial Number *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.serialNumber}
                                        onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        required
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as InstrumentStatus })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="calibration_due">Calibration Due</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Calibration Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.calibrationType}
                                        onChange={(e) => setFormData({ ...formData, calibrationType: e.target.value as CalibrationType })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="calibration">Calibration</option>
                                        <option value="qualification">Qualification</option>
                                        <option value="validation">Validation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Last Calibration Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.lastCalibrationDate}
                                        onChange={(e) => setFormData({ ...formData, lastCalibrationDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Next Calibration Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.nextCalibrationDate}
                                        onChange={(e) => setFormData({ ...formData, nextCalibrationDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Calibration Frequency (days) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.calibrationFrequency}
                                        onChange={(e) => setFormData({ ...formData, calibrationFrequency: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Responsible Person *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.responsiblePerson}
                                        onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                                >
                                    {editingInstrument ? 'Update' : 'Add'} Instrument
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
