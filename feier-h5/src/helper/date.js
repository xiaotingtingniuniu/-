const getFormattedTime = timestamp => {
  const date = new Date(timestamp || null);
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, 0);
  const d = String(date.getDate()).padStart(2, 0);
  const h = String(date.getHours()).padStart(2, 0);
  const mi = String(date.getMinutes()).padStart(2, 0);
  const s = String(date.getSeconds()).padStart(2, 0);
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
};

const getFormattedDate = timestamp => {
  const date = new Date(timestamp || null);
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, 0);
  const d = String(date.getDate()).padStart(2, 0);

  return `${y}-${mo}-${d}`;
};

export { getFormattedTime, getFormattedDate };
