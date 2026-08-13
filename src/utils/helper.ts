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
