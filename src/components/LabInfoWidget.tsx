import React from 'react';
import { useLaboratoryStore } from '../stores/laboratoryStore';
import { useDashboardPreferences } from '../stores/dashboardPreferencesStore';
import { Clock, X, Info, Thermometer, FlaskConical, FileText } from 'lucide-react';

export const LabInfoWidget: React.FC = () => {
    const { getStats } = useLaboratoryStore();
    const { toggleShowLabInfo } = useDashboardPreferences();
    const stats = getStats();

    // Check if there are any alerts
    const hasAlerts =
        stats.instruments.calibrationDue > 0 ||
        stats.reagents.lowStock > 0 ||
        stats.reagents.expired > 0 ||
        stats.referenceSamples.expiringSoon > 0 ||
        stats.referenceSamples.expired > 0 ||
        stats.sops.reviewDue > 0;

    if (!hasAlerts) return null;

    return (
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
                <button
                    onClick={toggleShowLabInfo}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors text-blue-600 dark:text-blue-400"
                    title="Dismiss Info"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-xl">
                    <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        Lab Management Alerts
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        The following items require your attention:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.instruments.calibrationDue > 0 && (
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <Thermometer className="w-5 h-5 text-warning-500" />
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{stats.instruments.calibrationDue}</div>
                                    <div className="text-xs text-slate-500">Calibration Due</div>
                                </div>
                            </div>
                        )}

                        {(stats.reagents.lowStock > 0 || stats.reagents.expired > 0) && (
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <FlaskConical className="w-5 h-5 text-danger-500" />
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">
                                        {stats.reagents.lowStock + stats.reagents.expired}
                                    </div>
                                    <div className="text-xs text-slate-500">Reagent Issues</div>
                                </div>
                            </div>
                        )}

                        {(stats.referenceSamples.expiringSoon > 0 || stats.referenceSamples.expired > 0) && (
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <Clock className="w-5 h-5 text-warning-500" />
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">
                                        {stats.referenceSamples.expiringSoon + stats.referenceSamples.expired}
                                    </div>
                                    <div className="text-xs text-slate-500">Ref. Samples Expiring</div>
                                </div>
                            </div>
                        )}

                        {stats.sops.reviewDue > 0 && (
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <FileText className="w-5 h-5 text-primary-500" />
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{stats.sops.reviewDue}</div>
                                    <div className="text-xs text-slate-500">SOP Reviews Due</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
