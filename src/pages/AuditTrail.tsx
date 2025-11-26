import React from 'react';
import { Search, Filter, Download } from 'lucide-react';

export const AuditTrail: React.FC = () => {
    // Mock audit logs for demonstration
    const auditLogs = [
        {
            id: '1',
            timestamp: new Date().toISOString(),
            user: 'John Doe (Analyst)',
            action: 'UPDATE',
            entity: 'Sample S-2024-001',
            details: 'Updated pH result from 6.8 to 6.9',
            reason: 'Typo correction'
        },
        {
            id: '2',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            user: 'Jane Smith (QA Mgr)',
            action: 'APPROVE',
            entity: 'Product P-001',
            details: 'Approved new specification version 2.0',
            reason: 'Annual review'
        },
        {
            id: '3',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            user: 'System',
            action: 'LOGIN',
            entity: 'Session',
            details: 'User John Doe logged in',
            reason: '-'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Trail</h1>
                    <p className="text-slate-500">21 CFR Part 11 Compliant System Logs</p>
                </div>
                <button className="btn btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Log
                </button>
            </div>

            <div className="flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="input pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <input type="date" className="input w-auto" />
                    <button className="btn btn-secondary flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden p-0">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Entity</th>
                            <th>Details</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="text-sm text-slate-500 font-mono">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="font-medium text-slate-900 dark:text-white">
                                    {log.user}
                                </td>
                                <td>
                                    <span className={`badge ${log.action === 'APPROVE' ? 'badge-success' :
                                        log.action === 'UPDATE' ? 'badge-warning' :
                                            'badge-info'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="text-sm text-slate-600 dark:text-slate-300">
                                    {log.entity}
                                </td>
                                <td className="text-sm text-slate-600 dark:text-slate-300 max-w-xs truncate">
                                    {log.details}
                                </td>
                                <td className="text-sm text-slate-500 italic">
                                    {log.reason}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
