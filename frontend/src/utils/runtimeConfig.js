const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const fallbackApiUrl = 'http://localhost:5000/api';

export const API_URL = trimTrailingSlash(import.meta.env.VITE_API_URL || fallbackApiUrl);
export const SERVER_URL = trimTrailingSlash(
  import.meta.env.VITE_SERVER_URL || API_URL.replace(/\/api$/, '')
);
export const SOCKET_URL = trimTrailingSlash(import.meta.env.VITE_SOCKET_URL || SERVER_URL);

export const buildAssetUrl = (assetPath = '') => {
  if (!assetPath) {
    return '';
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${SERVER_URL}/${assetPath.replace(/^\/+/, '')}`;
};
