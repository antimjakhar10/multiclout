import { API, API_HOST, IS_LOCALHOST, LIVE_SITE_HOST } from "./api";

export { API, API_HOST };

const normalizePath = (path = "") => {
  if (!path) return "";

  let value = path;

  if (typeof path === "object") {
    value =
      path.url ||
      path.path ||
      path.filename ||
      path.image ||
      path.thumbnail ||
      path.videoFile ||
      path.logo ||
      path.banner ||
      "";
  }

  value = String(value).trim();
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;

  return value.replace(/\\/g, "/").replace(/^\/+/, "");
};

const buildUrl = (host, cleanPath) => {
  if (!cleanPath) return "";

  if (cleanPath.startsWith("uploads/")) {
    return `${host}/${cleanPath}`;
  }

  if (cleanPath.startsWith("/uploads/")) {
    return `${host}${cleanPath}`;
  }

  return `${host}/uploads/${cleanPath}`;
};

export const getImageUrl = (path = "", fallback = "") => {
  const cleanPath = normalizePath(path);

  if (!cleanPath) return fallback;

  if (/^https?:\/\//i.test(cleanPath)) {
    return cleanPath;
  }

  // localhost pe pehle local image try karo
  if (IS_LOCALHOST) {
    return `${API_HOST}/${cleanPath.replace(/^\/+/, "")}`;
  }

  // live site
  return buildUrl(API_HOST, cleanPath);

  
};

export const getFallbackImageUrl = (path = "", fallback = "") => {
  const cleanPath = normalizePath(path);

  if (!cleanPath) return fallback;

  if (/^https?:\/\//i.test(cleanPath)) {
    return cleanPath;
  }

  return buildUrl(API_HOST, cleanPath);
};

export const getAssetUrl = (path = "", fallback = "") => {
  return getImageUrl(path, fallback);
};

export const getVideoUrl = (path = "", fallback = "") => {
  return getImageUrl(path, fallback);
};

export const getFallbackVideoUrl = (path = "", fallback = "") => {
  return getFallbackImageUrl(path, fallback);
};

export const getExternalUrl = (url = "") => {
  if (!url) return "";

  const cleanUrl = String(url).trim();
  if (!cleanUrl) return "";

  if (/^https?:\/\//i.test(cleanUrl)) return cleanUrl;

  return `https://${cleanUrl.replace(/^\/+/, "")}`;
};