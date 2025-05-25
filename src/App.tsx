
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ApplicationForm from "./pages/ApplicationForm";
import LeaseForm from "./pages/LeaseForm";
import Dashboard from "./pages/Dashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

const App = () => {
  // Create QueryClient inside the component to avoid hook issues
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/auth" element={<Layout><Auth /></Layout>} />
              <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
              <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
              <Route path="/terms" element={<Layout><Terms /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              
              {/* Protected routes */}
              <Route 
                path="/application/:propertyId?" 
                element={
                  <ProtectedRoute>
                    <Layout><ApplicationForm /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lease" 
                element={
                  <ProtectedRoute requiredRole="landlord">
                    <Layout><LeaseForm /></Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Role-based dashboard routes */}
              <Route 
                path="/dashboard/landlord" 
                element={
                  <RoleBasedRoute allowedRoles={['landlord']}>
                    <Layout><LandlordDashboard /></Layout>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/dashboard/tenant" 
                element={
                  <RoleBasedRoute allowedRoles={['tenant']}>
                    <Layout><TenantDashboard /></Layout>
                  </RoleBasedRoute>
                } 
              />
              
              {/* Legacy dashboard route - redirect based on role */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
