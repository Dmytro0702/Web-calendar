import { auth } from '@app/firebase/init';
import axios, {
  type AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { onAuthStateChanged } from 'firebase/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const http: AxiosInstance = axios.create({
  baseURL,
  withCredentials: false,
});

const authReady: Promise<void> = new Promise((resolve) => {
  if (auth.currentUser) {
    resolve();
    return;
  }
  const un = onAuthStateChanged(auth, () => {
    un();
    resolve();
  });
});

async function getIdToken(force = false): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const t = await user.getIdToken(force);
    return t;
  } catch {
    return null;
  }
}

http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    await authReady;

    const token = await getIdToken(false);
    const headersObj: Record<string, string> = { ...(config.headers as any) };

    if (token) {
      headersObj.Authorization = `Bearer ${token}`;
      if (import.meta.env.DEV) {
        console.debug('[http] set Authorization', headersObj.Authorization.slice(0, 20) + '...');
      }
    } else {
      delete headersObj.Authorization;
    }

    config.headers = AxiosHeaders.from(headersObj);
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    const status = error.response?.status ?? 0;

    if (status === 401 && original && !original._retried) {
      original._retried = true;
      const fresh = await getIdToken(true);
      if (fresh) {
        original.headers = AxiosHeaders.from({
          ...(original.headers as any),
          Authorization: `Bearer ${fresh}`,
        });
        return http.request(original);
      }
    }

    return Promise.reject(error);
  },
);
