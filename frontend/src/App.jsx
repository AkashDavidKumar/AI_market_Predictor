import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./context/AuthContext";
import { ToastProvider, useToast } from "./components/Toast";
import MainLayout from "./layouts/MainLayout";
import Chatbot from "./components/Chatbot";
import { healthService } from "./services/healthService";
import { Loader } from "./components/Loader";

// Pages
// Pages (Lazy Loaded)
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Prediction = React.lazy(() => import("./pages/Prediction"));
const MarketAnalytics = React.lazy(() => import("./pages/MarketAnalytics"));
const CropSuggestions = React.lazy(() => import("./pages/CropSuggestions"));
const Alerts = React.lazy(() => import("./pages/Alerts"));
const WeatherPage = React.lazy(() => import("./pages/WeatherPage"));
const AdminPanel = React.lazy(() => import("./pages/AdminPanel"));
const CropDetailsPage = React.lazy(() => import("./pages/CropDetailsPage"));
const SellReportPage = React.lazy(() => import("./pages/SellReportPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
import { AlertTriangle } from "lucide-react";

const AppContainer = () => {
  const [backendAlive, setBackendAlive] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const checkHealth = async () => {
      const isAlive = await healthService.checkBackendHealth();
      setBackendAlive(isAlive);
      if (!isAlive) {
        addToast("Backend connection unavailable. Some features may not work.", "error", 0); // persist 
      }
    };
    checkHealth();
  }, [addToast]);

  return (
    <div className="w-full h-full relative">
      {!backendAlive && (
        <div className="bg-rust text-white p-2 text-center text-sm font-body font-bold flex items-center justify-center gap-2 z-[9999] relative">
          <AlertTriangle className="w-4 h-4" />
          Backend connection unavailable. Running in UI-demo fallback mode.
        </div>
      )}

      <React.Suspense fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-cream">
          <Loader message="Accelerating your experience..." />
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Redirect implicitly wrapped outside layout */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes inside MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/analytics" element={<MarketAnalytics />} />
              <Route path="/crops" element={<CropSuggestions />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/crop-details/:cropName" element={<CropDetailsPage />} />
              <Route path="/sell-report/:crop" element={<SellReportPage />} />

              {/* Admin only route constraint handled within AdminPanel or wrapper */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>

      {/* Global Chatbot available on all pages (could restrict to MainLayout if desired) */}
      <Chatbot />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContainer />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
