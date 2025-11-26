import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSampleStore } from '../stores/sampleStore';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useDashboardPreferences } from '../stores/dashboardPreferencesStore';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingUp,
    FlaskConical,
    Settings
} from 'lucide-react';
import { LabInfoWidget } from '../components/LabInfoWidget';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { samples } = useSampleStore();
    const { products } = useMasterDataStore();
    const { preferences } = useDashboardPreferences();

    // Calculate stats
    const pendingSamples = samples.filter(s => s.status === 'received' || s.status === 'in_analysis').length;
    const completedSamples = samples.filter(s => s.status === 'approved').length;
    const reviewPending = samples.filter(s => s.status === 'under_review').length;

    // Mock OOS for demo
    const oosCount = samples.reduce((acc, sample) => {
        return acc + sample.results.filter(r => r.outOfSpec).length;
    }, 0);

    const stats = [
        {
            label: 'Pending Analysis',
            value: pendingSamples,
            icon: FlaskConical,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            trend: '+2 from yesterday'
        },
        {
            label: 'Pending Review',
            value: reviewPending,
            icon: Clock,
            color: 'text-warning-600',
            bg: 'bg-warning-50 dark:bg-warning-900/20',
            trend: 'Urgent attention needed'
        },
        {
            label: 'Completed (MTD)',
            value: completedSamples,
            icon: CheckCircle2,
            color: 'text-success-600',
            bg: 'bg-success-50 dark:bg-success-900/20',
            trend: '+12% vs last month'
        },
        {
            label: 'Out of Spec',
            value: oosCount,
            icon: AlertTriangle,
            color: 'text-danger-600',
            bg: 'bg-danger-50 dark:bg-danger-900/20',
            trend: 'Requires investigation'
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Welcome back, {user?.firstName}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Here's what's happening in the lab today.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/settings')}
                    className="btn btn-secondary flex items-center gap-2"
                    title="Dashboard Settings"
                >
                    <Settings className="w-4 h-4" />
                    Customize
                </button>
            </div>

            {/* Lab Info Widget */}
            {preferences.showLabInfo && <LabInfoWidget />}

            {/* Stats Grid */}
            <div className={`grid gap-6 ${preferences.layout === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                : preferences.layout === 'list'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 md:grid-cols-2'
                }`}>
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className={`card hover:scale-105 transition-transform duration-300 cursor-pointer ${preferences.compactMode ? 'p-4' : ''
                            }`}>
                            <div className={`flex items-start justify-between ${preferences.compactMode ? 'mb-2' : 'mb-4'}`}>
                                <div className={`${preferences.compactMode ? 'p-2' : 'p-3'} rounded-xl ${stat.bg}`}>
                                    <Icon className={`${preferences.compactMode ? 'w-5 h-5' : 'w-6 h-6'} ${stat.color}`} />
                                </div>
                                {preferences.showTrends && (
                                    <span className="flex items-center text-xs font-medium text-success-600 bg-success-50 px-2 py-1 rounded-full">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Active
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className={`${preferences.compactMode ? 'text-2xl' : 'text-3xl'} font-bold text-slate-900 dark:text-white mb-1`}>
                                    {stat.value}
                                </h3>
                                <p className={`${preferences.compactMode ? 'text-xs' : 'text-sm'} font-medium text-slate-500 dark:text-slate-400 mb-2`}>
                                    {stat.label}
                                </p>
                                {preferences.showTrends && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        {stat.trend}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                {preferences.showRecentSamples && (
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Samples</h2>
                            <button
                                onClick={() => navigate('/samples')}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                                View All
                            </button>
                        </div>

                        <div className="card overflow-hidden p-0">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Sample ID</th>
                                        <th>Product</th>
                                        <th>Status</th>
                                        <th>Received</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {samples.slice(0, 5).map((sample) => {
                                        const product = products.find(p => p.id === sample.productId);
                                        return (
                                            <tr key={sample.id}>
                                                <td className="font-medium text-primary-600">{sample.sampleNumber}</td>
                                                <td>
                                                    <div className="font-medium text-slate-900 dark:text-white">{product?.name}</div>
                                                    <div className="text-xs text-slate-500">Batch: {sample.batchNumber}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${sample.status === 'approved' ? 'badge-success' :
                                                        sample.status === 'rejected' ? 'badge-danger' :
                                                            sample.status === 'under_review' ? 'badge-warning' :
                                                                'badge-info'
                                                        }`}>
                                                        {sample.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="text-slate-500">
                                                    {new Date(sample.receivedDate).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                {preferences.showQuickActions && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
                        <div className="grid gap-4">
                            <button
                                onClick={() => navigate('/samples')}
                                className="card p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left group"
                            >
                                <div className="p-3 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                                    <FlaskConical className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Register Sample</h3>
                                    <p className="text-sm text-slate-500">Log new sample arrival</p>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    const firstSample = samples[0];
                                    if (firstSample) {
                                        navigate(`/results/${firstSample.id}`);
                                    } else {
                                        navigate('/samples');
                                    }
                                }}
                                className="card p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left group"
                            >
                                <div className="p-3 rounded-lg bg-success-50 text-success-600 group-hover:bg-success-100 transition-colors">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Enter Results</h3>
                                    <p className="text-sm text-slate-500">Record analysis data</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/samples')}
                                className="card p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left group"
                            >
                                <div className="p-3 rounded-lg bg-warning-50 text-warning-600 group-hover:bg-warning-100 transition-colors">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Review Batch</h3>
                                    <p className="text-sm text-slate-500">Approve pending results</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
