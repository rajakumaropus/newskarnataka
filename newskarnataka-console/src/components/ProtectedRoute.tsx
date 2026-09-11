import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { authAPI } from '../lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useStore();

  // Check authentication
  if (!isAuthenticated || !authAPI.isTokenValid()) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
