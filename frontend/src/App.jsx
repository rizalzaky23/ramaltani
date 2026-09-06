import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Suspense, lazy } from 'react';

// Layouts
import FarmerLayout from './layouts/FarmerLayout';
import ExtensionLayout from './layouts/ExtensionLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages (eager loaded for demo)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardHome from './pages/farmer/DashboardHome';
import RecommendationPage from './pages/farmer/RecommendationPage';
import RiskMapPage from './pages/farmer/RiskMapPage';
import PlantingHistoryPage from './pages/farmer/PlantingHistoryPage';
import NotificationsPage from './pages/farmer/NotificationsPage';
import CommunityPage from './pages/farmer/CommunityPage';
import EducationPage from './pages/farmer/EducationPage';
import ProfilePage from './pages/farmer/ProfilePage';
import ExtensionDashboard from './pages/extension/ExtensionDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Loading fallback
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-padi-500 flex items-center justify-center mx-auto mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8z" fill="white" opacity="0.9"/>
          </svg>
        </div>
        <p className="font-display text-lg text-ink">RamalTani</p>
        <p className="text-sm text-muted mt-1">Memuat...</p>
      </div>
    </div>
  );
}

// Protected route component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'farmer') return <Navigate to="/dashboard" replace />;
    if (user.role === 'extension_officer') return <Navigate to="/penyuluh" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

// Public route — redirect if already logged in
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (user) {
    if (user.role === 'farmer') return <Navigate to="/dashboard" replace />;
    if (user.role === 'extension_officer') return <Navigate to="/penyuluh" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
  }

  return children;
}

// Simple placeholder for unbuilt pages
function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-padi-50 flex items-center justify-center mb-4 text-padi-400 text-2xl">
        🌾
      </div>
      <h2 className="font-display text-xl text-ink mb-2">{title}</h2>
      <p className="text-sm text-muted max-w-sm">Halaman ini sedang dalam pengembangan. Silakan kembali nanti.</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Farmer routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="rekomendasi" element={<RecommendationPage />} />
        <Route path="peta-risiko" element={<RiskMapPage />} />
        <Route path="riwayat" element={<PlantingHistoryPage />} />
        <Route path="peringatan" element={<NotificationsPage />} />
        <Route path="komunitas" element={<CommunityPage />} />
        <Route path="edukasi" element={<EducationPage />} />
        <Route path="pengaturan" element={<PlaceholderPage title="Pengaturan" />} />
        <Route path="profil" element={<ProfilePage />} />
      </Route>

      {/* Extension officer routes */}
      <Route
        path="/penyuluh"
        element={
          <ProtectedRoute allowedRoles={['extension_officer']}>
            <ExtensionLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ExtensionDashboard />} />
        <Route path="petani" element={<PlaceholderPage title="Data Petani" />} />
        <Route path="peta" element={<RiskMapPage />} />
        <Route path="analitik" element={<PlaceholderPage title="Analitik Wilayah" />} />
        <Route path="broadcast" element={<PlaceholderPage title="Broadcast Pesan" />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<PlaceholderPage title="Manajemen Pengguna" />} />
        <Route path="regions" element={<PlaceholderPage title="Manajemen Wilayah" />} />
        <Route path="varieties" element={<PlaceholderPage title="Database Varietas" />} />
        <Route path="api" element={<PlaceholderPage title="API Monitoring" />} />
        <Route path="logs" element={<PlaceholderPage title="System Logs" />} />
        <Route path="settings" element={<PlaceholderPage title="Pengaturan Sistem" />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen bg-surface flex items-center justify-center text-center p-6">
          <div>
            <div className="font-display text-6xl text-padi-200 mb-4">404</div>
            <h1 className="font-display text-2xl text-ink mb-2">Halaman Tidak Ditemukan</h1>
            <p className="text-muted mb-6">Halaman yang Anda cari tidak ada.</p>
            <a href="/" className="btn btn-primary">Kembali ke Beranda</a>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
