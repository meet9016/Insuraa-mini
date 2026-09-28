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

// Calculate Age from Date of Birth
export function calculateAge(dobString: string | undefined | null): string {
  if (!dobString) return "";
  const str = String(dobString).trim();
  if (!str || str === 'null' || str === 'undefined' || str === '0000-00-00' || str === '00-00-0000') return "";

  const cleanVal = str.split(' ')[0].split('T')[0];

  let dob: Date | null = null;
  // Format: YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(cleanVal)) {
    const parts = cleanVal.split(/[-/]/).map(Number);
    dob = new Date(parts[0], parts[1] - 1, parts[2]);
  }
  // Format: DD-MM-YYYY or DD/MM/YYYY
  else if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(cleanVal)) {
    const parts = cleanVal.split(/[-/]/).map(Number);
    dob = new Date(parts[2], parts[1] - 1, parts[0]);
  } else {
    dob = new Date(cleanVal);
  }

  if (!dob || isNaN(dob.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age >= 0 ? String(age) : "";
}

