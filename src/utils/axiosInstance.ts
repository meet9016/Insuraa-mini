"use client";
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Default base URL from environment or fallback with proxy support for browser CORS
const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'https://api.insuraa.in/';

const apiAdminInstance = axios.create({
  baseURL: baseURL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = apiAdminInstance;

// Request Interceptor
apiAdminInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
apiAdminInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Add any common response handling logic here
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;

    // Handle Unauthorized errors
    if (response && response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("auth_token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
