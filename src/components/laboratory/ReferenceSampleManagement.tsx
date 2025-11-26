import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react';
import { useLaboratoryStore } from '../../stores/laboratoryStore';
import { ReferenceSample, StorageLocation } from '../../types/laboratory';

export const ReferenceSampleManagement: React.FC = () => {
    const { referenceSamples, addReferenceSample, updateReferenceSample, deleteReferenceSample } = useLaboratoryStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ReferenceSample | null>(null);
    const [formData, setFormData] = useState<Partial<ReferenceSample>>({
        referenceNumber: '',
        name: '',
        type: '',
        manufacturer: '',
        lotNumber: '',
        catalogNumber: '',
        quantity: 0,
        unit: '',
        receivedDate: '',
        expirationDate: '',
        storageLocation: 'refrigerator',
        storageDetails: '',
        certificateNumber: '',
        purity: '',
        status: 'active',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            updateReferenceSample(editingItem.id, formData);
        } else {
            addReferenceSample(formData as Omit<ReferenceSample, 'id' | 'createdAt' | 'updatedAt'>);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            referenceNumber: '',
            name: '',
            type: '',
            manufacturer: '',
            lotNumber: '',
            catalogNumber: '',
            quantity: 0,
            unit: '',
            receivedDate: '',
            expirationDate: '',
            storageLocation: 'refrigerator',
            storageDetails: '',
            certificateNumber: '',
            purity: '',
            status: 'active',
            notes: '',
        });
        setEditingItem(null);
        setShowModal(false);
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

    const filteredSamples = referenceSamples.filter((sample) =>
        sample.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search reference samples..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                >
                    <Plus className="w-4 h-4" />
                    Add Reference Sample
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Ref #</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Lot #</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Purity</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Quantity</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Expiration</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredSamples.map((sample) => (
                            <tr key={sample.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{sample.referenceNumber}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white">{sample.name}</div>
                                        <div className="text-xs text-slate-500">{sample.manufacturer}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{sample.type}</td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{sample.lotNumber}</td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{sample.purity || '-'}</td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{sample.quantity} {sample.unit}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div className={
                                        isExpired(sample.expirationDate) ? 'text-danger-600 font-medium' :
                                            isExpiringSoon(sample.expirationDate) ? 'text-warning-600 font-medium' :
                                                'text-slate-600 dark:text-slate-400'
                                    }>
                                        {new Date(sample.expirationDate).toLocaleDateString()}
                                        {isExpired(sample.expirationDate) && <div className="text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />Expired</div>}
                                        {isExpiringSoon(sample.expirationDate) && !isExpired(sample.expirationDate) && (
                                            <div className="text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />Expiring soon</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sample.status === 'active' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' :
                                        sample.status === 'expired' ? 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400' :
                                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                                        }`}>
                                        {sample.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => { setEditingItem(sample); setFormData(sample); setShowModal(true); }} className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteReferenceSample(sample.id)} className="p-1 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingItem ? 'Edit Reference Sample' : 'Add New Reference Sample'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reference Number *</label>
                                    <input type="text" required value={formData.referenceNumber} onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type *</label>
                                    <input type="text" required placeholder="e.g., Working Standard" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Manufacturer *</label>
                                    <input type="text" required value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lot Number *</label>
                                    <input type="text" required value={formData.lotNumber} onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catalog Number *</label>
                                    <input type="text" required value={formData.catalogNumber} onChange={(e) => setFormData({ ...formData, catalogNumber: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity *</label>
                                    <input type="number" required value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit *</label>
                                    <input type="text" required value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Purity</label>
                                    <input type="text" placeholder="e.g., 99.5%" value={formData.purity} onChange={(e) => setFormData({ ...formData, purity: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Certificate Number</label>
                                    <input type="text" value={formData.certificateNumber} onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Received Date *</label>
                                    <input type="date" required value={formData.receivedDate} onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiration Date *</label>
                                    <input type="date" required value={formData.expirationDate} onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Storage Location *</label>
                                    <select required value={formData.storageLocation} onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value as StorageLocation })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                        <option value="refrigerator">Refrigerator</option>
                                        <option value="freezer">Freezer</option>
                                        <option value="room_temperature">Room Temperature</option>
                                        <option value="controlled_room">Controlled Room</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Storage Details</label>
                                    <input type="text" value={formData.storageDetails} onChange={(e) => setFormData({ ...formData, storageDetails: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status *</label>
                                    <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="depleted">Depleted</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={resetForm} className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">{editingItem ? 'Update' : 'Add'} Reference Sample</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
