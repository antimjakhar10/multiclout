const DEFAULT_LOCAL_API = "http://localhost:5000";

const normalizeApiBase = (value) => {
  let base = (value || DEFAULT_LOCAL_API).trim();

  base = base.replace(/^https:\/\/localhost/i, "http://localhost");
  base = base.replace(/^https:\/\/127\.0\.0\.1/i, "http://127.0.0.1");

  // trailing slash remove
  base = base.replace(/\/+$/, "");

  return base.endsWith("/api") ? base : `${base}/api`;
};

const RAW_API = import.meta.env.VITE_API_URL || DEFAULT_LOCAL_API;

export const API = normalizeApiBase(RAW_API);
export const API_HOST = API.replace(/\/api$/, "");

export const getAdminToken = () => localStorage.getItem("adminToken");

export const getAuthHeaders = (isFormData = false) => {
  const token = getAdminToken();

  if (isFormData) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const IS_LOCALHOST =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

export const LIVE_SITE_HOST = "https://multiclout.com";