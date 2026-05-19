import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Manage Users
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            View and manage all users
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Manage Users
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Create Exam
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Create new exams with questions
          </p>
          <Link
            to="/admin/exams/create"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Exam
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Manage Courses
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Add and manage course content
          </p>
          <Link
            to="/admin/courses/create"
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Create Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;