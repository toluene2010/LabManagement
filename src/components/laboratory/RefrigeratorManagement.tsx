import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Refrigerator as RefrigeratorIcon } from 'lucide-react';
import { useLaboratoryStore } from '../../stores/laboratoryStore';
import { RefrigeratorItem } from '../../types/laboratory';

export const RefrigeratorManagement: React.FC = () => {
    const { refrigeratorItems, addRefrigeratorItem, updateRefrigeratorItem, deleteRefrigeratorItem } = useLaboratoryStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<RefrigeratorItem | null>(null);
    const [formData, setFormData] = useState<Partial<RefrigeratorItem>>({
        refrigeratorId: '',
        refrigeratorName: '',
        shelfLocation: '',
        itemType: 'reagent',
        itemName: '',
        lotNumber: '',
        quantity: 0,
        unit: '',
        storedDate: '',
        expirationDate: '',
        temperature: '',
        responsiblePerson: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            updateRefrigeratorItem(editingItem.id, formData);
        } else {
            addRefrigeratorItem(formData as Omit<RefrigeratorItem, 'id' | 'createdAt' | 'updatedAt'>);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            refrigeratorId: '',
            refrigeratorName: '',
            shelfLocation: '',
            itemType: 'reagent',
            itemName: '',
            lotNumber: '',
            quantity: 0,
            unit: '',
            storedDate: '',
            expirationDate: '',
            temperature: '',
            responsiblePerson: '',
            notes: '',
        });
        setEditingItem(null);
        setShowModal(false);
    };

    const filteredItems = refrigeratorItems.filter((item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.refrigeratorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group items by refrigerator
    const groupedItems = filteredItems.reduce((acc, item) => {
        if (!acc[item.refrigeratorName]) {
            acc[item.refrigeratorName] = [];
        }
        acc[item.refrigeratorName].push(item);
        return acc;
    }, {} as Record<string, RefrigeratorItem[]>);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search refrigerator items..."
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
                    Add Item
                </button>
            </div>

            {Object.entries(groupedItems).map(([refrigeratorName, items]) => (
                <div key={refrigeratorName} className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <RefrigeratorIcon className="w-5 h-5 text-primary-600" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{refrigeratorName}</h3>
                        <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                            {items.length} items
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white dark:bg-slate-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Shelf</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Item Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Item Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Lot #</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Quantity</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Temperature</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Expiration</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-medium">{item.shelfLocation}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 capitalize">{item.itemType.replace('_', ' ')}</td>
                                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{item.itemName}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.lotNumber || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.quantity} {item.unit}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.temperature}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                            {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => { setEditingItem(item); setFormData(item); setShowModal(true); }} className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteRefrigeratorItem(item.id)} className="p-1 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingItem ? 'Edit Refrigerator Item' : 'Add New Refrigerator Item'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Refrigerator ID *</label>
                                    <input type="text" required value={formData.refrigeratorId} onChange={(e) => setFormData({ ...formData, refrigeratorId: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Refrigerator Name *</label>
                                    <input type="text" required value={formData.refrigeratorName} onChange={(e) => setFormData({ ...formData, refrigeratorName: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shelf Location *</label>
                                    <input type="text" required placeholder="e.g., Shelf 2" value={formData.shelfLocation} onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Type *</label>
                                    <select required value={formData.itemType} onChange={(e) => setFormData({ ...formData, itemType: e.target.value as any })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                        <option value="reagent">Reagent</option>
                                        <option value="sample">Sample</option>
                                        <option value="reference_standard">Reference Standard</option>
                                        <option value="media">Media</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Name *</label>
                                    <input type="text" required value={formData.itemName} onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lot Number</label>
                                    <input type="text" value={formData.lotNumber} onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
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
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Temperature *</label>
                                    <input type="text" required placeholder="e.g., 2-8°C" value={formData.temperature} onChange={(e) => setFormData({ ...formData, temperature: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stored Date *</label>
                                    <input type="date" required value={formData.storedDate} onChange={(e) => setFormData({ ...formData, storedDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiration Date</label>
                                    <input type="date" value={formData.expirationDate} onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Responsible Person *</label>
                                    <input type="text" required value={formData.responsiblePerson} onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={resetForm} className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">{editingItem ? 'Update' : 'Add'} Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
