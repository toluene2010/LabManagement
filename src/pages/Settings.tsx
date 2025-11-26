import React, { useState, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useDashboardPreferences } from '../stores/dashboardPreferencesStore';
import {
    createBackup,
    downloadBackup,
    restoreBackup,
    readBackupFile,
    validateBackup,
    BackupData,
} from '../utils/backupRestore';
import {
    Database,
    Download,
    Upload,
    AlertCircle,
    CheckCircle2,
    Settings as SettingsIcon,
    Layout,
    RefreshCw,
    Shield,
    X
} from 'lucide-react';

export const Settings = () => {
    const { user } = useAuthStore();

    const {
        preferences,
        updateLayout,
        toggleShowTrends,
        toggleCompactMode,
        resetToDefaults
    } = useDashboardPreferences();

    const [backupStatus, setBackupStatus] = useState<{
        type: 'success' | 'error' | 'info' | null;
        message: string;
    }>({ type: null, message: '' });

    const [isProcessing, setIsProcessing] = useState(false);
    const [backupInfo, setBackupInfo] = useState<BackupData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle backup creation
    const handleCreateBackup = async () => {
        try {
            setIsProcessing(true);
            const backup = createBackup(user?.username || 'Unknown User');
            setBackupInfo(backup);
            downloadBackup(backup);

            setBackupStatus({
                type: 'success',
                message: `Backup created successfully! ${backup.metadata.recordCount} records backed up.`,
            });
        } catch (error) {
            setBackupStatus({
                type: 'error',
                message: 'Failed to create backup. Please try again.',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle backup restoration
    const handleRestoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsProcessing(true);
            const backup = await readBackupFile(file);

            // Validate backup
            const validation = validateBackup(backup);
            if (!validation.valid) {
                setBackupStatus({
                    type: 'error',
                    message: `Invalid backup file: ${validation.errors.join(', ')}`,
                });
                return;
            }

            // Confirm restoration
            const confirmed = window.confirm(
                `Are you sure you want to restore this backup?\n\n` +
                `Backup Date: ${new Date(backup.timestamp).toLocaleString()}\n` +
                `Records: ${backup.metadata.recordCount}\n` +
                `Created by: ${backup.metadata.backupBy}\n\n` +
                `This will overwrite all current data!`
            );

            if (!confirmed) {
                setBackupStatus({ type: 'info', message: 'Restore cancelled.' });
                return;
            }

            const success = await restoreBackup(backup);

            if (success) {
                setBackupStatus({
                    type: 'success',
                    message: 'Backup restored successfully! Please refresh the page to see changes.',
                });

                // Auto-refresh after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setBackupStatus({
                    type: 'error',
                    message: 'Failed to restore backup. Please check the file and try again.',
                });
            }
        } catch (error) {
            setBackupStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to restore backup.',
            });
        } finally {
            setIsProcessing(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Manage your application preferences and data
                </p>
            </div>

            {/* Status Messages */}
            {backupStatus.type && (
                <div
                    className={`card flex items-start gap-4 ${backupStatus.type === 'success'
                        ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
                        : backupStatus.type === 'error'
                            ? 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800'
                            : 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                        }`}
                >
                    {backupStatus.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                    ) : backupStatus.type === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                        <p
                            className={`font-medium ${backupStatus.type === 'success'
                                ? 'text-success-900 dark:text-success-100'
                                : backupStatus.type === 'error'
                                    ? 'text-danger-900 dark:text-danger-100'
                                    : 'text-primary-900 dark:text-primary-100'
                                }`}
                        >
                            {backupStatus.message}
                        </p>
                    </div>
                    <button
                        onClick={() => setBackupStatus({ type: null, message: '' })}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="card space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                        <Database className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Data Backup & Restore
                        </h2>
                        <p className="text-sm text-slate-500">Manage your application data</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Create Backup */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                    Create Backup
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Download a complete backup of all application data
                                </p>
                            </div>
                            <Download className="w-5 h-5 text-slate-400" />
                        </div>
                        <button
                            onClick={handleCreateBackup}
                            disabled={isProcessing}
                            className="btn btn-primary w-full"
                        >
                            {isProcessing ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Backup...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Create Backup
                                </>
                            )}
                        </button>
                    </div>

                    {/* Restore Backup */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                    Restore Backup
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Upload and restore a previous backup file
                                </p>
                            </div>
                            <Upload className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="btn btn-secondary w-full cursor-pointer">
                                <Upload className="w-4 h-4 mr-2" />
                                Select Backup File
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json"
                                    onChange={handleRestoreBackup}
                                    disabled={isProcessing}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="mt-3 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-warning-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-warning-700 dark:text-warning-300">
                                    Warning: Restoring a backup will overwrite all current data. This action
                                    cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Backup Info */}
                    {backupInfo && (
                        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                            <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                                Last Backup Info
                            </h4>
                            <div className="space-y-1 text-sm text-primary-700 dark:text-primary-300">
                                <p>Date: {new Date(backupInfo.timestamp).toLocaleString()}</p>
                                <p>Records: {backupInfo.metadata.recordCount}</p>
                                <p>Created by: {backupInfo.metadata.backupBy}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Dashboard Preferences */}
            <div className="card space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-success-50 dark:bg-success-900/20">
                        <Layout className="w-6 h-6 text-success-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Dashboard Preferences
                        </h2>
                        <p className="text-sm text-slate-500">Customize your dashboard layout</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Layout Selection */}
                    <div>
                        <label className="label">Dashboard Layout</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['grid', 'list', 'compact'] as const).map((layout) => (
                                <button
                                    key={layout}
                                    onClick={() => updateLayout(layout)}
                                    className={`p-3 rounded-lg border-2 transition-all ${preferences.layout === layout
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                        }`}
                                >
                                    <Layout className="w-5 h-5 mx-auto mb-1" />
                                    <p className="text-xs font-medium capitalize">{layout}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Display Options */}
                    <div className="space-y-3">
                        <label className="label">Display Options</label>

                        <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Show Trends
                            </span>
                            <input
                                type="checkbox"
                                checked={preferences.showTrends}
                                onChange={toggleShowTrends}
                                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                            />
                        </label>

                        <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Compact Mode
                            </span>
                            <input
                                type="checkbox"
                                checked={preferences.compactMode}
                                onChange={toggleCompactMode}
                                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                            />
                        </label>
                    </div>

                    {/* Reset Button */}
                    <button onClick={resetToDefaults} className="btn btn-secondary w-full">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset to Defaults
                    </button>
                </div>
            </div>

            {/* Security Settings */}
            <div className="card space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-warning-50 dark:bg-warning-900/20">
                        <Shield className="w-6 h-6 text-warning-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Security Settings
                        </h2>
                        <p className="text-sm text-slate-500">Manage your account security</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                            Current User
                        </h3>
                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            <p>Username: {user?.username}</p>
                            <p>Role: {user?.role?.replace('_', ' ').toUpperCase()}</p>
                            <p>Department: {user?.department}</p>
                        </div>
                    </div>

                    <button className="btn btn-secondary w-full" disabled>
                        <Shield className="w-4 h-4 mr-2" />
                        Change Password (Coming Soon)
                    </button>
                </div>
            </div>

            {/* Application Info */}
            <div className="card space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <SettingsIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Application Info
                        </h2>
                        <p className="text-sm text-slate-500">System information</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Version
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            1.0.0
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Build Date
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {new Date().toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Environment
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            Development
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
