import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DashboardLayout = 'grid' | 'list' | 'compact';
export type StatCardOrder = 'default' | 'priority' | 'alphabetical' | 'custom';

export interface DashboardWidget {
    id: string;
    name: string;
    enabled: boolean;
    order: number;
}

export interface DashboardPreferences {
    layout: DashboardLayout;
    statCardOrder: StatCardOrder;
    customStatOrder: string[];
    widgets: DashboardWidget[];
    showTrends: boolean;
    showQuickActions: boolean;
    showRecentSamples: boolean;
    showLabInfo: boolean;
    compactMode: boolean;
}

interface DashboardPreferencesState {
    preferences: DashboardPreferences;
    updateLayout: (layout: DashboardLayout) => void;
    updateStatCardOrder: (order: StatCardOrder) => void;
    updateCustomStatOrder: (order: string[]) => void;
    toggleWidget: (widgetId: string) => void;
    reorderWidgets: (widgets: DashboardWidget[]) => void;
    toggleShowTrends: () => void;
    toggleShowQuickActions: () => void;
    toggleShowRecentSamples: () => void;
    toggleShowLabInfo: () => void;
    toggleCompactMode: () => void;
    resetToDefaults: () => void;
}

const DEFAULT_PREFERENCES: DashboardPreferences = {
    layout: 'grid',
    statCardOrder: 'default',
    customStatOrder: [],
    widgets: [
        { id: 'stats', name: 'Statistics Cards', enabled: true, order: 0 },
        { id: 'recent-samples', name: 'Recent Samples', enabled: true, order: 1 },
        { id: 'quick-actions', name: 'Quick Actions', enabled: true, order: 2 },
    ],
    showTrends: true,
    showQuickActions: true,
    showRecentSamples: true,
    showLabInfo: true,
    compactMode: false,
};

export const useDashboardPreferences = create<DashboardPreferencesState>()(
    persist(
        (set) => ({
            preferences: DEFAULT_PREFERENCES,

            updateLayout: (layout) =>
                set((state) => ({
                    preferences: { ...state.preferences, layout },
                })),

            updateStatCardOrder: (statCardOrder) =>
                set((state) => ({
                    preferences: { ...state.preferences, statCardOrder },
                })),

            updateCustomStatOrder: (customStatOrder) =>
                set((state) => ({
                    preferences: { ...state.preferences, customStatOrder },
                })),

            toggleWidget: (widgetId) =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        widgets: state.preferences.widgets.map((w) =>
                            w.id === widgetId ? { ...w, enabled: !w.enabled } : w
                        ),
                    },
                })),

            reorderWidgets: (widgets) =>
                set((state) => ({
                    preferences: { ...state.preferences, widgets },
                })),

            toggleShowTrends: () =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        showTrends: !state.preferences.showTrends,
                    },
                })),

            toggleShowQuickActions: () =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        showQuickActions: !state.preferences.showQuickActions,
                    },
                })),

            toggleShowRecentSamples: () =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        showRecentSamples: !state.preferences.showRecentSamples,
                    },
                })),

            toggleShowLabInfo: () =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        showLabInfo: !state.preferences.showLabInfo,
                    },
                })),

            toggleCompactMode: () =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        compactMode: !state.preferences.compactMode,
                    },
                })),

            resetToDefaults: () =>
                set({ preferences: DEFAULT_PREFERENCES }),
        }),
        {
            name: 'pharma-qc-dashboard-preferences',
        }
    )
);
