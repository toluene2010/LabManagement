import React, { useState } from 'react';
import { useMasterDataStore } from '../stores/masterDataStore';
import { FlaskConical, Beaker, Edit2, CopyPlus } from 'lucide-react';
import { TestMethodModal } from '../components/TestMethodModal';
import { TestMethod } from '../types';

export const TestMethods: React.FC = () => {
    const { testMethods, createMethodVersion } = useMasterDataStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<TestMethod | null>(null);

    const handleEditMethod = (method: TestMethod) => {
        setSelectedMethod(method);
        setIsModalOpen(true);
    };

    const handleVersionUp = (methodId: string) => {
        if (window.confirm('This will create a new version and deactivate the current one. Continue?')) {
            createMethodVersion(methodId);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMethod(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Test Methods</h1>
                    <p className="text-slate-500">Standard Operating Procedures and Analytical Methods</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    New Method
                </button>
            </div>

            <div className="card overflow-hidden p-0">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Method Code</th>
                            <th>Method Name</th>
                            <th>Category</th>
                            <th>Version</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testMethods.map((method) => (
                            <tr key={method.id} className={`cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 ${method.status === 'inactive' ? 'opacity-60' : ''}`}>
                                <td className="font-medium text-primary-600">{method.code}</td>
                                <td>
                                    <div className="font-medium text-slate-900 dark:text-white">{method.name}</div>
                                    <div className="text-xs text-slate-500">{method.description}</div>
                                </td>
                                <td>
                                    <span className="flex items-center gap-2">
                                        <Beaker className="w-4 h-4 text-slate-400" />
                                        {method.category}
                                    </span>
                                </td>
                                <td>v{method.version}</td>
                                <td>
                                    <span className={`badge ${method.status === 'active' ? 'badge-success' : 'badge-secondary'} capitalize`}>
                                        {method.status}
                                    </span>
                                </td>
                                <td className="text-slate-500">
                                    {new Date(method.updatedAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditMethod(method);
                                            }}
                                            className="p-1 text-slate-400 hover:text-primary-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            title="Edit Method"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {method.status === 'active' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVersionUp(method.id);
                                                }}
                                                className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                title="Create New Version"
                                            >
                                                <CopyPlus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Test Method Modal */}
            <TestMethodModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                methodToEdit={selectedMethod}
            />
        </div>
    );
};
