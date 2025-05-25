
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type RoleBasedRouteProps = {
  children: ReactNode;
  allowedRoles: ('landlord' | 'tenant')[];
};

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
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

  // Role check
  if (!profile?.role || !allowedRoles.includes(profile.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    if (profile?.role === 'landlord') {
      return <Navigate to="/dashboard/landlord" replace />;
    } else if (profile?.role === 'tenant') {
      return <Navigate to="/dashboard/tenant" replace />;
    } else {
      return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
