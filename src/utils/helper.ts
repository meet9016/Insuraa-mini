"use client";
// import dayjs from "dayjs"; // Uncomment when dayjs is installed

// Basic Date Format helpers
export function formatDateBasic(dateString: string | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

// Basic Native Date Format
export const formatDate = (iso: string) => {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(iso));
};

// Standard Price formatter
export function formatPrice(value: string | number, currency: string = "INR") {
  if (!value && value !== 0) return "";
  const num = Number(value);
  if (isNaN(num)) return value;
  const locale = currency.toUpperCase() === "INR" ? "en-IN" : "en-US";
  return num.toLocaleString(locale);
}

// Detailed Currency formatter
export const formatCurrency = (amount: number, currency: string = "INR") => {
  const locale = currency.toUpperCase() === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
};

// Clipboard helper
export const copyToClip = (text: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
};

// Word Limit Function
export const limitChars = (text: string, limit: number) => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

// Generic Unique ID Generator for sessions/temp usage
export const getTempId = () => {
  if (typeof window === "undefined") return null;
  let tempId = sessionStorage.getItem("temp_id");

  if (!tempId) {
    tempId = "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("temp_id", tempId);
  }

  return tempId;
};

// Clear session storage helper
export const removeTempId = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("temp_id");
  }
};
