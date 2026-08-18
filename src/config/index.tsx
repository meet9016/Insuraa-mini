import axios from "axios";
import endPointApi from "@/utils/endPointApi";

const API = typeof window !== "undefined"
  ? "/admin_api/"
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

const TOKEN_COOKIE_NAME = "crm_token";

export function setAuthToken(token: string, days: number = 1) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(
    token,
  )}; path=/; expires=${expires.toUTCString()}`;
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const c of cookies) {
    if (c.startsWith(`${TOKEN_COOKIE_NAME}=`)) {
      return decodeURIComponent(c.substring(TOKEN_COOKIE_NAME.length + 1));
    }
  }
  return null;
}

export function clearAuthToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

if (typeof window !== "undefined") {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401 && window.location.pathname !== "/login") {
        clearAuthToken();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
}
