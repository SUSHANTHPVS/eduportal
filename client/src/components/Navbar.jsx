import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppSettings } from '../context/AppSettingsContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, language, setLanguage, languages, t } = useAppSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };



  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between h-auto md:h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <span className="text-lg font-extrabold">E</span>
              </div>
              <span>EduPortal</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('nav.home')}
            </Link>
            <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('nav.courses')}
            </Link>
            <Link to="/exams" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('nav.exams')}
            </Link>
            <Link to="/leaderboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('nav.leaderboard')}
            </Link>
            <Link to="/drives" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('nav.drives')}
            </Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {t('nav.contact')}
            </Link>

            

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {user ? (
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  {t('nav.dashboard')}
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/exams/create" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      {t('nav.createExam')}
                    </Link>
                    <Link to="/admin/drives" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      {t('nav.manageDrives')}
                    </Link>
                  </>
                )}
                <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;