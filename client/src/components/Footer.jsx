import { Link } from 'react-router-dom';
import { useAppSettings } from '../context/AppSettingsContext';

const Footer = () => {
  const { t } = useAppSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">EduPortal</h2>
          <p className="mt-2 max-w-lg text-sm text-gray-600 dark:text-gray-400">
            {t('footer.description')}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link to="/" className="text-sm text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            {t('nav.home')}
          </Link>
          <Link to="/courses" className="text-sm text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            {t('nav.courses')}
          </Link>
          <Link to="/contact" className="text-sm text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            {t('nav.contact')}
          </Link>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        © {currentYear} EduPortal. {t('footer.allRights')}
      </div>
    </footer>
  );
};

export default Footer;
