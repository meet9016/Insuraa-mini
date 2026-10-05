"use client";
import axios from "axios";

// Default base URL from environment or a fallback
const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/api/v1/";

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
