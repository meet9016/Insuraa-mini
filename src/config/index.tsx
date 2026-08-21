import axios from "axios";
import endPointApi from "@/utils/endPointApi";

const API = typeof window !== "undefined"
  ? "/"
  : (process.env.NEXT_PUBLIC_API_URL || "https://api.insuraa.in/");

export const baseUrl: {
  AUTH: {
    SEND_LOGIN_OTP: string;
    VERIFY_LOGIN_OTP: string;
    SEND_SIGN_UP_OTP: string;
    VERIFY_SIGN_UP_OTP: string;
  };
  [key: string]: any;
} = {
  AUTH: {
    SEND_LOGIN_OTP: `${API}${endPointApi.AUTH.SEND_LOGIN_OTP}`,
    VERIFY_LOGIN_OTP: `${API}${endPointApi.AUTH.VERIFY_LOGIN_OTP}`,
    SEND_SIGN_UP_OTP: `${API}${endPointApi.AUTH.SEND_SIGN_UP_OTP}`,
    VERIFY_SIGN_UP_OTP: `${API}${endPointApi.AUTH.VERIFY_SIGN_UP_OTP}`,
  },
};

const TOKEN_STORAGE_KEY = "auth_token";

export function setAuthToken(token: string, days: number = 1) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);

  // Keep setting the cookie as a fallback in case other parts of the app use it
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `crm_token=${encodeURIComponent(
    token,
  )}; path=/; expires=${expires.toUTCString()}`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const localToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (localToken) return localToken;

  // Fallback to cookie
  if (typeof document !== "undefined") {
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (const c of cookies) {
      if (c.startsWith(`crm_token=`)) {
        return decodeURIComponent(c.substring("crm_token".length + 1));
      }
    }
  }
  return null;
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);

  // Clear cookie fallback
  if (typeof document !== "undefined") {
    document.cookie = `crm_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

if (typeof window !== "undefined") {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401 && window.location.pathname !== "/auth/login") {
        clearAuthToken();
        window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }
  );
}
