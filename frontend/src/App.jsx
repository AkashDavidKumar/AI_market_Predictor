import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./context/AuthContext";
import { ToastProvider, useToast } from "./components/Toast";
import MainLayout from "./layouts/MainLayout";
import Chatbot from "./components/Chatbot";
import { healthService } from "./services/healthService";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import MarketAnalytics from "./pages/MarketAnalytics";
import CropSuggestions from "./pages/CropSuggestions";
import Alerts from "./pages/Alerts";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
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

            {/* Admin only route constraint handled within AdminPanel or wrapper */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

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
