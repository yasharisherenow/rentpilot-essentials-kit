
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { profile, isLoading } = useAuth();

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rentpilot-600"></div>
      </div>
    );
  }

  // Redirect to role-specific dashboard
  if (profile?.role === 'landlord') {
    return <Navigate to="/dashboard/landlord" replace />;
  } else if (profile?.role === 'tenant') {
    return <Navigate to="/dashboard/tenant" replace />;
  }

  // If no role is found, redirect to auth
  return <Navigate to="/auth" replace />;
};

export default Dashboard;
