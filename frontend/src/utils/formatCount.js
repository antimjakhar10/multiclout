export function parseCountValue(value) {
  if (value === null || value === undefined || value === "") return 0;

  const raw = String(value).trim().toLowerCase().replace(/,/g, "");

  const match = raw.match(/^(\d+(\.\d+)?)([km])?(\+)?$/);
  if (match) {
    let num = Number(match[1]);
    const suffix = match[3];

    if (suffix === "k") num *= 1000;
    if (suffix === "m") num *= 1000000;

    return Math.floor(num);
  }

  const numeric = Number(raw);
  return Number.isNaN(numeric) ? 0 : Math.floor(numeric);
}

export function formatSocialCount(value) {
  const count = parseCountValue(value);

  if (count < 1000) return String(count);

  if (count < 1000000) {
    const formatted = (count / 1000).toFixed(1);
    return `${formatted.replace(".0", "")}K`;
  }

  const formatted = (count / 1000000).toFixed(1);
  return `${formatted.replace(".0", "")}M`;
}