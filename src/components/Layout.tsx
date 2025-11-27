import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FlaskConical,
    Timer,
    FileText,
    Settings,
    ClipboardList,
    History,
    LogOut,
    User,
    TrendingUp,
    AlertTriangle,
    Shield,
    Beaker
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useMasterDataStore } from '../stores/masterDataStore';
import { useSampleStore } from '../stores/sampleStore';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { fetchMasterData } = useMasterDataStore();
    const { fetchSamples } = useSampleStore();

    React.useEffect(() => {
        fetchMasterData();
        fetchSamples();
    }, [fetchMasterData, fetchSamples]);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Sample Management', href: '/samples', icon: FlaskConical },
        { name: 'Product Master', href: '/products', icon: FileText },
        { name: 'Test Methods', href: '/test-methods', icon: ClipboardList },
        { name: 'Stability Studies', href: '/stability', icon: Timer },
        { name: 'R&D Studies', href: '/rd-studies', icon: Beaker },
        { name: 'Laboratory Management', href: '/laboratory', icon: FlaskConical },
        { name: 'Analytics & CPK', href: '/analytics', icon: TrendingUp },
        { name: 'Deviations & CAPA', href: '/deviations', icon: AlertTriangle },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Audit Trail', href: '/audit', icon: History },
        { name: 'Data Schemas', href: '/config', icon: Settings },
    ];

    if (user?.role === 'admin') {
        navigation.push({ name: 'System Admin', href: '/admin', icon: Shield });
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed h-full z-10 transition-all duration-300">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                            QC
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">Pharma QC</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">System v1.0</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                    }`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
                                {user?.role.replace('_', ' ')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    {children}
                </div>
            </div>
        </div>
    );
};
