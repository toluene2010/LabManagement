/**
 * Backup and Restore Utility
 * Handles complete application data backup and restoration
 */

export interface BackupData {
    version: string;
    timestamp: string;
    data: {
        samples: any[];
        products: any[];
        testMethods: any[];
        specifications: any[];
        deviations: any[];
        stabilityStudies: any[];
        rdStudies: any[];
        laboratoryData: any[];
        auditLogs: any[];
        users: any[];
        config: any;
    };
    metadata: {
        appVersion: string;
        backupBy: string;
        recordCount: number;
    };
}

/**
 * Get all store names from localStorage
 */
const getStoreKeys = (): string[] => {
    return [
        'pharma-qc-samples',
        'pharma-qc-master-data',
        'pharma-qc-deviations',
        'pharma-qc-stability',
        'pharma-qc-rd-studies',
        'pharma-qc-laboratory',
        'pharma-qc-config',
        'pharma-qc-auth',
        'auditLogs',
    ];
};

/**
 * Create a complete backup of all application data
 */
export const createBackup = (userName: string): BackupData => {
    const storeKeys = getStoreKeys();
    const backupData: any = {};
    let totalRecords = 0;

    // Collect data from all stores
    storeKeys.forEach(key => {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                backupData[key] = parsed;

                // Count records
                if (parsed.state) {
                    Object.values(parsed.state).forEach((value: any) => {
                        if (Array.isArray(value)) {
                            totalRecords += value.length;
                        }
                    });
                }
            }
        } catch (error) {
            console.error(`Error backing up ${key}:`, error);
        }
    });

    const backup: BackupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
            samples: backupData['pharma-qc-samples']?.state?.samples || [],
            products: backupData['pharma-qc-master-data']?.state?.products || [],
            testMethods: backupData['pharma-qc-master-data']?.state?.testMethods || [],
            specifications: backupData['pharma-qc-master-data']?.state?.specifications || [],
            deviations: backupData['pharma-qc-deviations']?.state?.deviations || [],
            stabilityStudies: backupData['pharma-qc-stability']?.state?.studies || [],
            rdStudies: backupData['pharma-qc-rd-studies']?.state?.studies || [],
            laboratoryData: backupData['pharma-qc-laboratory']?.state || {},
            auditLogs: backupData['auditLogs'] || [],
            users: backupData['pharma-qc-auth']?.state?.users || [],
            config: backupData['pharma-qc-config']?.state || {},
        },
        metadata: {
            appVersion: '1.0.0',
            backupBy: userName,
            recordCount: totalRecords,
        },
    };

    return backup;
};

/**
 * Download backup as JSON file
 */
export const downloadBackup = (backup: BackupData): void => {
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `pharma-qc-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Restore data from backup
 */
export const restoreBackup = async (backupData: BackupData): Promise<boolean> => {
    try {
        // Validate backup structure
        if (!backupData.version || !backupData.data) {
            throw new Error('Invalid backup file structure');
        }

        // Restore each store
        const storeMapping = {
            'pharma-qc-samples': { state: { samples: backupData.data.samples } },
            'pharma-qc-master-data': {
                state: {
                    products: backupData.data.products,
                    testMethods: backupData.data.testMethods,
                    specifications: backupData.data.specifications,
                },
            },
            'pharma-qc-deviations': { state: { deviations: backupData.data.deviations } },
            'pharma-qc-stability': { state: { studies: backupData.data.stabilityStudies } },
            'pharma-qc-rd-studies': { state: { studies: backupData.data.rdStudies } },
            'pharma-qc-laboratory': { state: backupData.data.laboratoryData },
            'pharma-qc-config': { state: backupData.data.config },
            'pharma-qc-auth': { state: { users: backupData.data.users } },
            'auditLogs': backupData.data.auditLogs,
        };

        // Apply restoration
        Object.entries(storeMapping).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
        });

        return true;
    } catch (error) {
        console.error('Error restoring backup:', error);
        return false;
    }
};

/**
 * Read backup file from user upload
 */
export const readBackupFile = (file: File): Promise<BackupData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const backup = JSON.parse(content) as BackupData;
                resolve(backup);
            } catch (error) {
                reject(new Error('Invalid backup file format'));
            }
        };

        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsText(file);
    });
};

/**
 * Validate backup file
 */
export const validateBackup = (backup: BackupData): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!backup.version) errors.push('Missing version information');
    if (!backup.timestamp) errors.push('Missing timestamp');
    if (!backup.data) errors.push('Missing data section');
    if (!backup.metadata) errors.push('Missing metadata');

    return {
        valid: errors.length === 0,
        errors,
    };
};
