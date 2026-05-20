import axios from 'axios';

const defaultBaseURL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:5000' : '');
axios.defaults.baseURL = defaultBaseURL;

axios.interceptors.request.use(
  (config) => {
    if (typeof config.url === 'string' && config.url.startsWith('http://localhost:5000')) {
      config.url = config.url.replace('http://localhost:5000', defaultBaseURL);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getBackendUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (url) {
    return url.replace(/\/+$/, '');
  }
  return import.meta.env.DEV ? 'http://localhost:5000' : '';
};

export default axios;
