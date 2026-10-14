import axios from "axios";
import { showSkippedRecordsModal } from "@/components/ui/SkippedRecordsModal";

// Default base URL from environment or a fallback
const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/api/v1/";

const apiAdminInstance = axios.create({
  baseURL: baseURL,
});

export const api = apiAdminInstance;

// Helper to check and show modal for skipped records in bulk operations
const checkAndShowSkippedRecords = (payload: any) => {
  if (!payload) return;
  const data = payload?.data || payload;
  const skipped = data?.skipped || payload?.skipped;
  const skippedCount = data?.skipped_count ?? payload?.skipped_count ?? (Array.isArray(skipped) ? skipped.length : 0);

  if (Array.isArray(skipped) && skipped.length > 0 && Number(skippedCount) > 0) {
    showSkippedRecordsModal({
      message: payload?.message || data?.message,
      skipped,
    });
  }
};

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
    checkAndShowSkippedRecords(response?.data);
    return response;
  },
  (error) => {
    const { response } = error;

    if (response?.data) {
      checkAndShowSkippedRecords(response.data);
    }

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

