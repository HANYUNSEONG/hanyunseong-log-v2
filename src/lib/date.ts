const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// 2023-03-27 -> 2023.03.27
export function formatDate(date: Date) {
  return formatter.format(date).replaceAll("-", ".");
}

export function getYear(date: Date) {
  return formatter.format(date).slice(0, 4);
}
