
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: 'landlord' | 'tenant';
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    // Show loading spinner or skeleton while checking auth status
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rentpilot-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Role check if specified
  if (requiredRole && profile?.role !== requiredRole) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">
          You need to be a {requiredRole} to access this page.
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
