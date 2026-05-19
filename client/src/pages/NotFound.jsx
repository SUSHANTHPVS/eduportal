import { useAppSettings } from '../context/AppSettingsContext';

const NotFound = () => {
  const { t } = useAppSettings();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-lg w-full text-center rounded-3xl border border-gray-200 bg-white p-10 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
          {t('notFound.pageNotFound')}
        </p>
        <h1 className="mt-6 text-5xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
          {t('notFound.message')}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
