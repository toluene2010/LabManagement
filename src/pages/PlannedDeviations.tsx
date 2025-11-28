import React, { useState, useEffect } from 'react';
import { usePlannedDeviationStore, PlannedDeviation } from '../stores/plannedDeviationStore';
import { useAuthStore } from '../stores/authStore';
import {
    Plus, FileText, CheckCircle2, XCircle, AlertTriangle,
    BarChart3, Calendar, User, ArrowRight, Search, Filter
} from 'lucide-react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

export const PlannedDeviations: React.FC = () => {
    const { deviations, fetchDeviations, addDeviation, approveDeviation, closeDeviation } = usePlannedDeviationStore();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'new'>('dashboard');
    const [selectedDeviation, setSelectedDeviation] = useState<PlannedDeviation | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchDeviations();
    }, [fetchDeviations]);

    // Dashboard Data
    const statusData = {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [
            {
                data: [
                    deviations.filter(d => d.approvalStatus === 'Pending').length,
                    deviations.filter(d => d.approvalStatus === 'Approved').length,
                    deviations.filter(d => d.approvalStatus === 'Rejected').length,
                ],
                backgroundColor: ['#F59E0B', '#10B981', '#EF4444'],
                borderWidth: 1,
            },
        ],
    };

    const riskData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                label: 'Deviations by Risk',
                data: [
                    deviations.filter(d => d.riskLevel === 'Low').length,
                    deviations.filter(d => d.riskLevel === 'Medium').length,
                    deviations.filter(d => d.riskLevel === 'High').length,
                ],
                backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444'],
            },
        ],
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        const formData = new FormData(e.currentTarget);

        await addDeviation({
            dateRaised: new Date().toISOString(),
            raisedBy: user.id,
            department: formData.get('department') as string,
            type: formData.get('type') as 'Planned' | 'Unplanned',
            description: formData.get('description') as string,
            justification: formData.get('justification') as string,
            impactAssessment: formData.get('impactAssessment') as string,
            riskLevel: formData.get('riskLevel') as 'Low' | 'Medium' | 'High',
            proposedAction: formData.get('proposedAction') as string,
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            capaRequired: formData.get('capaRequired') === 'on',
            evidenceUploads: null,
            closureComment: null,
            closedBy: null,
            closedDate: null,
            linkedCapaId: null,
            approver: null
        });

        setActiveTab('list');
        e.currentTarget.reset();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Planned Deviations</h1>
                    <p className="text-slate-500">Manage and track planned deviations from standard procedures</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        All Deviations
                    </button>
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`btn ${activeTab === 'new' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Deviation
                    </button>
                </div>
            </div>

            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                        <h3 className="text-lg font-bold mb-4">Deviations by Status</h3>
                        <div className="h-64 flex justify-center">
                            <Pie data={statusData} />
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="text-lg font-bold mb-4">Deviations by Risk Level</h3>
                        <div className="h-64">
                            <Bar
                                data={riskData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'new' && (
                <div className="card max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold mb-6">New Planned Deviation Request</h2>
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="label">Department</label>
                                <select name="department" className="input" required>
                                    <option value="">Select Department</option>
                                    <option value="Production">Production</option>
                                    <option value="QC">Quality Control</option>
                                    <option value="QA">Quality Assurance</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Warehouse">Warehouse</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Type</label>
                                <select name="type" className="input" required>
                                    <option value="Planned">Planned Deviation</option>
                                    <option value="Unplanned">Unplanned Deviation</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="label">Description of Deviation</label>
                            <textarea name="description" className="input h-24" required placeholder="What is deviating from the SOP?"></textarea>
                        </div>

                        <div>
                            <label className="label">Justification</label>
                            <textarea name="justification" className="input h-24" required placeholder="Why is this deviation necessary?"></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="label">Risk Level</label>
                                <select name="riskLevel" className="input" required>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Impact Assessment</label>
                                <input name="impactAssessment" className="input" required placeholder="Product, Safety, GMP, Batch..." />
                            </div>
                        </div>

                        <div>
                            <label className="label">Proposed Action / Workaround</label>
                            <textarea name="proposedAction" className="input h-24" required></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="label">Start Date</label>
                                <input type="date" name="startDate" className="input" required />
                            </div>
                            <div>
                                <label className="label">End Date</label>
                                <input type="date" name="endDate" className="input" required />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="capaRequired" id="capaRequired" className="rounded border-gray-300" />
                            <label htmlFor="capaRequired" className="label mb-0">CAPA Required?</label>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={() => setActiveTab('list')} className="btn btn-secondary">Cancel</button>
                            <button type="submit" className="btn btn-primary">Submit Request</button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'list' && (
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 font-semibold">Number</th>
                                    <th className="p-4 font-semibold">Type</th>
                                    <th className="p-4 font-semibold">Department</th>
                                    <th className="p-4 font-semibold">Risk</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Date Raised</th>
                                    <th className="p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deviations.map(dev => (
                                    <tr key={dev.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-4 font-medium">{dev.deviationNumber}</td>
                                        <td className="p-4">{dev.type}</td>
                                        <td className="p-4">{dev.department}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${dev.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                                                    dev.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {dev.riskLevel}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${dev.approvalStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    dev.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'
                                                }`}>
                                                {dev.approvalStatus}
                                            </span>
                                        </td>
                                        <td className="p-4">{new Date(dev.dateRaised).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => { setSelectedDeviation(dev); setIsDetailsOpen(true); }}
                                                className="btn btn-sm btn-secondary"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {isDetailsOpen && selectedDeviation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedDeviation.deviationNumber}</h2>
                                <p className="text-slate-500">Raised on {new Date(selectedDeviation.dateRaised).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div>
                                    <span className="text-sm text-slate-500">Department</span>
                                    <p className="font-medium">{selectedDeviation.department}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-slate-500">Type</span>
                                    <p className="font-medium">{selectedDeviation.type}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-slate-500">Risk Level</span>
                                    <p className={`font-medium ${selectedDeviation.riskLevel === 'High' ? 'text-red-600' :
                                            selectedDeviation.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                                        }`}>{selectedDeviation.riskLevel}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-slate-500">Status</span>
                                    <p className="font-medium">{selectedDeviation.approvalStatus}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold mb-2">Description</h3>
                                <p className="text-slate-700 dark:text-slate-300">{selectedDeviation.description}</p>
                            </div>

                            <div>
                                <h3 className="font-bold mb-2">Justification</h3>
                                <p className="text-slate-700 dark:text-slate-300">{selectedDeviation.justification}</p>
                            </div>

                            <div>
                                <h3 className="font-bold mb-2">Proposed Action</h3>
                                <p className="text-slate-700 dark:text-slate-300">{selectedDeviation.proposedAction}</p>
                            </div>

                            {/* Approval Section */}
                            {selectedDeviation.approvalStatus === 'Pending' && (user?.role === 'qa_manager' || user?.role === 'admin') && (
                                <div className="border-t pt-6 mt-6">
                                    <h3 className="font-bold mb-4">QA Approval</h3>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                approveDeviation(selectedDeviation.id, user.id, 'Approved');
                                                setIsDetailsOpen(false);
                                            }}
                                            className="btn btn-success flex-1"
                                        >
                                            Approve Deviation
                                        </button>
                                        <button
                                            onClick={() => {
                                                approveDeviation(selectedDeviation.id, user.id, 'Rejected');
                                                setIsDetailsOpen(false);
                                            }}
                                            className="btn btn-danger flex-1"
                                        >
                                            Reject Deviation
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Closure Section */}
                            {selectedDeviation.approvalStatus === 'Approved' && !selectedDeviation.closedDate && (user?.role === 'qa_manager' || user?.role === 'admin') && (
                                <div className="border-t pt-6 mt-6">
                                    <h3 className="font-bold mb-4">Deviation Closure</h3>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const comment = (e.currentTarget.elements.namedItem('closureComment') as HTMLTextAreaElement).value;
                                        closeDeviation(selectedDeviation.id, user.id, comment);
                                        setIsDetailsOpen(false);
                                    }}>
                                        <textarea name="closureComment" className="input mb-4" placeholder="Closure comments and verification..." required></textarea>
                                        <button type="submit" className="btn btn-primary w-full">Close Deviation</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
