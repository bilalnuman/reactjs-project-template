// lib/http.ts
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// --- tiny helpers (browser only) ---
const isBrowser = typeof window !== 'undefined';
const getCookie = (name: string) => {
    if (!isBrowser) return undefined;
    const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m.pop() as string) : undefined;
};
const deleteCookie = (name: string) => {
    if (!isBrowser) return;
    document.cookie = `${name}=; Max-Age=0; path=/`;
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // was import.meta.env.VITE_API_BASE_URL
    withCredentials: true,
    headers: { Accept: 'application/json' },
});

// Django CSRF naming
api.defaults.xsrfCookieName = 'csrftoken';
api.defaults.xsrfHeaderName = 'X-CSRFToken';

const CSRF_UNSAFE = new Set(['post', 'put', 'patch', 'delete']);

// REQUEST interceptor (single registration)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Optional dev token via localStorage (browser only)
    if (isBrowser && process.env.NODE_ENV === 'development') {
        const devToken = window.localStorage.getItem('token');
        if (devToken) (config.headers as any).Authorization = `Bearer ${devToken}`;
    }

    // Cookie token (access_token)
        if (isBrowser) {
        const token = getCookie('access_token');
        if (token) (config.headers as any).Authorization = `Bearer ${token}`;

        // CSRF for unsafe methods
        if (CSRF_UNSAFE.has((config.method || 'get').toLowerCase())) {
            const csrf = getCookie('csrftoken');
            if (csrf) (config.headers as any)['X-CSRFToken'] = csrf;
        }

        // Language from localStorage or cookie
        const lang = window.localStorage.getItem('lang') || getCookie('lang');
        if (lang) (config.headers as any)['Accept-Language'] = lang;
    }

    return config;
});

// RESPONSE interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<any>) => {
        const status = error.response?.status ?? (error as any).status;
        const code = error.response?.data?.errors?.code;

        if ((code === 'token_not_valid' || status === 401) && isBrowser) {
            deleteCookie('access_token');
            if (localStorage.getItem('has_token') === null) {
                localStorage.setItem('has_token', 'false');
                window.location.replace('/login');
            }
        }

        if (error.code === 'ERR_NETWORK') {
            // toast.info('Network Error', { toastId: 'ERR_NETWORK' });
        }
        if (error.code === 'ECONNABORTED') {
            // toast.warning('Timeout exceeded', { toastId: 'ECONNABORTED' });
        }

        if (error.response) {
            console.error('API Error:', {
                url: error.config?.url,
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.request) {
            console.error('Network Error: No response from server', error.request);
        } else {
            console.error('Unexpected Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
