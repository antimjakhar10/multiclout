export const MOBILE_THEME_KEY = "multiclout_mobile_theme";

export const getMobileTheme = () => {
  const saved = localStorage.getItem(MOBILE_THEME_KEY);
  return saved === "light" ? "light" : "dark";
};

export const applyMobileTheme = (theme) => {
  const root = document.documentElement;
  root.classList.remove("mc-light", "mc-dark");
  root.classList.add(theme === "light" ? "mc-light" : "mc-dark");
  localStorage.setItem(MOBILE_THEME_KEY, theme);
};

export const toggleMobileTheme = () => {
  const current = getMobileTheme();
  const next = current === "dark" ? "light" : "dark";
  applyMobileTheme(next);
  return next;
};