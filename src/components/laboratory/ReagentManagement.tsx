import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, TrendingDown } from 'lucide-react';
import { useLaboratoryStore } from '../../stores/laboratoryStore';
import { Reagent, ReagentStatus, StorageLocation } from '../../types/laboratory';

export const ReagentManagement: React.FC = () => {
    const { reagents, addReagent, updateReagent, deleteReagent } = useLaboratoryStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingReagent, setEditingReagent] = useState<Reagent | null>(null);
    const [formData, setFormData] = useState<Partial<Reagent>>({
        catalogNumber: '',
        name: '',
        manufacturer: '',
        lotNumber: '',
        quantity: 0,
        unit: '',
        status: 'in_stock',
        receivedDate: '',
        expirationDate: '',
        storageLocation: 'room_temperature',
        storageDetails: '',
        minimumStock: 0,
        reorderLevel: 0,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingReagent) {
            updateReagent(editingReagent.id, formData);
        } else {
            addReagent(formData as Omit<Reagent, 'id' | 'createdAt' | 'updatedAt'>);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            catalogNumber: '',
            name: '',
            manufacturer: '',
            lotNumber: '',
            quantity: 0,
            unit: '',
            status: 'in_stock',
            receivedDate: '',
            expirationDate: '',
            storageLocation: 'room_temperature',
            storageDetails: '',
            minimumStock: 0,
            reorderLevel: 0,
            notes: '',
        });
        setEditingReagent(null);
        setShowModal(false);
    };

    const handleEdit = (reagent: Reagent) => {
        setEditingReagent(reagent);
        setFormData(reagent);
        setShowModal(true);
    };

    const getStatusBadge = (status: ReagentStatus) => {
        const colors = {
            in_stock: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
            low_stock: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
            expired: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
            ordered: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400',
        };
        return colors[status];
    };

    const isExpiringSoon = (expirationDate: string) => {
        const today = new Date();
        const expiry = new Date(expirationDate);
        const daysUntil = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 30 && daysUntil >= 0;
    };

    const isExpired = (expirationDate: string) => {
        return new Date(expirationDate) < new Date();
    };

    const filteredReagents = reagents.filter((reagent) =>
        reagent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reagent.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reagent.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
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
                            placeholder="Search reagents..."
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
                    Add Reagent
                </button>
            </div>

            {/* Reagents Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Catalog #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Lot Number
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Storage
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Expiration
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredReagents.map((reagent) => (
                            <tr key={reagent.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                    {reagent.catalogNumber}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white">
                                            {reagent.name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {reagent.manufacturer}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                    {reagent.lotNumber}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-900 dark:text-white font-medium">
                                            {reagent.quantity} {reagent.unit}
                                        </span>
                                        {reagent.quantity <= reagent.reorderLevel && (
                                            <TrendingDown className="w-4 h-4 text-warning-600" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reagent.status)}`}>
                                        {reagent.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                    <div>
                                        <div className="capitalize">{reagent.storageLocation.replace('_', ' ')}</div>
                                        {reagent.storageDetails && (
                                            <div className="text-xs text-slate-500">{reagent.storageDetails}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <div className={
                                        isExpired(reagent.expirationDate) ? 'text-danger-600 font-medium' :
                                            isExpiringSoon(reagent.expirationDate) ? 'text-warning-600 font-medium' :
                                                'text-slate-600 dark:text-slate-400'
                                    }>
                                        {new Date(reagent.expirationDate).toLocaleDateString()}
                                        {isExpired(reagent.expirationDate) && <div className="text-xs">Expired</div>}
                                        {isExpiringSoon(reagent.expirationDate) && !isExpired(reagent.expirationDate) && (
                                            <div className="text-xs">Expiring soon</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(reagent)}
                                            className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteReagent(reagent.id)}
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
                                {editingReagent ? 'Edit Reagent' : 'Add New Reagent'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Catalog Number *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.catalogNumber}
                                        onChange={(e) => setFormData({ ...formData, catalogNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Reagent Name *
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
                                        Lot Number *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lotNumber}
                                        onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Unit *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., mL, g, kg"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
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
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ReagentStatus })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="in_stock">In Stock</option>
                                        <option value="low_stock">Low Stock</option>
                                        <option value="expired">Expired</option>
                                        <option value="ordered">Ordered</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Storage Location *
                                    </label>
                                    <select
                                        required
                                        value={formData.storageLocation}
                                        onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value as StorageLocation })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="refrigerator">Refrigerator (2-8°C)</option>
                                        <option value="freezer">Freezer (-20°C)</option>
                                        <option value="room_temperature">Room Temperature</option>
                                        <option value="controlled_room">Controlled Room</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Storage Details
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Shelf 2, Cabinet A"
                                        value={formData.storageDetails}
                                        onChange={(e) => setFormData({ ...formData, storageDetails: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Received Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.receivedDate}
                                        onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Expiration Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.expirationDate}
                                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Minimum Stock *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.minimumStock}
                                        onChange={(e) => setFormData({ ...formData, minimumStock: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Reorder Level *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.reorderLevel}
                                        onChange={(e) => setFormData({ ...formData, reorderLevel: parseFloat(e.target.value) })}
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
                                    {editingReagent ? 'Update' : 'Add'} Reagent
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
