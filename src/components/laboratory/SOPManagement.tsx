import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Clock, AlertCircle } from 'lucide-react';
import { useLaboratoryStore } from '../../stores/laboratoryStore';
import { SOP, SOPStatus } from '../../types/laboratory';

export const SOPManagement: React.FC = () => {
    const { sops, addSOP, updateSOP, deleteSOP } = useLaboratoryStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<SOP | null>(null);
    const [formData, setFormData] = useState<Partial<SOP>>({
        sopNumber: '',
        title: '',
        version: '',
        department: '',
        effectiveDate: '',
        reviewDate: '',
        nextReviewDate: '',
        reviewFrequency: 12,
        status: 'active',
        author: '',
        approver: '',
        approvalDate: '',
        description: '',
        filePath: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            updateSOP(editingItem.id, formData);
        } else {
            addSOP(formData as Omit<SOP, 'id' | 'createdAt' | 'updatedAt'>);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            sopNumber: '',
            title: '',
            version: '',
            department: '',
            effectiveDate: '',
            reviewDate: '',
            nextReviewDate: '',
            reviewFrequency: 12,
            status: 'active',
            author: '',
            approver: '',
            approvalDate: '',
            description: '',
            filePath: '',
            notes: '',
        });
        setEditingItem(null);
        setShowModal(false);
    };

    const isReviewDue = (nextReviewDate: string) => {
        const today = new Date();
        const next = new Date(nextReviewDate);
        const daysUntil = Math.floor((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 30 && daysUntil >= 0;
    };

    const isOverdue = (nextReviewDate: string) => {
        return new Date(nextReviewDate) < new Date();
    };

    const getStatusBadge = (status: SOPStatus) => {
        const colors = {
            active: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
            under_review: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
            obsolete: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400',
            draft: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400',
        };
        return colors[status];
    };

    const filteredSOPs = sops.filter((sop) =>
        sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sop.sopNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sop.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search SOPs..."
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
                    Add SOP
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">SOP #</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Version</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Department</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Effective Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Next Review</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredSOPs.map((sop) => (
                            <tr key={sop.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{sop.sopNumber}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white">{sop.title}</div>
                                        {sop.description && (
                                            <div className="text-xs text-slate-500 line-clamp-1">{sop.description}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{sop.version}</td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{sop.department}</td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                    {new Date(sop.effectiveDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <div className={
                                        isOverdue(sop.nextReviewDate) ? 'text-danger-600 font-medium' :
                                            isReviewDue(sop.nextReviewDate) ? 'text-warning-600 font-medium' :
                                                'text-slate-600 dark:text-slate-400'
                                    }>
                                        {new Date(sop.nextReviewDate).toLocaleDateString()}
                                        {isOverdue(sop.nextReviewDate) && (
                                            <div className="text-xs flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />Overdue
                                            </div>
                                        )}
                                        {isReviewDue(sop.nextReviewDate) && !isOverdue(sop.nextReviewDate) && (
                                            <div className="text-xs flex items-center gap-1">
                                                <Clock className="w-3 h-3" />Due soon
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(sop.status)}`}>
                                        {sop.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => { setEditingItem(sop); setFormData(sop); setShowModal(true); }}
                                            className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteSOP(sop.id)}
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

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingItem ? 'Edit SOP' : 'Add New SOP'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SOP Number *</label>
                                    <input type="text" required value={formData.sopNumber} onChange={(e) => setFormData({ ...formData, sopNumber: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Version *</label>
                                    <input type="text" required value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                                    <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                                    <input type="text" required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status *</label>
                                    <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as SOPStatus })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                                        <option value="active">Active</option>
                                        <option value="under_review">Under Review</option>
                                        <option value="draft">Draft</option>
                                        <option value="obsolete">Obsolete</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Effective Date *</label>
                                    <input type="date" required value={formData.effectiveDate} onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Review Date *</label>
                                    <input type="date" required value={formData.reviewDate} onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Next Review Date *</label>
                                    <input type="date" required value={formData.nextReviewDate} onChange={(e) => setFormData({ ...formData, nextReviewDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Review Frequency (months) *</label>
                                    <input type="number" required value={formData.reviewFrequency} onChange={(e) => setFormData({ ...formData, reviewFrequency: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Author *</label>
                                    <input type="text" required value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Approver *</label>
                                    <input type="text" required value={formData.approver} onChange={(e) => setFormData({ ...formData, approver: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Approval Date</label>
                                    <input type="date" value={formData.approvalDate} onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">File Path</label>
                                    <input type="text" placeholder="Path to SOP document" value={formData.filePath} onChange={(e) => setFormData({ ...formData, filePath: e.target.value })} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                                    <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={resetForm} className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">{editingItem ? 'Update' : 'Add'} SOP</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
