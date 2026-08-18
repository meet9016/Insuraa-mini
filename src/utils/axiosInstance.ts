"use client";
import axios from "axios";

// Default base URL from environment or fallback with proxy support for browser CORS
const baseURL = typeof window !== 'undefined'
  ? '/'
  : (process.env.NEXT_PUBLIC_APP_URL || 'https://api.insuraa.in/');

const apiAdminInstance = axios.create({
  baseURL: baseURL,
});

export const api = apiAdminInstance;

// Request Interceptor
apiAdminInstance.interceptors.request.use(
  async (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiAdminInstance.interceptors.response.use(
  function (response) {
    // Add any common response handling logic here
    return response;
  },
  (error) => {
    const { response } = error;

    // Handle Unauthorized errors
    if (response && response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
