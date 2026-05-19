import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-12 text-gray-700 dark:text-gray-200">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center rounded-lg border border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-950 text-red-900 dark:text-red-200">
        Access denied. Admin privileges required.
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
