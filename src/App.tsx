import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProductMaster } from './pages/ProductMaster';
import { TestMethods } from './pages/TestMethods';
import { SampleManagement } from './pages/SampleManagement';
import { ResultEntry } from './pages/ResultEntry';
import { AuditTrail } from './pages/AuditTrail';
import { ConfigurationBuilder } from './pages/ConfigurationBuilder';
import { Analytics } from './pages/Analytics';
import { Deviations } from './pages/Deviations';
import { Reports } from './pages/Reports';
import { AdminSettings } from './pages/AdminSettings';
import { StabilityStudies } from './pages/StabilityStudies';
import { RDStudies } from './pages/RDStudies';
import { LaboratoryManagement } from './pages/LaboratoryManagement';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { useAuthStore } from './stores/authStore';
import { ToastProvider } from './components/ToastProvider';

function App() {
    const { isAuthenticated, checkSession } = useAuthStore();

    // Check for existing session on mount
    useEffect(() => {
        checkSession();
    }, [checkSession]);

    return (
        <ToastProvider>
            <Router>
                {!isAuthenticated ? (
                    <div className="animate-fade-in">
                        <Login />
                    </div>
                ) : (
                    <Layout>
                        <div className="animate-fade-in">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/config" element={<ConfigurationBuilder />} />
                                <Route path="/products" element={<ProductMaster />} />
                                <Route path="/test-methods" element={<TestMethods />} />
                                <Route path="/samples" element={<SampleManagement />} />
                                <Route path="/results/:sampleId" element={<ResultEntry />} />
                                <Route path="/analytics" element={<Analytics />} />
                                <Route path="/deviations" element={<Deviations />} />
                                <Route path="/stability" element={<StabilityStudies />} />
                                <Route path="/rd-studies" element={<RDStudies />} />
                                <Route path="/laboratory" element={<LaboratoryManagement />} />
                                <Route path="/audit" element={<AuditTrail />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/admin" element={<AdminSettings />} />
                            </Routes>
                        </div>
                    </Layout>
                )}
            </Router>
        </ToastProvider>
    );
}

export default App;

