import axios from "axios";

const API = typeof window !== "undefined"
  ? "/admin_api/"
  : (process.env.NEXT_PUBLIC_API_URL || "https://api.insuraa.in/admin_api/");

export const baseUrl: { sendLoginOtp: string; verifyLoginOtp: string; sendSignUpOtp: string; verifySignUpOtp: string; [key: string]: any } = {
  sendLoginOtp: `${API}send_login_otp`,
  verifyLoginOtp: `${API}verify_login_otp`,
  sendSignUpOtp: `${API}send_sign_up_otp`,
  verifySignUpOtp: `${API}verify_sign_up_otp`,
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
