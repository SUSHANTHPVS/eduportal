import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Exams from './pages/Exams';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminExamCreate from './pages/AdminExamCreate';
import AdminCourseCreate from './pages/AdminCourseCreate';
import AdminDrives from './pages/AdminDrives';
import TakeExam from './pages/TakeExam';
import Contact from './pages/Contact';
import Leaderboard from './pages/Leaderboard';
import Drives from './pages/Drives';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AppSettingsProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/courses" element={<Courses />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/exams/:id" element={<TakeExam />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/drives" element={<Drives />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/exams/create"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminExamCreate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/courses/create"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminCourseCreate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/drives"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDrives />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </AppSettingsProvider>
  );
}

export default App;
