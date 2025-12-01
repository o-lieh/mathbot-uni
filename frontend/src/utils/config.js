import axios from 'axios';
import API_URL from './api.js';

function config() {
    const postobject = axios.create({
        baseURL: `${API_URL}/api`
    });

    postobject.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => Promise.reject(error)
    );

    postobject.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) return Promise.reject(error);

                try {
                    const response = await postobject.post('/token/refresh/', { refresh: refreshToken });
                    const { access } = response.data;
                    localStorage.setItem('token', access);

                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return postobject(originalRequest);
                } catch (err) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        }
    );

    return postobject;
}

export default config;
