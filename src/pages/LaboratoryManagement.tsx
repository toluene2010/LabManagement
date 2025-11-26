import React, { useState } from 'react';
import {
    Microscope,
    FlaskRound,
    TestTube,
    Refrigerator,
    FileCheck,
    BookOpen,
    AlertCircle
} from 'lucide-react';
import { useLaboratoryStore } from '../stores/laboratoryStore';
import {
    InstrumentManagement,
    ReagentManagement,
    GlasswareManagement,
    RefrigeratorManagement,
    ReferenceSampleManagement,
    SOPManagement
} from '../components/laboratory';

type TabType = 'instruments' | 'reagents' | 'glassware' | 'refrigerators' | 'references' | 'sops';

export const LaboratoryManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('instruments');
    const stats = useLaboratoryStore((state) => state.getStats());

    const tabs = [
        {
            id: 'instruments' as TabType,
            name: 'Instruments',
            icon: Microscope,
            count: stats.instruments.total,
            alert: stats.instruments.calibrationDue,
        },
        {
            id: 'reagents' as TabType,
            name: 'Reagents',
            icon: FlaskRound,
            count: stats.reagents.total,
            alert: stats.reagents.expired + stats.reagents.lowStock,
        },
        {
            id: 'glassware' as TabType,
            name: 'Glassware & Tools',
            icon: TestTube,
            count: stats.glassware.total,
            alert: 0,
        },
        {
            id: 'refrigerators' as TabType,
            name: 'Refrigerator Inventory',
            icon: Refrigerator,
            count: 0,
            alert: 0,
        },
        {
            id: 'references' as TabType,
            name: 'Reference Samples',
            icon: FileCheck,
            count: stats.referenceSamples.total,
            alert: stats.referenceSamples.expiringSoon + stats.referenceSamples.expired,
        },
        {
            id: 'sops' as TabType,
            name: 'SOPs',
            icon: BookOpen,
            count: stats.sops.total,
            alert: stats.sops.reviewDue,
        },
    ];

    const renderStatsCards = () => {
        const cards = [
            {
                title: 'Active Instruments',
                value: stats.instruments.active,
                total: stats.instruments.total,
                icon: Microscope,
                color: 'primary',
                alert: stats.instruments.calibrationDue > 0 ? `${stats.instruments.calibrationDue} calibration due` : null,
            },
            {
                title: 'Reagents in Stock',
                value: stats.reagents.inStock,
                total: stats.reagents.total,
                icon: FlaskRound,
                color: 'success',
                alert: stats.reagents.lowStock > 0 ? `${stats.reagents.lowStock} low stock` : null,
            },
            {
                title: 'Available Glassware',
                value: stats.glassware.available,
                total: stats.glassware.total,
                icon: TestTube,
                color: 'info',
                alert: null,
            },
            {
                title: 'Active Reference Samples',
                value: stats.referenceSamples.active,
                total: stats.referenceSamples.total,
                icon: FileCheck,
                color: 'warning',
                alert: stats.referenceSamples.expiringSoon > 0 ? `${stats.referenceSamples.expiringSoon} expiring soon` : null,
            },
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-${card.color}-100 dark:bg-${card.color}-900/20 flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                                </div>
                                {card.alert && (
                                    <div className="flex items-center gap-1 text-xs text-warning-600 dark:text-warning-400">
                                        <AlertCircle className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                {card.title}
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {card.value}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    / {card.total}
                                </p>
                            </div>
                            {card.alert && (
                                <p className="text-xs text-warning-600 dark:text-warning-400 mt-2">
                                    {card.alert}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Laboratory Management
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage instruments, reagents, glassware, reference samples, and SOPs
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            {renderStatsCards()}

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${isActive
                                        ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.name}
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${isActive
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                        }`}>
                                        {tab.count}
                                    </span>
                                    {tab.alert > 0 && (
                                        <span className="w-2 h-2 bg-warning-500 rounded-full"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'instruments' && <InstrumentManagement />}
                    {activeTab === 'reagents' && <ReagentManagement />}
                    {activeTab === 'glassware' && <GlasswareManagement />}
                    {activeTab === 'refrigerators' && <RefrigeratorManagement />}
                    {activeTab === 'references' && <ReferenceSampleManagement />}
                    {activeTab === 'sops' && <SOPManagement />}
                </div>
            </div>
        </div>
    );
};
